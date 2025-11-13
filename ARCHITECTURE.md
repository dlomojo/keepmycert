# 🏗️ KeepMyCert - Complete Architecture & Infrastructure Guide

## 🎯 **Project Overview**
AI-powered IT certification management platform with freemium SaaS model, built for scalability and enterprise readiness.

---

## 🏛️ **Architecture Stack**

### **Frontend Framework**
- **Next.js 15** (App Router) - React-based full-stack framework
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling with responsive design
- **shadcn/ui** - Component library for consistent UI

### **Backend Infrastructure**
- **Serverless Functions** - Next.js API routes on Vercel Edge
- **Supabase PostgREST** - Data access layer via service role key
- **Supabase PostgreSQL** - Hosted Postgres with storage + auth primitives

### **Authentication & Security**
- **Auth0** - Enterprise-grade authentication service
- **JWT Sessions** - Secure user session management
- **RBAC** - Role-based access control (Free/Pro/Team)

### **External Services**
- **Resend** - Transactional email delivery
- **Stripe** - Payment processing (ready for integration)
- **Vercel Blob** - File storage (certificates, attachments)

---

## 🔄 **User Flow & Authentication**

### **1. Landing Page Experience**
```
User visits https://keepmycert.vercel.app
├── Hero section with AI value proposition
├── Feature showcase with plan-based gates
├── Pricing section (Free/Pro/Team)
└── Call-to-action buttons
```

### **2. Authentication Flow**
```
Click "Sign Up" → Auth0 Universal Login
├── User creates account or logs in
├── Auth0 callback: /api/auth/callback
├── User creation in Supabase (REST API)
├── Session establishment
└── Redirect to dashboard based on plan
```

### **3. Dashboard Routing Logic**
```
/dashboard (main route)
├── Check user authentication
├── Determine user plan (FREE/PRO/TEAM)
├── Route to appropriate dashboard:
    ├── FREE → /dashboard/free
    ├── PRO → /dashboard/pro
    └── TEAM → /team
```

---

## 🗄️ **Database Schema & Data Flow**

### **Core Tables**
```sql
User {
  id: String (Primary Key)
  email: String (Unique)
  name: String
  plan: Enum (FREE|PRO|TEAM)
  timezone: String
  createdAt: DateTime
}

Certification {
  id: String (Primary Key)
  ownerUserId: String (Foreign Key)
  title: String
  vendor: String
  issueDate: DateTime
  expiresOn: DateTime
  status: Enum (ACTIVE|EXPIRED|EXPIRING_SOON)
  attachmentUrl: String (Optional)
}

Team {
  id: String (Primary Key)
  name: String
  ownerId: String (Foreign Key)
}

TeamMember {
  id: String (Primary Key)
  teamId: String (Foreign Key)
  userId: String (Foreign Key)
  role: Enum (MANAGER|MEMBER)
}
```

### **Data Flow Pattern**
```
Client Request → Next.js API Route → Supabase REST client → Supabase Postgres
                      ↓
              Feature Gate Check (Plan Limits)
                      ↓
              Response with Plan-Appropriate Data
```

---

## 🚀 **Build & Deployment Pipeline**

### **Local Development**
```bash
# Environment Setup
npm install

# Development Server
npm run dev  # Runs on localhost:3000
```

### **Production Build Process**
```
1. Code Push to GitHub
2. Vercel Auto-Deploy Trigger
3. Build Process:
   ├── npm install (dependencies)
   ├── npm run build (Next.js optimization)
   ├── TypeScript compilation
   ├── ESLint validation
   └── Static page generation
4. Edge Deployment (Global CDN)
5. Environment Variable Injection
```

### **Build Configuration**
```javascript
// next.config.js
{
  experimental: { externalDir: true },
  serverless: true,
  edge: true
}

// vercel.json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 9 * * *"  // Daily at 9 AM
  }]
}
```

---

## 🔐 **Security & Environment Management**

### **Environment Variables (Production)**
```bash
# Authentication
AUTH0_SECRET=<generated-secret>
AUTH0_BASE_URL=https://keepmycert.vercel.app
AUTH0_ISSUER_BASE_URL=https://dev-ot2xb43hbx5ckhg0.us.auth0.com
AUTH0_CLIENT_ID=U3k2BBTw1efuEPiFfJspjkXP6Ytlu3Oh
AUTH0_CLIENT_SECRET=<auth0-secret>

# Supabase
SUPABASE_URL=<supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_STORAGE_BUCKET=certifications

# External Services
RESEND_API_KEY=<resend-key>
STRIPE_SECRET_KEY=<stripe-key>
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>

# Application
APP_URL=https://keepmycert.vercel.app
CRON_TOKEN=<secure-random-token>
```

### **Security Features**
- **Server-Only Imports** - Sensitive operations isolated
- **Plan-Based Access Control** - Feature gates enforced server-side
- **CSRF Protection** - Built into Next.js API routes
- **SQL Injection Prevention** - Supabase REST parameter binding
- **Session Security** - Auth0 enterprise-grade tokens

---

## 📊 **Feature Gate System**

### **Plan Limits Enforcement**
```typescript
// Server-side enforcement
const PLAN_LIMITS = {
  FREE: { maxCertifications: 3, hasAIInsights: false },
  PRO: { maxCertifications: Infinity, hasAIInsights: true },
  TEAM: { maxCertifications: Infinity, hasTeamManagement: true }
}

// API Route Protection
if (user.plan === 'FREE' && certCount >= 3) {
  return NextResponse.json(
    { error: 'UPGRADE_REQUIRED' }, 
    { status: 403 }
  );
}
```

### **UI Feature Gates**
```typescript
// Component-level restrictions
{canAccessFeature(user.plan, 'hasAIInsights') ? (
  <AIInsightsPanel />
) : (
  <UpgradePrompt feature="AI Insights" />
)}
```

---

## 🔄 **API Architecture**

### **Core API Routes**
```
/api/auth/[...auth0]     # Auth0 callback handler
/api/certs               # Certification CRUD operations
/api/export/csv          # Data export (Pro+ only)
/api/export/ics          # Calendar export (Pro+ only)
/api/checkout            # Stripe payment processing
/api/cron/reminders      # Automated email reminders
/api/verify-military     # ID.me military verification
```

### **Request/Response Pattern**
```typescript
// Typical API Route Structure
export async function POST(req: Request) {
  // 1. Authentication check
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  
  // 2. Plan-based authorization
  if (!canAccessFeature(user.plan, 'feature')) {
    return upgradeRequired();
  }
  
  // 3. Business logic
  const result = await processRequest(data);
  
  // 4. Response
  return NextResponse.json(result);
}
```

---

## 📧 **Automated Systems**

### **Email Reminder System**
```
Vercel Cron Job (Daily 9 AM)
├── Query users with expiring certificates
├── Plan-based reminder frequency:
    ├── FREE: 30, 7 days before expiration
    └── PRO/TEAM: 30, 14, 7, 1 days before
├── Generate personalized HTML emails
└── Send via Resend API
```

### **User Onboarding Flow**
```
New User Registration
├── Auth0 account creation
├── Webhook to create local user record
├── Default plan assignment (FREE)
├── Welcome email (optional)
└── Dashboard redirect with onboarding tour
```

---

## 🎯 **Performance Optimizations**

### **Frontend Optimizations**
- **Static Site Generation** - Pre-rendered landing pages
- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Next.js automatic optimization
- **Edge Caching** - Vercel global CDN

### **Backend Optimizations**
- **Supabase Connection Reuse** - REST calls via service role key
- **Serverless Functions** - Auto-scaling compute
- **Database Indexing** - Optimized queries on user/cert lookups
- **Caching Strategy** - Static content caching

### **Bundle Analysis**
```
Route Sizes (Optimized):
├── Landing page: 116KB first load
├── Dashboard routes: 103KB first load
├── API routes: 99.8KB each
└── Shared chunks: 99.7KB
```

---

## 🔄 **Development Workflow**

### **Local Development Setup**
```bash
1. Clone repository
2. Install dependencies: npm install
3. Setup environment: cp .env.example .env.local
4. Provision Supabase tables & storage
5. Start development: npm run dev
```

### **Deployment Process**
```bash
# Automatic deployment
git push origin main → Vercel auto-deploy

# Manual deployment
vercel --prod

# Environment sync
vercel env pull .env.local
```

### **Testing Strategy**
- **TypeScript Compilation** - Build-time type checking
- **ESLint** - Code quality enforcement
- **Supabase Row-Level Policies** - Enforce access control
- **Auth0 Integration Testing** - Authentication flow validation

---

## 📈 **Scalability Considerations**

### **Current Architecture Limits**
- **Vercel Functions**: 10s timeout, 50MB memory
- **Database**: Supabase auto-scaling Postgres
- **File Storage**: Vercel Blob unlimited
- **Email**: Resend 100 emails/day (free tier)

### **Scaling Path**
```
Phase 1: Current (0-1K users)
├── Vercel serverless functions
├── Supabase free tier
└── Basic monitoring

Phase 2: Growth (1K-10K users)
├── Supabase Pro tier (increased throughput)
├── Resend Pro (higher limits)
├── Advanced monitoring (Sentry)
└── CDN optimization

Phase 3: Enterprise (10K+ users)
├── Dedicated database instances
├── Microservices architecture
├── Advanced caching (Redis)
└── Multi-region deployment
```

---

## 🎯 **Business Logic Flow**

### **Certification Management**
```
Upload Certificate
├── AI document parsing (OCR + NLP)
├── Data extraction and validation
├── Plan limit enforcement
├── Database storage
├── Automatic expiration calculation
└── Reminder scheduling
```

### **Upgrade Flow**
```
User hits plan limit
├── Upgrade prompt with clear benefits
├── Stripe checkout session
├── Payment processing
├── Plan upgrade in database
├── Feature unlock
└── Confirmation email
```

This architecture provides a solid foundation for a scalable SaaS platform with clear separation of concerns, robust security, and efficient development workflows.