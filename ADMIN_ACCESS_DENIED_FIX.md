# Admin Access Denied - Complete Fix Guide

## Problem

You see: **"Access Denied - You don't have permission to access this area"**

This happens when:
1. ❌ Admin user created but role NOT assigned
2. ❌ Role assignment query not run in Supabase
3. ❌ Wrong email used in role query
4. ❌ Session not refreshed after role assignment

## Solution (5 Steps - 10 Minutes)

### Step 1: Verify Admin User Exists

1. Go to: https://app.supabase.com/
2. Login and select your **prospermotors** project
3. Left menu → **Authentication** → **Users**
4. Look for your admin user (default: `admin@prosperousmotors.com`)

**If NOT listed:**
- Click **"Add User"**
- Email: `admin@prosperousmotors.com`
- Password: `ChangeMe123!` (change this later in production)
- UNCHECK: "Auto Confirm User Email"
- Click **Create User**
- Return to Step 2

**If ALREADY listed:**
- Note the exact email address shown
- Move to Step 2

### Step 2: Verify user_roles Table Exists

1. In Supabase Dashboard → **SQL Editor** → **New Query**
2. Paste and run:

```sql
-- Check if user_roles table exists
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'user_roles'
);
```

**If result is `t` (true):**
- Table exists, move to Step 3

**If result is `f` (false):**
- Run this to create table:

```sql
-- Create user_roles table if missing
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "users can read own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

SELECT 'user_roles table created' as status;
```

Then move to Step 3

### Step 3: Assign Admin Role

**IMPORTANT:** Copy the EXACT email from Step 1

In SQL Editor → **New Query**, paste and run:

```sql
-- Assign admin role to user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::text FROM auth.users
WHERE email = 'admin@prosperousmotors.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify it worked
SELECT u.id, u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@prosperousmotors.com';
```

**Result should show:**
| id | email | role |
|---|---|---|
| xxxxx | admin@prosperousmotors.com | admin |

**If no role shown (NULL):**
- Email doesn't match exactly - check spelling
- Try Step 3 again with exact email

### Step 4: Verify RLS Policies Allow Admin

In SQL Editor → **New Query**, run:

```sql
-- Check RLS policies on cars table
SELECT policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'cars'
ORDER BY policyname;
```

**Should show 4 policies:**
1. `cars_delete_policy` - allows authenticated
2. `cars_insert_policy` - allows authenticated  
3. `cars_select_policy` - allows anon and authenticated
4. `cars_update_policy` - allows authenticated

**If policies look wrong**, run this to fix:

```sql
-- Fix RLS policies for cars table
DROP POLICY IF EXISTS "Anyone can view cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can update cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can delete cars" ON public.cars;
DROP POLICY IF EXISTS "cars_delete_policy" ON public.cars;
DROP POLICY IF EXISTS "cars_insert_policy" ON public.cars;
DROP POLICY IF EXISTS "cars_select_policy" ON public.cars;
DROP POLICY IF EXISTS "cars_update_policy" ON public.cars;

-- Disable and re-enable RLS
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create correct policies
CREATE POLICY "cars_select_policy" ON public.cars
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "cars_insert_policy" ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "cars_update_policy" ON public.cars
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "cars_delete_policy" ON public.cars
FOR DELETE
TO authenticated
USING (true);

SELECT 'Policies fixed' as status;
```

### Step 5: Clear Session and Login Again

1. **Close all browser tabs** with your app
2. **Stop dev server** (Ctrl+C in terminal)
3. **Clear browser cache**:
   - Windows: Press `Ctrl+Shift+Delete`
   - Mac: Press `Cmd+Shift+Delete`
   - Select "All time" and click "Clear"
4. **Start dev server again**: `npm run dev`
5. **Go to**: http://localhost:5173/admin/login
6. **Login with**:
   - Email: `admin@prosperousmotors.com`
   - Password: `ChangeMe123!`
7. **Click "Sign In"**

**Now you should see:**
- ✅ Redirects to Admin Dashboard
- ✅ Can access Add Car form
- ✅ Can add, edit, delete cars

## If Still Getting "Access Denied"

### Debug Check 1: Verify Session

1. Open DevTools: `F12`
2. Go to **Console** tab
3. Paste and run:

```javascript
// Check if logged in
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user?.email);
console.log('User ID:', user?.id);

// Check if role is set
const { data: roles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user?.id);
console.log('Roles:', roles);
```

**Expected output:**
```
User: admin@prosperousmotors.com
User ID: xxxxx
Roles: [ { role: 'admin' } ]
```

**If Roles shows empty:**
- Role wasn't assigned properly
- Go back to Step 3 and verify

### Debug Check 2: Check RLS Block

In Console, run:

```javascript
// Try to insert a test car
const { data, error } = await supabase
  .from('cars')
  .insert({
    brand: 'Test',
    model: 'Test',
    year: 2024,
    price: 1000000,
    images: ['https://example.com/test.jpg']
  });

console.log('Insert result:', { data, error });
```

**If error shows "permission denied":**
- RLS policies are blocking
- Run the RLS fix from Step 4

### Debug Check 3: Check Supabase Connection

In Console, run:

```javascript
// Verify Supabase is connected
console.log('Supabase URL:', supabase.supabaseUrl);
const { data: { session } } = await supabase.auth.getSession();
console.log('Session valid:', !!session);
console.log('Session expires:', session?.expires_at);
```

**If session is null:**
- Not logged in properly
- Try logging in again

## Admin User Common Scenarios

### Scenario 1: First Time Setup

**Step-by-step:**
1. ✅ Create user in Auth → Users (Step 1)
2. ✅ Create user_roles table (Step 2)
3. ✅ Assign admin role (Step 3)
4. ✅ Fix RLS policies (Step 4)
5. ✅ Clear cache and login again (Step 5)

### Scenario 2: Wrong Email Used

**Problem:** Used `admin@example.com` but role query uses `admin@prosperousmotors.com`

**Fix:**
1. Check what email is in Auth > Users
2. Copy that EXACT email
3. Run Step 3 with correct email
4. Verify role was assigned

### Scenario 3: Password Changed

**To reset password in Supabase:**
1. Go to: Authentication → Users
2. Click on admin user
3. Click "Reset password" (will send email)
4. Open email reset link
5. Set new password
6. Clear app cache and login again

### Scenario 4: Multiple Admin Users

**To add another admin:**
1. Create user in Auth > Users
2. Run this SQL:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::text FROM auth.users
WHERE email = 'newadmin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

## Production Security Checklist

Before going live:

- [ ] Admin password is STRONG (not default `ChangeMe123!`)
- [ ] Admin email is unique and secure
- [ ] RLS policies only allow authenticated users to modify
- [ ] Service role key is NOT in frontend
- [ ] Regular password rotation policy (90 days)
- [ ] Backup admin account exists
- [ ] Two-factor authentication considered

## Quick Reference

| Issue | Fix |
|-------|-----|
| "Access Denied" | Run Step 3 to assign admin role |
| Can't login | Verify user exists in Auth > Users |
| Login works but still denied | Clear cache and logout/login |
| Can't add cars | Check RLS policies (Step 4) |
| Password forgotten | Click "Reset password" in Auth Users |

## Support

If you're still seeing "Access Denied" after all steps:

1. **Check SQL query results** - verify role shows in query
2. **Check browser console** - look for JavaScript errors
3. **Check Supabase logs** - Settings → Logs for detailed errors
4. **Verify email spelling** - exact match required
5. **Try incognito mode** - eliminates cache issues

---

**Remember:** After assigning role, you may need to logout/login for changes to take effect.
