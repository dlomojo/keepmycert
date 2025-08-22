// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db/db';
import { sendEmail } from '@/lib/email/email';

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validationResult = signupSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    const { name, email, password } = validationResult.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        plan: 'free',
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true,
      },
    });
    
    // Log signup event
    await prisma.eventAudit.create({
      data: {
        userId: user.id,
        type: 'user_signup',
        payload: {
          email: user.email,
          method: 'credentials',
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(error => {
      console.error('Failed to send welcome email:', error);
      // Don't fail the signup if email fails
    });
    
    // Return success response
    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
        },
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific database errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to create account. Please try again.',
        ...(process.env.NODE_ENV === 'development' && { 
          debug: error.message 
        })
      },
      { status: 500 }
    );
  }
}

// Send welcome email function
async function sendWelcomeEmail(email: string, name: string | null) {
  const welcomeTemplate = {
    subject: 'Welcome to KeepMyCert! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
              color: white;
              padding: 30px;
              border-radius: 12px 12px 0 0;
              text-align: center;
            }
            .logo {
              display: inline-block;
              background: white;
              color: #3b82f6;
              padding: 10px 15px;
              border-radius: 8px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-radius: 0 0 12px 12px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: 500;
            }
            .feature {
              display: flex;
              align-items: start;
              margin: 15px 0;
            }
            .feature-icon {
              width: 24px;
              height: 24px;
              margin-right: 12px;
              color: #10b981;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              padding: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🛡️ KeepMyCert</div>
            <h1 style="margin: 0; font-size: 28px;">Welcome to KeepMyCert!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.95;">Your AI-powered IT certification tracker</p>
          </div>
          
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            
            <p>Thank you for joining KeepMyCert! We're excited to help you manage your IT certifications and never miss a renewal again.</p>
            
            <h3 style="color: #1f2937; margin-top: 25px;">🚀 Get Started in 3 Easy Steps:</h3>
            <ol style="padding-left: 20px;">
              <li><strong>Add Your First Certification</strong><br>
                Upload a PDF or manually enter your certification details
              </li>
              <li><strong>Set Up Reminders</strong><br>
                Choose when you want to be notified (90, 60, 30, 15, 7, or 1 day before expiry)
              </li>
              <li><strong>Relax & Focus</strong><br>
                We'll handle the tracking while you focus on your career
              </li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                Go to Your Dashboard →
              </a>
            </div>
            
            <h3 style="color: #1f2937;">✨ Your Free Plan Includes:</h3>
            <ul>
              <li>✓ Track certifications from up to 3 vendors</li>
              <li>✓ AI-powered certificate parsing</li>
              <li>✓ Email renewal reminders</li>
              <li>✓ Secure file storage</li>
              <li>✓ Mobile-friendly dashboard</li>
            </ul>
            
            <p style="background: #fef3c7; padding: 12px; border-radius: 6px; margin-top: 20px;">
              <strong>💡 Pro Tip:</strong> Upload your certificate PDFs for automatic parsing - our AI will extract all the details for you!
            </p>
            
            <h3 style="color: #1f2937;">Need Help?</h3>
            <p>We're here to help! Check out our:</p>
            <ul>
              <li>📚 <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #3b82f6;">Help Center</a></li>
              <li>📧 <a href="mailto:support@keepmycert.com" style="color: #3b82f6;">Email Support</a></li>
              <li>💬 <a href="${process.env.NEXT_PUBLIC_APP_URL}/community" style="color: #3b82f6;">Community Forum</a></li>
            </ul>
          </div>
          
          <div class="footer">
            <p style="margin: 5px 0;">© 2024 KeepMyCert by Detached Solutions LLC</p>
            <p style="margin: 5px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280; margin: 0 10px;">Privacy Policy</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #6b7280; margin: 0 10px;">Terms of Service</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #6b7280; margin: 0 10px;">Unsubscribe</a>
            </p>
            <p style="margin: 15px 0 0 0; font-size: 11px;">
              You're receiving this email because you signed up for KeepMyCert.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to KeepMyCert!

Hi ${name || 'there'},

Thank you for joining KeepMyCert! We're excited to help you manage your IT certifications and never miss a renewal again.

Get Started in 3 Easy Steps:
1. Add Your First Certification - Upload a PDF or manually enter your certification details
2. Set Up Reminders - Choose when you want to be notified
3. Relax & Focus - We'll handle the tracking while you focus on your career

Your Free Plan Includes:
- Track certifications from up to 3 vendors
- AI-powered certificate parsing
- Email renewal reminders
- Secure file storage
- Mobile-friendly dashboard

Go to Your Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Need Help?
- Help Center: ${process.env.NEXT_PUBLIC_APP_URL}/help
- Email Support: support@keepmycert.com
- Community Forum: ${process.env.NEXT_PUBLIC_APP_URL}/community

Best regards,
The KeepMyCert Team

© 2025 KeepMyCert by Detached Solutions LLC
    `.trim()
  };
  
  await sendEmail({
    to: email,
    ...welcomeTemplate
  });
}

// OPTIONS method for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}