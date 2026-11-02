Set-Content "srcPagesAdminUsersManagement.jsx" -Encoding UTF8 -Value @'
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
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.users || []);
      setFiltered(res.data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter((u) =>
      u.name?.toLowerCase().includes(q) || u.mobile?.includes(q) || u.email?.toLowerCase().includes(q)
    ));
  }, [search, users]);

