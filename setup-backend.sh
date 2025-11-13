#!/bin/bash

# KeepMyCert Supabase Setup Helper
# This script scaffolds the minimal environment required for local development

set -e

if [ ! -f "package.json" ]; then
  echo "❌ Please run this script from the project root"
  exit 1
fi

cat <<'INFO'
🚀 KeepMyCert backend configuration
==================================
The application now uses Supabase for all persistence. No Prisma or Neon
resources are required. Ensure you have created a Supabase project with:
  • A `user_certifications` table for certificate metadata
  • Supporting tables for users, teams, and notifications (see docs)
  • A storage bucket for certification files (default: certifications)

This helper will generate an environment template (.env.local.example)
containing the Supabase secrets required by the app.
INFO

ENV_FILE=".env.local.example"

cat > "$ENV_FILE" <<'ENV'
# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="certifications"

# Auth0
AUTH0_SECRET=""
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://YOUR_TENANT.auth0.com"
AUTH0_CLIENT_ID=""
AUTH0_CLIENT_SECRET=""

# Google Calendar
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:3000/api/calendar/callback"

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_PRO=""
STRIPE_PRICE_TEAM=""

# External APIs
OPENAI_API_KEY=""
NEWSAPI_KEY=""
RESEND_API_KEY=""

# ID.me
IDME_CLIENT_ID=""
IDME_CLIENT_SECRET=""

# App URLs
APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_IDME_CLIENT_ID=""

# Cron
CRON_TOKEN=""
ENV

chmod 600 "$ENV_FILE"

echo "✅ Created $ENV_FILE with Supabase configuration placeholders."
echo "Next steps:"
echo "  1. Copy .env.local.example to .env.local and fill in real values"
echo "  2. Populate Supabase with the required tables"
echo "  3. Run: npm install"
echo "  4. Start development with npm run dev"
