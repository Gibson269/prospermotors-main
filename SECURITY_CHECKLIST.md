# Admin Authentication Security Checklist

## Immediate Setup (Required)

- [ ] Create admin user in Supabase Dashboard
  - [ ] Email: `admin@prosperousmotors.com`
  - [ ] Temporary password: `ChangeMe123!`
  - [ ] Confirm user appears in `/admin` login

- [ ] Assign admin role via SQL
  - [ ] Run role assignment query in SQL Editor
  - [ ] Verify role with SELECT query
  - [ ] Test login with new credentials

- [ ] Environment Variables (.env)
  - [ ] Update `VITE_ADMIN_EMAIL` (keep default for dev)
  - [ ] Update `VITE_ADMIN_PASSWORD` (change in production!)
  - [ ] Never commit .env file

## Before Production Deployment

### Security

- [ ] **Change Admin Password**
  - [ ] Use strong password (min 12 chars)
  - [ ] Include uppercase, lowercase, numbers, symbols
  - [ ] Store securely (password manager)

- [ ] **Update Email**
  - [ ] Use your domain email
  - [ ] Example: `admin@yourcompany.com`
  - [ ] Verify it's monitored

- [ ] **Enable Supabase Email Settings**
  - [ ] Configure SMTP for password resets
  - [ ] Set up email templates
  - [ ] Test password reset flow

- [ ] **Enable MFA (Optional but Recommended)**
  - [ ] Configure TOTP in Supabase
  - [ ] Force MFA for all admin accounts
  - [ ] Store recovery codes securely

- [ ] **Set Up Rate Limiting**
  - [ ] Limit login attempts (e.g., 5 attempts/15 min)
  - [ ] Implement CAPTCHA if needed
  - [ ] Configure in Supabase Auth settings

### Access Control

- [ ] **Remove Test Users**
  - [ ] Delete any test admin accounts
  - [ ] Keep only production admin user

- [ ] **Verify Protected Routes**
  - [ ] Test /admin/dashboard without auth
  - [ ] Confirm redirect to login
  - [ ] Test with non-admin user

- [ ] **Test Logout**
  - [ ] Verify session is cleared
  - [ ] Confirm redirect to login page
  - [ ] Check localStorage is empty

### Monitoring & Logging

- [ ] **Set Up Admin Activity Logging**
  - [ ] Log all product changes
  - [ ] Log all order modifications
  - [ ] Log all admin login/logout events

- [ ] **Configure Alerts**
  - [ ] Alert on failed login attempts
  - [ ] Alert on admin login from new IP
  - [ ] Alert on unusual activity

- [ ] **Enable Audit Trail**
  - [ ] Track who changed what and when
  - [ ] Store in separate audit table
  - [ ] Review logs regularly

### Backup & Recovery

- [ ] **Create Recovery Process**
  - [ ] Document admin user creation steps
  - [ ] Store in secure location
  - [ ] Test recovery procedure

- [ ] **Backup Credentials**
  - [ ] Store in password manager
  - [ ] Add to secure team documentation
  - [ ] Set expiration reminder

- [ ] **Test Session Recovery**
  - [ ] Logout and login
  - [ ] Verify role persists
  - [ ] Test across browsers

## Ongoing Maintenance (Monthly)

- [ ] Review login attempt logs
- [ ] Check for suspicious activity
- [ ] Update admin password if needed
- [ ] Verify all admins still need access
- [ ] Test admin routes are protected
- [ ] Review and rotate API keys if used
- [ ] Update dependencies for security patches

## Incident Response

### If Admin Credentials Compromised

1. **Immediate Actions**
   - [ ] Change admin password immediately
   - [ ] Check login logs for unauthorized access
   - [ ] Verify no unauthorized changes made
   - [ ] Revoke sessions: Sign out all sessions in Supabase

2. **Within 24 Hours**
   - [ ] Create new admin user if needed
   - [ ] Delete compromised user account
   - [ ] Review all admin activity logs
   - [ ] Update team on security incident

3. **Follow-up**
   - [ ] Implement MFA if not already done
   - [ ] Review and improve access controls
   - [ ] Document lessons learned
   - [ ] Update security policies

### If Unauthorized Changes Made

1. **Assess Damage**
   - [ ] Review all product/order changes
   - [ ] Identify affected data
   - [ ] Document timeline of changes

2. **Rollback**
   - [ ] Use database backups if available
   - [ ] Manually restore critical data
   - [ ] Notify affected customers

3. **Prevent Recurrence**
   - [ ] Strengthen access controls
   - [ ] Enable detailed audit logging
   - [ ] Consider role-based restrictions per admin

## Security Best Practices

### Password Policy
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No dictionary words
- Not reused for 12 months

### Session Management
- Session timeout: 24 hours (Supabase default)
- Consider reducing to 8 hours for production
- Implement auto-logout on inactivity
- Force logout on password change

### Access Control
- Only grant admin role when necessary
- Use principle of least privilege
- Different roles for different teams (optional)
- Quarterly access reviews

### Communication
- Notify team of admin procedures
- Document login process
- Create onboarding guide
- Maintain contact list for security issues

## Testing Checklist

- [ ] Test admin login with correct credentials
- [ ] Test login with incorrect password
- [ ] Test login with non-existent email
- [ ] Test protected routes redirect correctly
- [ ] Test logout clears session
- [ ] Test protected routes after logout
- [ ] Test session persistence on page refresh
- [ ] Test with different browsers
- [ ] Test on mobile devices
- [ ] Test role verification works

## Documentation

Keep these documents updated:
- [ ] ADMIN_AUTH.md - This document
- [ ] ADMIN_SETUP.md - Setup instructions
- [ ] Credentials stored securely (password manager)
- [ ] Team access list (who has admin access)
- [ ] Recovery procedures documented
- [ ] Incident response plan

## Contact & Escalation

In case of security issues:

1. **Immediate Contact** 
   - Project Lead: [Name]
   - Email: [Email]

2. **Security Issues**
   - Email: security@yourcompany.com
   - Never post credentials in chat/email

3. **Support**
   - Supabase Support: https://app.supabase.com/support
   - Supabase Docs: https://supabase.com/docs

## Sign Off

- [ ] Security team reviewed
- [ ] Admin credentials updated
- [ ] Incident response plan acknowledged
- [ ] All team members trained

**Date Completed:** _______________

**Approved By:** _______________

**Next Review Date:** _______________
