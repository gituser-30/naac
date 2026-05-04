const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const generatePDF = (user, submissions, documents, res) => {
  return new Promise((resolve, reject) => {
    try {
      const verifiedSubs = submissions.filter(s => s.status === 'verified');
      const criteriaNames = {
        1: "Curricular Aspects",
        2: "Teaching-Learning & Evaluation",
        3: "Research, Innovations & Extension",
        4: "Infrastructure & Learning Resources",
        5: "Student Support & Progression",
        6: "Governance, Leadership & Management",
        7: "Institutional Values & Best Practices"
      };

      const doc = new PDFDocument({ 
        margin: 30, 
        autoFirstPage: false, // We'll add pages manually to avoid blank first page
        layout: 'landscape',
        size: 'A4' 
      });
      doc.pipe(res);

      const exportDate = new Date().toLocaleDateString('en-GB');
      const sigPath = path.join(__dirname, '../assets/signature.jpg');

      // ---- Table Drawing Helper with Auto-Header Redraw ----
      const renderTable = (headers, rows) => {
        const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const colW = pageW / headers.length;
        const rowH = 22;
        const fontSize = headers.length > 8 ? 6 : 8;

        const drawHeader = (yPos) => {
          doc.font('Helvetica-Bold').fontSize(fontSize).fillColor('#FFFFFF');
          headers.forEach((h, i) => {
            const x = doc.page.margins.left + i * colW;
            doc.save().rect(x, yPos, colW, rowH).fill('#1E40AF').restore();
            doc.text(h, x + 2, yPos + 6, { width: colW - 4, align: 'center', ellipsis: true });
          });
          return yPos + rowH;
        };

        let currentY = drawHeader(doc.y);

        rows.forEach((row, rIdx) => {
          // Check for page break
          if (currentY + rowH > doc.page.height - 60) {
            doc.addPage({ layout: 'landscape' });
            currentY = drawHeader(doc.page.margins.top);
          }

          const bg = rIdx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
          doc.font('Helvetica').fontSize(fontSize - 1).fillColor('#000000');
          
          row.forEach((cell, cIdx) => {
            const x = doc.page.margins.left + cIdx * colW;
            doc.save().rect(x, currentY, colW, rowH).fillAndStroke(bg, '#EEEEEE').restore();
            doc.text(String(cell ?? ''), x + 2, currentY + 7, { width: colW - 4, align: 'left', ellipsis: true });
          });
          currentY += rowH;
        });

        return currentY;
      };

      if (verifiedSubs.length === 0) {
        doc.addPage({ layout: 'landscape' });
        doc.fontSize(20).font('Helvetica-Bold').text('NAAC Verified Documentation Report', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(12).text('No verified data found to export.', { align: 'center', color: 'red' });
        doc.end();
        return resolve();
      }

      let lastY = 0;

      // Loop through each criterion
      for (let i = 1; i <= 7; i++) {
        const cSubs = verifiedSubs.filter(s => s.criterionId === i);
        if (cSubs.length === 0) continue; // Only create page if there is data

        doc.addPage({ layout: 'landscape' });

        // Criterion Title
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#1E40AF').text(`Criterion ${i}: ${criteriaNames[i]}`, { underline: true });
        doc.fontSize(8).font('Helvetica').fillColor('#666666').text(`Teacher: ${user.name} | Dept: ${user.department} | Exported: ${exportDate}`, { align: 'right' });
        doc.moveDown(1);

        // Get dynamic keys for THIS criterion only
        const cKeys = new Set();
        cSubs.forEach(s => {
          if (s.formData) Object.keys(s.formData).forEach(k => cKeys.add(k));
        });
        const dynCols = Array.from(cKeys);

        const headers = ['Sub-Crit.', ...dynCols, 'Documents'];
        const rows = cSubs.map(sub => {
          const subDocs = documents.filter(d => d.criterionId === sub.criterionId && d.subCriterion === sub.subCriterion);
          const docNames = subDocs.map(d => d.originalName).join(', ') || '—';
          const formVals = dynCols.map(k => (sub.formData && sub.formData[k]) ? String(sub.formData[k]) : '—');
          return [sub.subCriterion, ...formVals, docNames];
        });

        lastY = renderTable(headers, rows);
      }

      // ---- SIGNATURE AT THE END ----
      let sigY = lastY + 40;
      if (sigY + 100 > doc.page.height) {
        doc.addPage({ layout: 'landscape' });
        sigY = 50;
      }

      if (fs.existsSync(sigPath)) {
        doc.image(sigPath, doc.page.width - 180, sigY, { width: 80 });
      }
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000');
      doc.text('------------------------------------------------', doc.page.width - 250, sigY + 60, { width: 200, align: 'right' });
      doc.text('Verified & Approved by HOD', doc.page.width - 250, sigY + 72, { width: 200, align: 'right' });
      doc.text('(Signature)', doc.page.width - 250, sigY + 84, { width: 200, align: 'right' });

      doc.end();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
const generateSingleSubmissionPDF = (submission, user, documents, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(res);

      const exportDate = new Date().toLocaleDateString('en-GB');

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('NAAC Verified Criterion Form', { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica').text(`College Name: Institutional College`, { align: 'center' });
      doc.text(`Teacher Name: ${user.name}`, { align: 'center' });
      doc.text(`Department: ${user.department}`, { align: 'center' });
      doc.text(`Export Date: ${exportDate}`, { align: 'center' });
      doc.moveDown(2);

      // Submission Details
      doc.fontSize(16).font('Helvetica-Bold').text(`Criterion ${submission.criterionId} - Sub-Criterion ${submission.subCriterion}`, { underline: true });
      doc.moveDown(1);

      if (submission.formData) {
          const formEntries = Object.entries(submission.formData);
          formEntries.forEach(([key, value], index) => {
              if (index % 2 === 0) doc.fillColor('#333333');
              else doc.fillColor('#000000');

              doc.font('Helvetica-Bold').fontSize(12).text(`${key}: `, { continued: true });
              doc.font('Helvetica').text(String(value));
              doc.moveDown(0.5);
          });
          doc.fillColor('#000000'); // reset
      }

      doc.moveDown(2);

      // Documents section
      doc.fontSize(14).font('Helvetica-Bold').text('Attached Evidence Documents:');
      doc.moveDown(0.5);
      
      if (documents.length === 0) {
           doc.fontSize(12).font('Helvetica').text('No documents attached.');
      } else {
           doc.fontSize(12).font('Helvetica');
           documents.forEach(docItem => {
               const uploadDate = new Date(docItem.uploadedAt).toLocaleDateString('en-GB');
               doc.text(`• ${docItem.originalName} - Uploaded: ${uploadDate}`);
           });
      }

      doc.moveDown(5);

      // Dummy Signature Block
      const sigPath = path.join(__dirname, '../assets/signature.jpg');
      if (fs.existsSync(sigPath)) {
          doc.image(sigPath, doc.page.width - 200, doc.y, { width: 100 });
          doc.moveDown(4);
      }

      doc.fontSize(12).font('Helvetica-Bold').text('---------------------------------------------------------', { align: 'right' });
      doc.text('Verified & Approved by Head of Department', { align: 'right' });
      doc.text('(Signature)                                ', { align: 'right' });

      doc.end();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF, generateSingleSubmissionPDF };
