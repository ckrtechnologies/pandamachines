/**
 * InvoicePDFRN.js
 *
 * React Native invoice generator.
 * - Fetches invoice data from the same API endpoint as the web:
 *     GET /orders/invoice/:groupOrderId
 * - Renders the same IBM Plex monochrome industrial design
 *   (header / from-address / bill-to / product table / totals / payment / footer)
 * - Saves as PDF via jsPDF + RNFS, then opens share sheet via react-native-share
 */

import { Platform } from 'react-native';
import { jsPDF } from 'jspdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { API_BASE_URL } from './basicInfo';

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = n => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `₹${Math.round(n || 0)}`;
  }
};

const fmtDate = d => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const fmtNow = () => {
  const now = new Date();
  return `${now.toLocaleDateString('en-IN')} at ${now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

// ─── Fetch invoice data (same endpoint as web) ────────────────────────────────

const fetchInvoiceData = async groupOrderId => {
  const res = await fetch(`${API_BASE_URL}/orders/invoice/${groupOrderId}`);
  if (!res.ok) throw new Error(`Failed to fetch invoice: ${res.status}`);
  const json = await res.json();
  if (!json.success || !json.invoice) {
    throw new Error(json.message || 'Invoice data not found');
  }
  return json.invoice;
};

// ─── Drawing helpers ──────────────────────────────────────────────────────────

const PAGE_W = 210;   // A4 mm
const PAGE_H = 297;
const MARGIN = 14;
const COL_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = 274;

/**
 * Clamp y — add a new page if we're past the footer zone.
 */
const checkPage = (doc, y, needed = 10) => {
  if (y + needed > FOOTER_Y) {
    doc.addPage();
    return MARGIN + 6;
  }
  return y;
};

/**
 * Draw footer on every page (mirrors web footer).
 */
const drawFooter = doc => {
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, FOOTER_Y, PAGE_W - MARGIN, FOOTER_Y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(170, 170, 170);
    doc.text(
      'This is a computer-generated invoice and does not require a signature.',
      MARGIN,
      FOOTER_Y + 4,
    );
    doc.text(
      'For queries: info@pandamachines.com  |  +91 80717 93049',
      MARGIN,
      FOOTER_Y + 8,
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text(`Generated ${fmtNow()}`, PAGE_W - MARGIN, FOOTER_Y + 4, { align: 'right' });
    doc.text('pandamachines.com', PAGE_W - MARGIN, FOOTER_Y + 8, { align: 'right' });
  }
};

/**
 * Draw the label-above-value block used in the "from" and "bill-to" sections.
 */
const drawSectionLabel = (doc, x, y, text) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text(text.toUpperCase(), x, y);
};

// ─── PDF Generator ────────────────────────────────────────────────────────────

const generateInvoicePDF = invoiceData => {
  const {
    groupOrderId,
    createdAt,
    paymentMethod,
    paymentStatus,
    razorpayId,
    customer,
    shippingAddress,
    products,
    totals,
  } = invoiceData;

  const invoiceRef = (groupOrderId || '').replace('GRP-', 'INV-') || 'INV-XXXXXXXX';
  const addr = shippingAddress || {};
  const customerName =
    customer?.name ||
    (customer?.firstName && customer?.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : customer?.firstName || 'Customer');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── HEADER ────────────────────────────────────────────────────────

  let y = MARGIN + 2;

  // Top rule (heavy)
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  // Brand name (left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(26, 26, 26);
  doc.text('PANDA MACHINES', MARGIN, y + 1);

  // Invoice label + number (right)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text('TAX INVOICE', PAGE_W - MARGIN, y - 1, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  doc.text(invoiceRef, PAGE_W - MARGIN, y + 5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(fmtDate(createdAt), PAGE_W - MARGIN, y + 10, { align: 'right' });

  y += 16;

  // Bottom rule (light)
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  // ── ADDRESSES ─────────────────────────────────────────────────────

  const colW = COL_W / 2 - 4;
  const col2X = MARGIN + colW + 8;

  // From
  drawSectionLabel(doc, MARGIN, y, 'From');
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 26, 26);
  doc.text('Panda Machines Pvt Ltd OPC', MARGIN, y);

  const fromLines = [
    '784/2647, 3rd Floor, Jagamara',
    'Bhubaneswar – 751030, Odisha',
    '+91 80717 93049',
    'info@pandamachines.com',
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  fromLines.forEach(line => {
    y += 4;
    doc.text(line, MARGIN, y);
  });

  // Bill To (right column — starts at same y as "From" label)
  const addrStartY = y - 4 * fromLines.length - 4;
  let addrY = addrStartY;

  // Vertical separator
  doc.setDrawColor(232, 232, 232);
  doc.setLineWidth(0.3);
  doc.line(col2X - 4, addrStartY - 2, col2X - 4, y + 2);

  drawSectionLabel(doc, col2X, addrY, 'Bill To & Ship To');
  addrY += 4;

  const billName = addr.fullName || customerName;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 26, 26);
  doc.text(billName, col2X, addrY);
  addrY += 4;

  const addrLines = [
    addr.addressLine1,
    addr.addressLine2,
    [addr.city, addr.state].filter(Boolean).join(', ') +
    (addr.postalCode ? ` – ${addr.postalCode}` : ''),
    addr.country,
    addr.phone ? `+91 ${addr.phone}` : null,
    customer?.email || null,
  ].filter(Boolean);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  addrLines.forEach(line => {
    doc.text(line, col2X, addrY);
    addrY += 4;
  });

  y = Math.max(y, addrY) + 8;

  // ── PRODUCTS TABLE ─────────────────────────────────────────────────

  // Column X positions (mirrors web table: Product | Qty | Unit | GST | Shipping | Total)
  const tCols = {
    product: MARGIN,
    qty: MARGIN + 72,
    unit: MARGIN + 90,
    gst: MARGIN + 118,
    ship: MARGIN + 140,
    total: PAGE_W - MARGIN,
  };

  // Table header
  y = checkPage(doc, y, 12);
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y - 1, PAGE_W - MARGIN, y - 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(136, 136, 136);
  const headers = [
    [tCols.product, 'PRODUCT'],
    [tCols.qty, 'QTY'],
    [tCols.unit, 'UNIT PRICE'],
    [tCols.gst, 'GST'],
    [tCols.ship, 'SHIPPING'],
    [tCols.total, 'TOTAL'],
  ];
  headers.forEach(([x, label]) => {
    if (x === tCols.total) doc.text(label, x, y + 4, { align: 'right' });
    else if (x === tCols.qty) doc.text(label, x, y + 4, { align: 'center' });
    else doc.text(label, x, y + 4);
  });

  y += 6;
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 4;

  // Rows
  (products || []).forEach((item, idx) => {
    const qty = item.quantity || 1;
    const base = item.price || 0;
    const gst = (item.gst || 0) * qty;
    const extra = (item.extraTax || 0) * qty;
    const ship = (item.shippingCharge || 0) * qty;
    const lineTotal = base * qty + gst + extra + ship;
    const name = item.name || item.productName || 'Product';
    const meta = [
      item.size ? `Size: ${item.size}` : null,
      item.variantModel ? `Variant: ${item.variantModel}` : null,
    ]
      .filter(Boolean)
      .join('  ·  ');

    const rowH = meta ? 12 : 8;
    y = checkPage(doc, y, rowH + 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(26, 26, 26);
    doc.text(name, tCols.product, y + 4);

    if (item.brand) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(153, 153, 153);
      doc.text(item.brand, tCols.product, y + 7.5);
    }

    if (meta) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(153, 153, 153);
      doc.text(meta, tCols.product, y + (item.brand ? 11 : 7.5));
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);

    doc.text(String(qty), tCols.qty, y + 4, { align: 'center' });
    doc.text(fmt(base), tCols.unit, y + 4);
    doc.text(gst > 0 ? fmt(gst) : '—', tCols.gst, y + 4);
    doc.text(ship > 0 ? fmt(ship) : 'Free', tCols.ship, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(fmt(lineTotal), tCols.total, y + 4, { align: 'right' });

    y += rowH;

    // Row separator
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 2;
  });

  // Close table
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  // ── TOTALS (right-aligned box) ────────────────────────────────────

  const totalsX = PAGE_W - MARGIN - 60;
  const totalsLabelX = totalsX;
  const totalsValueX = PAGE_W - MARGIN;

  const t = totals || {};
  const subtotal = t.subtotal || 0;
  const gstTotal = t.gstTotal || 0;
  const extraTaxTotal = t.extraTaxTotal || 0;
  const shippingTotal = t.shippingTotal || 0;
  const grandTotal = t.grandTotal || (subtotal + gstTotal + extraTaxTotal + shippingTotal);

  y = checkPage(doc, y, 40);

  const totalsRows = [
    ['Subtotal', fmt(subtotal)],
    gstTotal > 0 ? ['GST', fmt(gstTotal)] : null,
    extraTaxTotal > 0 ? ['Extra Tax', fmt(extraTaxTotal)] : null,
    ['Shipping', shippingTotal === 0 ? 'Free' : fmt(shippingTotal)],
  ].filter(Boolean);

  totalsRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(label, totalsLabelX, y);
    doc.setTextColor(26, 26, 26);
    doc.setFont('helvetica', 'normal');
    doc.text(value, totalsValueX, y, { align: 'right' });
    y += 5.5;
  });

  // Grand Total rule
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.7);
  doc.line(totalsLabelX, y + 1, totalsValueX, y + 1);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(26, 26, 26);
  doc.text('GRAND TOTAL', totalsLabelX, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(fmt(grandTotal), totalsValueX, y, { align: 'right' });
  y += 14;

  // ── PAYMENT INFO ──────────────────────────────────────────────────

  y = checkPage(doc, y, 20);

  doc.setDrawColor(232, 232, 232);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  const payFields = [
    ['Payment Method', paymentMethod || '—'],
    ['Payment Status', paymentStatus || '—'],
    razorpayId ? ['Transaction ID', razorpayId] : null,
    ['Order Reference', groupOrderId || '—'],
  ].filter(Boolean);

  const payColW = COL_W / payFields.length;
  payFields.forEach(([label, value], i) => {
    const px = MARGIN + i * payColW;
    drawSectionLabel(doc, px, y, label);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const isStatus = label === 'Payment Status';
    if (isStatus) {
      const isPaid = (paymentStatus || '').toLowerCase() === 'paid';
      doc.setTextColor(isPaid ? 22 : 180, isPaid ? 163 : 83, isPaid ? 74 : 9);
    } else {
      doc.setTextColor(26, 26, 26);
    }
    const isId = label === 'Transaction ID' || label === 'Order Reference';
    if (isId) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
    }
    doc.text(value, px, y + 5);
  });

  y += 12;
  doc.setDrawColor(232, 232, 232);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  // ── FOOTER ────────────────────────────────────────────────────────

  drawFooter(doc);

  return { doc, invoiceRef };
};

// ─── Public API (mirrors web's downloadInvoice) ───────────────────────────────

/**
 * downloadInvoiceRN(groupOrderId)
 *
 * Fetch invoice data from the API, generate the PDF,
 * save to device, and open the share sheet.
 */
export const downloadInvoiceRN = async groupOrderId => {
  if (!groupOrderId) throw new Error('No groupOrderId provided');

  // 1. Fetch data (same endpoint as web)
  const invoiceData = await fetchInvoiceData(groupOrderId);

  // 2. Generate PDF
  const { doc, invoiceRef } = generateInvoicePDF(invoiceData);

  // 3. Save to filesystem
  const fileName = `${invoiceRef}-${Date.now()}.pdf`;
  const dir =
    Platform.OS === 'android'
      ? RNFS.DownloadDirectoryPath
      : RNFS.DocumentDirectoryPath;
  const filePath = `${dir}/${fileName}`;

  const pdfBase64 = doc.output('dataurlstring').split(',')[1];
  await RNFS.writeFile(filePath, pdfBase64, 'base64');

  // 4. Share
  await Share.open({
    url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
    type: 'application/pdf',
    filename: fileName,
    title: 'Share Invoice',
    message: 'Please find the attached invoice',
    failOnCancel: false,
  });

  return { success: true, path: filePath, fileName };
};

// Keep backward-compat default export (class interface replaced by function above)
export default { downloadInvoiceRN };