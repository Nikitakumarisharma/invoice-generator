# 🧾 Company Registration Invoice Generator

A modern and responsive **Company Registration Invoice Generator** built with **Next.js, TypeScript, and Tailwind CSS**.  
It allows users to dynamically select **Company Type**, **State**, and **Add-ons** to generate an invoice.  
Features include **Invoice Preview**, **PDF Download**, and **WhatsApp Offers**.

---

## 🚀 Features

- ✅ Dynamic Invoice Calculation (State + Company Type + Add-ons)
- ✅ Company Type Dropdown
- ✅ State Selection with Auto-Fee Update
- ✅ Add-On Services with Recommended Tags
- ✅ Invoice Preview UI
- ✅ PDF Download of Invoice
- ✅ Direct WhatsApp Offers Button
- ✅ Clean, Responsive Tailwind CSS UI
- ✅ Blur & Transparent Modal for Checkout
- ✅ TypeScript Strictly Typed

---

## 📂 Project Structure

```
my-invoice-app/
├── public/
│   └── logo.png  # Logo for the invoice
├── src/
│   ├── app/
│   │   └── page.tsx  # Main page component
│   ├── components/
│   │   ├── InvoiceForm.tsx  # Form for selecting company details
│   │   ├── InvoicePreview.tsx  # Preview of the generated invoice
│   │   └── CheckoutModal.tsx  # Modal for customer info and checkout
│   ├── types/
│   │   └── invoice.ts  # TypeScript types for invoice data
│   ├── utils/
│   │   └── pdfGenerator.ts  # Generates PDF from invoice data
│   └── styles/
│       └── globals.css  # Global styles
├── package.json
└── tsconfig.json

```

---

## 🛠️ Tech Stac

- **Next.js**: For server-side rendering and routing.
- **TypeScript**: For type safety and better development experience.
- **Tailwind CSS**: For styling and responsive design.
- **React Hook Form**: For form handling and validation.
- **JSPDF**: For generating PDFs.
- **HTML2Canvas**: For converting HTML to canvas for PDF generation.
- **MongoDB**: For storing invoice data.
- **Mongoose**: For MongoDB object modeling.

---

## 📝 To-Do List
