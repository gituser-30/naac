// client/src/components/CriterionCard.jsx
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { motion } from 'framer-motion';

const CriterionCard = ({ criterion, title, marks, progressData }) => {
  const navigate = useNavigate();
  
  let status = 'Not Started';
  let badgeColor = 'bg-surfaceHover text-gray-400 border border-white/5';
  let percentage = 0;

  if (progressData && progressData.total > 0) {
      if (progressData.verified === progressData.total) {
          status = 'Verified';
          badgeColor = 'bg-green-500/20 text-green-400 border border-green-500/30';
          percentage = 100;
      } else if (progressData.submitted > 0) {
          status = 'Submitted';
          badgeColor = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
          percentage = Math.round((progressData.submitted / progressData.total) * 100);
      } else {
          status = 'In Progress';
          badgeColor = 'bg-primary-500/20 text-primary-400 border border-primary-500/30';
          percentage = 50; 
      }
  }

  return (
    <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={() => navigate(`/criterion/${criterion}`)}
        className="glass-panel p-5 rounded-2xl cursor-pointer flex flex-col justify-between h-full group hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:border-primary-500/50 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">Criterion {criterion}</h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{title}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium tracking-wide ${badgeColor}`}>
            {status}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2 font-medium">
            <span>Progress</span>
            <span className={percentage === 100 ? 'text-green-400' : 'text-primary-400'}>{percentage}%</span>
        </div>
        <div className="w-full bg-surfaceHover rounded-full h-1.5 overflow-hidden border border-white/5">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-1.5 rounded-full ${percentage === 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-gradient-to-r from-primary-500 to-accent-400 shadow-[0_0_10px_rgba(249,115,22,0.8)]'}`}
            ></motion.div>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Max Marks: <span className="text-gray-300 font-bold">{marks}</span>
        </span>
        <span className="text-xs font-semibold text-primary-400 group-hover:text-primary-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          Manage &rarr;
        </span>
      </div>
    </motion.div>
  );
};

export default CriterionCard;
