// client/src/components/ProgressBar.jsx
const ProgressBar = ({ percentage, color = "bg-blue-600" }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
            className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
            style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
};

export default ProgressBar;
