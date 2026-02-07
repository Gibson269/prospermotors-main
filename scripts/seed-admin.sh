#!/bin/bash

# Seed Admin User Script
# This script creates a default admin user in Supabase
# Usage: bash scripts/seed-admin.sh

set -e

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Error: .env file not found"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check required variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_PROJECT_ID" ]; then
  echo "Error: Missing Supabase configuration in .env"
  exit 1
fi

ADMIN_EMAIL="${VITE_ADMIN_EMAIL:-admin@prosperousmotors.com}"
ADMIN_PASSWORD="${VITE_ADMIN_PASSWORD:-ChangeMe123!}"
PROJECT_ID="${VITE_SUPABASE_PROJECT_ID}"

echo "🔐 Seeding admin user..."
echo "Email: $ADMIN_EMAIL"
echo ""

# Using Supabase CLI to seed the user
# Note: This requires supabase CLI to be installed: npm install -g supabase
supabase seed run --seed-file ./supabase/seed.sql 2>/dev/null || {
  echo "⚠️  Supabase CLI not available. Please use the following approach:"
  echo ""
  echo "1. Go to Supabase Dashboard: https://app.supabase.com"
  echo "2. Select your project: $PROJECT_ID"
  echo "3. Go to Authentication > Users"
  echo "4. Click 'Add User'"
  echo "5. Enter email: $ADMIN_EMAIL"
  echo "6. Enter password: $ADMIN_PASSWORD"
  echo "7. Uncheck 'Auto Confirm User Email'"
  echo "8. Click 'Create User'"
  echo ""
  echo "9. Then go to SQL Editor and run:"
  echo "   INSERT INTO public.user_roles (user_id, role)"
  echo "   SELECT id, 'admin' FROM auth.users"
  echo "   WHERE email = '$ADMIN_EMAIL'"
  echo "   ON CONFLICT (user_id, role) DO NOTHING;"
  echo ""
  exit 1
}

echo "✅ Admin user seeded successfully!"
echo ""
echo "Admin credentials:"
echo "Email: $ADMIN_EMAIL"
echo "Password: $ADMIN_PASSWORD"
echo ""
echo "⚠️  IMPORTANT: Change the admin password in production!"
