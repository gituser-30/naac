// client/src/components/NotificationBell.jsx
import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        const fetchNotifs = async () => {
            try {
                const res = await axiosInstance.get('/notifications');
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.unread);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNotifs();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            await axiosInstance.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axiosInstance.patch('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <span className="font-semibold text-gray-700 text-sm">Notifications</span>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-center text-gray-500">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif._id} 
                                    onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                                    className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${notif.isRead ? 'opacity-60 bg-white' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                                >
                                    <p className="text-sm text-gray-800 mb-1">{notif.message}</p>
                                    <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
