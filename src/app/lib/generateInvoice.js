import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";
import puppeteer from "puppeteer";

// Generates a PDF invoice using HTML and saves it to public/invoice
//        customerData: orderSession.customerDetails,
// orderId: order._id,
// date: new Date().toLocaleDateString(),
// items: orderSession.cartItems,
// total: orderSession.totalAmount,
// tax: orderSession.tax,
export default async function generateInvoicePdf(data) {
  const folder = "invoice";
  const uploadPath = path.join(process.cwd(), "public", folder);
  await mkdir(uploadPath, { recursive: true });

  const fileName = `invoice-${Date.now()}.pdf`;
  const filePath = path.join(uploadPath, fileName);
  const publicUrl = `/${folder}/${fileName}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #fefaf5;
            color: #000;
            line-height: 1.6;
            padding: 20px;
        }

        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #236339;
            color: #fff;
            padding: 30px;
            text-align: center;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .company-details {
            font-size: 14px;
            line-height: 1.8;
        }

        .invoice-body {
            padding: 30px;
        }

        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            gap: 20px;
        }

        .customer-details, .invoice-details {
            flex: 1;
            padding: 20px;
            border: 2px solid #236339;
            border-radius: 8px;
            background-color: #fefaf5;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #236339;
            margin-bottom: 15px;
            border-bottom: 2px solid #236339;
            padding-bottom: 5px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .detail-label {
            font-weight: bold;
            color: #236339;
        }

        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .product-table th {
            background-color: #236339;
            color: #fff;
            padding: 15px;
            text-align: left;
            font-weight: bold;
        }

        .product-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
        }

        .product-table tr:nth-child(even) {
            background-color: #fefaf5;
        }

        .product-table tr:hover {
            background-color: #f0f0f0;
        }

        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }

        .totals-table {
            width: 300px;
            border-collapse: collapse;
        }

        .totals-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #ddd;
        }

        .totals-table .label {
            font-weight: bold;
            color: #236339;
            text-align: right;
        }

        .totals-table .amount {
            text-align: right;
            font-weight: bold;
        }

        .total-row {
            background-color: #236339;
            color: #fff;
            font-size: 18px;
        }

        .shipping-address {
            padding: 20px;
            border: 2px solid #236339;
            border-radius: 8px;
            background-color: #fefaf5;
        }

        .address-title {
            font-size: 16px;
            font-weight: bold;
            color: #236339;
            margin-bottom: 15px;
            border-bottom: 2px solid #236339;
            padding-bottom: 5px;
        }

        .address-line {
            margin-bottom: 5px;
        }

        @media (max-width: 768px) {
            .invoice-info {
                flex-direction: column;
            }
            
            .totals-section {
                justify-content: center;
            }
            
            .totals-table {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="company-name">CULLEN</div>
            <div class="company-details">
                123 Business Street, Suite 100<br>
                City, State 12345<br>
                Phone: +1 (555) 123-4567<br>
                GST Number: 22AAAAA0000A1Z5
            </div>
        </div>

        <!-- Invoice Body -->
        <div class="invoice-body">
            <!-- Customer and Invoice Info -->
            <div class="invoice-info">
                <div class="customer-details">
                    <div class="section-title">Customer Details</div>
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span>${data.customerData.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span>${data.customerData.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span>${data.customerData.phone}</span>
                    </div>
                </div>

                <div class="invoice-details">
                    <div class="section-title">Invoice Details</div>
                    <div class="detail-row">
                        <span class="detail-label">Invoice Number:</span>
                        <span>${data.orderId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span>${data.date}</span>
                    </div>
                </div>
            </div>

            <!-- Product Table -->
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                   ${data.items.map(
                     (item) =>
                       ` <tr>
                         <td>${item.pid_name}</td>
                         <td>${item.quantity}</td>
                         <td>${item.pid_price}</td>
                         <td>${item.quantity * item.pid_price}</td>
                     </tr>`
                   )}
                   
                </tbody>
            </table>

            <!-- Totals Section -->
            <div class="totals-section">
                <table class="totals-table">
                    <tr>
                        <td class="label">Subtotal:</td>
                        <td class="amount">₹${data.total}</td>
                    </tr>
                    <tr>
                        <td class="label">Tax (${data.taxPer}%):</td>
                        <td class="amount">₹${data.tax}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label">Total:</td>
                        <td class="amount">₹${data.total + data.tax}</td>
                    </tr>
                </table>
            </div>

            <!-- Shipping Address -->
            <div class="shipping-address">
                <div class="address-title">Shipping Address</div>
                <div class="address-line">${data.customerData.name}</div>
                <div class="address-line">${data.customerData.address}</div>
                <div class="address-line">${data.customerData.city.name}, ${
    data.customerData.state.name
  } ${data.customerData.zip}</div>
                <div class="address-line">${
                  data.customerData.country.name
                }</div>
            </div>
        </div>
    </div>
</body>
</html>`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: filePath, format: "A4", printBackground: true });

  await browser.close();

  return publicUrl;
}
