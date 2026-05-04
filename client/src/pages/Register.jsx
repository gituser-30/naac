// client/src/pages/Register.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  department: yup.string().required('Department is required'),
  designation: yup.string().required('Designation is required'),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      setIsPending(true);
      toast.success('Registration request sent!');
    } catch (err) {
        // error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel max-w-md w-full p-8 text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Registration Successful</h2>
          <p className="text-gray-300">
            Your registration has been sent to the Head of Department for verification.
          </p>
          <p className="text-sm text-gray-400">
            Once approved, the HOD will verify your details and send your login password to your registered email address.
          </p>
          <Link to="/login" className="block w-full glass-button mt-4">
            Return to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 z-0">
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob z-[-1]"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000 z-[-1]"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10"
      >
        <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md underline decoration-primary-500 underline-offset-8">Teacher Signup</h2>
        <h3 className="mt-6 text-lg text-gray-400">Request access to the NAAC Portal</h3>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass-panel py-8 px-4 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <div className="mt-1">
                <input {...register('name')} className="glass-input block w-full" placeholder="Dr. Jane Smith" />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Official Email</label>
              <div className="mt-1">
                <input {...register('email')} type="email" className="glass-input block w-full" placeholder="jane@college.edu" />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Department</label>
              <div className="mt-1">
                <input {...register('department')} className="glass-input block w-full" placeholder="Computer Engineering" />
                {errors.department && <p className="mt-1 text-sm text-red-400">{errors.department.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300">Designation</label>
              <div className="mt-1">
                <input {...register('designation')} className="glass-input block w-full" placeholder="Associate Professor" />
                {errors.designation && <p className="mt-1 text-sm text-red-400">{errors.designation.message}</p>}
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <p className="text-xs text-yellow-500 leading-relaxed">
                    <strong>Note:</strong> You don't need to set a password now. After your HOD verifies your registration, they will email you your login credentials.
                </p>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <button type="submit" disabled={loading} className="w-full flex justify-center glass-button disabled:opacity-70">
                {loading ? 'Sending Request...' : 'Submit Registration Request'}
              </button>
            </motion.div>
          </form>
          <div className="mt-8 text-center text-sm border-t border-white/10 pt-6">
             <span className="text-gray-400">Already have an account? </span>
             <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
