# System Architecture Diagram

## 🏗️ Complete Application Structure

```
┌───────────────────────────────────────────────────────────────────────────┐
│                      PROSPEROUS AUTOS - SYSTEM ARCHITECTURE               │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (React)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────┐              ┌──────────────────────┐          │
│  │  ADMIN DASHBOARD   │              │  CUSTOMER STOREFRONT │          │
│  ├────────────────────┤              ├──────────────────────┤          │
│  │ /admin/login       │              │ /                    │ ← Home   │
│  │ /admin/dashboard   │              │ /shop                │ ← Shop   │
│  │ /admin/cars        │ ← Cars Mgmt  │ /car/:id             │ ← Detail │
│  │ /admin/orders      │ ← Orders     │ /checkout            │ ← Checkout
│  │ /admin/users       │ ← Users Mgmt │ /order-confirmation  │ ← Confirm
│  └────────────────────┘              │ /about               │          │
│                                       │ /contact             │          │
│                                       │ /videos              │          │
│                                       └──────────────────────┘          │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────┐           │
│  │              SHARED COMPONENTS & UTILITIES               │           │
│  ├──────────────────────────────────────────────────────────┤           │
│  │ • Header/Navigation                    • UI Components   │           │
│  │ • Footer                               • Forms           │           │
│  │ • Layout Wrapper                       • Cards           │           │
│  │ • Cart Drawer                          • Dialogs         │           │
│  │ • Protected Route Wrapper              • Tables          │           │
│  └──────────────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                          React Router (v6.30)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │  React Query       │  │  Context API    │  │  Local Storage     │  │
│  │  (Server State)    │  │  (Client State) │  │  (Session Persist) │  │
│  ├────────────────────┤  ├─────────────────┤  ├────────────────────┤  │
│  │ • useCars hook     │  │ • AuthContext   │  │ • JWT token        │  │
│  │ • useOrders hook   │  │ • CartContext   │  │ • User preferences │  │
│  │ • Cache management │  │ • State sync    │  │ • Cart items       │  │
│  │ • Stale-while-     │  │                 │  │                    │  │
│  │   revalidate       │  │                 │  │                    │  │
│  └────────────────────┘  └─────────────────┘  └────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
         API Layer (Supabase Client Library v2.95.3)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (Supabase)                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────┐  ┌────────────────────────────────┐        │
│  │   AUTHENTICATION       │  │   REAL-TIME SUBSCRIPTIONS      │        │
│  ├────────────────────────┤  ├────────────────────────────────┤        │
│  │ • Supabase Auth        │  │ • Postgres Change Events       │        │
│  │ • JWT Token Management │  │ • Listen on tables:            │        │
│  │ • Session Handling     │  │   - cars (inventory updates)   │        │
│  │ • RLS (Row Level Sec.) │  │   - orders (new orders)        │        │
│  │ • Role Enforcement     │  │   - user_roles (role changes)  │        │
│  │ • Password Hashing     │  │ • Push updates to clients      │        │
│  └────────────────────────┘  └────────────────────────────────┘        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              DATABASE LAYER (PostgreSQL)                    │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │                                                             │       │
│  │  ┌──────────────────────────────────────────────────────┐  │       │
│  │  │  auth.users (Supabase Managed)                       │  │       │
│  │  │  └─ id, email, password_hash, created_at           │  │       │
│  │  └──────────────────────────────────────────────────────┘  │       │
│  │                         ↓ (Foreign Key)                    │       │
│  │  ┌──────────────────────────────────────────────────────┐  │       │
│  │  │  user_roles                                          │  │       │
│  │  │  ├─ id (UUID)                                        │  │       │
│  │  │  ├─ user_id (FK → auth.users.id)                    │  │       │
│  │  │  ├─ role ('admin' | 'user')                         │  │       │
│  │  │  └─ created_at (TIMESTAMP)                          │  │       │
│  │  └──────────────────────────────────────────────────────┘  │       │
│  │                                                             │       │
│  │  ┌──────────────────────────────────────────────────────┐  │       │
│  │  │  profiles                                            │  │       │
│  │  │  ├─ id (UUID)                                        │  │       │
│  │  │  ├─ user_id (FK → auth.users.id, unique)           │  │       │
│  │  │  ├─ full_name (TEXT)                                │  │       │
│  │  │  ├─ phone (TEXT)                                    │  │       │
│  │  │  ├─ email (TEXT)                                    │  │       │
│  │  │  └─ created_at, updated_at (TIMESTAMP)             │  │       │
│  │  └──────────────────────────────────────────────────────┘  │       │
│  │                                                             │       │
│  │  ┌──────────────────────────────────────────────────────┐  │       │
│  │  │  cars (Vehicle Inventory)                            │  │       │
│  │  │  ├─ id (UUID)                                        │  │       │
│  │  │  ├─ brand, model, year (TEXT/INTEGER)              │  │       │
│  │  │  ├─ price (DECIMAL), mileage (INTEGER)             │  │       │
│  │  │  ├─ engine, transmission, fuel_type (TEXT)         │  │       │
│  │  │  ├─ interior_color, exterior_color (TEXT)          │  │       │
│  │  │  ├─ description (TEXT)                              │  │       │
│  │  │  ├─ features (TEXT[])                               │  │       │
│  │  │  ├─ images (TEXT[])                                 │  │       │
│  │  │  ├─ is_featured, is_sold (BOOLEAN)                 │  │       │
│  │  │  └─ created_at, updated_at (TIMESTAMP)             │  │       │
│  │  └──────────────────────────────────────────────────────┘  │       │
│  │                                                             │       │
│  │  ┌──────────────────────────────────────────────────────┐  │       │
│  │  │  orders (Customer Orders)                            │  │       │
│  │  │  ├─ id (UUID)                                        │  │       │
│  │  │  ├─ user_id (FK → auth.users.id, nullable)         │  │       │
│  │  │  ├─ customer_name, email, phone (TEXT)             │  │       │
│  │  │  ├─ customer_address (TEXT)                         │  │       │
│  │  │  ├─ items (JSONB)                                   │  │       │
│  │  │  ├─ total_amount (DECIMAL)                          │  │       │
│  │  │  ├─ status ('pending'|'processing'|'completed')    │  │       │
│  │  │  ├─ notes (TEXT)                                    │  │       │
│  │  │  └─ created_at, updated_at (TIMESTAMP)             │  │       │
│  │  └──────────────────────────────────────────────────────┘  │       │
│  │                                                             │       │
│  │  RLS POLICIES:                                            │       │
│  │  ├─ cars: SELECT (public) | INSERT/UPDATE/DELETE (admin) │       │
│  │  ├─ orders: SELECT (own/admin) | INSERT (all)            │       │
│  │  ├─ profiles: SELECT/UPDATE (own)                        │       │
│  │  └─ user_roles: SELECT (own/admin) | MANAGE (admin)      │       │
│  │                                                             │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

```

---

## 🔄 Data Flow Diagrams

### Admin Adding a Car
```
Admin Form Input
    ↓
Form Validation (client-side)
    ↓
Send INSERT to Supabase API
    ↓
RLS Policy Check (admin role verification)
    ↓
INSERT into cars table
    ↓
Database Trigger (timestamp update)
    ↓
Postgres Change Event
    ↓
Real-time Subscription
    ↓
Customer Shop Page Auto-Updates
    ↓
New Car Appears in Grid (no refresh needed)
```

### Customer Placing an Order
```
Customer Clicks Checkout
    ↓
Fill Customer Information
    ↓
Submit Order Form
    ↓
Validate Cart Items
    ↓
INSERT into orders table
    ↓
Calculate Total
    ↓
Set Status = 'pending'
    ↓
Success Toast Message
    ↓
Redirect to Confirmation Page
    ↓
Admin Notified (real-time)
    ↓
Order Appears in /admin/orders
```

### Admin Authenticating
```
Admin Visits /admin
    ↓
Enter Credentials
    ↓
POST to Supabase Auth
    ↓
Validate email/password
    ↓
Check auth.users table
    ↓
Generate JWT token
    ↓
Return token to client
    ↓
Store in localStorage
    ↓
Query user_roles table
    ↓
Check has 'admin' role
    ↓
✅ Grant Access / ❌ Deny Access
    ↓
Redirect to /admin/dashboard or show error
```

### Real-Time Shop Update
```
Supabase (Backend)        Client 1 (Customer)        Client 2 (Admin)
    │                            │                           │
    │                            │                           │
    │  ← Subscription: cars      │                    Issue: INSERT car
    │                            │                           │
    │                            │                    DB: cars table updated
    │  Postgres Change Event     │                           │
    │  (INSERT detected)         │                           │
    │                            │                           │
    │─ Push "new car" ─→         │                           │
    │                       React Query                      │
    │                       Invalidate cache                 │
    │                       Re-fetch cars                    │
    │                       Shop Page Updates                │
    │                            │                           │
    │                       ✅ Sees new car!                 │
    │                            │                           │
```

---

## 📊 Component Dependency Graph

```
App (Root)
├── AuthProvider (Context)
│   ├── AuthContext.tsx
│   └── useAuth hook
├── CartProvider (Context)
│   ├── CartContext.tsx
│   └── useCart hook
├── QueryClientProvider (React Query)
│   └── Manages server state
└── BrowserRouter (React Router)
    ├── Public Routes
    │   ├── Index (/)
    │   │   └── Featured Cars (useCars hook)
    │   ├── Shop (/shop)
    │   │   ├── CarCard component
    │   │   └── useCars + useCarBrands hooks
    │   ├── CarDetail (/car/:id)
    │   │   └── useCars hook
    │   ├── Checkout
    │   │   └── useCart hook
    │   ├── OrderConfirmation
    │   │   └── useCart hook
    │   ├── About, Contact, Videos
    │   └── NotFound
    │
    └── Protected Routes (ProtectedRoute wrapper)
        ├── AdminDashboard (/admin/dashboard)
        │   └── useQuery (admin-stats)
        ├── AdminCars (/admin/cars)
        │   ├── useQuery (admin-cars)
        │   ├── useMutation (createCar)
        │   ├── useMutation (updateCar)
        │   └── useMutation (deleteCar)
        ├── AdminOrders (/admin/orders)
        │   └── useQuery (orders)
        └── AdminUsers (/admin/users)
            ├── useQuery (admin-users)
            ├── useMutation (createUser)
            ├── useMutation (deleteUser)
            └── useMutation (updateRole)
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────┐
│           SECURITY LAYERS                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: Transport Security                        │
│  └─ HTTPS/SSL (production)                          │
│                                                     │
│  Layer 2: Authentication                            │
│  ├─ Supabase Auth (managed)                         │
│  ├─ JWT token generation                            │
│  ├─ Password hashing (bcrypt)                       │
│  └─ Email verification (optional)                   │
│                                                     │
│  Layer 3: Authorization                             │
│  ├─ Role-based access control (RBAC)                │
│  ├─ Admin vs User roles                             │
│  └─ ProtectedRoute wrapper components               │
│                                                     │
│  Layer 4: Database Level (Row Level Security)       │
│  ├─ RLS Policies per table                          │
│  ├─ Admin policies                                  │
│  ├─ User policies                                   │
│  └─ Public policies (read-only)                     │
│                                                     │
│  Layer 5: Application Level                         │
│  ├─ Input validation (client & server)              │
│  ├─ Error handling                                  │
│  ├─ Session management                              │
│  └─ Logout functionality                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Path

```
Current State (MVP)
    ├─ Single Supabase project
    ├─ Client-side React app
    ├─ Real-time subscriptions
    └─ PostgreSQL database

↓ (Growth)

Scale Point 1: Image CDN
    ├─ Move image storage to CDN
    ├─ Faster image delivery
    └─ Reduce server bandwidth

↓

Scale Point 2: Caching Layer
    ├─ Redis for frequently accessed data
    ├─ Reduce database queries
    └─ Faster response times

↓

Scale Point 3: Search Service
    ├─ Elasticsearch for advanced search
    ├─ Better filtering experience
    └─ Faster searches

↓

Scale Point 4: Analytics
    ├─ BigQuery for data analysis
    ├─ Customer behavior tracking
    └─ Business intelligence

↓

Scale Point 5: Microservices
    ├─ Separate order service
    ├─ Notification service
    ├─ Payment service
    └─ Admin service
```

---

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND DEPLOYMENT                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Code (GitHub)                                      │
│      ↓                                              │
│  CI/CD Pipeline (GitHub Actions)                    │
│      ↓                                              │
│  Build & Test                                       │
│      ↓                                              │
│  Deploy to Vercel/Netlify                           │
│      ↓                                              │
│  CDN Edge Caching                                   │
│      ↓                                              │
│  Users Get Fast Load (< 1s)                         │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  BACKEND DEPLOYMENT (Managed)                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Supabase (Fully Managed)                           │
│      ├─ PostgreSQL Database                         │
│      ├─ Auth Service                                │
│      ├─ Real-time API                               │
│      ├─ Automatic Backups                           │
│      ├─ Auto-scaling                                │
│      └─ 99.99% Uptime SLA                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Technology Stack Summary

```
Frontend Layer:
├─ Framework: React 18.3.1
├─ Language: TypeScript 5
├─ Routing: React Router 6.30
├─ State: React Query 5.83 + Context API
├─ Styling: Tailwind CSS + shadcn/ui
└─ Build: Vite

Backend Layer:
├─ Platform: Supabase (managed)
├─ Database: PostgreSQL
├─ Auth: JWT + Supabase Auth
├─ Real-time: Websockets (postgres_changes)
└─ API: REST + Real-time subscriptions

Infrastructure:
├─ Frontend Hosting: Vercel/Netlify (optional)
├─ Backend Hosting: Supabase Cloud (managed)
├─ CDN: Vercel/Cloudflare (optional)
└─ Monitoring: Supabase Logs + Error tracking (optional)

Development:
├─ Package Manager: npm/bun
├─ Build Tool: Vite
├─ Testing: Vitest
├─ Linting: ESLint
├─ Formatting: Prettier (optional)
└─ Version Control: Git/GitHub
```

---

**System is production-ready and can scale to handle thousands of concurrent users!**

