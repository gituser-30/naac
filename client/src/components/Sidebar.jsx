// client/src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, Clock } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const teacherLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Criteria 1', path: '/criterion/1', icon: <FileText className="w-5 h-5" /> },
    { name: 'Criteria 2', path: '/criterion/2', icon: <FileText className="w-5 h-5" /> },
    { name: 'Criteria 3', path: '/criterion/3', icon: <FileText className="w-5 h-5" /> },
    { name: 'Criteria 4', path: '/criterion/4', icon: <FileText className="w-5 h-5" /> },
    { name: 'Criteria 5', path: '/criterion/5', icon: <FileText className="w-5 h-5" /> },
    { name: 'Criteria 6', path: '/criterion/6', icon: <FileText className="w-5 h-5" /> },
    { name: 'Criteria 7', path: '/criterion/7', icon: <FileText className="w-5 h-5" /> },
  ];

  const hodLinks = [
    { name: 'Dashboard', path: '/hod-dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  const links = user?.role === 'hod' ? hodLinks : teacherLinks;

  return (
    <div className="flex flex-col w-64 bg-blue-900 border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-blue-800">
        <span className="text-xl font-bold text-white tracking-wider">NAAC PORTAL</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto text-blue-100">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((link) => {
             const isActive = location.pathname === link.path;
             return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'bg-blue-800 text-white' : 'hover:bg-blue-800 hover:text-white'
                }`}
              >
                {link.icon}
                <span className="ml-3">{link.name}</span>
              </Link>
             );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
