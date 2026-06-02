import html2pdf from "html2pdf.js";
import logo from "../Assets/img/Logos/PMHorrLogo.png";


const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "—";

const fmtDateTime = () => {
  const now = new Date();
  return `${now.toLocaleDateString("en-IN")} at ${now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const getBase64Logo = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null); // fallback: skip logo
    img.src = logo;
  });


// HTML generator


const generateInvoiceHTML = (invoiceData, logoBase64) => {
  const { groupOrderId, createdAt, paymentMethod, paymentStatus, razorpayId,
    customer, shippingAddress, products, totals } = invoiceData;

  const invoiceRef = groupOrderId?.replace("GRP-", "INV-") || "INV-XXXXXXXX";

  const customerName =
    customer?.name ||
    (customer?.firstName && customer?.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : customer?.firstName || "Customer");

  const addr = shippingAddress || {};

  const addrLines = [
    addr.addressLine1,
    addr.addressLine2,
    [addr.city, addr.state].filter(Boolean).join(", ") + (addr.postalCode ? ` – ${addr.postalCode}` : ""),
    addr.country,
  ]
    .filter(Boolean)
    .map((l) => `<div>${l}</div>`)
    .join("");

  const productRows = products
    .map((item) => {
      const qty = item.quantity || 1;
      const base = item.price || 0;
      const gst = (item.gst || 0) * qty;
      const extra = (item.extraTax || 0) * qty;
      const ship = (item.shippingCharge || 0) * qty;
      const lineTotal = base * qty + gst + extra + ship;

      const meta = [
        item.size ? `Size: ${item.size}` : null,
        item.variantModel ? `Variant: ${item.variantModel}` : null,
      ]
        .filter(Boolean)
        .join(" &nbsp;·&nbsp; ");

      return `
        <tr>
          <td>
            <div class="product-name">${item.name || item.productName || "Product"}</div>
            ${item.brand ? `<div class="product-sub">${item.brand}</div>` : ""}
            ${meta ? `<div class="product-sub">${meta}</div>` : ""}
          </td>
          <td class="center">${qty}</td>
          <td class="right">${fmt(base)}</td>
          <td class="right muted">${gst > 0 ? fmt(gst) : "—"}</td>
          <td class="right muted">${ship > 0 ? fmt(ship) : "Free"}</td>
          <td class="right bold">${fmt(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const logoMarkup = logoBase64
    ? `<img src="${logoBase64}" alt="Panda Machines" style="height:48px; display:block;" />`
    : `<div class="brand-text">PANDA MACHINES</div>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'IBM Plex Sans', Arial, sans-serif;
      font-size: 12px;
      color: #1a1a1a;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 14mm 16mm 14mm 16mm;
      background: #fff;
      position: relative;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 12px;
      border-bottom: 2px solid #1a1a1a;
      margin-bottom: 24px;
    }

    .brand-text {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #1a1a1a;
    }

    .invoice-meta {
      text-align: right;
    }

    .invoice-meta .invoice-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 3px;
    }

    .invoice-meta .invoice-number {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.04em;
    }

    .invoice-meta .invoice-date {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }

    /* ── Addresses ── */
    .addresses {
      display: flex;
      gap: 0;
      margin-bottom: 28px;
    }

    .address-col {
      flex: 1;
    }

    .address-col + .address-col {
      padding-left: 24px;
      border-left: 1px solid #e8e8e8;
      margin-left: 24px;
    }

    .section-label {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 8px;
    }

    .address-name {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .address-col .addr-line {
      font-size: 11px;
      color: #555;
      line-height: 1.65;
    }

    /* ── Company info col ── */
    .company-col {
      flex: 1;
    }

    .company-col .company-name {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .company-col .addr-line {
      font-size: 11px;
      color: #555;
      line-height: 1.65;
    }

    /* ── Products table ── */
    .table-wrap {
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead tr {
      border-top: 1px solid #1a1a1a;
      border-bottom: 1px solid #1a1a1a;
    }

    thead th {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #888;
      padding: 8px 6px;
    }

    thead th:first-child { text-align: left; }
    thead th.center { text-align: center; }
    thead th.right { text-align: right; }

    tbody tr {
      border-bottom: 1px solid #f0f0f0;
    }

    tbody tr:last-child {
      border-bottom: 1px solid #1a1a1a;
    }

    td {
      padding: 10px 6px;
      font-size: 11px;
      color: #333;
      vertical-align: top;
    }

    td.center { text-align: center; }
    td.right { text-align: right; }
    td.bold { font-weight: 600; color: #1a1a1a; }
    td.muted { color: #888; }

    .product-name {
      font-weight: 500;
      color: #1a1a1a;
      line-height: 1.4;
    }

    .product-sub {
      font-size: 10px;
      color: #999;
      margin-top: 2px;
    }

    /* ── Totals ── */
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 28px;
    }

    .totals-box {
      width: 240px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      font-size: 11px;
    }

    .totals-row .t-label { color: #666; }
    .totals-row .t-value { font-weight: 500; color: #1a1a1a; }
    .totals-row .t-value.free { color: #22c55e; font-size: 10px; }

    .totals-divider {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 4px 0;
    }

    .totals-grand {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0 6px;
      border-top: 2px solid #1a1a1a;
      margin-top: 4px;
    }

    .totals-grand .tg-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #1a1a1a;
    }

    .totals-grand .tg-value {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 17px;
      font-weight: 600;
      color: #1a1a1a;
    }

    /* ── Payment info ── */
    .payment-row {
      display: flex;
      gap: 40px;
      padding: 14px 0;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      margin-bottom: 28px;
    }

    .payment-field { }
    .payment-field .pf-label {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 4px;
    }

    .payment-field .pf-value {
      font-size: 11px;
      font-weight: 500;
      color: #1a1a1a;
    }

    .payment-field .pf-value.paid { color: #16a34a; }
    .payment-field .pf-value.pending { color: #d97706; }
    .payment-field .pf-value.mono {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: #666;
    }

    /* ── Footer ── */
    .footer {
      position: absolute;
      bottom: 14mm;
      left: 16mm;
      right: 16mm;
      border-top: 1px solid #e8e8e8;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-left {
      font-size: 9.5px;
      color: #aaa;
      line-height: 1.6;
    }

    .footer-right {
      font-size: 9px;
      color: #ccc;
      text-align: right;
      font-family: 'IBM Plex Mono', monospace;
    }

    @media print {
      body { margin: 0; }
      .page { padding: 10mm 14mm; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div>
      ${logoMarkup}
    </div>
    <div class="invoice-meta">
      <div class="invoice-label">Tax Invoice</div>
      <div class="invoice-number">${invoiceRef}</div>
      <div class="invoice-date">${fmtDate(createdAt)}</div>
    </div>
  </div>

  <!-- Addresses: From / Bill To / Ship To -->
  <div class="addresses">

    <div class="company-col">
      <div class="section-label">From</div>
      <div class="address-name">Panda Machines Pvt Ltd OPC</div>
      <div class="addr-line">784/2647, 3rd Floor, Jagamara</div>
      <div class="addr-line">Bhubaneswar – 751030, Odisha</div>
      <div class="addr-line">+91 80717 93049</div>
      <div class="addr-line">info@pandamachines.com</div>
    </div>

    <div class="address-col">
      <div class="section-label">Bill To &amp; Ship To</div>
      <div class="address-name">${addr.fullName || customerName}</div>
      ${addrLines}
      ${addr.phone ? `<div class="addr-line" style="margin-top:4px">+91 ${addr.phone}</div>` : ""}
      ${customer?.email ? `<div class="addr-line">${customer.email}</div>` : ""}
    </div>

  </div>

  <!-- Products Table -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th class="center">Qty</th>
          <th class="right">Unit Price</th>
          <th class="right">GST</th>
          <th class="right">Shipping</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <div class="totals-section">
    <div class="totals-box">
      <div class="totals-row">
        <span class="t-label">Subtotal</span>
        <span class="t-value">${fmt(totals.subtotal)}</span>
      </div>
      ${totals.gstTotal > 0 ? `
      <div class="totals-row">
        <span class="t-label">GST</span>
        <span class="t-value">${fmt(totals.gstTotal)}</span>
      </div>` : ""}
      ${totals.extraTaxTotal > 0 ? `
      <div class="totals-row">
        <span class="t-label">Extra Tax</span>
        <span class="t-value">${fmt(totals.extraTaxTotal)}</span>
      </div>` : ""}
      <div class="totals-row">
        <span class="t-label">Shipping</span>
        ${totals.shippingTotal === 0
      ? `<span class="t-value free">Free</span>`
      : `<span class="t-value">${fmt(totals.shippingTotal)}</span>`}
      </div>
      <div class="totals-grand">
        <span class="tg-label">Grand Total</span>
        <span class="tg-value">${fmt(totals.grandTotal)}</span>
      </div>
    </div>
  </div>

  <!-- Payment Info -->
  <div class="payment-row">
    <div class="payment-field">
      <div class="pf-label">Payment Method</div>
      <div class="pf-value">${paymentMethod || "—"}</div>
    </div>
    <div class="payment-field">
      <div class="pf-label">Payment Status</div>
      <div class="pf-value ${(paymentStatus || "").toLowerCase() === "paid" ? "paid" : "pending"}">
        ${paymentStatus || "—"}
      </div>
    </div>
    ${razorpayId ? `
    <div class="payment-field">
      <div class="pf-label">Transaction ID</div>
      <div class="pf-value mono">${razorpayId}</div>
    </div>` : ""}
    <div class="payment-field">
      <div class="pf-label">Order Reference</div>
      <div class="pf-value mono">${groupOrderId}</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      This is a computer-generated invoice and does not require a signature.<br />
      For queries: info@pandamachines.com &nbsp;|&nbsp; +91 80717 93049
    </div>
    <div class="footer-right">
      Generated ${fmtDateTime()}<br />
      pandamachines.com
    </div>
  </div>

</div>
</body>
</html>`;
};


// Fetch invoice data from API

const fetchInvoiceData = async (groupOrderId) => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/orders/invoice/${groupOrderId}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch invoice: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success || !json.invoice) {
    throw new Error(json.message || "Invoice data not found");
  }

  return json.invoice;
};

export const downloadInvoice = async (input) => {
  try {
    // Accept either a groupOrderId string or a pre-fetched invoiceData object
    const invoiceData =
      typeof input === "string"
        ? await fetchInvoiceData(input)
        : input;

    const logoBase64 = await getBase64Logo();
    const html = generateInvoiceHTML(invoiceData, logoBase64);

    const element = document.createElement("div");
    element.innerHTML = html;

    const ref = invoiceData.groupOrderId?.replace("GRP-", "INV-") || "INVOICE";

    const opt = {
      margin: 0,
      filename: `${ref}-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: {
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      },
    };

    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.error("[downloadInvoice]", err);
    throw err;
  }
};

export const printInvoice = async (input) => {
  try {
    const invoiceData =
      typeof input === "string"
        ? await fetchInvoiceData(input)
        : input;

    const logoBase64 = await getBase64Logo();
    const html = generateInvoiceHTML(invoiceData, logoBase64);

    const printWindow = window.open("", "_blank", "height=900,width=850");
    if (!printWindow) {
      throw new Error("Pop-up blocked. Please allow pop-ups for this site.");
    }

    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => printWindow.print(), 300);
    };

    return true;
  } catch (err) {
    console.error("[printInvoice]", err);
    throw err;
  }
};