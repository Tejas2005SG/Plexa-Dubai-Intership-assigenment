import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadCsv = () => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState(() => {
        const savedData = localStorage.getItem("campaignData");
        return savedData ? JSON.parse(savedData) : [];
    });
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError("");
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            toast.error("Please select a file to upload.");
            return;
        }

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
                toast.warn("No valid Pan Card Number found in the uploaded file.");
            } else {
                toast.success("File uploaded successfully!");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred during upload.";
            setError(errorMessage);
            toast.error(errorMessage);
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

            toast.success(response.data.message);
            const updatedPreview = [...previewData];
            updatedPreview[index] = response.data.updatedCampaign;
            setPreviewData(updatedPreview);
            localStorage.setItem("campaignData", JSON.stringify(updatedPreview));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to update campaign.";
            toast.error(errorMessage);
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
      
          toast.success(response.data.message);
      
          const updatedPreview = [...previewData];
          const campaignData = updatedPreview[campaignIndex].campaignData;
      
          // Include campaign_name in the fields to delete
          ["billName", "description", "startDate", "endDate", "amount", "place", "pan_number", "campaign_name"].forEach(field => {
            if (campaignData[field]) campaignData[field].splice(rowIndex, 1);
          });
      
          // If no rows remain in campaignData, remove the entire campaign
          if (campaignData.billName.length === 0) {
            updatedPreview.splice(campaignIndex, 1);
          }
      
          setPreviewData(updatedPreview);
          localStorage.setItem("campaignData", JSON.stringify(updatedPreview));
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to delete row.";
          toast.error(errorMessage);
        }
      };
      
    return (
        <div className="p-8 bg-gray-100 h-[90vh] rounded-lg">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Upload Your Campaign </h1>
            <div className="bg-white shadow-md rounded p-6 mb-6">
                <label htmlFor="fileInput" className="block text-gray-700 font-semibold mb-2">
                    Drag and drop your CSV file here, or click to upload
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />
                <button
                    onClick={handleUpload}
                    disabled={!file}
                    className={`mt-4 px-4 py-2 text-white font-bold rounded ${file ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    Upload File
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            {previewData.length > 0 ? (
                <div className="bg-white shadow-md rounded p-6 overflow-auto mt-20" style={{ maxHeight: "400px", maxWidth: "100%" }}>
                    <h2 className="text-xl font-bold mb-4">Last Uploaded Campaign</h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Bill Name</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                                <th className="border border-gray-300 px-4 py-2">End Date</th>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                                <th className="border border-gray-300 px-4 py-2">Place</th>
                                <th className="border border-gray-300 px-4 py-2">PAN Number</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                                <th className="border border-gray-300 px-4 py-2">Main Campaign</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.map((campaign, campaignIndex) =>
                                campaign.campaignData.billName && campaign.campaignData.billName.length > 0
                                    ? campaign.campaignData.billName.map((_, index) => (
                                        <tr key={`${campaignIndex}-${index}`} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.billName[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.description[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.startDate[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.endDate[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.amount[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.place[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.pan_number[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {campaign.campaignData.campaign_name[index]}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleEdit(campaignIndex, campaign._id)}
                                                    className="bg-green-500 text-white px-3 mb-4 py-1 rounded mr-2 hover:bg-green-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(campaignIndex, index, campaign._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
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
            ) : (
                <p className="text-gray-600">No data available. Please upload a valid file.</p>
            )}
        </div>
    );
};

export default UploadCsv;
