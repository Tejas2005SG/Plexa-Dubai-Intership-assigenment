import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from "react-router-dom";


import SignupPage from "./Components/Signup-Page/Signup.jsx";
import LoginPage from "./Components/Login-Page/Login.jsx";
import Dashboard from "./Components/Dashboard-Page/Dashboard.jsx";
import EmailVerificationPage from "./Components/EmailVerificationPage/EmailVerificationPage.jsx";
import ForgotPasswordPage from './Components/Forgot-Password/ForgotPassword.jsx';
import ResetPasswordPage from './Components/Reset-Password/ResetPassword.jsx';
import CampaignComponent from './Components/campaign-page/campaign.jsx';
import InvoiceComponent from './Components/invoice-page/invoice.jsx';
import AccountSetting from './Components/account-setting-page/accountSetting.jsx';
import AcceptReject from './Components/accept-reject/acceptReject.jsx';
import Loader from "./Components/loading-component/loader.jsx";
import HomePage from './Components/home/home.jsx';

import { useAuthStore } from './Components/Store/AuthStore.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (!user?.isVerified) return <Navigate to='/login' replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return <div><Loader/></div>;
  if (isAuthenticated && user?.isVerified) return <Navigate to='/' replace />;
  return children;
};

function App() {
  const { rehydrateUser, isCheckingAuth, user } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await rehydrateUser();
      setInitialized(true);
    };
    initializeAuth();
  }, [rehydrateUser]);

  if (!initialized || isCheckingAuth) return <div>Loading...</div>;

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden'>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route path="campaign" element={user?.role === "citizen" ? <CampaignComponent /> : <Navigate to='/login' />} />
          <Route path="invoice" element={user?.role === "citizen" ? <InvoiceComponent /> : <Navigate to='/login' />} />
          <Route path="account-setting" element={<AccountSetting />} />
          <Route path="accept-reject" element={user?.role === "admin" ? <AcceptReject /> : <Navigate to='/login' />} />
          <Route path="dashboard-home" element={user?.role === "admin" ? <HomePage /> : <Navigate to='/login' />} />
        </Route>
        <Route path='/signup' element={
          <RedirectAuthenticatedUser>
            <SignupPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/login' element={
          <RedirectAuthenticatedUser>
            <LoginPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
        <Route path='/forgot-password' element={
          <RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/reset-password/:token' element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
