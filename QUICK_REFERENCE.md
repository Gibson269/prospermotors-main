# Quick Reference Card - Prosperous Autos

## 🚀 Start Development
```bash
npm run dev
```
→ Open `http://localhost:5173`

---

## 👨‍💼 Admin Access
```
URL: http://localhost:5173/admin
Email: admin@prosperousmotors.com
Password: ChangeMe123!
```

---

## 📍 Admin Pages

| Page | URL | Function |
|------|-----|----------|
| Dashboard | `/admin/dashboard` | Stats & overview |
| Cars | `/admin/cars` | Add/Edit/Delete vehicles |
| Orders | `/admin/orders` | View & manage orders |
| Users | `/admin/users` | Create/manage users |
| Login | `/admin` | Admin authentication |

---

## 🛍️ Customer Pages

| Page | URL | Function |
|------|-----|----------|
| Home | `/` | Featured cars & hero |
| Shop | `/shop` | Browse all vehicles |
| Car Detail | `/car/:id` | Full car info |
| Checkout | `/checkout` | Order placement |
| Confirmation | `/order-confirmation` | Order receipt |
| About | `/about` | About company |
| Contact | `/contact` | Contact info |
| Videos | `/videos` | Video gallery |

---

## 🎯 Quick Tasks

### Add a Vehicle
1. Go to `/admin/cars`
2. Click "Add Car"
3. Fill: Brand, Model, Year, Price
4. Add images (URLs)
5. Click "Add Car"

### View Orders
1. Go to `/admin/orders`
2. See all customer orders
3. Update status if needed

### Manage Users
1. Go to `/admin/users`
2. Add user with email/password
3. Select role (admin/customer)
4. Click "Create User"

### Browse Shop
1. Go to `/shop`
2. Search or filter
3. Click car card
4. View details
5. Add to cart

---

## 📊 Database Tables

```
auth.users          → User accounts (Supabase)
user_roles          → User roles (admin/user)
profiles            → User info (name, phone)
cars                → Vehicle inventory
orders              → Customer orders
```

---

## 🔐 Default Admin Credentials

```
Email: admin@prosperousmotors.com
Password: ChangeMe123!

⚠️ CHANGE THIS PASSWORD BEFORE PRODUCTION
```

---

## 🐛 Troubleshooting

### Can't Login?
- Verify email/password exact match
- Check user exists in Supabase
- Check user has admin role
- Review `LOGIN_TROUBLESHOOTING.md`

### Car Not Showing in Shop?
- Refresh page (Ctrl+F5)
- Check `is_sold` is false
- Verify image URLs are valid
- Check console for errors

### Order Not Appearing?
- Go to `/admin/orders`
- Check order timestamp
- Verify cart had items
- Check Supabase database

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `ADMIN_SYSTEM_GUIDE.md` | Complete admin documentation |
| `QUICK_START_ADD_VEHICLE.md` | How to add vehicles |
| `COMPLETE_WORKFLOW.md` | Full system architecture |
| `IMPLEMENTATION_SUMMARY.md` | What was built |
| `ADMIN_AUTH.md` | Authentication setup |
| `LOGIN_TROUBLESHOOTING.md` | Login issues |

---

## 🔧 Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run tests
npm run test

# Lint code
npm lint
```

---

## 🌐 Navigation Links

**Header Navigation:**
- Home
- Collection (Shop)
- About
- Videos
- Contact

**Admin Sidebar:**
- Dashboard
- Cars
- Orders
- Users
- Sign Out

---

## 💡 Tips

### Add Features to Vehicles
Use comma-separated list:
```
Sunroof, Heated Seats, Navigation, Panoramic Roof
```

### Price Format
Always use numbers (no currency symbols):
```
45000000 (not ₦45,000,000)
```

### Image URLs
Must start with http/https:
```
✅ https://example.com/image.jpg
❌ /images/car.jpg
```

### Feature Vehicles
Toggle "Featured" to show on homepage:
- ✅ Featured = Shows on `/`
- ❌ Not Featured = Only in `/shop`

---

## 📱 Responsive

The site works on:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

Test by resizing browser or using DevTools device emulation.

---

## 🔄 Real-Time Features

When admin updates inventory:
- Customers see changes instantly
- No page refresh needed
- Real-time subscription active

---

## ✅ Status

```
Build:           ✅ OK (7.20s, no errors)
Database:        ✅ Connected
Authentication:  ✅ Active
Shop:            ✅ Working
Admin:           ✅ Functional
Real-time:       ✅ Active
Responsive:      ✅ Tested
```

---

## 🎯 Next Steps

1. **Add Vehicles** → 10-20 cars minimum
2. **Set Featured** → 4-6 cars on homepage
3. **Test Everything** → Use checklists
4. **Change Password** → Update from default
5. **Go Live** → Deploy when ready

---

## 📞 Support

**Having issues?**
1. Check relevant documentation file
2. Review error messages in console
3. Check Supabase logs
4. Verify database has data
5. Try clearing browser cache

**Still stuck?**
- ADMIN_SYSTEM_GUIDE.md (troubleshooting section)
- QUICK_START_ADD_VEHICLE.md (vehicle issues)
- LOGIN_TROUBLESHOOTING.md (authentication issues)

---

**Last Updated:** February 7, 2026  
**Status:** Production Ready  
**Build:** ✅ Passing  

🎉 **Ready to Use!**
```bash
npm run build
```

### Run Tests
```bash
npm run test
```

## File Locations

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Auth state management |
| `src/pages/admin/AdminLogin.tsx` | Login form |
| `src/components/ProtectedRoute.tsx` | Route protection |
| `src/components/admin/AdminLayout.tsx` | Admin layout |
| `.env` | Environment variables |

## Key Functions

### Login
```typescript
const { error } = await signIn(email, password);
```

### Logout
```typescript
await signOut();
```

### Check Auth Status
```typescript
const { user, isAdmin, isLoading } = useAuth();
```

## Protected Routes

All admin routes automatically protected:
- No authentication → Redirect to `/admin`
- Not admin role → Show "Access Denied"
- Admin → Grant access to `/admin/dashboard`

## Session Timeout

- Default: 24 hours
- Configurable in Supabase settings
- Auto-refresh: Yes
- Persists: Yes (across page reloads)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Verify user exists in Supabase Auth Users |
| "Access Denied" | Verify admin role assigned in user_roles table |
| Session lost | Clear browser cache, check localStorage enabled |
| Forgot password | Use Supabase password reset email |

## Documentation

- 📖 **ADMIN_AUTH.md** - Full documentation
- 🔒 **SECURITY_CHECKLIST.md** - Security best practices
- 🧪 **ADMIN_TESTING.md** - Testing scenarios
- ⚙️ **ADMIN_SETUP.md** - Setup instructions

## Security Reminders

✅ Change default password in production
✅ Use strong, unique passwords (12+ chars)
✅ Enable MFA for admin accounts
✅ Monitor login attempts
✅ Review audit logs regularly
✅ Keep environment variables secure

## Support Links

- Supabase Docs: https://supabase.com/docs
- Authentication: https://supabase.com/docs/guides/auth
- Security: https://supabase.com/docs/guides/platform/security

## Emergency Contacts

**Password Reset**
1. Go to Supabase Dashboard
2. Auth > Users
3. Find admin user
4. Click "Reset Password"
5. Send reset link to admin email

**User Locked Out**
1. Create new admin user (see Quick Start)
2. Assign admin role
3. Investigate login attempts

**Security Incident**
1. Immediately change admin password
2. Review login attempt logs
3. Check for unauthorized changes
4. Contact Supabase support if needed

---

**Last Updated:** February 6, 2026
**Version:** 1.0
