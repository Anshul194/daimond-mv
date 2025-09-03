export const contactUsEmailTemplate = (data) => {
  console.log(data);
  const { firstName, lastName, email, message, phone } = data;
  return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - CULLEN Jewelry</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #d4af37, #f4d03f);
            color: #2c3e50;
            text-align: center;
            padding: 30px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.8;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            color: #d4af37;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 2px solid #f8f9fa;
            padding-bottom: 5px;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            margin-bottom: 12px;
            align-items: center;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-label {
            font-weight: bold;
            color: #2c3e50;
            min-width: 100px;
            margin-right: 15px;
        }
        .info-value {
            color: #555;
            flex: 1;
        }
        .message-box {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 20px;
            margin-top: 15px;
        }
        .message-content {
            font-style: italic;
            color: #555;
            line-height: 1.7;
        }
        .footer {
            background-color: #2c3e50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 12px;
        }
        .footer a {
            color: #d4af37;
            text-decoration: none;
        }
        .timestamp {
            color: #888;
            font-size: 12px;
            text-align: right;
            margin-top: 20px;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
        }
        .urgent-badge {
            background-color: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            margin-left: 10px;
        }
        @media (max-width: 600px) {
            .info-row {
                flex-direction: column;
                align-items: flex-start;
            }
            .info-label {
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>CULLEN</h1>
            <p>Fine Jewelry & Luxury Craftsmanship</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>New Contact Form Submission</h2>
                <div class="contact-info">
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${firstName} ${lastName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${email}</span>
                    </div>
                   ${
                     phone &&
                     ` <div class="info-row">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">${phone}</span>
                    </div>`
                   }
                </div>
            </div>
            
            <div class="section">
                <h2>Customer Message</h2>
                <div class="message-box">
                    <div class="message-content">
                        "${message}"
                    </div>
                </div>
            </div>
            
            <div class="timestamp">
                Received: ${new Date().toLocaleString()}
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent through the contact form on the CULLEN Jewelry website.</p>
            <p>Please respond promptly to maintain our excellent customer service standards.</p>
            <p><a href="mailto:${email}">Reply to Customer</a> | <a href="tel:${phone}">Call Customer</a></p>
        </div>
    </div>
</body>
</html>
    `;
};

export const customJewelryEmailTemplate = (data) => {
  const { firstName, lastName, email, centreStoneType, message, phone } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Jewelry Inquiry - CULLEN</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #d4af37, #f4d03f);
            color: #2c3e50;
            text-align: center;
            padding: 30px 20px;
            position: relative;
        }
        .header::before {
            content: "💎";
            position: absolute;
            top: 10px;
            left: 20px;
            font-size: 20px;
        }
        .header::after {
            content: "✨";
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.8;
        }
        .custom-badge {
            background-color: #e74c3c;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            color: #d4af37;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 2px solid #f8f9fa;
            padding-bottom: 5px;
            display: flex;
            align-items: center;
        }
        .section h2::before {
            content: "🔶";
            margin-right: 10px;
        }
        .customer-info {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #d4af37;
        }
        .info-row {
            display: flex;
            margin-bottom: 12px;
            align-items: center;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-label {
            font-weight: bold;
            color: #2c3e50;
            min-width: 120px;
            margin-right: 15px;
        }
        .info-value {
            color: #555;
            flex: 1;
        }
        .required-field {
            color: #e74c3c;
            font-weight: bold;
        }
        .stone-highlight {
            background: linear-gradient(135deg, #fff5f5, #ffeaa7);
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #d4af37;
            margin-top: 10px;
            text-align: center;
        }
        .stone-type {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .message-box {
            background-color: #fff;
            border: 2px solid #d4af37;
            border-radius: 8px;
            padding: 20px;
            margin-top: 15px;
            position: relative;
        }
        .message-box::before {
            content: "💬";
            position: absolute;
            top: -10px;
            left: 15px;
            background: white;
            padding: 0 5px;
            font-size: 16px;
        }
        .message-content {
            font-style: italic;
            color: #555;
            line-height: 1.7;
            margin-top: 10px;
        }
        .priority-actions {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .priority-actions h3 {
            margin: 0 0 15px 0;
            color: #d4af37;
            font-size: 16px;
        }
        .action-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .action-btn {
            background-color: #d4af37;
            color: #2c3e50;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
        }
        .footer {
            background-color: #2c3e50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 12px;
        }
        .footer a {
            color: #d4af37;
            text-decoration: none;
        }
        .timestamp {
            color: #888;
            font-size: 12px;
            text-align: right;
            margin-top: 20px;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
        }
        .custom-note {
            background: linear-gradient(135deg, #fff9c4, #f39c12);
            color: #2c3e50;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #f39c12;
        }
        .custom-note strong {
            color: #d35400;
        }
        @media (max-width: 600px) {
            .info-row {
                flex-direction: column;
                align-items: flex-start;
            }
            .info-label {
                margin-bottom: 5px;
            }
            .action-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>CULLEN</h1>
            <p>Bespoke Jewelry & Custom Craftsmanship</p>
            <div class="custom-badge">Custom Jewelry Inquiry</div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Customer Information</h2>
                <div class="customer-info">
                    <div class="info-row">
                        <span class="info-label">First Name:</span>
                        <span class="info-value required-field">${firstName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Last Name:</span>
                        <span class="info-value required-field">${lastName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${email}</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Custom Design Requirements</h2>
                <div class="stone-highlight">
                    <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Requested Centre Stone Type:</div>
                    <div class="stone-type required-field">${centreStoneType}</div>
                </div>
            </div>
            
            <div class="section">
                <h2>Design Vision & Requirements</h2>
                <div class="message-box">
                    <div class="message-content">
                        "${message}"
                    </div>
                </div>
            </div>
            
            <div class="priority-actions">
                <h3>⚡ Priority Actions Required</h3>
                <div class="action-buttons">
                    <a href="mailto:${email}" class="action-btn">Reply to Customer</a>
                    <a href="call:${phone}" class="action-btn">Schedule Consultation</a>
                    
                </div>
            </div>
            
            <div class="custom-note">
                <strong>Custom Jewelry Process:</strong> This inquiry requires personalized attention. Please respond within 24 hours to maintain our premium service standards. Consider scheduling a consultation to discuss design details, timeline, and pricing.
            </div>
            
            <div class="timestamp">
                Received: ${new Date().toLocaleString()}
            </div>
        </div>
        
        <div class="footer">
            <p>🎨 Custom Jewelry Inquiry - CULLEN Bespoke Services</p>
            <p>Transform dreams into diamonds. Every piece tells a story.</p>
            <p><a href="mailto:${email}">Contact Customer</a> | <a href="#">View Design Gallery</a></p>
        </div>
    </div>
</body>
</html>`;
};
