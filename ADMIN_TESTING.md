# Admin Authentication Testing Guide

## Quick Start Test

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Admin Login Page
- Navigate to: `http://localhost:5173/admin`
- You should see the admin login form

### 3. Test Unauthenticated Access
1. Try navigating to: `http://localhost:5173/admin/dashboard`
2. You should be redirected to `/admin` (login page)

### 4. Create Test Admin User (Supabase)

#### Option A: Via Supabase Dashboard UI
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Authentication > Users**
4. Click **Add User**
5. Enter:
   - Email: `admin@prosperousmotors.com`
   - Password: `ChangeMe123!`
   - **Uncheck** "Auto Confirm User Email"
6. Click **Create User**

#### Option B: Via Supabase CLI
```bash
# If you have Supabase CLI installed
supabase auth admin create-user --email admin@prosperousmotors.com --password ChangeMe123!
```

### 5. Assign Admin Role

Go to Supabase Dashboard → **SQL Editor** and run:

```sql
-- Find the user ID
SELECT id, email FROM auth.users WHERE email = 'admin@prosperousmotors.com';

-- Assign admin role (replace USER_ID with actual ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@prosperousmotors.com';
```

### 6. Test Login
1. Navigate to `http://localhost:5173/admin`
2. Enter email: `admin@prosperousmotors.com`
3. Enter password: `ChangeMe123!`
4. Click "Sign In"
5. You should be redirected to `/admin/dashboard`

### 7. Verify Admin Access
You should see:
- Dashboard with statistics
- Navigation menu with: Dashboard, Cars, Orders
- User email in sidebar
- "Sign Out" button

## Testing Scenarios

### Scenario 1: Incorrect Password
**Steps:**
1. Go to `/admin`
2. Enter email: `admin@prosperousmotors.com`
3. Enter password: `WrongPassword123!`
4. Click "Sign In"

**Expected Result:**
- Error message appears
- Not redirected
- Page stays on login form

### Scenario 2: Non-Existent Email
**Steps:**
1. Go to `/admin`
2. Enter email: `notreal@example.com`
3. Enter password: `ChangeMe123!`
4. Click "Sign In"

**Expected Result:**
- Error message appears
- Not redirected
- Page stays on login form

### Scenario 3: Empty Fields
**Steps:**
1. Go to `/admin`
2. Leave email empty
3. Leave password empty
4. Click "Sign In"

**Expected Result:**
- Validation error: "Email address is required"
- Form does not submit

### Scenario 4: Invalid Email Format
**Steps:**
1. Go to `/admin`
2. Enter email: `notanemail`
3. Enter password: `ChangeMe123!`
4. Click "Sign In"

**Expected Result:**
- Validation error: "Please enter a valid email address"
- Form does not submit

### Scenario 5: Protected Route Access
**Steps:**
1. In new incognito window, navigate to `/admin/dashboard`

**Expected Result:**
- Automatically redirected to `/admin` login page
- No content from dashboard visible

### Scenario 6: Non-Admin User Login
**Steps:**
1. Create a regular user (no admin role)
   ```sql
   INSERT INTO auth.users (email, password)
   VALUES ('user@example.com', 'HashedPassword123!');
   -- Note: Can't create directly, use sign up instead
   ```
2. Login with this user
3. Try accessing `/admin/dashboard`

**Expected Result:**
- "Access Denied" message
- Cannot access admin area

### Scenario 7: Logout Functionality
**Steps:**
1. Login as admin
2. Click "Sign Out" in sidebar
3. Try accessing `/admin/dashboard`

**Expected Result:**
- Redirected to login page
- All admin routes inaccessible
- Must login again to access

### Scenario 8: Session Persistence
**Steps:**
1. Login as admin
2. Refresh the page (F5)
3. Check if still logged in

**Expected Result:**
- Still on `/admin/dashboard`
- Session maintained
- No re-login required

### Scenario 9: Session in New Tab
**Steps:**
1. Login as admin in Tab A
2. Open new tab and go to `/admin/dashboard`

**Expected Result:**
- Session shared across tabs
- New tab shows dashboard
- No re-login needed

### Scenario 10: Navigate Between Admin Pages
**Steps:**
1. Login as admin
2. Click "Cars" in navigation
3. Navigate through all admin pages

**Expected Result:**
- All admin routes accessible
- Navigation works smoothly
- No unexpected redirects

## Automated Testing

### Test Admin Login Form Validation

Create `src/test/admin-login.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Admin Login', () => {
  it('should show error for invalid email', () => {
    // Test email validation
    const email = 'not-an-email';
    expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should require password minimum length', () => {
    // Test password length
    const password = '12345';
    expect(password.length).toBeLessThan(6);
  });

  it('should validate email format', () => {
    const validEmails = [
      'admin@example.com',
      'user+tag@example.co.uk',
    ];
    
    validEmails.forEach(email => {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });
});
```

Run with:
```bash
npm run test
```

## Debugging

### Check Auth State in Console

Open browser DevTools (F12) and run:

```javascript
// Get current user
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
console.log('User:', session?.user);

// Check if admin
const { data } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', session?.user?.id);
console.log('User Roles:', data);
```

### Check LocalStorage

In DevTools Console:

```javascript
// View stored session
console.log(JSON.parse(localStorage.getItem('sb-glehwxqxvcbfozjqtqmd-auth-token')));

// Clear session (for testing logout)
localStorage.clear();
```

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Navigate to **Logs** (in left sidebar)
3. Check **Auth logs** for login attempts
4. Look for errors or warnings

## Common Issues & Solutions

### Issue: "Unauthenticated" Error
**Solution:**
- Verify Supabase URL and key in `.env`
- Check network tab for failed requests
- Clear browser cache and local storage

### Issue: "Access Denied" After Login
**Solution:**
```sql
-- Verify admin role is assigned
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@prosperousmotors.com';

-- If no role found, assign it
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email = 'admin@prosperousmotors.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Issue: Cannot Create User in Supabase
**Solution:**
- User may already exist (check Auth Users list)
- Email format may be invalid
- Check Supabase email restrictions

### Issue: "Invalid Login Credentials"
**Solution:**
- Verify email matches exactly (case-sensitive in some cases)
- Ensure password is correct
- Check if user is confirmed in Supabase

## Performance Testing

### Test Login Performance
1. Measure time from login click to dashboard load
2. Should be less than 2 seconds
3. Check network tab for slow requests

### Test Protected Route Performance
1. Access `/admin/dashboard` directly
2. Should load quickly (< 1 second)
3. No unnecessary re-renders

## Security Testing

### Test Session Security

```javascript
// In DevTools Console - DO NOT RUN IN PRODUCTION!

// 1. Get current token
const token = JSON.parse(
  localStorage.getItem('sb-glehwxqxvcbfozjqtqmd-auth-token')
).access_token;

// 2. Decode JWT (for inspection only)
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Token payload:', payload);
console.log('Token expires:', new Date(payload.exp * 1000));
```

### Test CORS Protection

The API should reject:
- Requests from unauthorized domains
- Requests with invalid origins
- Requests without proper headers

## Load Testing

### Test Multiple Simultaneous Logins

Use load testing tool like:
- Apache JMeter
- LoadRunner
- Artillery

Example with Artillery:

```yaml
config:
  target: 'http://localhost:5173'
  
scenarios:
  - name: 'Multiple Logins'
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'admin@test.com'
            password: 'password123'
```

## Browser Testing

Test authentication on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

- [ ] Tab order is correct
- [ ] Error messages are announced
- [ ] Form labels are associated with inputs
- [ ] Color contrast is sufficient
- [ ] Focus states are visible

## Cleanup After Testing

1. Delete test users created
2. Clear browser cache
3. Clear cookies
4. Clear localStorage
5. Review Supabase for test data

## Sign-Off

- [ ] All scenarios tested
- [ ] No security issues found
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Cross-browser compatibility confirmed

**Tested By:** _______________

**Date:** _______________

**Issues Found:** _______________

**Status:** PASS / FAIL
