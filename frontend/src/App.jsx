import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';

// Regular app components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ChatBot from './Components/ChatBot';

// Regular app pages
import Home from './Components/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import Team from './Pages/OurTeam';
import Training from './Pages/Training';
import Research from './Pages/Research';
import Contact from './Pages/Contact';
import Login from './Components/Login';
import Registration from './Components/Registration';
import ForgetPassword from './Components/ForgetPassword';
import ResetPassword from './Components/ResetPassword';
import Mindchange from './Pages/Mindchange';
import MyAppointments from './Pages/MyAppointments';

// Admin pages
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminLayout from './Pages/Admin/AdminLayout';
import Dashboard from './Pages/Admin/Dashboard';
import UsersManagement from './Pages/Admin/UsersManagement';
import AppointmentsManagement from './Pages/Admin/AppointmentsManagement';
import ContactMessages from './Pages/Admin/ContactMessages';

// Main layout with Navbar + Footer
const MainLayout = () => (
  <>
    <Navbar />
    <div className='pt-16 min-h-screen'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/team' element={<Team />} />
        <Route path='/universities' element={<Training />} />
        <Route path='/training' element={<Training />} />
        <Route path='/research' element={<Research />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/mindchange' element={<Mindchange />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
    <Footer />
    <ChatBot />
  </>
);

const AdminRoute = () => {
  const { isAdminAuthenticated } = useAdmin();
  return isAdminAuthenticated ? <AdminLayout /> : <Navigate to='/admin/login' replace />;
};

function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Admin area - no navbar/footer */}
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin' element={<AdminRoute />}>
              <Route index element={<Navigate to='/admin/dashboard' replace />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='users' element={<UsersManagement />} />
              <Route path='appointments' element={<AppointmentsManagement />} />
              <Route path='messages' element={<ContactMessages />} />
            </Route>
            {/* Main app with navbar/footer */}
            <Route path='/*' element={<MainLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;