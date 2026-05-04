// client/src/pages/Login.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('teacher');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Pass the selected role to the backend if needed, or backend just resolves it
      const user = await login(data.email, data.password);
      
      if (user.role !== selectedRole) {
          toast.error(`Account registered as ${user.role.toUpperCase()}. Automatically routing.`);
      } else {
          toast.success('Logged in successfully');
      }
      
      navigate(user.role === 'hod' ? '/hod-dashboard' : '/dashboard');
    } catch (err) {
        // error handled in axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 z-0">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob z-[-1]"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000 z-[-1]"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000 z-[-1]"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10"
      >
        <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">NAAC Portal</h2>
        <h3 className="mt-3 text-xl font-medium text-gray-400">Welcome Back</h3>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass-panel py-8 px-4 sm:rounded-2xl sm:px-10">
          
          {/* Role Toggle */}
          <div className="flex bg-surfaceHover p-1 rounded-xl mb-8 relative border border-white/5">
              <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary-600 rounded-lg shadow-md transition-all duration-300 ease-out z-0 ${selectedRole === 'teacher' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
              />
              <button 
                  onClick={() => setSelectedRole('teacher')}
                  className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${selectedRole === 'teacher' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                  Teacher
              </button>
              <button 
                  onClick={() => setSelectedRole('hod')}
                  className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${selectedRole === 'hod' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                  HOD
              </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  className="glass-input block w-full"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  className="glass-input block w-full"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center glass-button disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : `Sign in as ${selectedRole === 'hod' ? 'HOD' : 'Teacher'}`}
              </button>
            </motion.div>
          </form>
          <div className="mt-8 text-center text-sm border-t border-white/10 pt-6">
             <span className="text-gray-400">Don't have an account? </span>
             <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">Register here</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
