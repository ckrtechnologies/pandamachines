import { Platform } from 'react-native';
import Share from 'react-native-share';
import { jsPDF } from 'jspdf';
import RNFS from 'react-native-fs';
import BackgroundImage from '../assets/Image/imageLogo.png';

class QuotationPDFRN {
  viewShotRef = null;

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  }

  formatCurrency(amount) {
    if (!amount && amount !== 0) return 'INR 0.00';
    return `INR ${parseFloat(amount).toFixed(2)}`;
  }

  calculatePricing(product) {
    const basePrice = parseFloat(product?.price || 0);
    const gstPercentage = parseFloat(product?.gstPercentage || 18);
    const extraTaxPercentage = parseFloat(product?.extraTaxPercentage || 0);
    const shippingCharge = parseFloat(product?.shippingCharge || 0);

    const gstAmount = (basePrice * gstPercentage) / 100;
    const extraTaxAmount = (basePrice * extraTaxPercentage) / 100;
    const priceWithTaxes = basePrice + gstAmount + extraTaxAmount;
    const totalAmount = priceWithTaxes + shippingCharge;

    return {
      basePrice,
      gstAmount,
      extraTaxAmount,
      shippingCharge,
      priceWithTaxes,
      totalAmount,
      gstPercentage,
      extraTaxPercentage,
    };
  }

  async addLogoToDoc(doc) {
    try {
      doc.addImage(BackgroundImage, 'PNG', 15, 8, 40, 15);

      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.09 }));

      const pageWidth = 210;
      const pageHeight = 297;
      const logoWidth = pageWidth * 0.6;
      const logoHeight = logoWidth * 0.699;

      const xPos = (pageWidth - logoWidth) / 2;
      const yPos = (pageHeight - logoHeight) / 2;

      doc.addImage(BackgroundImage, 'PNG', xPos, yPos, logoWidth, logoHeight);
      doc.restoreGraphicsState();
    } catch (error) {
      console.warn('Could not load logo:', error);
    }
  }

  // Helper function to check if we need a new page
  checkPageBreak(doc, currentY, requiredSpace, footerY = 260) {
    if (currentY + requiredSpace > footerY) {
      doc.addPage();
      return 20; // Return new starting Y position
    }
    return currentY;
  }

  // Add footer to current page
  addFooter(doc) {
    const footerY = 270;
    const primaryColor = [0, 86, 158];

    doc.setFillColor(...primaryColor);
    doc.rect(0, footerY, 210, 25, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Thank you for your interest in our products!', 105, footerY + 8, {
      align: 'center',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(
      'Email: info@pandamachines.com | Phone: +91-80717 93049',
      105,
      footerY + 18,
      { align: 'center' },
    );
  }

  async generateAndDownloadPDF(quotationData, sections = {}) {
    try {
      if (!quotationData) {
        throw new Error('No quotation data provided');
      }

      const pdfSections = {
        customerInfo: sections.customerInfo !== false,
        productInfo: sections.productInfo !== false,
        pricing: sections.pricing !== false,
        brandInfo: sections.brandInfo !== false,
        categoryInfo: sections.categoryInfo !== false,
        materialInfo: sections.materialInfo !== false,
        measurementInfo: sections.measurementInfo !== false,
        warrantyInfo: sections.warrantyInfo !== false,
      };

      const doc = new jsPDF();

      const primaryColor = [0, 86, 158];
      const primaryBtnColor = [0, 70, 128];
      const accentColor = [140, 196, 65];
      const primaryText = [31, 41, 55];
      const footerY = 260; // Content must stay above this

      await this.addLogoToDoc(doc);

      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 35, 'F');

      doc.setFillColor(...accentColor);
      doc.rect(0, 32, 210, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('QUOTATION', 105, 22, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const quoteId = quotationData._id
        ? quotationData._id.slice(-8).toUpperCase()
        : 'N/A';
      doc.text(`Quote # ${quoteId}`, 15, 20);
      doc.text(`Date: ${this.formatDate(quotationData.createdAt)}`, 190, 20, {
        align: 'right',
      });

      let yPosition = 45; // Reduced from 50

      // Customer Information Section
      if (pdfSections.customerInfo) {
        yPosition = this.checkPageBreak(doc, yPosition, 40, footerY);

        doc.setFillColor(...primaryBtnColor);
        doc.rect(15, yPosition, 180, 8, 'F');

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('CUSTOMER INFORMATION', 20, yPosition + 6);

        yPosition += 12; // Reduced from 15
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...primaryText);
        doc.setFontSize(10);

        const customerInfo = [
          ['Name:', quotationData.fullName || 'N/A'],
          ['Phone:', quotationData.mobNumber || 'N/A'],
          ['Email:', quotationData.email || 'N/A'],
          ['City:', quotationData.city || 'N/A'],
          // ['Address:', quotationData.address || 'N/A'],
          ['State:', quotationData.state || 'N/A'],
          ['Subject:', quotationData.subject || 'N/A'],
        ];

        customerInfo.forEach(([label, value], index) => {
          const xPos = index % 2 === 0 ? 20 : 110;
          const currentY = yPosition + Math.floor(index / 2) * 7; // Reduced from 8

          doc.setFont('helvetica', 'bold');
          doc.text(label, xPos, currentY);
          doc.setFont('helvetica', 'normal');
          doc.text(value, xPos + 25, currentY);
        });

        yPosition += Math.ceil(customerInfo.length / 2) * 7 + 5; // Reduced from 8 + 10
      }

      // Product Information Section
      if (pdfSections.productInfo && quotationData.products?.length > 0) {
        yPosition = this.checkPageBreak(doc, yPosition, 30, footerY);

        doc.setFillColor(...primaryBtnColor);
        doc.rect(15, yPosition, 180, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('PRODUCTS', 20, yPosition + 6);

        yPosition += 12; // Reduced from 15
        doc.setTextColor(...primaryText);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        quotationData.products?.forEach((item, itemIdx) => {
          const product = item.product || {};

          // Check if product section will fit
          yPosition = this.checkPageBreak(doc, yPosition, 25, footerY);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(
            `Product ${itemIdx + 1}: ${product.name || 'N/A'}`,
            20,
            yPosition,
          );
          yPosition += 6; // Reduced from 7

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);

          const productInfo = [];

          if (pdfSections.brandInfo) {
            productInfo.push(['Brand:', product.brand || 'N/A']);
          }

          if (pdfSections.categoryInfo) {
            productInfo.push(
              ['Category:', item.category?.name || 'N/A'],
              ['Sub-Category:', item.subCategory?.name || 'N/A'],
              ['Tier-3-Category:', item.subSubCategory?.name || 'N/A'],
            );
          }

          if (pdfSections.materialInfo) {
            productInfo.push(['Material:', product.material || 'N/A']);
          }

          if (pdfSections.measurementInfo) {
            productInfo.push(['Measurement:', product.measurement || 'N/A']);
          }

          if (pdfSections.warrantyInfo) {
            productInfo.push([
              'Warranty:',
              product.warranty?.warrantyDays || 'N/A',
            ]);
          }

          productInfo.push(['Quantity:', item.quantity || 1]);

          productInfo.forEach(([label, value], index) => {
            const xPos = index % 2 === 0 ? 20 : 110;
            const currentY = yPosition + Math.floor(index / 2) * 5.5; // Reduced from 6

            doc.setFont('helvetica', 'bold');
            doc.text(label, xPos, currentY);
            doc.setFont('helvetica', 'normal');

            const maxWidth = 70;
            const wrappedText = doc.splitTextToSize(String(value), maxWidth);
            doc.text(wrappedText[0], xPos + 25, currentY);
          });

          yPosition += Math.ceil(productInfo.length / 2) * 5.5 + 5; // Reduced from 6 + 8
        });

        yPosition += 2; // Reduced from 5
      }

      // Pricing Section
      if (pdfSections.pricing && quotationData.products?.length > 0) {
        yPosition = this.checkPageBreak(doc, yPosition, 50, footerY);

        doc.setFillColor(...primaryBtnColor);
        doc.rect(15, yPosition, 180, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('PRICING BREAKDOWN', 20, yPosition + 6);

        yPosition += 10; // Reduced from 12

        // Product Pricing Table Header
        doc.setFillColor(...primaryBtnColor);
        doc.rect(15, yPosition, 180, 7, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('Product', 18, yPosition + 5);
        doc.text('Unit Price', 85, yPosition + 5);
        doc.text('Qty', 140, yPosition + 5);
        doc.text('Total', 175, yPosition + 5, { align: 'right' });

        yPosition += 8;

        // Product rows
        doc.setTextColor(...primaryText);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        quotationData.products?.forEach((item, idx) => {
          yPosition = this.checkPageBreak(doc, yPosition, 10, footerY);

          const product = item.product || {};
          const pricing = this.calculatePricing(product);
          const quantity = item.quantity || 1;
          const totalAmount = pricing.totalAmount * quantity;

          // Alternate row background
          if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, yPosition - 1, 180, 6, 'F');
          }

          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.rect(15, yPosition - 1, 180, 6);

          doc.setTextColor(...primaryText);
          doc.setFont('helvetica', 'normal');
          const productName = `Product ${idx + 1}: ${product.name || 'N/A'}`;
          const wrappedName = doc.splitTextToSize(productName, 60);
          doc.text(wrappedName[0], 18, yPosition + 2);

          doc.text(this.formatCurrency(pricing.basePrice), 85, yPosition + 2);
          doc.text(String(quantity), 140, yPosition + 2);
          doc.text(this.formatCurrency(totalAmount), 175, yPosition + 2, {
            align: 'right',
          });

          yPosition += 7;
        });

        yPosition += 2; // Reduced from 3

        // Pricing Details Section
        yPosition = this.checkPageBreak(doc, yPosition, 40, footerY);

        doc.setFillColor(...primaryBtnColor);
        doc.rect(15, yPosition, 180, 7, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('Description', 20, yPosition + 5);
        doc.text('Amount', 175, yPosition + 5, { align: 'right' });

        yPosition += 8;

        doc.setTextColor(...primaryText);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        let rowIdx = 0;
        quotationData.products?.forEach(item => {
          const product = item.product || {};
          const pricing = this.calculatePricing(product);

          const details = [
            ['Base Price', this.formatCurrency(pricing.basePrice)],
            [
              `GST (${pricing.gstPercentage}%)`,
              this.formatCurrency(pricing.gstAmount),
            ],
          ];

          if (pricing.extraTaxPercentage > 0) {
            details.push([
              `Extra Tax (${pricing.extraTaxPercentage}%)`,
              this.formatCurrency(pricing.extraTaxAmount),
            ]);
          }

          details.push([
            'Shipping Charges',
            this.formatCurrency(pricing.shippingCharge),
          ]);
          details.push([
            'Subtotal (Inc. Taxes)',
            this.formatCurrency(pricing.priceWithTaxes),
          ]);

          details.forEach(([label, value]) => {
            yPosition = this.checkPageBreak(doc, yPosition, 10, footerY);

            if (rowIdx % 2 === 0) {
              doc.setFillColor(248, 250, 252);
              doc.rect(15, yPosition - 1, 180, 6, 'F');
            }

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.rect(15, yPosition - 1, 180, 6);

            doc.setTextColor(...primaryText);
            doc.setFont('helvetica', 'normal');
            doc.text(label, 20, yPosition + 2);

            doc.setFont('helvetica', 'bold');
            doc.text(value, 175, yPosition + 2, { align: 'right' });

            yPosition += 7;
            rowIdx++;
          });
        });

        yPosition += 2; // Reduced from 3

        // Grand Total
        yPosition = this.checkPageBreak(doc, yPosition, 15, footerY);

        const grandTotal = quotationData.products.reduce((total, item) => {
          const pricing = this.calculatePricing(item.product);
          return total + pricing.totalAmount * (item.quantity || 1);
        }, 0);

        doc.setFillColor(...accentColor);
        doc.rect(15, yPosition, 180, 10, 'F'); // Reduced height from 12

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text('GRAND TOTAL:', 20, yPosition + 7); // Adjusted from 8
        doc.text(this.formatCurrency(grandTotal), 190, yPosition + 7, {
          align: 'right',
        });
      }

      // Add footer to all pages
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        this.addFooter(doc);

        // Border for each page
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(1);
        doc.rect(5, 5, 200, 287);
      }

      // Save PDF to file
      const fileName = `quotation-${quoteId}-${
        new Date().toISOString().split('T')[0]
      }.pdf`;

      const pdfBase64 = doc.output('dataurlstring').split(',')[1];
      const documentsPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}`
          : `${RNFS.DocumentDirectoryPath}`;

      const filePath = `${documentsPath}/${fileName}`;

      await RNFS.writeFile(filePath, pdfBase64, 'base64');
      console.log('PDF saved at:', filePath);

      // Share the PDF
      const shareOptions = {
        url: Platform.OS === 'android' ? 'file://' + filePath : filePath,
        type: 'application/pdf',
        filename: fileName,
        title: 'Share Quotation',
        message: 'Please find the attached quotation',
        failOnCancel: false,
      };

      console.log('Opening share dialog...');
      await Share.open(shareOptions);

      return {
        success: true,
        path: filePath,
        fileName: fileName,
      };
    } catch (error) {
      console.error('Error in generateAndDownloadPDF:', error);
      throw new Error(`PDF Generation Failed: ${error.message}`);
    }
  }
}

export default QuotationPDFRN;
