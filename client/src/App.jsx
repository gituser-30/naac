// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import HODDashboard from './pages/HODDashboard';
import CriterionPage from './pages/CriterionPage';
import HODTeacherView from './pages/HODTeacherView';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading, user } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'hod' ? '/hod-dashboard' : '/dashboard'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'hod' ? '/hod-dashboard' : '/dashboard'} />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/dashboard" element={<TeacherDashboard />} />
        <Route path="/criterion/:criterionId" element={<CriterionPage />} />
      </Route>

      {/* HOD Routes */}
      <Route element={<ProtectedRoute allowedRoles={['hod']} />}>
        <Route path="/hod-dashboard" element={<HODDashboard />} />
        <Route path="/hod/teacher/:uid" element={<HODTeacherView />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
