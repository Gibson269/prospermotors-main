# Admin Authentication System

This document outlines the secure admin authentication system implemented for Prosperous Motors.

## Overview

The admin authentication system uses:
- **Supabase Auth** for session management (JWT tokens)
- **Email + Password** authentication
- **Role-based access control** via `user_roles` table
- **Protected routes** with automatic redirects
- **Secure logout** with session cleanup

## Architecture

### Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages authentication state globally
   - Handles user session persistence
   - Checks admin role status
   - Provides sign in/out methods

2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   - Wraps admin routes
   - Redirects unauthenticated users to login
   - Checks for admin role if required
   - Shows loading state during auth check

3. **AdminLogin** (`src/pages/admin/AdminLogin.tsx`)
   - Email/password login form
   - Form validation with error display
   - Redirects authenticated admins to dashboard
   - Shows informative error messages

4. **AdminLayout** (`src/components/admin/AdminLayout.tsx`)
   - Sidebar navigation for admin pages
   - User info display with email
   - Logout functionality
   - Responsive mobile menu

## Security Features

### 1. Session Management
- Supabase Auth handles JWT tokens automatically
- Tokens stored securely in localStorage
- Automatic token refresh on expiration
- Session state persisted across page reloads

### 2. Role-Based Access Control
- Admin roles stored in `public.user_roles` table
- Role checked before granting access
- Separate from Supabase Auth users
- Row-level security policies enforced

### 3. Protected Routes
- All admin routes wrapped with `ProtectedRoute`
- Automatic redirect for unauthorized access
- Loading states to prevent flash of content
- Admin role verification before displaying content

### 4. Password Security
- Supabase Auth handles password hashing with bcrypt
- Passwords never sent to frontend in plain text
- Session-based auth prevents password re-entry

### 5. Environment Variables
- Admin credentials stored in `.env`
- Not committed to version control
- Can be changed per environment
- Used only for initial setup

## Setup Instructions

### 1. Create Admin User in Supabase

#### Via Dashboard:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication > Users**
4. Click **Add User**
5. Enter credentials:
   - Email: `admin@prosperousmotors.com`
   - Password: `ChangeMe123!`
   - Uncheck "Auto Confirm User Email"
6. Click **Create User**

#### Via SQL (after user is created in Auth):
1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email = 'admin@prosperousmotors.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

3. Verify with:

```sql
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@prosperousmotors.com';
```

### 2. Update Environment Variables

Edit `.env`:
```env
VITE_ADMIN_EMAIL="admin@prosperousmotors.com"
VITE_ADMIN_PASSWORD="ChangeMe123!"
```

### 3. Login to Dashboard

1. Navigate to `http://localhost:5173/admin`
2. Enter credentials
3. Click "Sign In"
4. You'll be redirected to `/admin/dashboard`

## Routing

### Public Routes
- `/` - Home
- `/shop` - Shop page
- `/admin` - Admin login

### Protected Admin Routes
- `/admin/dashboard` - Requires admin role
- `/admin/cars` - Requires admin role
- `/admin/orders` - Requires admin role

## API Reference

### useAuth Hook

```typescript
const { user, isAdmin, isLoading, signIn, signOut, session } = useAuth();

// Sign in
const { error } = await signIn(email, password);

// Sign out
await signOut();

// Properties
user        // Current user object or null
isAdmin     // Boolean indicating admin status
isLoading   // Boolean for loading state
session     // Current session object
```

### ProtectedRoute Component

```tsx
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

## Authentication Flow

```
User Visits /admin
    ↓
AdminLogin checks if already authenticated
    ↓
If authenticated and admin → Redirect to /admin/dashboard
    ↓
If not authenticated → Show login form
    ↓
User enters email/password
    ↓
Form validates input
    ↓
Supabase Auth verifies credentials
    ↓
If valid → Create session + check admin role
    ↓
If admin → Redirect to /admin/dashboard
    ↓
If not admin → Show "Access Denied"
```

## Production Checklist

- [ ] Change default admin password
- [ ] Update `VITE_ADMIN_EMAIL` to your admin email
- [ ] Enable email verification in Supabase
- [ ] Set up password reset email templates
- [ ] Configure rate limiting on login
- [ ] Enable MFA for admin accounts
- [ ] Set up activity logging
- [ ] Configure email alerts for admin login
- [ ] Test logout functionality
- [ ] Verify protected routes redirect correctly
- [ ] Test session persistence across browser restarts

## Common Issues

### Issue: "Access Denied" after login
- Verify admin role is assigned in `user_roles` table
- Check SQL query above for role assignment
- Ensure user email matches exactly

### Issue: Session lost on page refresh
- Verify Supabase URL and key are correct
- Check localStorage is enabled
- Clear browser cache and try again

### Issue: Cannot navigate to /admin/dashboard
- Make sure user is logged in
- Verify admin role is set
- Check browser console for errors

## Security Best Practices

1. **Change Default Credentials**
   - Update admin password immediately in production
   - Use strong, unique passwords (minimum 12 characters)

2. **Enable MFA**
   - Consider adding multi-factor authentication
   - Available through Supabase Auth settings

3. **Rate Limiting**
   - Implement rate limiting on login endpoint
   - Prevent brute force attacks

4. **Audit Logging**
   - Log all admin actions
   - Monitor login attempts
   - Track changes to products/orders

5. **Session Timeout**
   - Consider auto-logout after inactivity
   - Implement refresh token rotation

6. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` as template
   - Rotate credentials regularly

## Logout Functionality

Users can logout via:
1. **Sidebar Button** - "Sign Out" in admin sidebar
2. **Programmatic** - `signOut()` from `useAuth()` hook

On logout:
- Session is cleared from Supabase
- Auth state is reset
- User is redirected to `/admin`
- localStorage is cleared

## Token Refresh

Supabase automatically handles:
- JWT token refresh
- Token expiration (24 hours default)
- Automatic re-authentication

No manual refresh needed in frontend code.

## Testing

### Test Admin Login
1. Go to `/admin`
2. Enter email: `admin@prosperousmotors.com`
3. Enter password: `ChangeMe123!`
4. Should redirect to `/admin/dashboard`

### Test Protected Routes
1. Open `/admin/dashboard` in new tab
2. Without logging in, should redirect to `/admin`

### Test Logout
1. Click "Sign Out" in sidebar
2. Should redirect to `/admin` login page
3. Verify session is cleared

## Support

For issues or questions about the admin authentication system:
1. Check this documentation
2. Review Supabase Auth documentation
3. Check browser console for error messages
4. Verify Supabase project configuration
