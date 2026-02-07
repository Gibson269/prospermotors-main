# Prosperous Autos - Complete Admin System Guide

## 📋 Overview

This guide covers the complete admin system for Prosperous Autos, including database structure, user management, vehicle management, and order management.

---

## 🏗️ Database Architecture

### Tables Structure

#### 1. **user_roles** (Role Management)
```sql
id: UUID (Primary Key)
user_id: UUID (References auth.users)
role: app_role enum ('admin' | 'user')
created_at: TIMESTAMP
UNIQUE(user_id, role)
```

**Purpose:** Secure role-based access control (RBAC) for admin functionality

**Policies:**
- Users can view their own roles
- Admins can view all roles

---

#### 2. **profiles** (User Profiles)
```sql
id: UUID (Primary Key)
user_id: UUID (References auth.users, unique)
full_name: TEXT
phone: TEXT
email: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**Purpose:** Store customer and admin profile information

**Policies:**
- Users can view and update their own profile
- Users can insert their own profile

---

#### 3. **cars** (Vehicle Inventory)
```sql
id: UUID (Primary Key)
brand: TEXT (Required) - e.g., "Mercedes-Benz"
model: TEXT (Required) - e.g., "S-Class"
year: INTEGER (Required) - e.g., 2024
price: DECIMAL(15,2) (Required) - in NGN
mileage: INTEGER - in kilometers
engine: TEXT - e.g., "3.0L V6 Turbo"
transmission: TEXT - "Automatic" | "Manual" | "CVT"
fuel_type: TEXT - "Petrol" | "Diesel" | "Hybrid" | "Electric"
interior_color: TEXT - e.g., "Saddle Brown Leather"
exterior_color: TEXT - e.g., "Obsidian Black"
description: TEXT - detailed description
features: TEXT[] - array of feature strings
images: TEXT[] - array of image URLs
is_featured: BOOLEAN (default: false)
is_sold: BOOLEAN (default: false)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**Purpose:** Store vehicle inventory

**Policies:**
- Anyone can view cars (public storefront)
- Only admins can insert, update, delete cars

**Sample Data:**
```javascript
{
  brand: "Mercedes-Benz",
  model: "S-Class",
  year: 2024,
  price: 45000000,
  mileage: 0,
  engine: "3.0L V6 Turbo",
  transmission: "Automatic",
  fuel_type: "Petrol",
  interior_color: "Saddle Brown Leather",
  exterior_color: "Obsidian Black",
  description: "Premium luxury sedan with full specifications...",
  features: ["Sunroof", "Heated Seats", "Navigation", "Panoramic Roof"],
  images: ["https://example.com/image1.jpg"],
  is_featured: true,
  is_sold: false
}
```

---

#### 4. **orders** (Customer Orders)
```sql
id: UUID (Primary Key)
user_id: UUID (References auth.users, nullable) - for guest orders
customer_name: TEXT (Required)
customer_email: TEXT (Required)
customer_phone: TEXT (Required)
customer_address: TEXT
items: JSONB (Required) - array of items [{car_id, quantity, price}]
total_amount: DECIMAL(15,2) (Required)
status: TEXT (default: "pending") - "pending" | "processing" | "completed" | "cancelled"
notes: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**Purpose:** Track vehicle orders and inquiries

**Policies:**
- Users can view their own orders
- Admins can view all orders
- Anyone can create orders (guest checkout)

---

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS enabled with specific policies:

**Admin Operations:**
- Create/Update/Delete cars (requires admin role)
- View all user roles and profiles
- View all orders
- Manage users

**Customer Operations:**
- View public cars list
- Create orders
- View own profile
- View own orders

---

## 👥 User Management

### Admin Pages

#### Dashboard (`/admin/dashboard`)
- Overview statistics
- Total vehicles
- Total orders
- Total revenue
- Featured cars count
- Recent orders table

#### Cars Management (`/admin/cars`)
- **List all vehicles** with pagination
- **Add car** - Opens dialog with full form
  - Brand, Model, Year
  - Price, Mileage
  - Engine, Transmission, Fuel Type
  - Colors (interior & exterior)
  - Description
  - Features (comma-separated)
  - Images (URLs)
  - Featured toggle
  - Sold status toggle
- **Edit car** - Modify existing vehicle
- **Delete car** - Remove from inventory
- **Search & filters** - Filter by status, featured

#### Orders Management (`/admin/orders`)
- View all customer orders
- Order details (customer info, items, total)
- Status management (pending, processing, completed, cancelled)
- Export orders (optional)

#### Users Management (`/admin/users`)
- **List all users** with roles
- **Add user**
  - Email (required)
  - Password (required)
  - Full Name (optional)
  - Phone (optional)
  - Role (admin/customer)
- **Change user role** - Update user permission level
- **Delete user** - Remove account

---

## 🚀 Admin Operations

### Create Admin User

**Option 1: Via Admin Users Page**
1. Go to `/admin/users`
2. Click "Add User"
3. Fill in details:
   - Email: `admin@example.com`
   - Password: Strong password
   - Role: Select "Admin"
4. Click "Create User"

**Option 2: Via Supabase Dashboard**
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Check "Auto Confirm User Email"
5. Click "Create User"
6. Go to SQL Editor and run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role FROM auth.users
   WHERE email = 'admin@example.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

---

### Add Vehicle to Inventory

1. Login to admin dashboard
2. Go to `/admin/cars`
3. Click "Add Car"
4. Fill in all required fields:
   - **Brand:** Mercedes-Benz
   - **Model:** S-Class
   - **Year:** 2024
   - **Price:** 45000000 (in NGN)
5. Fill optional fields:
   - Mileage, Engine specs, Transmission, Fuel type
   - Colors, Description, Features
6. Add images (paste image URLs)
7. Toggle "Featured" to show on homepage
8. Click "Add Car"

**✅ Tips:**
- Use high-quality images from reliable sources
- Add 3-5 images per vehicle
- Feature 4-6 cars on homepage
- Update descriptions with key selling points

---

### Manage Orders

1. Go to `/admin/orders`
2. View all customer orders
3. Update order status:
   - **Pending:** New inquiry
   - **Processing:** Customer contacted, viewing scheduled
   - **Completed:** Vehicle sold
   - **Cancelled:** Order cancelled
4. Add notes about order progress

---

### Manage Users

1. Go to `/admin/users`
2. View all registered users
3. Change user role:
   - Select user from table
   - Click role dropdown
   - Select "Admin" or "Customer"
4. Delete user if needed (confirm first)

---

## 📊 Customer Side

### Homepage (`/`)
- Hero section with featured cars
- 6 featured vehicles showcase
- 8 newest vehicles showcase
- Features section
- Testimonials
- CTA buttons to Shop

### Shop (`/shop`)
- **Grid view** of all available vehicles
- **Search** by brand, model, year
- **Filters:**
  - Brand dropdown
  - Price range (min-max)
  - Transmission (Automatic, Manual, CVT)
  - Fuel type (Petrol, Diesel, Hybrid, Electric)
  - Year range
- **Car cards** showing:
  - Image, Brand, Model, Year
  - Price in NGN
  - Quick details
  - "View Details" button
- **Real-time updates** from Supabase

### Car Detail (`/car/:id`)
- Full vehicle information
- Image gallery
- Specifications
- Features list
- Price
- "Add to Cart" button
- Related vehicles

### Cart & Checkout
- View cart items
- Edit quantities
- Remove items
- Proceed to checkout
- Fill customer info
- Place order

### Order Confirmation
- Confirmation message
- Order details
- Reference number
- Contact information

---

## 🔧 Technical Setup

### Environment Variables

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### Key Dependencies

- **Supabase:** Authentication, Database, Real-time
- **React Query:** Server state management
- **React Router:** Client routing
- **Tailwind CSS:** Styling
- **shadcn/ui:** UI components

---

## 🧪 Testing Workflow

### 1. Test Admin Login
```
URL: http://localhost:5173/admin
Email: admin@prosperousmotors.com
Password: ChangeMe123!
Expected: Redirect to /admin/dashboard
```

### 2. Test Add Car
```
1. Go to /admin/cars
2. Click "Add Car"
3. Fill in form with test data
4. Click "Add Car"
5. Verify car appears in table
6. Refresh page - car should persist
```

### 3. Test Edit Car
```
1. Click edit icon on any car
2. Modify a field (e.g., price)
3. Click "Update Car"
4. Verify changes in table
```

### 4. Test Customer View
```
1. Go to /shop
2. Verify all cars display
3. Test filters work
4. Click car details
5. Verify all info displays
6. Add to cart
7. Complete checkout
```

### 5. Test Order Creation
```
1. Add 1-2 cars to cart
2. Go to checkout
3. Fill customer info
4. Submit order
5. Verify order appears in /admin/orders
```

---

## 📈 Feature Toggle Status

| Feature | Status | Location |
|---------|--------|----------|
| Admin Auth | ✅ Active | `/admin` |
| Car Management | ✅ Active | `/admin/cars` |
| Order Management | ✅ Active | `/admin/orders` |
| User Management | ✅ Active | `/admin/users` |
| Shop Display | ✅ Active | `/shop` |
| Real-time Updates | ✅ Active | All pages |
| Cart System | ✅ Active | Cart drawer |
| Checkout | ✅ Active | `/checkout` |
| Role-Based Access | ✅ Active | Protected routes |

---

## 🆘 Troubleshooting

### Admin Login Not Working
**Check:**
1. User exists in Supabase Auth
2. User has admin role in user_roles table
3. Email matches exactly (case-sensitive)

**SQL Check:**
```sql
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@prosperousmotors.com';
```

### Car Not Appearing in Shop
**Check:**
1. `is_sold` is false
2. Car data saved to database
3. Refresh browser (clear cache if needed)
4. Check console for errors

### Images Not Displaying
**Check:**
1. Image URLs are valid (start with http/https)
2. Server allows CORS
3. Check browser console for blocked requests

### Orders Not Saving
**Check:**
1. Cart items have valid car IDs
2. Customer info is filled correctly
3. Database permissions allow insert
4. Check `/admin/orders` for created order

---

## 📝 Database Maintenance

### Backup Important Data
```sql
-- Export cars
SELECT * FROM public.cars;

-- Export orders
SELECT * FROM public.orders;

-- Export users
SELECT email, role FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
```

### Clean Up Sold Vehicles
```sql
-- Archive sold vehicles (don't delete)
UPDATE public.cars
SET is_sold = true
WHERE id = 'car-id';
```

### Reset Demo Data
```sql
-- Delete all cars (WARNING: irreversible)
DELETE FROM public.cars;

-- Delete all orders (WARNING: irreversible)
DELETE FROM public.orders;

-- Delete all user roles except current user (WARNING: irreversible)
DELETE FROM public.user_roles
WHERE user_id != auth.uid();
```

---

## 🎯 Next Steps

1. **Populate Inventory:** Add 10-20 featured vehicles
2. **Set Featured Cars:** Mark best sellers as featured
3. **Create Sample Orders:** Test order workflow end-to-end
4. **Test All Filters:** Verify search/filter functionality
5. **Check Responsive Design:** Test on mobile/tablet
6. **Deploy:** Follow deployment guide

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review error messages in browser console
3. Check Supabase logs: Dashboard → Logs
4. Review code comments for implementation details

