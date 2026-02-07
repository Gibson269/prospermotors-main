@echo off
REM Admin User Setup & Verification Script for Windows
REM This script helps verify and troubleshoot admin authentication setup

echo.
echo ==========================================
echo Prosperous Motors - Admin Setup Verification
echo ==========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    exit /b 1
)

echo 1. Checking Supabase Configuration...
echo    Opening Supabase Dashboard...
echo.

REM Display instructions
echo 2. Admin Credentials
echo    Email: admin@prosperousmotors.com
echo    Password: *** [hidden for security]
echo.

echo 3. Manual Setup Steps (if user not yet created):
echo.
echo    A. Create Admin User in Supabase:
echo       1. Go to: https://app.supabase.com
echo       2. Sign in and select your project
echo       3. Navigate to: Authentication ^> Users
echo       4. Click: "Add User" button
echo       5. Enter email: admin@prosperousmotors.com
echo       6. Enter password: ChangeMe123!
echo       7. IMPORTANT: UNCHECK "Auto Confirm User Email"
echo       8. Click: "Create User"
echo.

echo    B. Assign Admin Role:
echo       1. In Supabase, go to: SQL Editor
echo       2. Copy and paste this SQL query:
echo.
echo          INSERT INTO public.user_roles (user_id, role)
echo          SELECT id, 'admin'::app_role FROM auth.users
echo          WHERE email = 'admin@prosperousmotors.com'
echo          ON CONFLICT (user_id, role) DO NOTHING;
echo.
echo       3. Then run this verification query:
echo.
echo          SELECT u.email, ur.role FROM auth.users u
echo          LEFT JOIN public.user_roles ur ON u.id = ur.user_id
echo          WHERE u.email = 'admin@prosperousmotors.com';
echo.
echo       4. Should see: admin@prosperousmotors.com | admin
echo.

echo    C. Test the Login:
echo       1. Start dev server: npm run dev
echo       2. Go to: http://localhost:5173/admin
echo       3. Enter email: admin@prosperousmotors.com
echo       4. Enter password: ChangeMe123!
echo       5. Click "Sign In"
echo.

echo ==========================================
echo TROUBLESHOOTING
echo ==========================================
echo.

echo [ERROR] Login says "Invalid credentials"
echo SOLUTION:
echo  - Verify user exists in Supabase Auth ^> Users list
echo  - Email must match EXACTLY (case-sensitive for some systems)
echo  - Password must be exactly: ChangeMe123!
echo  - User email must NOT have leading/trailing spaces
echo.

echo [ERROR] Login succeeds but shows "Access Denied"
echo SOLUTION:
echo  - Admin role was not assigned
echo  - Go to SQL Editor and run the INSERT query above
echo  - Run the SELECT query to verify role shows as "admin"
echo.

echo [ERROR] Cannot create user in Supabase
echo SOLUTION:
echo  - User may already exist (check Auth Users list first)
echo  - Check if email format is valid
echo  - Check project doesn't have email restrictions
echo.

echo ==========================================
echo QUICK LINKS
echo ==========================================
echo.
echo Documentation:
echo  - ADMIN_TESTING.md (comprehensive testing guide)
echo  - ADMIN_AUTH.md (full documentation)
echo  - QUICK_REFERENCE.md (quick lookup guide)
echo.
echo Open Supabase Dashboard:
echo  - https://app.supabase.com
echo.

pause
