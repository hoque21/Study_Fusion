import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FaShieldAlt } from "react-icons/fa";
import { adminAPI } from "../../services/api";
import { useAdmin } from "../../contexts/AdminContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mobile || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await adminAPI.login(form);
      adminLogin(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0B1F3A] via-[#122C4F] to-[#1F3A5F] flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden'
      >
        <div className='bg-gradient-to-r from-[#0B1F3A] to-[#16324F] px-8 py-10 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] rounded-full mb-4 shadow-lg'>
            <FaShieldAlt className='text-[#0B1F3A] text-2xl' />
          </div>
          <h1 className='text-2xl font-extrabold text-white'>Admin Panel</h1>
          <p className='text-[#B9C4D4] text-sm mt-1'>Study Fusion</p>
        </div>
        <div className='px-8 py-8'>
          {error && (
            <div className='mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl'>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className='space-y-5' noValidate>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Admin Mobile</label>
              <input
                type='text' name='mobile' placeholder='Enter admin mobile'
                value={form.mobile} onChange={handleChange} disabled={loading}
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 outline-none transition text-gray-900 disabled:opacity-60'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Password</label>
              <div className='relative'>
                <input
                  type={showPw ? 'text' : 'password'} name='password' placeholder='Enter admin password'
                  value={form.password} onChange={handleChange} disabled={loading}
                  className='w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 outline-none transition text-gray-900 disabled:opacity-60'
                />
                <button type='button' onClick={() => setShowPw((v) => !v)} tabIndex={-1}
                  className='absolute right-3 top-3.5 text-gray-400 hover:text-[#0B1F3A] transition'>
                  {showPw ? <EyeSlashIcon className='h-5 w-5' /> : <EyeIcon className='h-5 w-5' />}
                </button>
              </div>
            </div>
            <motion.button type='submit' disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              className='w-full bg-gradient-to-r from-[#0B1F3A] to-[#16324F] text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed'>
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in to Admin Panel'}
            </motion.button>
          </form>
          <p className='text-center text-xs text-gray-400 mt-6'>
            Browser demo credentials: mobile = <b>admin</b> / password = <b>admin123</b>.
            This demo is not secured for real administration.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
