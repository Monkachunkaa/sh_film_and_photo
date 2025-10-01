/**
 * Netlify Serverless Function: Contact Form Handler
 * 
 * This function handles contact form submissions for Sanford and Hun Film and Photography.
 * It uses AWS SES (Simple Email Service) to send form submissions to the business email.
 * 
 * Environment Variables Required (set in Netlify dashboard):
 * - SHFILM_AWS_SES_ACCESS_KEY: AWS IAM access key with SES permissions
 * - SHFILM_AWS_SES_SECRET_KEY: AWS IAM secret key
 * - SHFILM_AWS_SES_REGION: AWS region (e.g., us-east-2)
 * 
 * Form Fields Expected:
 * - name: Client's full name
 * - email: Client's email address
 * - phone: Client's phone number (optional)
 * - message: Message from the client
 */

const AWS = require('aws-sdk');

/**
 * Main handler function for the Netlify serverless function
 * @param {Object} event - The event object containing request data
 * @returns {Object} Response object with status code and body
 */
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the form data from the request body
    const formData = JSON.parse(event.body);
    
    // Validate required fields (phone is optional)
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields', 
          fields: missingFields 
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Configure AWS SES
    AWS.config.update({
      accessKeyId: process.env.SHFILM_AWS_SES_ACCESS_KEY,
      secretAccessKey: process.env.SHFILM_AWS_SES_SECRET_KEY,
      region: process.env.SHFILM_AWS_SES_REGION
    });

    const ses = new AWS.SES({ apiVersion: '2010-12-01' });

    // Build the email HTML template
    const emailHTML = buildEmailTemplate(formData);
    
    // Build the email plain text version (fallback)
    const emailText = buildEmailTextVersion(formData);

    // Configure the email parameters
    const params = {
      Source: 'no-reply@shfilmandphotos.com', // Verified sender email
      Destination: {
        ToAddresses: ['jake@honeybeewebdesign.com'] // Recipient email
      },
      Message: {
        Subject: {
          Data: `New Contact Form Submission - ${formData.name}`,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: emailHTML,
            Charset: 'UTF-8'
          },
          Text: {
            Data: emailText,
            Charset: 'UTF-8'
          }
        }
      },
      // Reply-To address set to the client's email for easy responses
      ReplyToAddresses: [formData.email]
    };

    // Send the email via AWS SES
    await ses.sendEmail(params).promise();

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      })
    };

  } catch (error) {
    // Log the error for debugging
    console.error('Error processing contact form:', error);

    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email', 
        details: error.message 
      })
    };
  }
};

/**
 * Builds a professional HTML email template
 * @param {Object} formData - The form submission data
 * @returns {string} HTML email content
 */
function buildEmailTemplate(formData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #2c3e50;
      color: #ffffff;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 30px -30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .field-group {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .field-group:last-child {
      border-bottom: none;
    }
    .field-label {
      font-weight: bold;
      color: #2c3e50;
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field-value {
      font-size: 16px;
      color: #555;
    }
    .message-content {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #2c3e50;
      margin-top: 10px;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px;">Sanford and Hun Film and Photography</p>
    </div>

    <div class="field-group">
      <span class="field-label">Client Name</span>
      <div class="field-value">${escapeHtml(formData.name)}</div>
    </div>

    <div class="field-group">
      <span class="field-label">Email Address</span>
      <div class="field-value">
        <a href="mailto:${escapeHtml(formData.email)}" style="color: #3498db; text-decoration: none;">
          ${escapeHtml(formData.email)}
        </a>
      </div>
    </div>

    ${formData.phone ? `
    <div class="field-group">
      <span class="field-label">Phone Number</span>
      <div class="field-value">
        <a href="tel:${escapeHtml(formData.phone)}" style="color: #3498db; text-decoration: none;">
          ${escapeHtml(formData.phone)}
        </a>
      </div>
    </div>
    ` : ''}

    <div class="field-group">
      <span class="field-label">Message</span>
      <div class="message-content">
        ${escapeHtml(formData.message).replace(/\n/g, '<br>')}
      </div>
    </div>

    <div class="footer">
      <p>This email was sent from the contact form on shfilmandphotos.com</p>
      <p>You can reply directly to this email to respond to ${escapeHtml(formData.name)}</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Builds a plain text version of the email (fallback for email clients that don't support HTML)
 * @param {Object} formData - The form submission data
 * @returns {string} Plain text email content
 */
function buildEmailTextVersion(formData) {
  let text = `NEW CONTACT FORM SUBMISSION
Sanford and Hun Film and Photography
================================

CLIENT NAME: ${formData.name}

EMAIL: ${formData.email}
`;

  if (formData.phone) {
    text += `\nPHONE: ${formData.phone}`;
  }

  text += `

MESSAGE:
${formData.message}

================================
This email was sent from the contact form on shfilmandphotos.com
You can reply directly to this email to respond to ${formData.name}
`;

  return text;
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
