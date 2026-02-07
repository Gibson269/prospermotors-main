# Safe Supabase Configuration Guide

## Overview

This guide covers secure configuration of Supabase for the Prosperous Motors dealership application, protecting your data while allowing necessary functionality.

## Current Configuration

### Environment Variables

Your `.env` file should contain:

```env
# Public (safe to expose - used by browser)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Private (NEVER share - server-only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### What These Keys Do

| Key | Scope | Usage | Risk |
|-----|-------|-------|------|
| `VITE_SUPABASE_URL` | Public | Browser API endpoint | Low - just tells where to connect |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public | Browser authentication | Medium - limited by RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Backend/Admin | **CRITICAL** - bypasses all security |

## Security Architecture

### Row Level Security (RLS)

RLS is your **primary defense** - it enforces rules at the database level:

```sql
-- Cars table: Everyone can READ, only authenticated users can WRITE
CREATE POLICY "public read" ON cars
FOR SELECT USING (true);

CREATE POLICY "authenticated write" ON cars
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated update" ON cars
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated delete" ON cars
FOR DELETE USING (auth.role() = 'authenticated');
```

### Current RLS Policies

Check your policies in Supabase Dashboard:

1. Go to: https://app.supabase.com/project/YOUR_PROJECT/auth/policies
2. Select table: `cars`
3. Verify policies match above

## Best Practices

### 1. Protect Your Service Role Key

**❌ NEVER DO THIS:**
```typescript
// Hardcoding in frontend
const client = createClient(url, SERVICE_ROLE_KEY);

// Adding to git
git add .env (commits keys)

// Sharing in code
sendEmail('...here is my key...')

// Committing to GitHub
// Service key visible in git history
```

**✅ DO THIS:**
```typescript
// Use VITE_SUPABASE_PUBLISHABLE_KEY only in browser
const client = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

// .gitignore prevents accidental commits
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

// Service key only on backend
// Node.js file never exposed to browser
const adminClient = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
```

### 2. Git Security

**Setup .gitignore:**

```
# .gitignore
.env
.env.local
.env.production.local
.env.development.local
*.pem
dist/
node_modules/
.DS_Store
```

**Check if already committed:**

```bash
# Search git history for secrets
git log --all -S 'eyJhbGc' --oneline  # JWT pattern

# Remove from history (dangerous operation)
git filter-branch --tree-filter 'rm -f .env' HEAD
```

### 3. Database Access Control

**Current Setup for Prosperous Motors:**

```sql
-- Only authenticated users can upload admin images
CREATE POLICY "admin only" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Anyone can view public car data
CREATE POLICY "public read" ON cars
FOR SELECT USING (true);

-- Only authenticated users can modify cars
CREATE POLICY "admin modify" ON cars
FOR UPDATE USING (auth.role() = 'authenticated')
AND DELETE USING (auth.role() = 'authenticated');
```

**Verify Current Policies:**

```sql
-- In Supabase SQL Editor, run:
SELECT * FROM pg_policies WHERE tablename = 'cars';

-- Should show policies for SELECT, INSERT, UPDATE, DELETE
```

### 4. Environment-Specific Configuration

**Development:**
```env
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=dev-key-here
```

**Production:**
```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=prod-key-here
```

**Never mix keys** - use separate Supabase projects.

## Secure Admin Operations

### Admin Authentication

Your current admin uses email/password:

```typescript
// Admin Login Flow
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@prospermotors.com',
  password: 'secure-password'
});

if (!error) {
  // Admin is now authenticated
  // RLS policies grant write access
}
```

### Secure Admin Routes

Protect admin routes from unauthorized access:

```typescript
// App.tsx - Protect admin routes
<Route
  path="/admin/*"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
/>

// ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/admin/login" />;
  }
  
  return <>{children}</>;
}
```

### Audit Operations

Log admin actions for security:

```typescript
// Log every admin change
const logAdminAction = async (action: string, carId: string, details: any) => {
  await supabase
    .from('admin_logs')
    .insert({
      timestamp: new Date().toISOString(),
      admin_email: user.email,
      action: action,
      car_id: carId,
      details: JSON.stringify(details),
    });
};

// Usage in AdminCars.tsx
const handleDelete = async (carId: string) => {
  await logAdminAction('DELETE_CAR', carId, { reason: 'Removed from inventory' });
  // ... delete logic
};
```

## API Key Rotation

### When to Rotate Keys

1. **Suspected compromise** - immediately
2. **Employee leaves** - rotate all keys
3. **Every 90 days** - routine rotation
4. **Security incident** - all keys

### How to Rotate

1. **Create new key** in Supabase Dashboard:
   ```
   Settings → API Tokens → Generate New Token
   ```

2. **Update .env** with new key:
   ```env
   VITE_SUPABASE_PUBLISHABLE_KEY=new-key-here
   ```

3. **Redeploy application** with new keys

4. **Revoke old key** in dashboard

5. **Monitor logs** for issues

## Network Security

### HTTPS Only

```typescript
// Enforce HTTPS in production
if (import.meta.env.PROD) {
  if (window.location.protocol !== 'https:') {
    window.location.protocol = 'https:';
  }
}
```

### CORS Configuration

Your app runs at one domain, Supabase at another:

```typescript
// This is automatically handled by Supabase client
// No additional CORS setup needed if using official client

// But if making raw fetch requests:
const response = await fetch(supabaseUrl + '/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  }
});
```

## Data Encryption

### In Transit (Automatic)
- ✅ All Supabase connections use HTTPS TLS 1.2+
- ✅ Data encrypted in transmission

### At Rest
Supabase encrypts data at rest by default. For extra security:

```typescript
// Encrypt sensitive data before storing
import crypto from 'crypto';

const encryptCarData = (data: string) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decryptCarData = (encrypted: string) => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
```

## Backup & Disaster Recovery

### Automatic Backups

Supabase automatically backs up your data:

1. **Daily backups** - kept for 30 days
2. **Restore available** via Dashboard → Backups
3. **Recovery Point Objective (RPO)**: < 24 hours

### Manual Backups

```bash
# Export all data
pg_dump postgresql://user:password@host/dbname > backup.sql

# Restore from backup
psql postgresql://user:password@host/dbname < backup.sql
```

### Backup Verification

```typescript
// Periodically verify backup integrity
const verifyBackup = async () => {
  const count = await supabase
    .from('cars')
    .select('id', { count: 'exact', head: true });
    
  if (!count) {
    alert('Backup verification failed!');
  }
};

// Run weekly
setInterval(verifyBackup, 7 * 24 * 60 * 60 * 1000);
```

## Rate Limiting

### Prevent Abuse

```typescript
// Rate limit function - max 10 requests per minute
const rateLimiter = (() => {
  const requests = new Map<string, number[]>();
  
  return (userId: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(userId) || [];
    const recentRequests = userRequests.filter(t => now - t < 60000);
    
    if (recentRequests.length >= 10) return false;
    
    requests.set(userId, [...recentRequests, now]);
    return true;
  };
})();

// Usage
const handleRequest = async (userId: string) => {
  if (!rateLimiter(userId)) {
    return { error: 'Too many requests' };
  }
  // Process request
};
```

### Supabase Rate Limiting

Enable in Dashboard:

```
Settings → Rate Limiting → Enable
- Requests: 10,000 per day
- Connections: 100 per second
```

## Monitoring & Alerts

### Monitor RLS Policies

```sql
-- Check which policies are active
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
ORDER BY tablename;
```

### Monitor Failed Auth

```sql
-- Check failed login attempts
SELECT *
FROM auth.audit_log_entries
WHERE event = 'failed_sign_in'
ORDER BY created_at DESC
LIMIT 10;
```

### Set Up Alerts

In Supabase Dashboard → Alerts:

```
- Failed login attempts > 5 per hour
- Database connections > 100
- Storage usage > 90GB
- Query latency > 2 seconds
```

## Compliance

### GDPR Compliance

```typescript
// Allow users to export their data
const exportUserData = async (userId: string) => {
  const data = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', userId);
    
  return JSON.stringify(data, null, 2);
};

// Allow users to delete their data
const deleteUserData = async (userId: string) => {
  await supabase
    .from('user_data')
    .delete()
    .eq('user_id', userId);
};
```

### Data Retention

```typescript
// Auto-delete old records
const deleteOldRecords = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await supabase
    .from('orders')
    .delete()
    .lt('created_at', thirtyDaysAgo.toISOString());
};

// Run daily
schedule.scheduleJob('0 0 * * *', deleteOldRecords);
```

## Troubleshooting

### "Permission denied for schema public"

**Cause:** RLS policy missing
**Fix:**
```sql
-- Enable RLS on table
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Add default policy
CREATE POLICY "Enable public read" ON cars
FOR SELECT USING (true);
```

### "Unauthorized"

**Cause:** Invalid or expired API key
**Fix:**
```typescript
// Check key format
console.log(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY.substring(0, 20));
// Should be long JWT-like string

// Verify not expired
const payload = JSON.parse(atob(key.split('.')[1]));
console.log(new Date(payload.exp * 1000));
```

### "Connection refused"

**Cause:** URL misconfiguration
**Fix:**
```typescript
// Verify URL format
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should be: https://xxxxx.supabase.co

// Test connection
fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/')
  .then(r => console.log('Connected:', r.status))
  .catch(e => console.error('Failed:', e));
```

## Security Checklist

Before deploying to production:

- [ ] Service Role Key NOT in any frontend code
- [ ] `.env` added to `.gitignore`
- [ ] RLS policies configured on all tables
- [ ] Admin routes protected with authentication
- [ ] HTTPS enforced in production
- [ ] API keys rotated in last 90 days
- [ ] Backup verified in last 7 days
- [ ] Rate limiting enabled
- [ ] Monitoring alerts configured
- [ ] Team members trained on security

## Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/access-control/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Security](https://jwt.io/introduction)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## Support

For security incidents:
1. **Rotate all keys immediately**
2. **Review audit logs** in Supabase Dashboard
3. **Contact Supabase support** via Dashboard
4. **Notify all admins** of the incident

---

**Last Updated:** January 2025
**Review Schedule:** Quarterly
