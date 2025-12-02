import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const exportToExcel = (tableData, reportType) => {
  // Convert JSON to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  console.log("Worksheet: ", worksheet);

  //Dynamically setting the column width as per the data length
  const columnWidths = Object.keys(tableData[0]).map((key) => ({
    width:
      Math.max(
        key.length, // Header text length
        ...tableData.map((row) => row[key]?.toString().length || 0) // Longest data in column
      ) + 2, // Extra padding
  }));
  worksheet["!cols"] = columnWidths;

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write file and trigger download
  XLSX.writeFile(workbook, `${reportType}.xlsx`);
  toast.success("Export complete");
};

export default exportToExcel;
