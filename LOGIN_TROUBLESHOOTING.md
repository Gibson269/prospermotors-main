# Admin Login Troubleshooting Guide

## 🚨 Login Issues - Step by Step

### Issue 1: "Invalid Login Credentials" Error

**Symptoms:**
- Error message: "Invalid email or password. Please try again."
- Cannot login despite entering correct credentials

**Root Causes & Solutions:**

#### Solution A: Admin User Doesn't Exist
1. Go to **Supabase Dashboard** → https://app.supabase.com
2. Select your project
3. Navigate to **Authentication > Users**
4. **Look for email: `admin@prosperousmotors.com`**

**If user is NOT in the list:**
1. Click **"Add User"** button
2. Enter email: `admin@prosperousmotors.com`
3. Enter password: `ChangeMe123!`
4. **IMPORTANT: UNCHECK "Auto Confirm User Email"**
5. Click **"Create User"**

#### Solution B: Email Format Mismatch
1. Check the email you're entering has NO spaces before/after
2. Verify exact spelling: `admin@prosperousmotors.com`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

#### Solution C: User is in "Invited" Status
1. Go to **Authentication > Users**
2. Look for the user status column
3. If status is "Invited" instead of "Active":
   - User email hasn't been confirmed
   - This is why "Uncheck Auto Confirm" matters
   - Delete this user and create a new one WITH auto-confirm option (don't uncheck)

#### Solution D: Multiple Users with Same Email
1. Go to **Authentication > Users**
2. Check if there are duplicate users with your admin email
3. If duplicates exist:
   - Delete all except one
   - Make sure the remaining one is "Active"
   - Try login again

---

### Issue 2: Login Succeeds but Shows "Access Denied"

**Symptoms:**
- Login form accepts credentials
- Page shows "You don't have permission to access the admin dashboard"
- User email appears in sidebar but cannot access content

**Root Cause:** Admin role not assigned in database

**Solution:**

1. Go to **Supabase Dashboard > SQL Editor**

2. First, find your user ID by running:
```sql
SELECT id, email FROM auth.users 
WHERE email = 'admin@prosperousmotors.com';
```

3. Copy the `id` value (it's a long UUID string)

4. Then run this command to assign the admin role:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
```

**Replace `YOUR_USER_ID_HERE` with the ID from step 3**

5. Verify it worked by running:
```sql
SELECT u.email, ur.role FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@prosperousmotors.com';
```

**Expected Result:**
```
email                        | role
-----------------------------|------
admin@prosperousmotors.com   | admin
```

6. Logout and login again
7. You should now see the admin dashboard

---

### Issue 3: "Session Lost" or "Not Authenticated"

**Symptoms:**
- Login works temporarily
- Page refreshes and shows login page again
- Must login repeatedly

**Root Cause:** Session not persisting

**Solutions:**

#### Solution A: Browser Storage Issue
1. Open DevTools (F12)
2. Go to **Application** tab
3. Find **Local Storage**
4. Look for entries starting with `sb-`
5. Delete all `sb-*` entries
6. Close tab completely
7. Go to `http://localhost:5173/admin` in fresh tab
8. Try login again

#### Solution B: Supabase Configuration
1. Go to `.env` file
2. Verify these values are correct:
```
VITE_SUPABASE_URL="https://glehwxqxvcbfozjqtqmd.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
```

3. Check against your actual Supabase project settings
4. If different, update and restart dev server

#### Solution C: Cookies Blocked
1. Check browser privacy settings
2. Make sure cookies are allowed for localhost
3. Try in incognito/private window
4. If works in incognito, clear cache in normal window

---

### Issue 4: Cannot Create User in Supabase

**Symptoms:**
- "Add User" button exists but creates error
- User creation fails
- Error message appears

**Solutions:**

#### Solution A: User Already Exists
1. Check **Authentication > Users** list
2. Search for the email: `admin@prosperousmotors.com`
3. If found, delete it first (if you need to recreate)
4. Then create again

#### Solution B: Email Format Invalid
1. Verify email format is valid: `admin@prosperousmotors.com`
2. No special characters
3. Proper domain format
4. Try a test email first if unsure

#### Solution C: Project Email Restrictions
1. Go to **Project Settings > Auth**
2. Check if email allowlist/blocklist is enabled
3. If yes, add `admin@prosperousmotors.com` to allowlist
4. Try creating user again

---

### Issue 5: Forgot Admin Password

**Solution:**

#### Option A: Reset via Supabase Dashboard
1. Go to **Supabase Dashboard > Authentication > Users**
2. Find the admin user
3. Click the menu (three dots)
4. Click **"Reset Password"**
5. An email will be sent to reset password
6. Follow the email link

#### Option B: Delete and Recreate
1. Go to **Supabase Dashboard > Authentication > Users**
2. Find the admin user
3. Click the menu and **"Delete User"**
4. Create a new user with same email: `admin@prosperousmotors.com`
5. New password: `ChangeMe123!`

---

## 🔍 Diagnostic Checklist

Use this checklist to diagnose your specific issue:

- [ ] Can I access `http://localhost:5173/admin`? (Should show login form)
- [ ] Is the login form displayed?
- [ ] Does email input accept text?
- [ ] Does password input accept text?
- [ ] When I click "Sign In", does anything happen?
- [ ] Do I see an error message? (If yes, what does it say exactly?)
- [ ] After error, can I try again?
- [ ] Does browser DevTools console show any errors? (Press F12)

## 🛠️ Developer Debugging

### Check Console Errors

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for red error messages
4. Check what the error says
5. Common errors:
   - "Cannot read property 'auth' of undefined" → Supabase not loaded
   - "Invalid login credentials" → User doesn't exist
   - "user_roles relation does not exist" → Database schema issue

### Check Network Requests

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Sign In"
4. Look for failed requests (red color)
5. Click on failed request
6. Check **Response** tab for error details

### Check Database

1. Go to **Supabase Dashboard > SQL Editor**
2. Run this to see all auth users:
```sql
SELECT id, email, created_at FROM auth.users;
```

3. Run this to see all roles:
```sql
SELECT user_id, role, created_at FROM public.user_roles;
```

4. Compare the two lists
5. Admin user should appear in both

## 📞 Getting Help

If you're still stuck:

1. **Document the exact error message** you see
2. **Screenshot the error** if helpful
3. **Check Supabase logs**:
   - Go to **Logs** section in Supabase Dashboard
   - Look for auth-related errors
   - Note the error details

4. **Review your setup**:
   - Run the SETUP_ADMIN.bat (Windows) or SETUP_ADMIN.sh (Mac/Linux)
   - Follow all instructions step by step
   - Don't skip any steps

5. **Contact support**:
   - If still issues, check: https://supabase.com/docs
   - Supabase community: https://discord.gg/supabase

## ✅ Successful Login Checklist

You'll know it's working when:

- [x] Can enter email/password on login page
- [x] Click "Sign In" without errors
- [x] Page redirects to `/admin/dashboard`
- [x] See "Dashboard" heading
- [x] See navigation menu (Dashboard, Cars, Orders)
- [x] See admin email in sidebar
- [x] See "Sign Out" button in sidebar
- [x] Page persists after refresh (F5)
- [x] Can navigate between admin pages

## 🎯 Quick Start (Do This First)

1. **Never done this before?** Follow this exactly:
   1. Start dev server: `npm run dev`
   2. Go to: `http://localhost:5173/admin`
   3. See login form? ✓ Good!
   4. Go to: https://app.supabase.com
   5. Select your project
   6. Click: **Authentication > Users**
   7. Click: **Add User**
   8. Email: `admin@prosperousmotors.com`
   9. Password: `ChangeMe123!`
   10. UNCHECK: "Auto Confirm User Email"
   11. Click: **Create User**
   12. Go back to Supabase
   13. Click: **SQL Editor**
   14. Copy this query:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role FROM auth.users
   WHERE email = 'admin@prosperousmotors.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
   15. Paste and run it
   16. Go back to dev server tab
   17. Enter email: `admin@prosperousmotors.com`
   18. Enter password: `ChangeMe123!`
   19. Click: **Sign In**
   20. Should redirect to dashboard! ✓

If it doesn't work after these steps, check the **Diagnostic Checklist** section above.
