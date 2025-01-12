import React, { useEffect, useState } from "react";
import Loader from "../loading-component/loader";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]); // State to store invoices
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 6; // Items per page

  useEffect(() => {
    // Fetch invoices from API
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/invoices/all", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }

        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Function to determine the status class dynamically
  const getStatusClass = (status) => {
    const cleanStatus = status?.toLowerCase().trim(); // Handle casing and whitespace
    switch (cleanStatus) {
      case "pending":
        return "bg-lime-400 text-black";
      case "approved":
        return "bg-yellow-300 text-black";
      case "rejected":
        return "bg-red-400 text-white";
      default:
        return "bg-gray-200 text-black"; // Default fallback
    }
  };

  const totalPages = Math.ceil(invoices.length / itemsPerPage); // Calculate total pages
  const startIndex = (currentPage - 1) * itemsPerPage; // Determine start index for slicing
  const displayedInvoices = invoices.slice(startIndex, startIndex + itemsPerPage); // Get current page invoices

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <>
          {/* Display invoices */}
          <div className="space-y-2">
            {displayedInvoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className="flex items-center bg-white rounded-lg p-4 hover:bg-gray-200 transition-colors"
              >
                {/* Invoice index */}
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-medium">
                  {startIndex + index + 1}
                </div>
                {/* Invoice details */}
                <div className="ml-6 flex-grow">
                  <h3 className="text-lg font-medium">{invoice.campaignName}</h3>
                  <p className="text-gray-600">Uploaded at {invoice.uploadedDate}</p>
                </div>
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-4 py-1 rounded-full text-sm ${getStatusClass(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 mt-6">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 rounded ${
                  currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
              >
                «
              </button>
              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 rounded ${
                  currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
              >
                ‹
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 rounded ${
                  currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
              >
                ›
              </button>
              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 rounded ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Invoices;
