import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaEnvelope, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { adminAPI } from '../../services/api';

const MySwal = withReactContent(Swal);

const STATUS_STYLES = { New: 'bg-red-100 text-red-800 border-red-200', Read: 'bg-yellow-100 text-yellow-800 border-yellow-200', Replied: 'bg-green-100 text-green-800 border-green-200' };

const formatDateTime = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await adminAPI.getMessages(params);
      setMessages(res.data.messages || []);
    } catch (err) { setError(err?.response?.data?.message || 'Failed to load messages'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleStatusChange = async (msg, newStatus) => {
    if (msg.status === newStatus) return;
    setUpdatingId(msg.id);
    try { await adminAPI.updateMessageStatus(msg.id, newStatus); setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: newStatus } : m)); }
    catch (err) { MySwal.fire({ title: 'Error', text: 'Failed to update status', icon: 'error', confirmButtonColor: '#0B1F3A' }); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (msg) => {
    const result = await MySwal.fire({ title: 'Delete Message?', html: '<p>Delete message from <b>'+msg.name+'</b>? Cannot be undone.</p>', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, Delete' });
    if (!result.isConfirmed) return;
    try { await adminAPI.deleteMessage(msg.id); setMessages((prev) => prev.filter((m) => m.id !== msg.id)); }
    catch (err) { MySwal.fire({ title: 'Error', text: 'Delete failed', icon: 'error', confirmButtonColor: '#0B1F3A' }); }
  };
  return (
    <div className='space-y-5'>
      <div><h1 className='text-2xl font-extrabold text-gray-800'>Contact Messages</h1><p className='text-gray-500 text-sm'>{messages.length} messages{statusFilter ? ' — '+statusFilter : ''}</p></div>
      <div className='flex gap-2 flex-wrap'>
        {['', 'New', 'Read', 'Replied'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={(statusFilter === s ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B1F3A]')+' px-4 py-1.5 rounded-full text-sm font-semibold transition border-2'}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className='space-y-3'>
        {loading ? (
          <div className='flex items-center justify-center py-16 text-[#3B5378] gap-3 bg-white rounded-2xl shadow-sm border border-gray-100'><svg className='animate-spin h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' /></svg>Loading messages...</div>
        ) : error ? (
          <div className='p-6 text-red-600 bg-white rounded-2xl'>{error}</div>
        ) : messages.length === 0 ? (
          <div className='text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100'><FaEnvelope size={32} className='mx-auto mb-3 opacity-30' /><p>No messages found</p></div>
        ) : (
          messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={'bg-white rounded-2xl shadow-sm border overflow-hidden '+(msg.status === 'New' ? 'border-red-200' : 'border-gray-100')}>
              <div className='flex items-start justify-between p-5 cursor-pointer hover:bg-gray-50 transition' onClick={() => { setExpandedId(expandedId === msg.id ? null : msg.id); if (msg.status === 'New') handleStatusChange(msg, 'Read'); }}>
                <div className='flex items-start gap-4 min-w-0 flex-1'>
                  <div className='w-10 h-10 bg-[#0B1F3A] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>{msg.name?.[0]?.toUpperCase()}</div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'><p className='font-bold text-gray-800'>{msg.name}</p><span className={STATUS_STYLES[msg.status]+' px-2 py-0.5 rounded-full text-xs font-semibold border'}>{msg.status}</span></div>
                    <p className='text-gray-500 text-sm'>{msg.email}{msg.phone ? ' • '+msg.phone : ''}</p>
                    <p className='text-gray-700 font-medium text-sm mt-0.5 truncate'>{msg.subject}</p>
                    <p className='text-gray-400 text-xs mt-0.5'>{formatDateTime(msg.created_at)}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 flex-shrink-0 ml-2'>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(msg); }} className='p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition'><FaTrash size={13} /></button>
                  {expandedId === msg.id ? <FaChevronUp className='text-gray-400' size={14} /> : <FaChevronDown className='text-gray-400' size={14} />}
                </div>
              </div>              <AnimatePresence initial={false}>
                {expandedId === msg.id && (
                  <motion.div key='body' initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
                    <div className='px-5 pb-5 pt-0 border-t border-gray-100'>
                      <div className='bg-gray-50 rounded-xl p-4 mt-3'><p className='text-gray-700 text-sm leading-relaxed whitespace-pre-wrap'>{msg.message}</p></div>
                      <div className='flex items-center gap-3 mt-4'>
                        <span className='text-sm font-semibold text-gray-600'>Update status:</span>
                        <div className='flex gap-2'>
                          {['New', 'Read', 'Replied'].map((s) => (
                            <button key={s} onClick={() => handleStatusChange(msg, s)} disabled={msg.status === s || updatingId === msg.id}
                              className={(msg.status === s ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B1F3A] disabled:opacity-50')+' px-3 py-1.5 rounded-lg text-xs font-semibold transition border-2'}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
