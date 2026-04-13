
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import pmLogo from "../Assets/img/Logos/newPMLogo.png";

class QuotationPDF {
  formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  }

  formatCurrency(amount) {
    if (!amount && amount !== 0) return "INR 0.00";
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
      doc.addImage(pmLogo, "PNG", 15, 8, 40, 15);

      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.09 }));

      const pageWidth = 210;
      const pageHeight = 297;
      const logoWidth = pageWidth * 0.6;
      const logoHeight = logoWidth * 0.699;

      const xPos = (pageWidth - logoWidth) / 2;
      const yPos = (pageHeight - logoHeight) / 2;

      doc.addImage(pmLogo, "PNG", xPos, yPos, logoWidth, logoHeight);
      doc.restoreGraphicsState();
    } catch (error) {
      console.warn("Could not load logo:", error);
    }
  }

  generatePDFWithJSPDF(quotationData, sections = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!quotationData) {
          throw new Error("No quotation data provided");
        }

        // Default all sections to true if not provided
        const pdfSections = {
          customerInfo:
            sections.customerInfo !== undefined ? sections.customerInfo : true,
          productInfo:
            sections.productInfo !== undefined ? sections.productInfo : true,
          pricing: sections.pricing !== undefined ? sections.pricing : true,
          brandInfo:
            sections.brandInfo !== undefined ? sections.brandInfo : true,
          categoryInfo:
            sections.categoryInfo !== undefined ? sections.categoryInfo : true,
          materialInfo:
            sections.materialInfo !== undefined ? sections.materialInfo : true,
          measurementInfo:
            sections.measurementInfo !== undefined
              ? sections.measurementInfo
              : true,
          warrantyInfo:
            sections.warrantyInfo !== undefined ? sections.warrantyInfo : true,
        };

        const doc = new jsPDF();

        const primaryColor = [0, 86, 158]; // #00569e
        const primaryBtnColor = [0, 70, 128]; // #004680
        const accentColor = [140, 196, 65]; // #8cc441
        const primaryText = [31, 41, 55]; // #1f2937
        const secondaryText = [107, 114, 128]; // #6b7280

        await this.addLogoToDoc(doc);

        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 35, "F");

        doc.setFillColor(...accentColor);
        doc.rect(0, 32, 210, 3, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text("QUOTATION", 105, 22, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const quoteId =
          quotationData.quotationRef ||
          (quotationData._id
            ? quotationData._id.slice(-8).toUpperCase()
            : "N/A");
        doc.text(`Reference No. :- ${quoteId}`, 190, 15, { align: "right" });
        doc.text(`Date: ${this.formatDate(quotationData.createdAt)}`, 190, 20, {
          align: "right",
        });

        let yPosition = 50;

        // Customer Information Section
        if (pdfSections.customerInfo) {
          doc.setFillColor(...primaryBtnColor);
          doc.rect(15, yPosition, 180, 8, "F");

          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text("CUSTOMER INFORMATION", 20, yPosition + 6);

          yPosition += 15;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...primaryText);
          doc.setFontSize(10);

          const customerInfo = [
            [`Name:`, quotationData.fullName || "N/A"],
            [`Phone:`, quotationData.mobNumber || "N/A"],
            [`Email:`, quotationData.email || "N/A"],
            [`City:`, quotationData.city || "N/A"],
            [`State:`, quotationData.state || "N/A"],
            ...(quotationData.subject
              ? [[`Subject:`, quotationData.subject]]
              : []),
            [`Heading:`, quotationData.heading || "N/A"],
          ];

          customerInfo.forEach(([label, value], index) => {
            const xPos = index % 2 === 0 ? 20 : 110;
            const currentY = yPosition + Math.floor(index / 2) * 8;

            doc.setFont("helvetica", "bold");
            doc.text(label, xPos, currentY);
            doc.setFont("helvetica", "normal");
            doc.text(value, xPos + 25, currentY);
          });

          yPosition += Math.ceil(customerInfo.length / 2) * 8 + 8;

          // Add Description section if available
          if (quotationData.description) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("Description:", 20, yPosition);

            yPosition += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);

            const maxWidth = 170;
            const wrappedDescription = doc.splitTextToSize(
              quotationData.description,
              maxWidth,
            );
            doc.text(wrappedDescription, 20, yPosition);

            yPosition += wrappedDescription.length * 5 + 8;
          } else {
            yPosition += 2;
          }
        }

        // Product Information Section
        if (pdfSections.productInfo) {
          doc.setFillColor(...primaryBtnColor);
          doc.rect(15, yPosition, 180, 8, "F");

          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text("PRODUCT INFORMATION", 20, yPosition + 6);

          yPosition += 15;
          doc.setTextColor(...primaryText);
          doc.setFont("helvetica", "normal");

          const productInfo = [
            [`Product:`, quotationData.product?.name || "N/A"],
          ];

          // Add optional product fields based on section selections
          if (pdfSections.brandInfo) {
            productInfo.push([`Brand:`, quotationData.product?.brand || "N/A"]);
          }

          if (pdfSections.categoryInfo) {
            productInfo.push(
              [`Category:`, quotationData.category?.name || "N/A"],
              [`Sub-Category:`, quotationData.subCategory?.name || "N/A"],
              [`Tier-3-Category:`, quotationData.subSubCategory?.name || "N/A"],
            );
          }

          if (pdfSections.materialInfo) {
            productInfo.push([
              `Material:`,
              quotationData.product?.material || "N/A",
            ]);
          }

          if (pdfSections.measurementInfo) {
            productInfo.push([
              `Measurement:`,
              quotationData.product?.measurement || "N/A",
            ]);
          }

          if (pdfSections.warrantyInfo) {
            productInfo.push([
              `Warranty:`,
              quotationData.product?.warranty?.warrantyDays || "N/A",
            ]);
          }

          productInfo.forEach(([label, value], index) => {
            const xPos = index % 2 === 0 ? 20 : 110;
            const currentY = yPosition + Math.floor(index / 2) * 8;

            doc.setFont("helvetica", "bold");
            doc.text(label, xPos, currentY);
            doc.setFont("helvetica", "normal");

            const maxWidth = 80;
            const wrappedText = doc.splitTextToSize(value, maxWidth);
            doc.text(wrappedText[0], xPos + 28, currentY);
          });

          yPosition += Math.ceil(productInfo.length / 2) * 8 + 15;
        }

        // Pricing Section
        if (pdfSections.pricing) {
          const pricing = this.calculatePricing(quotationData.product);

          const tableData = [
            ["Base Price", this.formatCurrency(pricing.basePrice)],
            [
              `GST (${pricing.gstPercentage}%)`,
              this.formatCurrency(pricing.gstAmount),
            ],
          ];

          if (pricing.extraTaxPercentage > 0) {
            tableData.push([
              `Extra Tax (${pricing.extraTaxPercentage}%)`,
              this.formatCurrency(pricing.extraTaxAmount),
            ]);
          }

          tableData.push(
            ["Shipping Charges", this.formatCurrency(pricing.shippingCharge)],
            [
              "Subtotal (Inc. Taxes)",
              this.formatCurrency(pricing.priceWithTaxes),
            ],
          );

          autoTable(doc, {
            startY: yPosition,
            head: [["Description", "Amount"]],
            body: tableData,
            headStyles: {
              fillColor: primaryBtnColor,
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 11,
              halign: "center",
            },
            bodyStyles: {
              fontSize: 10,
              textColor: primaryText,
              cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252],
            },
            columnStyles: {
              0: { cellWidth: 120, halign: "left" },
              1: { cellWidth: 60, halign: "right", fontStyle: "bold" },
            },
            theme: "grid",
            tableLineColor: [200, 200, 200],
            tableLineWidth: 0.5,
            margin: { left: 15, right: 15 },
          });

          yPosition = doc.lastAutoTable.finalY + 5;
          doc.setFillColor(...accentColor);
          doc.rect(15, yPosition, 180, 15, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(255, 255, 255);
          doc.text("TOTAL AMOUNT:", 20, yPosition + 10);
          doc.text(
            this.formatCurrency(pricing.totalAmount),
            175,
            yPosition + 10,
            { align: "right" },
          );

          yPosition += 25;
        }

        // Check if we need a new page for validity and disclaimer
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
          // Add border to new page
          doc.setDrawColor(...primaryColor);
          doc.setLineWidth(1);
          doc.rect(5, 5, 200, 287);
        }

        // Validity Text
        const validityY = yPosition + 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...primaryText);
        doc.text(
          "Validity: This quotation is valid for 10 days from the date of issue.",
          20,
          validityY,
        );

        // System Generated Disclaimer
        const disclaimerY = validityY + 12;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...primaryText);
        doc.text("DISCLAIMER:", 20, disclaimerY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...secondaryText);

        const disclaimerText =
          "This is a System generated quotation and can be used for banking purposes. However, the price and specification may change any time, without any prior notice. So you are requested to take the final and updated quotation at the time of purchase.";

        const maxWidth = 170;
        const wrappedDisclaimer = doc.splitTextToSize(disclaimerText, maxWidth);
        doc.text(wrappedDisclaimer, 20, disclaimerY + 6);

        // Footer
        const footerY = 270;
        doc.setFillColor(...primaryColor);
        doc.rect(0, footerY, 210, 25, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text(
          "Thank you for your interest in our products!",
          105,
          footerY + 8,
          { align: "center" },
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          "Email: info@pandamachines.com | Phone: +91-80717 93049",
          105,
          footerY + 18,
          { align: "center" },
        );

        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(1);
        doc.rect(5, 5, 200, 287);

        const filename = `quotation-${quoteId}-${new Date().toISOString().split("T")[0]
          }.pdf`;
        doc.save(filename);

        resolve(true);
      } catch (error) {
        console.error("Error generating PDF with jsPDF:", error);
        reject(error);
      }
    });
  }
}

export default QuotationPDF;
