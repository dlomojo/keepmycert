// src/lib/email.ts
// Basic email service utility

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  // For development, just log the email
  if (process.env.NODE_ENV !== 'production') {
    console.log('Sending email:', { to, subject, text: text || html });
    return { success: true };
  }

  try {
    // Implementation will depend on your email provider
    // Example with a generic fetch request:
    const response = await fetch(`${process.env.EMAIL_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '')
      })
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

const emailService = {
  sendEmail
};

export default emailService;