import React, { useState, useEffect } from 'react';
import {axiosInstance} from "../../api/api.js"
import { jsPDF } from 'jspdf';
import Loader from '../loading-component/loader.jsx';
const ITEMS_PER_PAGE = 6;

const AcceptReject = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/campaign/all', { timeout: 10000 });
            if (response.status === 200 && response.data) {
                const updatedCampaigns = response.data.map(campaign => ({
                    ...campaign,
                    status: campaign.status || 'Pending',
                    _id: campaign._id || campaign.id,
                }));
                setCampaigns(updatedCampaigns);
            } else {
                throw new Error('Unexpected response data');
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setError('Failed to load campaigns. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCampaignName = (campaign) => {
        if (campaign?.campaign_name) {
            if (typeof campaign.campaign_name === 'string') {
                return campaign.campaign_name;
            }
            if (Array.isArray(campaign.campaign_name) && campaign.campaign_name.length > 0) {
                return campaign.campaign_name[0];
            }
        }
        return 'No name available';
    };

    const handlePDFDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Campaign Report', 20, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.setFontSize(14);
        doc.text('Campaign Name', 20, 50);
        doc.text('Upload Date', 120, 50);
        doc.text('Status', 180, 50);

        doc.setFontSize(12);
        campaigns.forEach((campaign, index) => {
            const yPosition = 60 + index * 10;
            doc.text(getCampaignName(campaign), 20, yPosition);
            doc.text(new Date(campaign.uploadedAt).toLocaleDateString(), 120, yPosition);
            doc.text(campaign.status || 'Pending', 180, yPosition);
        });

        doc.save(`Campaigns_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const handleAction = async (id, action, actionFunction) => {
        if (!id) {
            alert(`Cannot ${action} campaign: Invalid ID`);
            return;
        }

        try {
            await actionFunction(id);
        } catch (error) {
            handleActionError(action, error);
        }
    };

    const handleActionError = (action, error) => {
        if (error.response) {
            console.error(`Error in ${action}:`, error.response.status, error.response.data);
            alert(`Failed to ${action} campaign. Server responded with: ${error.response.status}`);
        } else {
            console.error(`Error in ${action}:`, error.message);
            alert(`Failed to ${action} campaign. Please check your network or try again later.`);
        }
    };

    const handleDownloadCampaign = async (id) => {
        await handleAction(id, 'download', async (campaignId) => {
            const response = await axiosInstance.get(`/campaign/download/${campaignId}`, {
                responseType: 'blob',
                timeout: 10000,
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `campaign_${campaignId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        });
    };

    const handleApprove = async (id) => {
        await handleAction(id, 'approve', async (campaignId) => {
            const response = await axiosInstance.post(`/campaign/accept-reject/${campaignId}`, { status: 'Approved' });
            if (response.status === 200) {
                updateCampaignStatus(campaignId, 'Approved');
            } else {
                throw new Error('Failed to approve campaign');
            }
        });
    };

    const handleReject = async (id) => {
        await handleAction(id, 'reject', async (campaignId) => {
            const response = await axiosInstance.post(`/campaign/accept-reject/${campaignId}`, { status: 'Rejected' });
            if (response.status === 200) {
                updateCampaignStatus(campaignId, 'Rejected');
            } else {
                throw new Error('Failed to reject campaign');
            }
        });
    };

    const updateCampaignStatus = (id, status) => {
        setCampaigns(prevCampaigns => 
            prevCampaigns.map(campaign =>
                campaign._id === id ? { ...campaign, status } : campaign
            )
        );
    };

    const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = campaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <p>{error}</p>
                <button
                    onClick={fetchCampaigns}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Accept or Reject Campaign</h1>
                <button
                    onClick={handlePDFDownload}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                >
                    Download PDF
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No campaigns available</div>
            ) : (
                <div className="space-y-4">
                    {currentItems.map((campaign, index) => {
                        const campaignId = campaign._id || campaign.id;
                        if (!campaignId) return null;

                        return (
                            <div
                                key={campaignId}
                                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                        {startIndex + index + 1}
                                    </div>
                                    <div>
                                        <div className="text-gray-800 font-medium">{getCampaignName(campaign)}</div>
                                        <div className="text-sm text-gray-500">
                                            Uploaded: {new Date(campaign.uploadedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleDownloadCampaign(campaignId)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        Download
                                    </button>

                                    <button
                                        onClick={() => handleApprove(campaignId)}
                                        className={`px-4 py-2 rounded ${campaign.status === 'Approved' ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                        disabled={campaign.status === 'Approved'}
                                    >
                                        {campaign.status === 'Approved' ? 'Approved' : 'Approve'}
                                    </button>

                                    <button
                                        onClick={() => handleReject(campaignId)}
                                        className={`px-4 py-2 rounded ${campaign.status === 'Rejected' ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                                        disabled={campaign.status === 'Rejected'}
                                    >
                                        {campaign.status === 'Rejected' ? 'Rejected' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex justify-center mt-8">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-l-lg disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-lg">{currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-r-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AcceptReject;
