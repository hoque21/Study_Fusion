import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaUserTie,
  FaUniversity,
} from "react-icons/fa";
import { useAdmin } from "../../contexts/AdminContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const NAV_LINKS = [
  { to: "/admin/dashboard",    label: "Student Reviews", icon: <FaStar /> },
  { to: "/admin/consultants",  label: "Consultants", icon: <FaUserTie /> },
  { to: "/admin/universities", label: "Universities", icon: <FaUniversity /> },
  { to: "/admin/users",        label: "Users",        icon: <FaUsers /> },
  { to: "/admin/appointments", label: "Consultations", icon: <FaCalendarAlt /> },
  { to: "/admin/messages",     label: "Messages",     icon: <FaEnvelope /> },
];

const SidebarInner = ({ admin, handleLogout, setSidebarOpen }) => (
  <div className="flex flex-col h-full">
    <div className="px-6 py-6 border-b border-[#1F3A5F]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] rounded-lg flex items-center justify-center flex-shrink-0">
          <FaShieldAlt className="text-[#0B1F3A] text-sm" />
        </div>
        <div>
          <p className="text-white font-extrabold text-sm leading-tight">Admin Panel</p>
          <p className="text-[#B9C4D4] text-xs">Study Fusion</p>
        </div>
      </div>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={({ isActive }) =>
`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isActive ? "bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] shadow-md" : "text-[#B9C4D4] hover:bg-[#16324F] hover:text-white"
            }`
          }
        >
          <span className="text-base">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
    <div className="px-4 py-4 border-t border-[#1F3A5F]">
      <div className="flex items-center gap-3 mb-3 px-2">
        <div className="w-8 h-8 bg-[#16324F] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{admin?.name || "Administrator"}</p>
          <p className="text-[#B9C4D4] text-xs truncate">{admin?.mobile}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-900/30 hover:text-red-200 transition text-sm font-semibold">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  </div>
);

const AdminLayout = () => {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    MySwal.fire({ title: "Logout?", text: "Are you sure you want to logout from admin panel?", icon: "question", showCancelButton: true, confirmButtonColor: "#0B1F3A", cancelButtonColor: "#6b7280", confirmButtonText: "Yes, Logout" }).then((r) => { if (r.isConfirmed) { adminLogout(); navigate("/admin/login"); } });
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B1F3A] flex-shrink-0"><SidebarInner admin={admin} handleLogout={handleLogout} /></aside>
      <AnimatePresence>
        {sidebarOpen && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed left-0 top-0 h-full w-64 bg-[#0B1F3A] z-50 flex flex-col lg:hidden">
            <div className="flex justify-end p-3"><button onClick={() => setSidebarOpen(false)} className="text-[#B9C4D4] hover:text-white p-1"><FaTimes size={18} /></button></div>
            <div className="flex-1 overflow-hidden"><SidebarInner admin={admin} handleLogout={handleLogout} setSidebarOpen={setSidebarOpen} /></div>
          </motion.aside>
        </>)}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-[#0B1F3A] transition p-1"><FaBars size={20} /></button>
          <div className="hidden lg:block"><p className="text-[#0B1F3A] font-bold text-base">Study Fusion &mdash; Admin</p></div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, <b className="text-[#0B1F3A]">{admin?.name || "Admin"}</b></span>
            <div className="w-8 h-8 bg-[#0B1F3A] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
