import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';

// Regular app components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ChatBot from './Components/ChatBot';

const Home = lazy(() => import('./Components/Home'));
const About = lazy(() => import('./Pages/About'));
const Services = lazy(() => import('./Pages/Services'));
const Team = lazy(() => import('./Pages/OurTeam'));
const Training = lazy(() => import('./Pages/Training'));
const Research = lazy(() => import('./Pages/Research'));
const Contact = lazy(() => import('./Pages/Contact'));
const Login = lazy(() => import('./Components/Login'));
const Registration = lazy(() => import('./Components/Registration'));
const ForgetPassword = lazy(() => import('./Components/ForgetPassword'));
const ResetPassword = lazy(() => import('./Components/ResetPassword'));
const Mindchange = lazy(() => import('./Pages/Mindchange'));
const MyAppointments = lazy(() => import('./Pages/MyAppointments'));
const AdminLogin = lazy(() => import('./Pages/Admin/AdminLogin'));
const AdminLayout = lazy(() => import('./Pages/Admin/AdminLayout'));
const Dashboard = lazy(() => import('./Pages/Admin/Dashboard'));
const UsersManagement = lazy(() => import('./Pages/Admin/UsersManagement'));
const AppointmentsManagement = lazy(() => import('./Pages/Admin/AppointmentsManagement'));
const ContactMessages = lazy(() => import('./Pages/Admin/ContactMessages'));
const SiteContentManagement = lazy(() => import('./Pages/Admin/SiteContentManagement'));

const LoadingScreen = () => (
  <div className="flex min-h-[50vh] items-center justify-center text-[#0B1F3A]" role="status">
    Loading page…
  </div>
);

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
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Admin area - no navbar/footer */}
              <Route path='/admin/login' element={<AdminLogin />} />
              <Route path='/admin' element={<AdminRoute />}>
                <Route index element={<Navigate to='/admin/dashboard' replace />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='users' element={<UsersManagement />} />
                <Route path='appointments' element={<AppointmentsManagement />} />
                <Route path='messages' element={<ContactMessages />} />
                <Route path='consultants' element={<SiteContentManagement key='consultants' type='consultants' />} />
                <Route path='universities' element={<SiteContentManagement key='universities' type='universities' />} />
              </Route>
              {/* Main app with navbar/footer */}
              <Route path='/*' element={<MainLayout />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;