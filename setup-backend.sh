#!/bin/bash

# KeepMyCert Vercel Backend Integration Setup
# This script prepares your frontend for Vercel-native backend services

set -e

echo "🚀 Setting up KeepMyCert for Vercel Backend Integration..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from your project root directory"
    exit 1
fi

# 1. Install core dependencies
echo "📦 Installing backend integration dependencies..."
npm install @auth/prisma-adapter @prisma/client prisma
npm install next-auth@beta
npm install @vercel/postgres @vercel/blob
npm install resend
npm install stripe @stripe/stripe-js
npm install zod bcryptjs
npm install @radix-ui/react-toast
npm install date-fns
npm install csv-parse

# Dev dependencies
npm install -D @types/bcryptjs

echo "✅ Dependencies installed"

# 2. Create directory structure
echo "📂 Creating directory structure..."
mkdir -p src/lib/auth
mkdir -p src/lib/db
mkdir -p src/lib/email
mkdir -p src/lib/storage
mkdir -p src/lib/payments
mkdir -p src/lib/services
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/api/certifications
mkdir -p src/app/api/uploads
mkdir -p src/app/api/webhooks
mkdir -p src/app/api/jobs
mkdir -p src/app/api/admin
mkdir -p prisma
mkdir -p src/types

echo "✅ Directory structure created"

# 3. Create environment variables template
echo "🔐 Creating environment variables template..."
cat > .env.local.example << 'EOF'
# Database (Vercel Postgres/Neon)
DATABASE_URL="postgres://neondb_owner:npg_ZTC0Q1dGFWtc@ep-plain-frog-adk2appv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL="postgres://neondb_owner:npg_ZTC0Q1dGFWtc@ep-plain-frog-adk2appv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Authentication (NextAuth)
NEXTAUTH_URL="https://keepmycert.vercel.app/api/auth/login"
NEXTAUTH_SECRET="ylQzTfQzqUfJqWscYMttofFzxRPFPpbvT3x2Vdg3nIP9Twfk1jvR2BQfdIy1lFLL"

# OAuth Providers
GOOGLE_CLIENT_ID="712693903461-vaep4j2pnkre3bq3fv6kj2smsrc91ahm.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=""

# Email (Resend)
RESEND_API_KEY="re_5Jbeq1C3_HvbLDMsp9FTPaXCdb5Y6CwEe"
EMAIL_FROM="info@detachedsolution.us"
EMAIL_REPLY_TO="info@detachedsolution.us

# Stripe
STRIPE_SECRET_KEY="sk_test_51RfSXfPepyI5TpkddAXGIMwEVw5iDigiqZWgFxzeG9MZI6uYsFtvUUCPEYeDPy5bEnkLAAhReBQ3jLtjC6Uro6b400zO34LHNq"
STRIPE_PUBLISHABLE_KEY="pk_test_51RfSXfPepyI5TpkdRSmqzCeH4vmfWn2yNREHnAErFle87h4Jgs6G5vjsLbu2bQnFOXd6jEs9QPJdsnS2zX2lrYp400KmKnwiai"
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID_PRO=""

# Vercel KV (optional for rate limiting)
KV_URL=""
KV_REST_API_URL=""
KV_REST_API_TOKEN=""
KV_REST_API_READ_ONLY_TOKEN=""

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Feature Flags
ENABLE_AI_FEATURES="false"
ENABLE_TEAM_FEATURES="false"
EOF

echo "✅ Environment template created"

# 4. Generate NextAuth secret if not exists
if [ ! -f ".env.local" ]; then
    echo "🔑 Generating NextAuth secret..."
    SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=\"$SECRET\"" > .env.local
    echo "✅ NextAuth secret generated in .env.local"
else
    echo "ℹ️  .env.local already exists, skipping secret generation"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.local.example to .env.local and fill in your values"
echo "2. Set up your Vercel project: vercel link"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Run database migrations: npm run db:push"
echo "5. Start development: npm run dev"
EOF