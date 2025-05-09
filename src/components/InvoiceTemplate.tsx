// components/InvoiceTemplate.tsx
import { Logo } from "./Logo";

export const generateInvoice = (
  email: string,
  orderId: string,
  amount: number,
  weeks: number,
  expiryDate: string
) => {
  const invoiceDate = new Date().toLocaleDateString();
  const invoiceNumber = `INV-${orderId.slice(0, 8).toUpperCase()}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #4F46E5;
        }
        .invoice-details {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
        }
        .detail-label {
          font-weight: 600;
          width: 150px;
          color: #6b7280;
        }
        .detail-value {
          flex: 1;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          background: #4F46E5;
          color: white;
          text-align: left;
          padding: 12px;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        .total-row {
          font-weight: bold;
          background: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-text {
          font-size: 20px;
          font-weight: bold;
          background: linear-gradient(to right, #4F46E5, #2563EB);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="logo-container">
          <div class="logo-text">TempMail</div>
        </div>
        <div>
          <div class="invoice-title">Invoice</div>
          <div>${invoiceNumber}</div>
          <div>Date: ${invoiceDate}</div>
        </div>
      </div>

      <div class="invoice-details">
        <div class="detail-row">
          <div class="detail-label">Temporary Email:</div>
          <div class="detail-value">${email}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Order ID:</div>
          <div class="detail-value">${orderId}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Expiry Date:</div>
          <div class="detail-value">${expiryDate}</div>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Temporary Email Extension</td>
            <td>${weeks} week(s)</td>
            <td>₹10</td>
            <td>₹${amount}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3">Total</td>
            <td>₹${amount}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        Thank you for using TempMail! Your temporary email will remain active until ${expiryDate}.
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoice = (
  email: string,
  orderId: string,
  amount: number,
  weeks: number,
  expiryDate: string
) => {
  const invoiceContent = generateInvoice(email, orderId, amount, weeks, expiryDate);
  const blob = new Blob([invoiceContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `TempMail_Invoice_${orderId.slice(0, 8)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};