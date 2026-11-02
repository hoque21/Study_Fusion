import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { adminAPI } from '../../services/api';

const MySwal = withReactContent(Swal);

const TIME_SLOT_LABELS = { '09:00-10:00': '9:00 AM - 10:00 AM', '10:00-11:00': '10:00 AM - 11:00 AM', '11:00-12:00': '11:00 AM - 12:00 PM', '12:00-13:00': '12:00 PM - 1:00 PM', '13:00-14:00': '1:00 PM - 2:00 PM', '14:00-15:00': '2:00 PM - 3:00 PM', '15:00-16:00': '3:00 PM - 4:00 PM', '16:00-17:00': '4:00 PM - 5:00 PM', '17:00-18:00': '5:00 PM - 6:00 PM' };

const STATUS_STYLES = { Pending: 'bg-yellow-100 text-yellow-800', Confirmed: 'bg-blue-100 text-blue-800', Completed: 'bg-green-100 text-green-800', Cancelled: 'bg-red-100 text-red-800' };

const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', date: '', doctor: '' });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      if (filters.doctor) params.doctor = filters.doctor;
      const res = await adminAPI.getAppointments(params);
      setAppointments(res.data.appointments || []);
    } catch (err) { setError(err?.response?.data?.message || 'Failed to load consultations'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);
  const handleStatusChange = async (appt, newStatus) => {
    if (appt.status === newStatus) return;
    const result = await MySwal.fire({ title: 'Update Status?', html: '<p>Change status of <b>#'+appt.id+'</b> from <b>'+appt.status+'</b> to <b>'+newStatus+'</b>?</p>', icon: 'question', showCancelButton: true, confirmButtonColor: '#0B1F3A', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, Update' });
    if (!result.isConfirmed) return;
    setUpdatingId(appt.id);
    try {
      await adminAPI.updateAppointmentStatus(appt.id, newStatus);
      setAppointments((prev) => prev.map((a) => a.id === appt.id ? { ...a, status: newStatus } : a));
    } catch (err) { MySwal.fire({ title: 'Error', text: err?.response?.data?.message || 'Update failed', icon: 'error', confirmButtonColor: '#0B1F3A' }); }
    finally { setUpdatingId(null); }
  };

  const clearFilters = () => setFilters({ status: '', date: '', doctor: '' });
  const iCls = 'w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0B1F3A] outline-none transition';

  return (
    <div className='space-y-5'>
      <div><h1 className='text-2xl font-extrabold text-gray-800'>Consultations</h1><p className='text-gray-500 text-sm'>{appointments.length} consultations{filters.status ? ' — '+filters.status : ''}</p></div>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
        <div className='flex items-center gap-2 mb-3 text-gray-600 text-sm font-semibold'><FaFilter size={12} /> Filters</div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))} className={iCls}><option value=''>All Statuses</option>{['Pending','Confirmed','Completed','Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <input type='date' value={filters.date} onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))} className={iCls} />
          <input type='text' placeholder='Search consultant name...' value={filters.doctor} onChange={(e) => setFilters((p) => ({ ...p, doctor: e.target.value }))} className={iCls} />
        </div>
        {(filters.status || filters.date || filters.doctor) && <button onClick={clearFilters} className='mt-3 text-sm text-[#0B1F3A] hover:underline font-medium'>✕ Clear filters</button>}
      </div>      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        {loading ? (<div className='flex items-center justify-center py-16 text-[#3B5378] gap-3'><svg className='animate-spin h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' /></svg>Loading consultations...</div>)
        : error ? (<div className='p-6 text-red-600'>{error}</div>)
        : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100'><tr><th className='px-4 py-3.5 text-left'>#</th><th className='px-4 py-3.5 text-left'>Student</th><th className='px-4 py-3.5 text-left'>Consultant</th><th className='px-4 py-3.5 text-left'>Date &amp; Time</th><th className='px-4 py-3.5 text-left'>Fee</th><th className='px-4 py-3.5 text-left'>Status</th><th className='px-4 py-3.5 text-left'>Action</th></tr></thead>
              <tbody className='divide-y divide-gray-50'>
                {appointments.map((a, i) => (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className='hover:bg-gray-50 transition'>
                    <td className='px-4 py-3 text-gray-400 font-mono text-xs'>{a.id}</td>
                    <td className='px-4 py-3'><p className='font-semibold text-gray-800'>{a.patient_name}</p><p className='text-gray-400 text-xs'>{a.patient_mobile}</p></td>
                    <td className='px-4 py-3'><p className='font-medium text-gray-700'>{a.doctor_name}</p><p className='text-gray-400 text-xs'>{a.doctor_role}</p></td>
                    <td className='px-4 py-3'><p className='text-gray-700 whitespace-nowrap'>{formatDate(a.appointment_date)}</p><p className='text-gray-400 text-xs'>{TIME_SLOT_LABELS[a.time_slot] || a.time_slot}</p></td>
                    <td className='px-4 py-3 font-semibold text-[#0B1F3A]'>${a.fee?.toLocaleString()}</td>
                    <td className='px-4 py-3'><span className={STATUS_STYLES[a.status]+' px-2.5 py-1 rounded-full text-xs font-semibold'}>{a.status}</span></td>
                    <td className='px-4 py-3'><select value={a.status} onChange={(e) => handleStatusChange(a, e.target.value)} disabled={updatingId === a.id} className='text-xs border-2 border-gray-200 rounded-lg px-2 py-1.5 focus:border-[#0B1F3A] outline-none transition cursor-pointer disabled:opacity-50'>{['Pending','Confirmed','Completed','Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (<div className='text-center py-16 text-gray-400'><FaCalendarAlt size={32} className='mx-auto mb-3 opacity-30' /><p>No consultations found</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsManagement;
