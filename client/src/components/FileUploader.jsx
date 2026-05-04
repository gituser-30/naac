// client/src/components/FileUploader.jsx
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUploader = ({ criterionId, subCriterion, submissionId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
          toast.error('Invalid file type. Please upload PDF, DOCX, JPG or PNG.');
          return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
          toast.error('File size exceeds 10MB limit.');
          return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!submissionId) {
        toast.error('Please save the form as a draft or submit before uploading files.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('submissionId', submissionId);
    formData.append('subCriterion', subCriterion);

    setUploading(true);
    try {
      await axiosInstance.post(`/upload/${criterionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('File uploaded successfully');
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 border-2 border-dashed border-white/20 p-8 rounded-2xl bg-surface/50 text-center hover:bg-surfaceHover hover:border-primary-500/50 transition-all group">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <UploadCloud className="mx-auto h-16 w-16 text-primary-500/50 group-hover:text-primary-400 mb-4 transition-colors" />
      </motion.div>
      <p className="text-sm text-gray-400 mb-6">Upload supporting documents for <span className="font-semibold text-white">{subCriterion}</span></p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input 
              type="file" 
              onChange={handleFileChange} 
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20 file:transition-colors file:cursor-pointer cursor-pointer"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
          />
          <motion.button 
              whileHover={(!file || uploading) ? {} : { scale: 1.05 }}
              whileTap={(!file || uploading) ? {} : { scale: 0.95 }}
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-6 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all ${!file || uploading ? 'bg-surfaceHover text-gray-500 cursor-not-allowed border border-white/5' : 'bg-primary-500 hover:bg-primary-600 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]'}`}
          >
              {uploading ? 'Uploading...' : 'Upload File'}
          </motion.button>
      </div>
    </div>
  );
};

export default FileUploader;
