import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/AuthStore.js';
import { LogOut, LogIn, Menu, X, User, ChevronRight } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
              InvoiceBridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Features
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Contact
            </a>

            {user ? (
              <div className="flex items-center ml-4">
                <div className="mr-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Welcome,</div>
                    <div className="font-medium text-gray-800">{user.firstName || "User"}</div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center"
                  onClick={handleLogout}
                >
                  Log Out
                  <LogOut size={16} className="ml-2" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  Login
                  <LogIn size={16} className="ml-2" />
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center"
                >
                  Sign Up
                  <ChevronRight size={16} className="ml-2" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 z-50 bg-white shadow-md transition-all duration-200 ease-in-out transform ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-100">
          <a
            href="#features"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>

          {user ? (
            <div className="pt-2 border-t border-gray-100">
              <div className="px-3 py-2 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Logged in as</div>
                  <div className="font-medium text-gray-800">{user.firstName || "User"}</div>
                </div>
              </div>
              <button
                className="w-full mt-2 flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleLogout}
              >
                <span>Log Out</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <Link
                to="/login"
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Login</span>
                <LogIn className="w-4 h-4" />
              </Link>
              <Link
                to="/signup"
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Sign Up</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;