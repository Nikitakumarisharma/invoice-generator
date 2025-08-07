import { InvoiceData, CustomerInfo } from "../types/invoice";

// Helper function to convert numbers to words (Indian numbering system)
function numberToWords(num: number): string {
  // Function to handle the integer part
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero";

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " and " + inWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + inWords(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + inWords(n % 100000) : "")
      );
    return (
      inWords(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + inWords(n % 10000000) : "")
    );
  }

  const integerPart = Math.floor(num);
  const words = inWords(integerPart);

  return words + " Only";
}

export const generateInvoicePDF = async (
  invoice: InvoiceData,
  customer?: CustomerInfo,
  personCount: number = 2
) => {
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import("jspdf")).default;

    // Create PDF directly without html2canvas
    const pdf = new jsPDF("p", "mm", "a4");

    // Helper function to format currency
    const formatCurrency = (amount: number) =>
      `${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2, // To show decimals
        maximumFractionDigits: 2,
      })}`;

    // Set font
    pdf.setFont("helvetica");

    // --- Start of Header Code ---
    try {
      const logoResponse = await fetch("/logo.png");
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
      });
      pdf.addImage(logoBase64, "PNG", 20, 13, 25, 17);
    } catch (error) {
      console.warn("Logo failed to load, using text fallback:", error);
      pdf.setFontSize(18);
      pdf.setTextColor(220, 20, 60);
      pdf.text("Tax", 20, 25);
      pdf.setTextColor(0, 0, 0);
      pdf.text("legit", 38, 25);
    }

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Taxlegit Consulting Private Limited", 45, 15);

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);

    const companyDetails = [
      "1117, Astralis, Plot No.94, Sector-94 Noida",
      "Uttar Pradesh-201301 INDIA",
      "GST: 09AAJCT8691F1ZN",
    ];
    companyDetails.forEach((line, index) => {
      pdf.text(line, 45, 20 + index * 4);
    });
    // --- End of Header Code ---

    // --- START: Updated Bill To Section ---
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Bill To:", 20, 43);
    pdf.setTextColor(0, 0, 0);
    if (customer) {
      pdf.text(`Name: ${customer.fullName}`, 20, 47);
      pdf.text(`contact: ${customer.contactNumber}`, 20, 51);

      const currentDate = new Date()
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
      const dateTextFormatted = `Date: ${currentDate}`;
      pdf.text(dateTextFormatted, 20, 55);
    }
    // --- END: Updated Bill To Section ---

    pdf.setFontSize(22);
    pdf.setTextColor(59, 130, 246);
    pdf.text("Quotation", 20, 67);

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    let yPos = 75;
    pdf.text(`Company Registration Type: ${invoice.companyType}`, 20, yPos);
    const stateText = `State: ${invoice.state.name}`;
    pdf.text(stateText, 190 - pdf.getTextWidth(stateText), yPos);
    yPos += 5;

    // Calculate additional fees based on person count
    let additionalDscFee = 0;
    let additionalDinFee = 0;

    if (personCount > 2) {
      // DSC logic: After 2 persons, add ₹2360 for each additional person
      additionalDscFee = (personCount - 2) * 2360;
    }

    if (personCount > 3) {
      // DIN logic: After 3 persons, add ₹1180 for each additional person
      additionalDinFee = (personCount - 3) * 1180;
    }

    // --- TABLE 1: Main Services ---
    const mainFees = [
      {
        label: `${personCount} x DSC Fees`,
        amount: invoice.baseFees.dsc + additionalDscFee,
      },
      { label: "RUN + PANTAN", amount: invoice.baseFees.runPanTan },
      { label: "Professional Fees", amount: invoice.baseFees.professionalFee },
      {
        label: `State Govt. Fee (${invoice.state.name})`,
        amount: invoice.state.fee,
      },
    ];

    // Always add DIN item, but with 0 price for 2-3 persons
    const dinLabel =
      personCount <= 3
        ? `${personCount} x DIN Fees`
        : `${personCount - 3} x DIN Fees`;
    mainFees.push({
      label: dinLabel,
      amount: additionalDinFee, // This will be 0 for 2-3 persons
    });

    const tableLeftX = 20;
    const tableWidth = 170;
    const tableRightX = tableLeftX + tableWidth;
    const col1Width = 20;
    const col2Width = 110;

    const table1StartY = yPos;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);

    yPos += 8;
    pdf.text("S. No.", tableLeftX + 10, yPos, { align: "center" });
    pdf.text("Services", tableLeftX + col1Width + 2, yPos);
    pdf.text("Amount", tableRightX - 2, yPos, { align: "right" });
    yPos += 4;
    pdf.setLineWidth(0.3);
    pdf.line(tableLeftX, yPos, tableRightX, yPos);

    yPos += 6;
    pdf.setFont("helvetica", "normal");
    let mainFeesTotal = 0;
    mainFees.forEach((item, index) => {
      mainFeesTotal += item.amount;
      pdf.text(`${index + 1}`, tableLeftX + 10, yPos, { align: "center" });
      pdf.text(item.label, tableLeftX + col1Width + 2, yPos);
      const amountText = item.amount.toLocaleString("en-IN");
      pdf.text(amountText, tableRightX - 2, yPos, { align: "right" });
      yPos += 7;
    });

    pdf.setLineWidth(0.3);
    pdf.line(tableLeftX, yPos - 3, tableRightX, yPos - 3);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total", tableLeftX + col1Width + 2, yPos + 2);
    pdf.text(mainFeesTotal.toLocaleString("en-IN"), tableRightX - 2, yPos + 2, {
      align: "right",
    });
    yPos += 7;

    const table1EndY = yPos - 3;
    pdf.rect(tableLeftX, table1StartY, tableWidth, table1EndY - table1StartY);
    pdf.line(
      tableLeftX + col1Width,
      table1StartY,
      tableLeftX + col1Width,
      table1EndY
    );
    pdf.line(
      tableLeftX + col1Width + col2Width,
      table1StartY,
      tableLeftX + col1Width + col2Width,
      table1EndY
    );

    // --- TABLE 2: Add-ons ---
    if (invoice.addOns.length > 0) {
      yPos += 5;
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text("Add-ons:", 20, yPos);
      yPos += 5;

      const table2StartY = yPos;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);

      yPos += 8;
      pdf.text("Sr. No.", tableLeftX + 10, yPos, { align: "center" });
      pdf.text("Services", tableLeftX + col1Width + 2, yPos);
      pdf.text("Amount ", tableRightX - 2, yPos, { align: "right" });
      yPos += 4;
      pdf.setLineWidth(0.3);
      pdf.line(tableLeftX, yPos, tableRightX, yPos);

      yPos += 6;
      pdf.setFont("helvetica", "normal");
      let addOnsTotal = 0;
      invoice.addOns.forEach((addon, index) => {
        addOnsTotal += addon.price;
        pdf.text(`${index + 1}`, tableLeftX + 10, yPos, { align: "center" });
        pdf.text(addon.name, tableLeftX + col1Width + 2, yPos);
        const addonAmountText = addon.price.toLocaleString("en-IN");
        pdf.text(addonAmountText, tableRightX - 2, yPos, {
          align: "right",
        });
        yPos += 7;
      });

      pdf.setLineWidth(0.3);
      pdf.line(tableLeftX, yPos - 3, tableRightX, yPos - 3);
      pdf.setFont("helvetica", "bold");
      pdf.text("Total", tableLeftX + col1Width + 2, yPos + 2);
      pdf.text(addOnsTotal.toLocaleString("en-IN"), tableRightX - 2, yPos + 2, {
        align: "right",
      });
      yPos += 7;

      const table2EndY = yPos - 3;
      const addOnTableWidth = 170;
      pdf.rect(
        tableLeftX,
        table2StartY,
        addOnTableWidth,
        table2EndY - table2StartY
      );
      pdf.line(
        tableLeftX + col1Width,
        table2StartY,
        tableLeftX + col1Width,
        table2EndY
      );
      pdf.line(
        tableLeftX + col1Width + col2Width,
        table2StartY,
        tableLeftX + col1Width + col2Width,
        table2EndY
      );
    }

    // --- START: Final Total Section (Aligned) ---
    yPos += 5;
    const totalBoxStartY = yPos;

    // Use the same column widths as the tables above for alignment
    const totalCol1X = tableLeftX + col1Width;
    const totalCol2X = tableLeftX + col1Width + col2Width;
    const wordsColumnWidth = totalCol2X - totalCol1X - 6;

    const totalInWords = numberToWords(invoice.total);
    const wrappedText = pdf.splitTextToSize(totalInWords, wordsColumnWidth);

    const dynamicBoxHeight = Math.max(15, wrappedText.length * 5 + 5);

    pdf.setLineWidth(0.3);
    pdf.rect(tableLeftX, totalBoxStartY, tableWidth, dynamicBoxHeight);

    const contentY =
      totalBoxStartY + dynamicBoxHeight / 2 - (wrappedText.length - 1) * 2.5;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total :", tableLeftX + 3, contentY);

    pdf.setFont("helvetica", "normal");
    pdf.text(wrappedText, totalCol1X + 3, contentY);

    if (invoice.hasSpecialOffer && invoice.subtotal && invoice.discount) {
      const originalText = formatCurrency(invoice.subtotal);
      const discountedText = formatCurrency(invoice.total);
      const discountedWidth = pdf.getTextWidth(discountedText);
      const originalWidth = pdf.getTextWidth(originalText);
      const spacing = 3;
      const discountedX = tableRightX - 3;
      const originalX = discountedX - discountedWidth - spacing;

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(255, 0, 0);
      pdf.text(originalText, originalX - originalWidth, contentY, {
        align: "left",
      });

      const lineY = contentY - 1.5;
      pdf.setLineWidth(0.5);
      pdf.line(originalX - originalWidth, lineY, originalX, lineY);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(discountedText, discountedX, contentY, { align: "right" });
    } else {
      const totalText = formatCurrency(invoice.total);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(totalText, tableRightX - 3, contentY, { align: "right" });
    }

    // Vertical line separators aligned with the tables
    pdf.line(
      totalCol1X,
      totalBoxStartY,
      totalCol1X,
      totalBoxStartY + dynamicBoxHeight
    );
    pdf.line(
      totalCol2X,
      totalBoxStartY,
      totalCol2X,
      totalBoxStartY + dynamicBoxHeight
    );

    pdf.setTextColor(0, 0, 0); // Set text color to black
    pdf.setFontSize(10); // Optional: set font size

    // Add Final Offered Prize below total if > 0
    if (invoice.finalPrize && invoice.finalPrize > 0) {
      const finalPrizeText = `Final Offered Prize: ${invoice.finalPrize.toFixed(
        2
      )}`;
      const finalPrizeY = totalBoxStartY + dynamicBoxHeight + 10;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 0, 0); // Red color
      pdf.text(finalPrizeText, tableRightX - 3, finalPrizeY, {
        align: "right",
      });
    }

    pdf.setTextColor(0, 0, 0); // Set text color to black

    pdf.text(
      "All Government fee and GST charges are excluded.",
      20,
      totalBoxStartY + dynamicBoxHeight + 10
    );

    // --- END: Final Total Section ---

    const footerY = 240;
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, footerY, 210, 57, "F");

    pdf.setTextColor(0, 0, 0);
    let footerLeftY = footerY + 10;
    pdf.setFontSize(10);
    pdf.text("Thank you for choosing our services!", 20, footerLeftY);

    footerLeftY += 8;
    pdf.setFontSize(9);
    pdf.text("Payment Details", 20, footerLeftY);
    footerLeftY += 5;
    pdf.setFontSize(8);
    const paymentDetails = [
      "Name: Taxlegit Consulting Private Limited",
      "Account No. : 778005500100",
      "IFSC : ICIC0007780",
      "Bank: ICICI Bank, Sector-45 Noida",
    ];
    paymentDetails.forEach((detail, index) =>
      pdf.text(detail, 20, footerLeftY + index * 4.5)
    );

    let footerRightY = footerY + 10;
    pdf.setFontSize(9);
    pdf.text("Contact Details", 150, footerRightY);
    footerRightY += 8;
    pdf.setFontSize(8);
    const contactDetails = [
      "Phone: +91 85957 66812",
      "WhatsApp: +91 88104 45899",
      "Email: 121@taxlegit.com",
      "Website: www.taxlegit.com & ",
      "www.ngoexperts.com",
    ];
    contactDetails.forEach((contact, index) =>
      pdf.text(contact, 150, footerRightY + index * 4.5)
    );

    pdf.save(`Quotation-${invoice.companyType}-${invoice.state.name}.pdf`);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};
