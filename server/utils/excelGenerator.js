const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const generateTeacherExcel = async (user, submissions, documents, res) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NAAC Portal';
    workbook.created = new Date();

    // Filter only verified submissions
    const verifiedSubs = submissions.filter(s => s.status === 'verified');

    const criteriaNames = {
        1: "C1 Curriculum",
        2: "C2 Teaching",
        3: "C3 Research",
        4: "C4 Infrastructure",
        5: "C5 Student Support",
        6: "C6 Governance",
        7: "C7 Values"
    };

    // Sheet "Summary"
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
        { header: 'Criterion', key: 'criterion', width: 25 },
        { header: 'Verified Sub-Criteria', key: 'subs', width: 30 },
        { header: 'Fields Filled', key: 'filled', width: 15 },
        { header: 'Documents', key: 'docs', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Updated', key: 'updated', width: 20 },
    ];
    summarySheet.getRow(1).font = { bold: true };
    
    for (let i = 1; i <= 7; i++) {
        const cSubs = verifiedSubs.filter(s => s.criterionId === i);
        if (cSubs.length === 0) continue; // skip criteria with no verified data

        let fieldsFilled = 0;
        cSubs.forEach(s => {
            if(s.formData) fieldsFilled += Object.keys(s.formData).length;
        });
        const lastUpdated = new Date(Math.max(...cSubs.map(s => new Date(s.updatedAt)))).toLocaleDateString();
        const cDocs = documents.filter(d => d.criterionId === i);

        summarySheet.addRow({
             criterion: criteriaNames[i],
             subs: cSubs.map(s => s.subCriterion).join(', '),
             filled: fieldsFilled,
             docs: cDocs.length,
             status: 'Verified',
             updated: lastUpdated
        });
    }

    // Sheets C1..C7 — only for criteria that have verified data
    for (let i = 1; i <= 7; i++) {
        const cSubs = verifiedSubs.filter(s => s.criterionId === i);
        if (cSubs.length === 0) continue;

        const sheetName = criteriaNames[i];
        const sheet = workbook.addWorksheet(sheetName);
        
        sheet.mergeCells('A1:E1');
        const headerCell = sheet.getCell('A1');
        headerCell.value = `${sheetName} — Verified Forms`;
        headerCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };

        const formKeys = new Set();
        cSubs.forEach(sub => {
            if (sub.formData) {
                Object.keys(sub.formData).forEach(k => formKeys.add(k));
            }
        });
        const dynamicColumns = Array.from(formKeys);

        const columns = [
            { header: 'Sub-Criterion', key: 'subc', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Supporting Document', key: 'doc', width: 30 },
            { header: 'Upload Date', key: 'date', width: 20 }
        ];
        
        dynamicColumns.forEach(k => {
            columns.push({ header: k, key: k, width: 25 });
        });

        sheet.columns = columns;
        sheet.getRow(2).values = columns.map(c => c.header);
        sheet.getRow(2).font = { bold: true };
        sheet.views = [{ state: 'frozen', ySplit: 2 }];
        
        cSubs.forEach((sub, index) => {
            const subDocs = documents.filter(d => d.subCriterion === sub.subCriterion);
            const docNames = subDocs.map(d => d.originalName).join(', ');
            const docDates = subDocs.map(d => new Date(d.uploadedAt).toLocaleDateString()).join(', ');

            const rowData = {
                subc: sub.subCriterion,
                status: sub.status,
                doc: docNames,
                date: docDates
            };
            
            if (sub.formData) {
                Object.entries(sub.formData).forEach(([k, v]) => {
                    rowData[k] = String(v);
                });
            }
            
            const row = sheet.addRow(rowData);
            if (index % 2 === 0) {
                 row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            }
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: {style:'thin'}, left: {style:'thin'},
                    bottom: {style:'thin'}, right: {style:'thin'}
                };
            });
        });

        // Signature block
        sheet.addRow([]);
        sheet.addRow([]);
        const sigPathExcel = path.join(__dirname, '../assets/signature.jpg');
        if (fs.existsSync(sigPathExcel)) {
            const imageId = workbook.addImage({ filename: sigPathExcel, extension: 'jpeg' });
            sheet.addImage(imageId, { tl: { col: 2, row: sheet.rowCount }, ext: { width: 100, height: 100 } });
            sheet.addRow([]); sheet.addRow([]); sheet.addRow([]); sheet.addRow([]); sheet.addRow([]);
        }
        const sr1 = sheet.addRow(['', '', '---------------------------------------------------------']);
        const sr2 = sheet.addRow(['', '', 'Verified & Approved by Head of Department']);
        const sr3 = sheet.addRow(['', '', '(Signature)']);
        sr1.getCell(3).font = { bold: true };
        sr2.getCell(3).font = { bold: true };
        sr1.getCell(3).alignment = { horizontal: 'right' };
        sr2.getCell(3).alignment = { horizontal: 'right' };
        sr3.getCell(3).alignment = { horizontal: 'right' };
    }

    // ---- Overall: All Verified Data in One Sheet ----
    if (verifiedSubs.length > 0) {
        const overallSheet = workbook.addWorksheet('All Verified Data');
        
        overallSheet.mergeCells('A1:E1');
        const titleCell = overallSheet.getCell('A1');
        titleCell.value = `NAAC — All Verified Form Data (${user.name})`;
        titleCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
        
        overallSheet.addRow(['Teacher', user.name]);
        overallSheet.addRow(['Department', user.department]);
        overallSheet.addRow(['Export Date', new Date().toLocaleDateString('en-GB')]);
        overallSheet.addRow([]);

        // Gather ALL unique form keys across every verified submission
        const allFormKeys = new Set();
        verifiedSubs.forEach(sub => {
            if (sub.formData) Object.keys(sub.formData).forEach(k => allFormKeys.add(k));
        });
        const allDynCols = Array.from(allFormKeys);

        const overallColumns = [
            { header: 'Criterion', key: 'criterion', width: 15 },
            { header: 'Sub-Criterion', key: 'subc', width: 18 },
            { header: 'Supporting Documents', key: 'doc', width: 30 },
            { header: 'Upload Date', key: 'date', width: 18 }
        ];
        allDynCols.forEach(k => {
            overallColumns.push({ header: k, key: k, width: 22 });
        });

        overallSheet.columns = overallColumns;
        const headerRow = overallSheet.getRow(6);
        headerRow.values = overallColumns.map(c => c.header);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
        });
        overallSheet.views = [{ state: 'frozen', ySplit: 6 }];

        verifiedSubs.forEach((sub, index) => {
            const subDocs = documents.filter(d => d.criterionId === sub.criterionId && d.subCriterion === sub.subCriterion);
            const docNames = subDocs.map(d => d.originalName).join(', ');
            const docDates = subDocs.map(d => new Date(d.uploadedAt).toLocaleDateString()).join(', ');

            const rowData = {
                criterion: `C${sub.criterionId}`,
                subc: sub.subCriterion,
                doc: docNames,
                date: docDates
            };
            if (sub.formData) {
                Object.entries(sub.formData).forEach(([k, v]) => {
                    rowData[k] = String(v);
                });
            }

            const row = overallSheet.addRow(rowData);
            if (index % 2 === 0) {
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            }
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: 'thin' }, left: { style: 'thin' },
                    bottom: { style: 'thin' }, right: { style: 'thin' }
                };
            });
        });

        // Signature on overall sheet
        overallSheet.addRow([]);
        overallSheet.addRow([]);
        const sigPathOverall = path.join(__dirname, '../assets/signature.jpg');
        if (fs.existsSync(sigPathOverall)) {
            const imgId = workbook.addImage({ filename: sigPathOverall, extension: 'jpeg' });
            overallSheet.addImage(imgId, { tl: { col: 2, row: overallSheet.rowCount }, ext: { width: 100, height: 100 } });
            overallSheet.addRow([]); overallSheet.addRow([]); overallSheet.addRow([]); overallSheet.addRow([]); overallSheet.addRow([]);
        }
        const osr1 = overallSheet.addRow(['', '', '---------------------------------------------------------']);
        const osr2 = overallSheet.addRow(['', '', 'Verified & Approved by Head of Department']);
        const osr3 = overallSheet.addRow(['', '', '(Signature)']);
        osr1.getCell(3).font = { bold: true };
        osr2.getCell(3).font = { bold: true };
        osr1.getCell(3).alignment = { horizontal: 'right' };
        osr2.getCell(3).alignment = { horizontal: 'right' };
        osr3.getCell(3).alignment = { horizontal: 'right' };
    }

    await workbook.xlsx.write(res);
};

const generateConsolidatedExcel = async (teachers, allSubmissions, allDocuments, res) => {
    const workbook = new ExcelJS.Workbook();

    // Filter only verified submissions
    const verifiedSubs = allSubmissions.filter(s => s.status === 'verified');
    
    // Tab 1: Summary
    const summarySheet = workbook.addWorksheet('Verified Summary');
    summarySheet.columns = [
        { header: 'Teacher', key: 'teacher', width: 25 },
        { header: 'C1', key: 'c1', width: 20 },
        { header: 'C2', key: 'c2', width: 20 },
        { header: 'C3', key: 'c3', width: 20 },
        { header: 'C4', key: 'c4', width: 20 },
        { header: 'C5', key: 'c5', width: 20 },
        { header: 'C6', key: 'c6', width: 20 },
        { header: 'C7', key: 'c7', width: 20 },
        { header: 'Verified Count', key: 'overall', width: 18 },
    ];
    summarySheet.getRow(1).font = { bold: true };

    teachers.forEach(teacher => {
        const teacherSubs = verifiedSubs.filter(s => s.userId.toString() === teacher._id.toString());
        const rowData = { teacher: teacher.name };
        
        let verifiedCount = 0;

        for(let i=1; i<=7; i++) {
            const cSubs = teacherSubs.filter(s => s.criterionId === i);
            if (cSubs.length > 0) {
                verifiedCount += cSubs.length;
                rowData[`c${i}`] = `${cSubs.length} verified`;
            } else {
                rowData[`c${i}`] = '—';
            }
        }
        rowData.overall = `${verifiedCount} sub-criteria`;
        summarySheet.addRow(rowData);
    });

    // Tabs 2-8 — only verified data
    for(let i=1; i<=7; i++) {
        const criterionVerified = verifiedSubs.filter(s => s.criterionId === i);
        if (criterionVerified.length === 0) continue;

        const sheet = workbook.addWorksheet(`Criterion ${i}`);
        
        const formKeys = new Set();
        criterionVerified.forEach(sub => {
            if (sub.formData) {
                Object.keys(sub.formData).forEach(k => formKeys.add(k));
            }
        });
        const dynamicColumns = Array.from(formKeys);

        const columns = [
            { header: 'Teacher', key: 'teacher', width: 25 },
            { header: 'Sub-Criterion', key: 'subc', width: 20 },
            { header: 'Supporting Document', key: 'doc', width: 30 },
            { header: 'Upload Date', key: 'date', width: 20 }
        ];
        dynamicColumns.forEach(k => {
            columns.push({ header: k, key: k, width: 25 });
        });
        
        sheet.columns = columns;
        sheet.getRow(1).font = { bold: true };
        sheet.views = [{ state: 'frozen', ySplit: 1 }];

        teachers.forEach(teacher => {
            const teacherSubs = criterionVerified.filter(s => 
                s.userId.toString() === teacher._id.toString()
            );
            
            teacherSubs.forEach(sub => {
                const subDocs = allDocuments.filter(d => d.subCriterion === sub.subCriterion && d.userId.toString() === teacher._id.toString());
                const docNames = subDocs.map(d => d.originalName).join(', ');
                const docDates = subDocs.map(d => new Date(d.uploadedAt).toLocaleDateString()).join(', ');

                const rowData = {
                    teacher: teacher.name,
                    subc: sub.subCriterion,
                    doc: docNames,
                    date: docDates
                };
                if (sub.formData) {
                    Object.entries(sub.formData).forEach(([k, v]) => {
                        rowData[k] = String(v);
                    });
                }
                sheet.addRow(rowData);
            });
        });

        // Signature block
        sheet.addRow([]);
        sheet.addRow([]);
        const sigPathCons = path.join(__dirname, '../assets/signature.jpg');
        if (fs.existsSync(sigPathCons)) {
            const imageId = workbook.addImage({ filename: sigPathCons, extension: 'jpeg' });
            sheet.addImage(imageId, { tl: { col: 2, row: sheet.rowCount }, ext: { width: 100, height: 100 } });
            sheet.addRow([]); sheet.addRow([]); sheet.addRow([]); sheet.addRow([]); sheet.addRow([]);
        }
        const sr1 = sheet.addRow(['', '', '---------------------------------------------------------']);
        const sr2 = sheet.addRow(['', '', 'Verified & Approved by Head of Department']);
        const sr3 = sheet.addRow(['', '', '(Signature)']);
        sr1.getCell(3).font = { bold: true };
        sr2.getCell(3).font = { bold: true };
        sr1.getCell(3).alignment = { horizontal: 'right' };
        sr2.getCell(3).alignment = { horizontal: 'right' };
        sr3.getCell(3).alignment = { horizontal: 'right' };
    }

    // Tab: Document Index (only docs for verified submissions)
    const verifiedSubIds = new Set(verifiedSubs.map(s => s._id.toString()));
    const verifiedDocs = allDocuments.filter(d => verifiedSubIds.has(d.submissionId?.toString()));

    const docSheet = workbook.addWorksheet('Document Index');
    docSheet.columns = [
        { header: 'Teacher', key: 'teacher', width: 25 },
        { header: 'Criterion', key: 'crit', width: 15 },
        { header: 'Sub-Criterion', key: 'subc', width: 15 },
        { header: 'File Name', key: 'file', width: 30 },
        { header: 'Upload Date', key: 'date', width: 20 },
    ];
    docSheet.getRow(1).font = { bold: true };

    verifiedDocs.forEach(doc => {
        const teacher = teachers.find(t => t._id.toString() === doc.userId.toString());
        docSheet.addRow({
            teacher: teacher ? teacher.name : 'Unknown',
            crit: `C${doc.criterionId}`,
            subc: doc.subCriterion,
            file: doc.originalName,
            date: new Date(doc.uploadedAt).toLocaleDateString()
        });
    });

    await workbook.xlsx.write(res);
};
const generateSingleSubmissionExcel = async (submission, user, documents, res) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NAAC Portal';
    workbook.created = new Date();

    const sheetName = `C${submission.criterionId} - ${submission.subCriterion}`;
    const sheet = workbook.addWorksheet(sheetName);

    sheet.mergeCells('A1:C1');
    const headerCell = sheet.getCell('A1');
    headerCell.value = `NAAC Verified Form - Criterion ${submission.criterionId} (${submission.subCriterion})`;
    headerCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };

    sheet.addRow(['Teacher Name', user.name, '']);
    sheet.addRow(['Department', user.department, '']);
    sheet.addRow(['Export Date', new Date().toLocaleDateString('en-GB'), '']);
    sheet.addRow([]);

    // Data Columns
    const formKeys = submission.formData ? Object.keys(submission.formData) : [];
    
    const columns = [
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Supporting Documents', key: 'doc', width: 30 },
        { header: 'Upload Dates', key: 'date', width: 20 }
    ];
    
    formKeys.forEach(k => {
        columns.push({ header: k, key: k, width: 25 });
    });

    sheet.columns = columns;
    const headerRow = sheet.getRow(6);
    headerRow.values = columns.map(c => c.header);
    headerRow.font = { bold: true };

    const docNames = documents.map(d => d.originalName).join(', ');
    const docDates = documents.map(d => new Date(d.uploadedAt).toLocaleDateString('en-GB')).join(', ');

    const rowData = {
        status: submission.status,
        doc: docNames,
        date: docDates
    };
    
    if (submission.formData) {
        Object.entries(submission.formData).forEach(([k, v]) => {
            rowData[k] = String(v);
        });
    }

    const dataRow = sheet.addRow(rowData);
    dataRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
            top: {style:'thin'}, left: {style:'thin'},
            bottom: {style:'thin'}, right: {style:'thin'}
        };
    });

    // Dummy Signature
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);

    const sigPath = path.join(__dirname, '../assets/signature.jpg');
    if (fs.existsSync(sigPath)) {
        const imageId = workbook.addImage({
            filename: sigPath,
            extension: 'jpeg',
        });
        
        sheet.addImage(imageId, {
            tl: { col: 2, row: sheet.rowCount }, 
            ext: { width: 100, height: 100 }
        });
        
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
    }

    const sigRow1 = sheet.addRow(['', '', '---------------------------------------------------------']);
    const sigRow2 = sheet.addRow(['', '', 'Verified & Approved by Head of Department']);
    const sigRow3 = sheet.addRow(['', '', '(Signature)']);
    
    sigRow1.getCell(3).font = { bold: true };
    sigRow2.getCell(3).font = { bold: true };
    sigRow1.getCell(3).alignment = { horizontal: 'right' };
    sigRow2.getCell(3).alignment = { horizontal: 'right' };
    sigRow3.getCell(3).alignment = { horizontal: 'right' };

    await workbook.xlsx.write(res);
};

module.exports = { generateTeacherExcel, generateConsolidatedExcel, generateSingleSubmissionExcel };
