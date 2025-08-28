# KeepMyCert - Full Stack Version

A complete IT certification tracking platform with authentication, database, and plan-based features.

## Backend Features

### 🔐 Authentication (Auth0)
- User registration and login
- Automatic local user creation
- Session management

### 📊 Plan-Based Features
- **Free**: 3 certifications max, basic reminders
- **Pro**: Unlimited certs, AI insights, export (CSV/ICS), attachments
- **Team**: Everything in Pro + team management, compliance dashboard

### 🗄️ Database (Neon + Prisma)
- User management with plans
- Certification tracking (personal & team)
- Team management with roles
- Subscription tracking

### 📧 Email Notifications (Resend)
- Automated expiration reminders
- Plan-based reminder frequency
- Cron job scheduling via Vercel

### 💳 Billing (Stripe) - Ready for Integration
- Checkout session creation
- Webhook handling for plan updates
- Subscription management

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in:

```bash
# Database (Get from Neon dashboard)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth0 (Create app at auth0.com)
AUTH0_SECRET="use [openssl rand -hex 32]"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"

# Email (Get API key from resend.com)
RESEND_API_KEY="re_..."

# App
APP_URL="http://localhost:3000"
CRON_TOKEN="your-secure-random-token"
```

### 2. Database Setup
```bash
npm install
npx prisma generate
npx prisma db push
```

### 3. Auth0 Configuration
In your Auth0 dashboard:
- Set Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Set Allowed Logout URLs: `http://localhost:3000`
- Set Allowed Web Origins: `http://localhost:3000`

### 4. Run Development Server
```bash
npm run dev
```

## API Endpoints

### Certifications
- `GET /api/certs` - List user certifications
- `POST /api/certs` - Create certification (enforces plan limits)

### Exports (Pro/Team only)
- `GET /api/export/csv` - Export certifications as CSV
- `GET /api/export/ics` - Export as calendar file

### Cron Jobs
- `GET /api/cron/reminders?token=...` - Send reminder emails

## Deployment to Vercel

### 1. Connect Repository
- Push code to GitHub
- Connect repository in Vercel dashboard

### 2. Environment Variables
Add all environment variables from `.env.example` to Vercel project settings.

### 3. Database Migration
The build command automatically runs `prisma migrate deploy`.

### 4. Cron Jobs
Vercel will automatically set up the cron job from `vercel.json`.

## Plan Enforcement

The backend enforces plan limits server-side:

```typescript
// Free plan: max 3 certifications
if (user.plan === 'FREE') {
  const count = await prisma.certification.count({ 
    where: { ownerUserId: user.id } 
  });
  if (count >= 3) {
    return NextResponse.json(
      { error: 'UPGRADE_REQUIRED' },
      { status: 403 }
    );
  }
}
```

## Email Reminders

Automated reminders based on plan:
- **Free**: 30 and 7 days before expiration
- **Pro/Team**: 30, 14, 7, and 1 day before expiration

## Next Steps

1. **Stripe Integration**: Add billing endpoints for upgrades
2. **Team Features**: Complete team invitation system
3. **File Attachments**: Implement with Vercel Blob
4. **AI Features**: Add certification insights for Pro users
5. **SSO**: Enterprise single sign-on for Team plans

## Testing Different Plans

Update the mock data in `src/lib/mock-data.ts` to test different user plans, or create real users through Auth0 and update their plan in the database.