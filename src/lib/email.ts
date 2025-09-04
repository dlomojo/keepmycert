import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');

export async function sendReminderEmail(
  to: string, 
  subject: string, 
  html: string
) {
  try {
    await resend.emails.send({
      from: 'KeepMyCert <noreply@keepmycert.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

export function generateReminderHTML(
  userName: string,
  certifications: Array<{ title: string; expiresOn: Date; daysUntil: number }>
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Certification Expiration Reminder</h2>
      <p>Hi ${userName},</p>
      <p>You have certifications expiring soon:</p>
      <ul>
        ${certifications.map(cert => `
          <li>
            <strong>${cert.title}</strong> - 
            Expires ${cert.expiresOn.toDateString()} 
            (${cert.daysUntil} days)
          </li>
        `).join('')}
      </ul>
      <p>Don't forget to renew them to keep your certifications current!</p>
      <p>
        <a href="${process.env.APP_URL}/dashboard" 
           style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Dashboard
        </a>
      </p>
    </div>
  `;
}