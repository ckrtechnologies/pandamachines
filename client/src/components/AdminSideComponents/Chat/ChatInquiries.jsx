import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import exportToExcel from "../../../utils/exportToExcel";

const ChatInquiries = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/chat/all`
        );
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      if (data?.length > 0) {
        const tableData = data.map((item, index) => ({
          Sl: index + 1,
          Name: item.name || "N/A",
          Phone: item.phone || "N/A",
          Email: item.email || "N/A",
          Date: new Date(item.createdAt).toLocaleDateString("en-IN"),
        }));

        const fileName = `Chat_Inquiries_${new Date()
          .toLocaleDateString("en-IN")
          .replace(/\//g, "-")}`;
        exportToExcel(tableData, fileName);
        toast.success("Chat inquiries exported successfully!");
      } else {
        toast.error("No chat inquiries data to export");
      }
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Failed to export chat inquiries");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chat Inquiries</h1>
        <button
          onClick={handleExportClick}
          disabled={isExporting}
          className="flex items-center gap-2 border border-green-300 rounded-lg px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          <FiDownload size={16} />
          {isExporting ? "Exporting..." : "Export"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Sl</th>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Phone</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3 font-medium">{item.name}</td>
                <td className="px-6 py-3">{item.phone}</td>
                <td className="px-6 py-3">{item.email || "-"}</td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChatInquiries;
