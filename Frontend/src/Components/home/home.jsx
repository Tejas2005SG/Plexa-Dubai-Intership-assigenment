// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalCampaigns: 0,
//     pendingReviews: 0,
//     approved: 0,
//     rejected: 0,
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//         try {
//           const response = await axios.get('/api/campaigns/stats');
//           console.log(response.data);  // Check if the data is correct
//           setStats(response.data);
//         } catch (error) {
//           console.error('Error fetching campaign stats:', error);
//         }
//       };
      
//     fetchStats();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-semibold">Total Campaigns</h2>
//           <p className="text-4xl mt-2">{stats.totalCampaigns}</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-semibold text-yellow-500">Pending Reviews</h2>
//           <p className="text-4xl mt-2">{stats.pendingReviews}</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-semibold text-green-500">Approved</h2>
//           <p className="text-4xl mt-2">{stats.approved}</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-semibold text-red-500">Rejected</h2>
//           <p className="text-4xl mt-2">{stats.rejected}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuthStore} from '../Store/AuthStore.js';
function Home() {
const {user} = useAuthStore();
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">Welcome {user.firstName}</h1>
        <p className="text-gray-700 mb-6">Manage your campaigns and account settings here.</p>
        
        <div className="grid gap-4 font-semibold">
          <button
            onClick={() => navigate('/dashboard-home')}
            className="w-full bg-blue-200 text-blue-800 py-3 px-4 rounded-lg  border-2 hover:border-blue-800"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/accept-reject')}
            className="w-full bg-green-200 text-green-800 py-3 px-4 rounded-lg border-2 hover:border-green-800"
          >
            Accept/Reject Campaigns
          </button>
          <button
            onClick={() => navigate('/account-setting')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg border-2 hover:border-gray-800"
          >
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
