# Admin User Setup - Step by Step Video Script

## 📹 Complete Setup Process (5 minutes)

### Part 1: Start Development Server (1 min)

**Steps:**
1. Open terminal/command prompt
2. Navigate to project folder: `cd prospermotors-main`
3. Start server: `npm run dev`
4. Wait for message: "Local: http://localhost:5173"
5. Open browser to: `http://localhost:5173/admin`
6. You should see the admin login form

**Expected:**
- Dark login page with "Prosperous Autos Admin Portal" heading
- Email and Password input fields
- "Sign In" button

---

### Part 2: Create Admin User in Supabase (2 mins)

**Steps:**

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com
   - Sign in with your Supabase account
   
2. **Select Your Project**
   - Click on your "prospermotors" project (or similar name)
   - Wait for dashboard to load
   
3. **Navigate to Auth Users**
   - Left sidebar: find "Authentication"
   - Click: "Authentication"
   - Click: "Users" (in the submenu)
   
4. **Create New User**
   - Click button: "Add User" (usually green, top right)
   - Enter email: `admin@prosperousmotors.com`
   - Enter password: `ChangeMe123!`
   - **IMPORTANT**: Find checkbox "Auto Confirm User Email"
   - **IMPORTANT**: UNCHECK this box (leave it unchecked)
   - Click: "Create User"
   
5. **Verify User Created**
   - You should see the new user in the Users list
   - Status should show as something like "Active" or "Just Now"
   - Email should be: `admin@prosperousmotors.com`

**Expected:**
- User appears in Supabase Users list
- Can see email, creation date, and last signed in time
- Status is active/confirmed

---

### Part 3: Assign Admin Role (1.5 mins)

**Steps:**

1. **Go to SQL Editor**
   - Left sidebar: find "SQL Editor" (or "SQL")
   - Click it
   - Wait for editor to load
   
2. **Create New Query**
   - You should see an editor with "SELECT" text
   - Click: "New Query" button (if available)
   - Or clear existing text
   
3. **Copy First Query (Find User ID)**
   - Copy this SQL:
   ```sql
   SELECT id, email FROM auth.users 
   WHERE email = 'admin@prosperousmotors.com';
   ```
   - Paste into SQL editor
   - Click: "Run" button (or Ctrl+Enter)
   - Look at results below
   - Copy the `id` value (long string like: `123e4567-e89b-12d3-a456-426614174000`)
   
4. **Create New Query (Assign Admin Role)**
   - Clear editor or create new query
   - Copy this SQL:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role FROM auth.users
   WHERE email = 'admin@prosperousmotors.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
   - Paste into SQL editor
   - Click: "Run" button
   - Should see: "Rows Affected: 1" or similar success message
   
5. **Verify Admin Role (Bonus Step)**
   - Clear editor or create new query
   - Copy and run this SQL:
   ```sql
   SELECT u.email, ur.role FROM auth.users u
   LEFT JOIN public.user_roles ur ON u.id = ur.user_id
   WHERE u.email = 'admin@prosperousmotors.com';
   ```
   - Should see result:
     - email: `admin@prosperousmotors.com`
     - role: `admin`

**Expected:**
- No error messages
- "Rows Affected: 1" message appears
- Verification query shows role as "admin"

---

### Part 4: Login to Admin Dashboard (1.5 mins)

**Steps:**

1. **Go Back to Login Page**
   - Switch to browser tab with login form
   - Or navigate to: `http://localhost:5173/admin`
   
2. **Enter Credentials**
   - Email field: type `admin@prosperousmotors.com`
   - Password field: type `ChangeMe123!`
   
3. **Click Sign In**
   - Click the blue "Sign In" button
   - Wait for page to load
   
4. **Verify You're Logged In**
   - Page should redirect to: `http://localhost:5173/admin/dashboard`
   - You should see:
     - "Dashboard" heading
     - Cards with "Total Vehicles", "Total Orders", etc.
     - Left sidebar with navigation (Dashboard, Cars, Orders)
     - Top right: user email in sidebar
     - "Sign Out" button in sidebar
   
5. **Test Navigation**
   - Click "Cars" in sidebar → Should load car management
   - Click "Orders" in sidebar → Should load order management
   - Click "Dashboard" in sidebar → Back to dashboard
   
6. **Test Logout**
   - Click "Sign Out" button
   - Should redirect back to login page
   - Try accessing `/admin/dashboard` directly
   - Should redirect to login again ✓

**Expected:**
- Successfully logged into admin dashboard
- Can navigate between pages
- Logout works and redirects to login

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Admin login form displays at `/admin`
- [ ] Admin user appears in Supabase Users list
- [ ] Admin role appears in user_roles table
- [ ] Can login with `admin@prosperousmotors.com` / `ChangeMe123!`
- [ ] Dashboard loads after successful login
- [ ] Navigation menu works (Dashboard, Cars, Orders)
- [ ] User email shows in sidebar
- [ ] Sign Out button visible in sidebar
- [ ] Logout works and redirects to login
- [ ] Session persists after page refresh
- [ ] Cannot access `/admin/dashboard` without logging in

---

## 🆘 Troubleshooting During Setup

### Step 2 Issue: Cannot create user in Supabase
- Check if user already exists (search in Users list)
- If exists, delete it and create again
- Verify email format is correct
- Check project doesn't have email blocklist

### Step 3 Issue: SQL query shows no results
- User may not be created yet (go back to Step 2)
- User email may have extra spaces (check carefully)
- Wait a moment and try again

### Step 4 Issue: Login shows "Invalid Credentials"
- Verify user was created successfully (Step 2)
- Verify admin role was assigned (Step 3)
- Check email/password spelling exactly
- No extra spaces before/after

### Step 4 Issue: Login succeeds but shows "Access Denied"
- Admin role wasn't assigned successfully
- Go back to Step 3 and run SQL queries
- Verify role shows as "admin" in verification query

---

## 📸 Screenshots

### What You Should See - Step 2
[Login form with email/password fields and "Sign In" button]

### What You Should See - Step 3
[Supabase SQL Editor with user_roles table]

### What You Should See - Step 4
[Admin dashboard with cards and sidebar navigation]

---

## 🎯 Success!

Once you see the admin dashboard after login:

✅ Admin authentication is working
✅ Database role assignment is correct
✅ Protected routes are functioning
✅ Session management is active

You can now:
- Manage vehicles (add, edit, delete cars)
- View and manage orders
- Monitor dashboard statistics
- Add other admin users if needed

---

## 📝 Notes

- **Password**: Change `ChangeMe123!` to a strong password in production
- **Email**: Change admin email to your actual email in production
- **Security**: Never share admin credentials
- **Backup**: Store credentials securely (password manager)
- **Access**: Only give admin access to trusted users

---

## 🔗 Quick Links

- Supabase Dashboard: https://app.supabase.com
- Project Documentation: `/ADMIN_AUTH.md`
- Troubleshooting Guide: `/LOGIN_TROUBLESHOOTING.md`
- Quick Reference: `/QUICK_REFERENCE.md`

