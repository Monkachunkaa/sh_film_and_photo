# Sanford and Hun Film and Photography - Contact Form Setup

This README provides instructions for setting up and testing the contact form with AWS SES and Netlify Functions.

## 📋 Overview

The contact form uses:
- **Netlify Functions** (serverless functions) to handle form submissions
- **AWS SES** (Simple Email Service) to send emails
- **Environment variables** to securely store AWS credentials

## 🚀 Setup Instructions

### 1. Install Dependencies

First, install the required Node.js packages:

```bash
npm install
```

### 2. AWS SES Configuration

The AWS credentials are already configured in the `.env` file for local testing. In production (Netlify), you'll need to add these as environment variables:

**Environment Variables to Add in Netlify Dashboard:**
- `SHFILM_AWS_SES_ACCESS_KEY` = AKIAZNB6L44HX2AMZPO3
- `SHFILM_AWS_SES_SECRET_KEY` = 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
- `SHFILM_AWS_SES_REGION` = us-east-2

### 3. Verify Email Addresses in AWS SES

**IMPORTANT:** Before the contact form will work, you must verify both email addresses in AWS SES:

1. Log into AWS Console
2. Go to Amazon SES (Simple Email Service)
3. Navigate to "Verified Identities"
4. Verify these email addresses:
   - `no-reply@shfilmandphotos.com` (sender)
   - `jake@honeybeewebdesign.com` (recipient)

**Note:** If your AWS SES account is in sandbox mode, you can only send emails to verified addresses. To send to any email address, you'll need to request production access.

### 4. Update Your Contact Form HTML

Make sure your contact form includes these field names:
- `name` - Client's full name
- `email` - Client's email address
- `phone` - Client's phone number
- `eventType` - Type of event (wedding, family, etc.)
- `eventDate` - Date of the event (optional)
- `message` - Client's message

Example form structure:
```html
<form id="contactForm">
  <div id="formStatus"></div>
  
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="tel" name="phone" placeholder="Your Phone" required>
  
  <select name="eventType" required>
    <option value="">Select Event Type</option>
    <option value="Wedding">Wedding</option>
    <option value="Family">Family</option>
    <option value="Other">Other</option>
  </select>
  
  <input type="date" name="eventDate" placeholder="Event Date">
  <textarea name="message" placeholder="Your Message" required></textarea>
  
  <button type="submit">Send Message</button>
</form>

<script src="/js/contact-form-handler.js"></script>
```

## 🧪 Testing Locally

### Using Netlify Dev

To test the function locally with Netlify Dev:

```bash
# Start the Netlify dev server
npm run dev
```

This will:
- Start a local server (usually at http://localhost:8888)
- Load environment variables from `.env`
- Enable you to test the serverless function locally

### Test the Function Directly

You can test the function endpoint directly using curl or Postman:

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-1234",
    "eventType": "Wedding",
    "eventDate": "2025-12-31",
    "message": "This is a test message"
  }'
```

## 📁 File Structure

```
sh_film_and_photo/
├── netlify/
│   └── functions/
│       └── contact-form.js         # Serverless function handling form submissions
├── js/
│   └── contact-form-handler.js     # Frontend JavaScript for form handling
├── .env                             # Environment variables (local testing only)
├── .gitignore                       # Prevents sensitive files from being committed
├── netlify.toml                     # Netlify configuration
├── package.json                     # Node.js dependencies
└── README_CONTACT_FORM.md          # This file
```

## 🔒 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Store credentials in Netlify** - Add environment variables in the Netlify dashboard under Site Settings > Environment Variables
3. **AWS IAM Permissions** - Ensure the AWS IAM user has only `ses:SendEmail` permission (least privilege principle)

## 🎨 Customizing the Email Template

The email template is built directly in the `contact-form.js` function in the `buildEmailTemplate()` function. You can customize:
- Colors and styling
- Layout and structure
- Fields to include/exclude
- Branding elements

## 📧 Email Details

- **From:** no-reply@shfilmandphotos.com
- **To:** jake@honeybeewebdesign.com
- **Reply-To:** Client's email address (for easy responses)
- **Subject:** New Contact Form Submission - [Event Type] - [Client Name]

## 🐛 Troubleshooting

### Form submission fails
1. Check that all environment variables are set correctly
2. Verify both email addresses in AWS SES
3. Check AWS SES sending limits (sandbox mode has restrictions)
4. Review browser console for JavaScript errors
5. Check Netlify function logs in the Netlify dashboard

### Emails not arriving
1. Check spam/junk folder
2. Verify recipient email in AWS SES
3. Ensure AWS SES account is not in sandbox mode (or recipient is verified)
4. Check AWS SES sending statistics in AWS Console

### Local testing issues
1. Ensure `.env` file exists and has correct values
2. Run `npm install` to install dependencies
3. Use `netlify dev` instead of a standard local server
4. Check that port 8888 is not in use by another application

## 📞 Support

For issues or questions, contact:
- **Developer:** Honeybee Web Design
- **Email:** jake@honeybeewebdesign.com

## ✅ Deployment Checklist

Before deploying to production:
- [ ] AWS SES email addresses verified
- [ ] Environment variables added to Netlify
- [ ] `.env` file in `.gitignore`
- [ ] Contact form HTML has correct field names
- [ ] Form handler JavaScript included on contact page
- [ ] Tested locally with `netlify dev`
- [ ] Tested form submission end-to-end
- [ ] Verified emails are being received
