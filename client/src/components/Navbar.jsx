// client/src/components/Navbar.jsx
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, {user?.name}
        </h2>
        <span className="ml-2 text-sm text-gray-500 hidden sm:inline-block">| {user?.department}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <button
          onClick={logout}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-1" />
          <span className="hidden sm:inline-block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
