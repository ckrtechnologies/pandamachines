import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import pmLogo from "../Assets/img/Logos/newPMLogo.png";

class MultiProductQuotationPDF {
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

  calculateProductTotal(product, quantity) {
    const pricing = this.calculatePricing(product);
    return {
      ...pricing,
      quantity: quantity || 1,
      lineTotal: pricing.totalAmount * (quantity || 1),
    };
  }

  addLogoToFirstPage(doc, isFirstPage) {
    if (!isFirstPage) return;

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
        let isFirstPage = true;

        const primaryColor = [0, 86, 158];
        const primaryBtnColor = [0, 70, 128];
        const accentColor = [140, 196, 65];
        const primaryText = [31, 41, 55];
        const secondaryText = [107, 114, 128];

        this.addLogoToFirstPage(doc, isFirstPage);

        // Border (add before filling)
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(1);
        doc.rect(5, 5, 200, 287);

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
        const quoteId = quotationData._id
          ? quotationData._id.slice(-8).toUpperCase()
          : "N/A";
        doc.text(`Quote #: ${quoteId}`, 190, 15, { align: "right" });
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
            [`Address:`, quotationData.address || "N/A"],
            [`Subject:`, quotationData.subject || "N/A"],
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
        }

        // Products Section
        if (quotationData.products && quotationData.products.length > 0) {
          doc.setFillColor(...primaryBtnColor);
          doc.rect(15, yPosition, 180, 8, "F");

          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text("PRODUCTS", 20, yPosition + 6);

          yPosition += 12;

          const productTotals = [];

          quotationData.products.forEach((productItem, index) => {
            const product = productItem.product;
            const quantity = productItem.quantity || 1;

            if (yPosition > 240) {
              doc.addPage();
              isFirstPage = false;
              yPosition = 20;
              // Add border to new page
              doc.setDrawColor(...primaryColor);
              doc.setLineWidth(1);
              doc.rect(5, 5, 200, 287);
            }

            doc.setFillColor(248, 250, 252);
            doc.rect(15, yPosition, 180, 8, "F");
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...primaryText);
            doc.setFontSize(11);
            doc.text(
              `Product ${index + 1}: ${product?.name || "N/A"}`,
              20,
              yPosition + 6
            );

            yPosition += 15;

            if (pdfSections.productInfo) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.setTextColor(...primaryText);

              const productInfo = [];

              if (pdfSections.brandInfo) {
                productInfo.push([`Brand:`, product?.brand || "N/A"]);
              }

              if (pdfSections.categoryInfo) {
                productInfo.push(
                  [`Category:`, productItem.category?.name || "N/A"],
                  [`Sub-Category:`, productItem.subCategory?.name || "N/A"],
                  [
                    `Tier-3-Category:`,
                    productItem.subSubCategory?.name || "N/A",
                  ]
                );
              }

              if (pdfSections.materialInfo) {
                productInfo.push([`Material:`, product?.material || "N/A"]);
              }

              if (pdfSections.measurementInfo) {
                productInfo.push([
                  `Measurement:`,
                  product?.measurement || "N/A",
                ]);
              }

              if (pdfSections.warrantyInfo) {
                productInfo.push([
                  `Warranty:`,
                  product?.warranty?.warrantyDays || "N/A",
                ]);
              }

              productInfo.push([`Quantity:`, quantity.toString()]);

              productInfo.forEach(([label, value], i) => {
                const xPos = i % 2 === 0 ? 20 : 110;
                const currentY = yPosition + Math.floor(i / 2) * 8;

                doc.setFont("helvetica", "bold");
                doc.text(label, xPos, currentY);
                doc.setFont("helvetica", "normal");

                const maxWidth = 75;
                const wrappedText = doc.splitTextToSize(value, maxWidth);
                doc.text(wrappedText[0], xPos + 28, currentY);
              });

              yPosition += Math.ceil(productInfo.length / 2) * 8 + 8;
            }

            const productTotal = this.calculateProductTotal(product, quantity);
            productTotals.push({
              name: product?.name || "Product",
              index: index + 1,
              ...productTotal,
            });

            if (index < quotationData.products.length - 1) {
              doc.setDrawColor(...secondaryText);
              doc.setLineWidth(0.5);
              doc.line(15, yPosition, 195, yPosition);
              yPosition += 5;
            } else {
              yPosition += 3;
            }
          });

          // PRICING SECTION
          if (pdfSections.pricing && productTotals.length > 0) {
            if (yPosition > 170) {
              doc.addPage();
              isFirstPage = false;
              yPosition = 20;
              // Add border to new page
              doc.setDrawColor(...primaryColor);
              doc.setLineWidth(1);
              doc.rect(5, 5, 200, 287);
            }

            doc.setFillColor(...primaryBtnColor);
            doc.rect(15, yPosition, 180, 8, "F");
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text("PRICING BREAKDOWN", 20, yPosition + 6);

            yPosition += 12;

            const pricingTableData = [];
            let grandTotal = 0;

            productTotals.forEach((pt) => {
              pricingTableData.push([
                {
                  content: `Product ${pt.index}: ${pt.name}`,
                  colSpan: 4,
                  styles: {
                    fillColor: [248, 250, 252],
                    fontStyle: "bold",
                    textColor: primaryText,
                  },
                },
              ]);

              pricingTableData.push(
                [
                  "Base Price",
                  this.formatCurrency(pt.basePrice),
                  pt.quantity,
                  this.formatCurrency(pt.basePrice * pt.quantity),
                ],
                [
                  `GST (${pt.gstPercentage}%)`,
                  this.formatCurrency(pt.gstAmount),
                  pt.quantity,
                  this.formatCurrency(pt.gstAmount * pt.quantity),
                ]
              );

              if (pt.extraTaxPercentage > 0) {
                pricingTableData.push([
                  `Extra Tax (${pt.extraTaxPercentage}%)`,
                  this.formatCurrency(pt.extraTaxAmount),
                  pt.quantity,
                  this.formatCurrency(pt.extraTaxAmount * pt.quantity),
                ]);
              }

              pricingTableData.push([
                "Shipping",
                this.formatCurrency(pt.shippingCharge),
                "-",
                this.formatCurrency(pt.shippingCharge),
              ]);

              pricingTableData.push([
                {
                  content: "Product Subtotal",
                  colSpan: 3,
                  styles: { fontStyle: "bold", halign: "right" },
                },
                {
                  content: this.formatCurrency(pt.lineTotal),
                  styles: { fontStyle: "bold", fillColor: [240, 244, 248] },
                },
              ]);

              grandTotal += pt.lineTotal;
            });

            autoTable(doc, {
              startY: yPosition,
              head: [["Description", "Unit Price", "Qty", "Total"]],
              body: pricingTableData,
              headStyles: {
                fillColor: primaryBtnColor,
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 10,
                halign: "center",
              },
              bodyStyles: {
                fontSize: 9,
                textColor: primaryText,
                cellPadding: { top: 2, bottom: 2, left: 4, right: 4 },
              },
              alternateRowStyles: { fillColor: [255, 255, 255] },
              columnStyles: {
                0: { cellWidth: 80, halign: "left" },
                1: { cellWidth: 40, halign: "right" },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: 40, halign: "right", fontStyle: "bold" },
              },
              theme: "grid",
              tableLineColor: [200, 200, 200],
              tableLineWidth: 0.5,
              margin: { left: 15, right: 15 },
            });

            yPosition = doc.lastAutoTable.finalY + 8;

            if (yPosition > 250) {
              doc.addPage();
              isFirstPage = false;
              yPosition = 20;
              // Add border to new page
              doc.setDrawColor(...primaryColor);
              doc.setLineWidth(1);
              doc.rect(5, 5, 200, 287);
            }

            doc.setFillColor(...accentColor);
            doc.rect(15, yPosition, 180, 12, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(255, 255, 255);
            doc.text("GRAND TOTAL:", 20, yPosition + 8);
            doc.text(this.formatCurrency(grandTotal), 175, yPosition + 8, {
              align: "right",
            });

            yPosition += 18;
          }
        }

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
          { align: "center" }
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          "Email: info@pandamachines.com | Phone: +91-80717 93049",
          105,
          footerY + 18,
          { align: "center" }
        );

        const filename = `multi-quotation-${quoteId}-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        doc.save(filename);

        resolve(true);
      } catch (error) {
        console.error("Error generating multi-product PDF:", error);
        reject(error);
      }
    });
  }
}

export default MultiProductQuotationPDF;
