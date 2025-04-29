import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Upload, Edit, Trash2, AlertCircle } from "lucide-react";

const UploadCsv = () => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState(() => {
        const savedData = localStorage.getItem("campaignData");
        return savedData ? JSON.parse(savedData) : [];
    });
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError("");
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            toast.error("Please select a file to upload.", { toastId: "no-file" });
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/campaign/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            const validData = response.data?.validData || [];
            setPreviewData(validData);
            localStorage.setItem("campaignData", JSON.stringify(validData));
            setError("");

            if (validData.length === 0) {
                setError("No valid Pan Card Number found in the uploaded file.");
                toast.warn("No valid Pan Card Number found in the uploaded file.", { toastId: "no-valid-data" });
            } else {
                toast.success("File uploaded successfully!", { toastId: "upload-success" });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred during upload.";
            setError(errorMessage);
            toast.error(errorMessage, { toastId: "upload-error" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = async (index, campaignId) => {
        const updatedCampaign = { ...previewData[index] };
        const editableFields = ['billName', 'description', 'startDate', 'endDate', 'amount', 'place'];
        editableFields.forEach((field) => {
            const newValue = prompt(`Enter new ${field}:`, updatedCampaign.campaignData[field][0]);
            if (newValue !== null && newValue.trim() !== "") {
                updatedCampaign.campaignData[field][0] = newValue;
            }
        });

        try {
            const response = await axios.patch(`http://localhost:5000/api/campaign/edit/${campaignId}`, {
                updatedData: updatedCampaign.campaignData,
            });

            toast.success(response.data.message, { toastId: "edit-success" });
            const updatedPreview = [...previewData];
            updatedPreview[index] = response.data.updatedCampaign;
            setPreviewData(updatedPreview);
            localStorage.setItem("campaignData", JSON.stringify(updatedPreview));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to update campaign.";
            toast.error(errorMessage, { toastId: "edit-error" });
        }
    };

    const handleDelete = async (campaignIndex, rowIndex, campaignId) => {
        const confirmation = window.confirm("Are you sure you want to delete this row?");
        if (!confirmation) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/campaign/delete/${campaignId}`, {
                data: { rowIndex },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            toast.success(response.data.message, { toastId: "delete-success" });
            const updatedPreview = [...previewData];
            const campaignData = updatedPreview[campaignIndex].campaignData;

            ["billName", "description", "startDate", "endDate", "amount", "place", "pan_number", "campaign_name"].forEach(field => {
                if (campaignData[field]) campaignData[field].splice(rowIndex, 1);
            });

            if (campaignData.billName.length === 0) {
                updatedPreview.splice(campaignIndex, 1);
            }

            setPreviewData(updatedPreview);
            localStorage.setItem("campaignData", JSON.stringify(updatedPreview));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete row.";
            toast.error(errorMessage, { toastId: "delete-error" });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-[88vh] rounded-xl">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Your Campaign</h1>

            {/* File Upload Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <label htmlFor="fileInput" className="block text-gray-700 font-semibold mb-3">
                    Upload CSV File
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        Drag and drop your CSV file here, or{" "}
                        <label htmlFor="fileInput" className="text-blue-600 cursor-pointer hover:underline">
                            click to upload
                        </label>
                    </p>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {file && (
                        <p className="mt-2 text-sm text-gray-500 truncate">
                            Selected: {file.name}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`mt-4 w-full flex justify-center items-center px-4 py-2 text-white font-semibold rounded-lg transition-all duration-300 ${file && !isUploading
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isUploading ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    ) : (
                        <Upload className="h-5 w-5 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Upload File"}
                </button>
                {error && (
                    <div className="mt-3 flex items-center text-red-600">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* Data Preview Section */}
            {previewData.length > 0 ? (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Last Uploaded Campaign</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        {["Bill Name", "Description", "Start Date", "End Date", "Amount", "Place", "PAN Number", "Main Campaign", "Actions"].map((header) => (
                                            <th key={header} className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((campaign, campaignIndex) =>
                                        campaign.campaignData.billName && campaign.campaignData.billName.length > 0
                                            ? campaign.campaignData.billName.map((_, index) => (
                                                <tr key={`${campaignIndex}-${index}`} className="hover:bg-gray-50 transition-colors">
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.billName[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.description[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.startDate[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.endDate[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.amount[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.place[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.pan_number[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                        {campaign.campaignData.campaign_name[index]}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 flex  text-sm text-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(campaignIndex, campaign._id)}
                                                            className="inline-flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                                            title="Edit Campaign"
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(campaignIndex, index, campaign._id)}
                                                            className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                            title="Delete Campaign"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                            : null
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-sm">No data available. Upload a valid CSV file to see your campaign data.</p>
                </div>
            )}
        </div>
    );
};

export default UploadCsv;