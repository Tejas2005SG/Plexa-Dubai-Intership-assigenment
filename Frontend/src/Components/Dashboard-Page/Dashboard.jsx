import React, { useEffect } from 'react';
import { useAuthStore } from '../Store/AuthStore.js';
import { UserPlus, LogIn, LogOut } from "lucide-react";
import { Outlet, Link, useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  const navElements = [
    // { name: 'Home', navigation: () => navigate('/dashboard-home'), roles: ['admin', 'citizen'] },
    { name: 'Campaign', navigation: () => navigate('/campaign'), roles: ['citizen'] },
    { name: 'Invoices', navigation: () => navigate('/invoice'), roles: ['citizen'] },
    { name: 'Accept-Reject', navigation: () => navigate('/accept-reject'), roles: ['admin'] },
    { name: 'Account Setting', navigation: () => navigate('/account-setting'), roles: ['admin', 'citizen'] },
   
  ];

  const listNav = navElements
    .filter(navElement => navElement.roles.includes(user?.role))
    .map((navElement, index) => (
      <li
        key={index}
        onClick={navElement.navigation}
        className="w-48 bg-gray-300 hover:bg-zinc-400 text-black rounded-lg p-2 flex justify-center items-center my-1 mx-auto cursor-pointer"
      >
        <h1 className="text-lg">{navElement.name}</h1>
      </li>
    ));

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, isCheckingAuth, navigate]);

  return (
    <div className="flex p-3 items-center overflow-hidden bg-zinc-900 h-screen">
      <div className="main-sidebar w-[14vw] h-[98vh] rounded-xl bg-gray-100 flex flex-col justify-between">
        <div>
          <div className="w-52 bg-gray-300 text-zinc-900 rounded-lg p-4 flex justify-center items-center my-1 mx-auto">
            <h1 className="text-xl font-bold">{user ? `Welcome, ${user.firstName}` : 'Loading...'}</h1>
          </div>
          <ul className="inner-sidebar py-1 flex flex-col gap-1 my-3">
            {listNav}
          </ul>
        </div>
        <div className="flex justify-center mb-4">
          {isAuthenticated ? (
            <button
              className="bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Log Out</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <UserPlus className="mr-2" size={18} />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-zinc-500 hover:bg-zinc-950 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="main-box w-[84vw] h-[98vh] bg-gray-100 p-4 ml-3 rounded-xl">
        <h1 className='text-3xl font-bold text-center text-blue-600'>PLEXA DUBAI INTERNSHIP ASSIGNMENT</h1>
        <div>

        <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
