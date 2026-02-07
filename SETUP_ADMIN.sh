#!/bin/bash

# Admin User Setup & Verification Script
# This script helps verify and troubleshoot admin authentication setup

set -e

echo "=========================================="
echo "Prosperous Motors - Admin Setup Verification"
echo "=========================================="
echo ""

# Check environment file
if [ ! -f ".env" ]; then
  echo "❌ ERROR: .env file not found!"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)

# Verify Supabase configuration
echo "1. Checking Supabase Configuration..."
echo "   Project ID: ${VITE_SUPABASE_PROJECT_ID}"
echo "   URL: ${VITE_SUPABASE_URL}"

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_PROJECT_ID" ]; then
  echo "   ❌ Missing Supabase configuration!"
  exit 1
fi

echo "   ✓ Supabase configured"
echo ""

# Admin credentials info
ADMIN_EMAIL="${VITE_ADMIN_EMAIL:-admin@prosperousmotors.com}"
ADMIN_PASSWORD="${VITE_ADMIN_PASSWORD:-ChangeMe123!}"

echo "2. Admin Credentials"
echo "   Email: $ADMIN_EMAIL"
echo "   Password: *** (hidden for security)"
echo ""

# Instructions
echo "3. Manual Setup Steps (if user not yet created):"
echo ""
echo "   A. Create Admin User in Supabase:"
echo "      1. Go to: https://app.supabase.com"
echo "      2. Select your project: ${VITE_SUPABASE_PROJECT_ID}"
echo "      3. Go to: Authentication > Users"
echo "      4. Click: Add User"
echo "      5. Enter email: $ADMIN_EMAIL"
echo "      6. Enter password: $ADMIN_PASSWORD"
echo "      7. UNCHECK: 'Auto Confirm User Email'"
echo "      8. Click: Create User"
echo ""

echo "   B. Assign Admin Role:"
echo "      1. Go to: SQL Editor in Supabase Dashboard"
echo "      2. Run the following query:"
echo ""
cat << 'EOF'
      INSERT INTO public.user_roles (user_id, role)
      SELECT id, 'admin'::app_role FROM auth.users
      WHERE email = 'admin@prosperousmotors.com'
      ON CONFLICT (user_id, role) DO NOTHING;
      
      -- Verify:
      SELECT u.email, ur.role FROM auth.users u
      LEFT JOIN public.user_roles ur ON u.id = ur.user_id
      WHERE u.email = 'admin@prosperousmotors.com';
EOF
echo ""
echo ""

echo "4. Testing Login:"
echo "   1. Start dev server: npm run dev"
echo "   2. Go to: http://localhost:5173/admin"
echo "   3. Enter email: $ADMIN_EMAIL"
echo "   4. Enter password: $ADMIN_PASSWORD"
echo "   5. Click 'Sign In'"
echo ""

echo "=========================================="
echo "Need Help?"
echo "=========================================="
echo ""
echo "Common Issues:"
echo ""
echo "❓ Login says 'Invalid credentials'"
echo "   → Verify user exists in Supabase Auth > Users"
echo "   → Check email matches EXACTLY"
echo "   → Check password is correct"
echo ""
echo "❓ Login succeeds but shows 'Access Denied'"
echo "   → Admin role not assigned"
echo "   → Run the SQL query above to assign role"
echo "   → Verify query shows role 'admin' in result"
echo ""
echo "❓ Cannot create user in Supabase"
echo "   → User may already exist (check Auth Users list)"
echo "   → Email format must be valid"
echo "   → Project may have email restrictions"
echo ""
echo "✓ For more help, see:"
echo "  - ADMIN_TESTING.md - Testing procedures"
echo "  - ADMIN_AUTH.md - Full documentation"
echo "  - QUICK_REFERENCE.md - Quick lookup"
echo ""
