import React from 'react';
import { FiUser, FiLock, FiBell, FiMail, FiLogOut } from 'react-icons/fi';

const AccountSettingsIcons = () => {
  const handleClick = (section) => {
    alert(`Navigating to ${section} settings.`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-36">
      <h2 className="text-2xl font-semibold mb-6 text-center">Account Settings</h2>
      <div className="grid grid-cols-2 gap-6 text-center">
        <div
          onClick={() => handleClick('Profile')}
          className="cursor-pointer hover:bg-indigo-100 p-4 rounded-lg transition"
        >
          <FiUser className="text-4xl text-indigo-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </div>
        <div
          onClick={() => handleClick('Security')}
          className="cursor-pointer hover:bg-indigo-100 p-4 rounded-lg transition"
        >
          <FiLock className="text-4xl text-indigo-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-700">Security</span>
        </div>
        <div
          onClick={() => handleClick('Notifications')}
          className="cursor-pointer hover:bg-indigo-100 p-4 rounded-lg transition"
        >
          <FiBell className="text-4xl text-indigo-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-700">Notifications</span>
        </div>
        <div
          onClick={() => handleClick('Email Preferences')}
          className="cursor-pointer hover:bg-indigo-100 p-4 rounded-lg transition"
        >
          <FiMail className="text-4xl text-indigo-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-700">Email</span>
        </div>
        <div
          onClick={() => handleClick('Logout')}
          className="cursor-pointer hover:bg-red-100 p-4 rounded-lg transition"
        >
          <FiLogOut className="text-4xl text-red-500 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-700">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsIcons;
