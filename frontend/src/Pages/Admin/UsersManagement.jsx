import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaSearch, FaTrash, FaToggleOn, FaToggleOff, FaUsers } from 'react-icons/fa';
import { adminAPI } from '../../services/api';

const MySwal = withReactContent(Swal);
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try { const res = await adminAPI.getUsers(); setUsers(res.data.users || []); setFiltered(res.data.users || []); }
    catch (err) { setError(err?.response?.data?.message || 'Failed to load users'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter((u) => u.name?.toLowerCase().includes(q) || u.mobile?.includes(q) || u.email?.toLowerCase().includes(q)));
  }, [search, users]);
  const handleToggle = async (user) => {
    const action = user.is_active ? 'deactivate' : 'activate';
    const result = await MySwal.fire({ title: action.charAt(0).toUpperCase()+action.slice(1)+' User?', html: '<p>Are you sure you want to <b>'+action+'</b> <b>'+user.name+'</b>?</p>', icon: 'question', showCancelButton: true, confirmButtonColor: user.is_active ? '#ef4444' : '#0B1F3A', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, '+action });
    if (!result.isConfirmed) return;
    try { const res = await adminAPI.toggleUserStatus(user.id); setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: res.data.isActive ? 1 : 0 } : u)); }
    catch (err) { MySwal.fire({ title: 'Error', text: err?.response?.data?.message || 'Action failed', icon: 'error', confirmButtonColor: '#0B1F3A' }); }
  };

  const handleDelete = async (user) => {
    const result = await MySwal.fire({ title: 'Delete User?', html: '<p>Permanently delete <b>'+user.name+'</b> and all data? Cannot be undone.</p>', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, Delete' });
    if (!result.isConfirmed) return;
    try {
      await adminAPI.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      MySwal.fire({ title: 'Deleted', text: 'User deleted successfully', icon: 'success', iconColor: '#F5A623', background: '#FFF7E8', timer: 1500, showConfirmButton: false });
    } catch (err) { MySwal.fire({ title: 'Error', text: err?.response?.data?.message || 'Delete failed', icon: 'error', confirmButtonColor: '#0B1F3A' }); }
  };
  return (
    <div className='space-y-5'>
      <div><h1 className='text-2xl font-extrabold text-gray-800'>Users Management</h1><p className='text-gray-500 text-sm'>{users.length} registered users</p></div>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
        <div className='relative'>
          <FaSearch className='absolute left-4 top-3.5 text-gray-400' size={14} />
          <input type='text' placeholder='Search by name, mobile or email...' value={search} onChange={(e) => setSearch(e.target.value)} className='w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B1F3A] outline-none transition text-sm' />
        </div>
      </div>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        {loading ? (<div className='flex items-center justify-center py-16 text-[#3B5378] gap-3'><svg className='animate-spin h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' /></svg>Loading users...</div>)
        : error ? (<div className='p-6 text-red-600'>{error}</div>)
        : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100'><tr><th className='px-5 py-3.5 text-left'>#</th><th className='px-5 py-3.5 text-left'>User</th><th className='px-5 py-3.5 text-left'>Contact</th><th className='px-5 py-3.5 text-left'>Details</th><th className='px-5 py-3.5 text-left'>Joined</th><th className='px-5 py-3.5 text-left'>Status</th><th className='px-5 py-3.5 text-left'>Actions</th></tr></thead>
              <tbody className='divide-y divide-gray-50'>
                {filtered.map((user, i) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className='hover:bg-gray-50 transition'>
                    <td className='px-5 py-3.5 text-gray-400 font-mono text-xs'>{user.id}</td>
                    <td className='px-5 py-3.5'><div className='flex items-center gap-3'><div className='w-8 h-8 bg-[#0B1F3A] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>{user.name?.[0]?.toUpperCase()}</div><div><p className='font-semibold text-gray-800'>{user.name}</p><p className='text-gray-400 text-xs'>{user.sex || '—'}</p></div></div></td>
                    <td className='px-5 py-3.5'><p className='text-gray-700'>{user.mobile}</p><p className='text-gray-400 text-xs truncate max-w-xs'>{user.email || '—'}</p></td>
                    <td className='px-5 py-3.5 text-gray-600'>Age: {user.age || '—'}</td>
                    <td className='px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap'>{formatDate(user.created_at)}</td>
                    <td className='px-5 py-3.5'><span className={(user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700')+' px-2.5 py-1 rounded-full text-xs font-semibold'}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className='px-5 py-3.5'><div className='flex items-center gap-2'><button onClick={() => handleToggle(user)} title={user.is_active ? 'Deactivate' : 'Activate'} className={(user.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100')+' p-2 rounded-lg transition'}>{user.is_active ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}</button><button onClick={() => handleDelete(user)} title='Delete user' className='p-2 rounded-lg text-red-500 hover:bg-red-50 transition'><FaTrash size={14} /></button></div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (<div className='text-center py-16 text-gray-400'><FaUsers size={32} className='mx-auto mb-3 opacity-30' /><p>No users found</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
