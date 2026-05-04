// client/src/components/FileList.jsx
import { Trash2, ExternalLink, FileText } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FileList = ({ documents, onDeleteSuccess, readonly }) => {
  if (!documents || documents.length === 0) {
    return (
        <div className="mt-6 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-surface/30">
            <p className="text-gray-500 italic">No documents uploaded yet.</p>
        </div>
    );
  }

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
        try {
            await axiosInstance.delete(`/upload/file/${docId}`);
            toast.success('File deleted');
            if (onDeleteSuccess) onDeleteSuccess();
        } catch (err) {
            console.error(err);
        }
    }
  };

  const handleView = async (docId) => {
      try {
          const res = await axiosInstance.get(`/upload/file/${docId}`);
          window.open(res.data.url, '_blank');
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="mt-6 space-y-3">
        <AnimatePresence>
            {documents.map((doc, index) => (
                <motion.div 
                    key={doc._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-surfaceHover border border-white/5 rounded-xl hover:border-white/10 hover:shadow-lg transition-all group"
                >
                    <div className="flex items-center space-x-4 overflow-hidden">
                        <div className="p-2 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                            <FileText className="w-6 h-6 text-primary-400" />
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-medium text-white truncate" title={doc.originalName}>{doc.originalName}</span>
                            <span className="text-xs text-gray-500 mt-0.5">
                                {new Date(doc.uploadedAt).toLocaleDateString()} • {(doc.size / 1024).toFixed(2)} KB
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(doc._id)} 
                            className="p-2 text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 hover:text-primary-300 rounded-lg transition-colors" 
                            title="View"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </motion.button>
                        {!readonly && (
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(doc._id)} 
                                className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors" 
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
  );
};

export default FileList;
