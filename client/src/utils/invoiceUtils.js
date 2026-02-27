// src/utils/invoiceUtils.js
import html2pdf from "html2pdf.js";
import logo from "../Assets/img/Logos/newPMLogo.png";

/**
 * Format date to Indian locale
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

/**
 * Calculate order totals
 */
const calculateSubtotal = (products) =>
    products.reduce((sum, item) => sum + item.price * item.quantity, 0);

const calculateTotalGST = (products) =>
    products.reduce((sum, item) => sum + item.gst, 0);

const calculateTotalExtraTax = (products) =>
    products.reduce((sum, item) => sum + item.extraTax, 0);

const calculateTotalShipping = (products) =>
    products.reduce((sum, item) => sum + item.shippingCharge * item.quantity, 0);

/**
 * Generate professional invoice HTML
 * @param {Object} order - Order object with all details
 * @returns {string} HTML string for invoice
 */
const generateInvoiceHTML = (order) => {
    const subtotal = calculateSubtotal(order.products);
    const totalGST = calculateTotalGST(order.products);
    const totalExtraTax = calculateTotalExtraTax(order.products);
    const totalShipping = calculateTotalShipping(order.products);
    const grandTotal = subtotal + totalGST + totalExtraTax + totalShipping;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          color: #333;
          background: white;
        }
        .invoice-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .company-info h1 {
          font-size: 28px;
          color: #2563eb;
          margin-bottom: 5px;
        }
        .company-info p {
          color: #666;
          font-size: 13px;
          line-height: 1.6;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-details h2 {
          font-size: 24px;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .invoice-details p {
          font-size: 13px;
          color: #666;
          line-height: 1.8;
        }
        .invoice-no {
          font-weight: bold;
          color: #333;
        }
        .addresses {
          display: flex;
          gap: 60px;
          margin-bottom: 30px;
          font-size: 13px;
        }
        .address-block h3 {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        .address-block p {
          line-height: 1.8;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 13px;
        }
        th {
          background-color: #2563eb;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #2563eb;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        tr:last-child td {
          border-bottom: 2px solid #2563eb;
        }
        .text-right {
          text-align: right;
        }
        .product-name {
          font-weight: bold;
          color: #333;
        }
        .summary {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        .summary-table {
          width: 350px;
          font-size: 13px;
        }
        .summary-table tr td {
          padding: 10px 0;
          border: none;
        }
        .summary-table tr:nth-child(n+5) {
          border-top: 1px solid #ddd;
        }
        .summary-table .total-row {
          background-color: #f0f9ff;
          font-weight: bold;
          font-size: 16px;
          color: #2563eb;
        }
        .summary-table .total-row td {
          padding: 12px 10px;
          border-top: 2px solid #2563eb;
          border-bottom: 2px solid #2563eb;
        }
        .footer {
          border-top: 2px solid #2563eb;
          padding-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
        }
        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        .status-shipped {
          background-color: #e9d5ff;
          color: #5b21b6;
        }
        .status-delivered {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-cancelled {
          background-color: #fee2e2;
          color: #991b1b;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .invoice-container {
            padding: 0;
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-info">
            <h1>Panda Machines Pvt Ltd OPC</h1> 
            <p>
              Your trusted partner in industrial solutions<br>
              784/2647, 3rd Floor, Jagamara<br>
              Bhubaneswar - 751030, India<br>
              Phone: +91 80717 93049<br>
              Email: info@pandamachines.com
            </p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><span class="invoice-no">Invoice #${order._id.slice(-8)}</span></p>
            <p>Date: ${formatDate(order.createdAt)}</p>
            <p>Status: <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></p>
          </div>
        </div>

        <div class="addresses">
          <div class="address-block">
            <h3>Bill To:</h3>
            <p>
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
              ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
          <div class="address-block">
            <h3>Ship To:</h3>
            <p>
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
              ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th class="text-right">Price</th>
              <th class="text-right">Qty</th>
              <th class="text-right">GST</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
            .map(
                (item) => `
              <tr>
                <td><span class="product-name">${item.product.name}</span></td>
                <td>${item.product.brand || "N/A"}</td>
                <td class="text-right">${item.price}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.gst}</td>
                <td class="text-right">${item.price * item.quantity + item.gst + item.extraTax + item.shippingCharge * item.quantity}</td>
              </tr>
            `
            )
            .join("")}
          </tbody>
        </table>

        <div class="summary">
          <table class="summary-table">
            <tr>
              <td>Subtotal:</td>
              <td class="text-right"><strong>${subtotal}</strong></td>
            </tr>
            <tr>
              <td>Shipping Charges:</td>
              <td class="text-right"><strong>${totalShipping}</strong></td>
            </tr>
            <tr>
              <td>GST (18%):</td>
              <td class="text-right"><strong>${totalGST}</strong></td>
            </tr>
            <tr>
              <td>Extra Tax:</td>
              <td class="text-right"><strong>${totalExtraTax}</strong></td>
            </tr>
            <tr class="total-row">
              <td>Grand Total:</td>
              <td class="text-right">${grandTotal}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for your business! | This is an electronically generated invoice</p>
          <p style="margin-top: 10px; font-size: 11px;">Generated on ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Download invoice as PDF
 * @param {Object} order - Order object with all details
 * @example
 * downloadInvoice(order);
 */
export const downloadInvoice = async (order) => {
    try {
        const element = document.createElement("div");
        element.innerHTML = generateInvoiceHTML(order);

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Invoice-${order._id.slice(-8)}-${new Date().getTime()}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: {
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true
            },
        };

        return new Promise((resolve, reject) => {
            html2pdf()
                .set(opt)
                .from(element)
                .save()
                .then(() => {
                    console.log("Invoice downloaded successfully");
                    resolve(true);
                })
                .catch((error) => {
                    console.error("Error downloading invoice:", error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error("Failed to download invoice:", error);
        throw error;
    }
};

/**
 * Print invoice
 * @param {Object} order - Order object with all details
 * @example
 * printInvoice(order);
 */
export const printInvoice = async (order) => {
    try {
        const printWindow = window.open("", "_blank", "height=800,width=900");

        if (!printWindow) {
            throw new Error("Pop-up blocked. Please allow pop-ups for this site.");
        }

        printWindow.document.write(generateInvoiceHTML(order));
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        };

        setTimeout(() => {
            if (!printWindow.document.readyState || printWindow.document.readyState === "complete") {
                printWindow.focus();
                printWindow.print();
            }
        }, 500);

        return true;
    } catch (error) {
        console.error("Failed to print invoice:", error);
        throw error;
    }
};