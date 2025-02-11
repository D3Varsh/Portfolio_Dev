const sgMail = require('@sendgrid/mail');
require('dotenv').config();  // Ensure .env is loaded properly

exports.handler = async (event) => {
  // Make sure the environment is properly loaded in production
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  // Load SendGrid API key from environment variables
  const SENDGRID_API_KEY = process.env.SEND_GRID_API;
  
  // Validate that the SendGrid API key is available
  if (!SENDGRID_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SendGrid API key is missing.' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
  
  // Set up the SendGrid API client with the API key
  sgMail.setApiKey(SENDGRID_API_KEY);

  // Ensure it's a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  try {
    // Parse the incoming JSON data
    const data = JSON.parse(event.body);

    // Destructure the required fields from the incoming data
    const { name, phone, email, subject, message } = data;

    // Validate required fields
    if (!name || !phone || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    // Fallback if the email provided is not valid
    const fromEmail = email && email.includes('@') ? email : 'no-reply@yourdomain.com';  // Replace with a valid fallback email

    // Create the email message object
    const msg = {
      to: ['devarsh4455@gmail.com'],  // Replace with the actual recipient email addresses
      from: {
        email: fromEmail,  // Use the sender's email or fallback to a no-reply email
        name: 'Contact Form',
      },
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // Send the email using SendGrid API
    await sgMail.send(msg);

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    // Handle any error during the process
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
