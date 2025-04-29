import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../Store/AuthStore.js';
import { UserPlus, LogIn, LogOut, Menu, X, Home } from "lucide-react";
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

function DashboardPage() {
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    setActiveTab(location.pathname.split('/dashboard/')[1] || 'home');
  }, [location]);

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, isCheckingAuth, navigate]);

  const navElements = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home size={18} className="mr-2" />,
      roles: ['admin', 'citizen'] 
    },
    { 
      name: 'Campaign', 
      path: '/dashboard/campaign', 
      icon: <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            </span>,
      roles: ['citizen'] 
    },
    { 
      name: 'Invoices', 
      path: '/dashboard/invoice', 
      icon: <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            </span>,
      roles: ['citizen'] 
    },
    { 
      name: 'Accept-Reject', 
      path: '/dashboard/accept-reject', 
      icon: <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
            </span>,
      roles: ['admin'] 
    },
    { 
      name: 'Account', 
      path: '/dashboard/account-setting', 
      icon: <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
              <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
            </span>,
      roles: ['admin', 'citizen'] 
    },
  ];

  const filteredNav = navElements.filter(navElement => navElement.roles.includes(user?.role));

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <span className="ml-3 font-medium text-gray-800">
            {user ? `${user.firstName}` : 'Loading...'}
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block md:fixed w-full md:w-64 bg-white border-r border-gray-200 h-screen`}>
        <div className="p-4 flex flex-col h-full">
          {/* Desktop User Profile */}
          <div className="hidden md:flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-800">{user?.firstName || 'User'}</h3>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {filteredNav.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home size={18} className="mr-2" />
              Back to Home
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
              >
                <span>Logout</span>
                <LogOut size={18} />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  to="/signup"
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <UserPlus size={16} className="mr-1" />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <LogIn size={16} className="mr-1" />
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="h-full overflow-auto p-4 md:p-6">
          {/* Breadcrumb (optional) */}
          <div className="hidden md:flex items-center text-sm text-gray-500 mb-6">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            {location.pathname !== '/dashboard' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-700 capitalize">{activeTab.replace('-', ' ')}</span>
              </>
            )}
          </div>
          
          {/* Page Content */}
          {/* <div className="bg-white rounded-xl shadow-sm p-4 md:p-6"> */}
            <Outlet />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;