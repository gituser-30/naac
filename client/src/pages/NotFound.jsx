// client/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
    const { user } = useAuth();
    const dashboardLink = user?.role === 'hod' ? '/hod-dashboard' : '/dashboard';

    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center px-4">
            <h1 className="text-9xl font-extrabold text-blue-900 tracking-widest">404</h1>
            <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute text-white">
                Page Not Found
            </div>
            <h2 className="mt-8 text-3xl font-bold text-gray-900 text-center">Oops! You seem to be lost.</h2>
            <p className="mt-4 text-lg text-gray-600 text-center max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="mt-8 flex justify-center">
                <Link
                    to={dashboardLink}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    &larr; Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
