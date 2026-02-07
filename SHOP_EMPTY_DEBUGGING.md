# 🔍 Shop Page Empty - Debugging Guide

## Issue: `/shop` page shows "No Vehicles Available"

The Shop page is not displaying any vehicles. This can happen for several reasons. Follow this diagnostic guide to identify and fix the issue.

## 🚀 Step-by-Step Debugging

### Step 1: Check Browser Console
1. Open your browser (Firefox/Chrome)
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Navigate to `http://localhost:8089/shop`
5. Look for `[Shop]` logs

**Expected Output:**
```
[Shop] ========== FETCH START ==========
[Shop] Supabase URL: https://kczsgqjsuvgmxlpoqjzg.supabase.co
[Shop] Fetching cars from Supabase...
[Shop] Query Error: null
[Shop] Query Data: [{...}, {...}, ...]
[Shop] Data Type: object
[Shop] Data Length: 10
[Shop] ✅ Fetched 10 cars
[Shop] ✅ Processed cars: [...]
[Shop] ✅ Brands: ["Audi", "BMW", "Mercedes-Benz", "Porsche", ...]
[Shop] ========== FETCH COMPLETE ==========
```

### Step 2: Check for Database Connection Issues

**Look for these error patterns in console:**

#### 🔴 "Query Error: null but no data"
- Means connection works but database is empty
- **Solution:** Run seed migration in Supabase

#### 🔴 "Query Error: Invalid API Key"
- `.env` file has wrong Supabase key
- **Solution:** Check VITE_SUPABASE_PUBLISHABLE_KEY in `.env`

#### 🔴 "Query Error: Network request failed"
- Cannot reach Supabase
- **Solution:** Check internet connection, verify VITE_SUPABASE_URL

#### 🔴 "Query Error: row-level security"
- RLS policies blocking SELECT access
- **Solution:** Update RLS policies to allow public read

### Step 3: Verify Environment Variables

Create a test by checking `.env`:

```bash
# Should have these variables:
VITE_SUPABASE_URL=https://kczsgqjsuvgmxlpoqjzg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If missing or wrong:**
1. Go to Supabase Dashboard
2. Settings → API → Copy "Project URL" and "anon key"
3. Update `.env` file
4. Restart dev server

### Step 4: Check Supabase Database

1. Go to https://supabase.co/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run this query:
```sql
SELECT COUNT(*) as total_cars FROM public.cars;
```

**Expected Result:** 
```
total_cars: 10
```

**If Result is 0:**
- Database is empty
- Need to seed the data (see below)

### Step 5: Run Database Seed

If database is empty, run the seed migration:

1. In Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy and paste the reseed script:
```sql
-- Fresh reseed of car data
DELETE FROM public.cars;

INSERT INTO public.cars (brand, model, year, price, mileage, engine, transmission, fuel_type, interior_color, exterior_color, description, features, images, is_featured, is_sold)
VALUES 
  (
    'Mercedes-Benz',
    'S-Class 2024',
    2024,
    45000000.00,
    50,
    '3.0L V6 Turbo',
    'Automatic',
    'Petrol',
    'Black Leather',
    'Midnight Black',
    'Luxury sedan...',
    ARRAY['Panoramic Sunroof', 'Leather Interior', ...],
    ARRAY['https://images.unsplash.com/photo-1617469767537-b85461a1bbe0?w=800&q=80'],
    true,
    false
  );
  -- ... add more cars ...
```

4. Click **Run**
5. Go back to shop page and refresh

### Step 6: Verify RLS Policies

1. Supabase Dashboard → **SQL Editor**
2. Run this query:
```sql
SELECT tablename, policyname, roles, permissive FROM pg_policies 
WHERE tablename = 'cars' 
ORDER BY policyname;
```

**Expected Result:**
```
cars_delete_policy    |authenticated|permissive
cars_insert_policy    |authenticated|permissive
cars_select_policy    |anon,authenticated|permissive
cars_update_policy    |authenticated|permissive
```

**If "cars_select_policy" is missing:**
1. Run this SQL:
```sql
CREATE POLICY "cars_select_policy" ON public.cars
FOR SELECT
TO anon, authenticated
USING (true);
```

2. Refresh shop page

### Step 7: Check Network Requests

1. Open **Network** tab in DevTools
2. Filter for XHR/Fetch requests
3. Look for request to `/rest/v1/cars`
4. Check **Response** tab

**Good Response:**
```json
[
  {
    "id": "uuid",
    "brand": "Mercedes-Benz",
    "model": "S-Class 2024",
    "price": 45000000,
    ...
  },
  ...
]
```

**Error Response:**
```json
{
  "code": "PGRST116",
  "message": "The requested resource represents an error: permission denied"
}
```

## 🛠️ Common Solutions

### Solution 1: Restart Dev Server
```bash
# Stop server (Ctrl+C)
# Then:
npm run dev
```

### Solution 2: Clear Browser Cache
- Press Ctrl+Shift+Delete
- Clear cookies and site data for localhost:8089
- Refresh page

### Solution 3: Re-seed Database
Run in Supabase SQL Editor:
```sql
-- Truncate old data
TRUNCATE public.cars CASCADE;

-- Run full reseed (see Step 5 above)
```

### Solution 4: Fix RLS Policies
Run in Supabase SQL Editor:
```sql
-- Disable RLS temporarily to test
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Then try shop page - if it works, RLS was the issue
-- Re-enable and fix policies:
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Ensure select policy exists:
CREATE POLICY IF NOT EXISTS "cars_select_policy" ON public.cars
FOR SELECT
TO anon, authenticated
USING (true);
```

### Solution 5: Update Environment Variables
1. Stop dev server
2. Edit `.env` file
3. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Save and restart: `npm run dev`

## 📊 Expected Console Output Patterns

### ✅ Success Pattern
```
[Shop] ========== FETCH START ==========
[Shop] Supabase URL: https://...
[Shop] Fetching cars from Supabase...
[Shop] Query Error: null
[Shop] Query Data: [Object, Object, Object, ...]
[Shop] Data Length: 10
[Shop] ✅ Fetched 10 cars
[Shop] ========== FETCH COMPLETE ==========
```

### 🔴 Empty Database Pattern
```
[Shop] Query Data: []
[Shop] Data Length: 0
[Shop] ⚠️ No cars found in database
```

### 🔴 Connection Error Pattern
```
[Shop] ❌ Query error: {...error object...}
[Shop] Error message: "JWT expired" or similar
```

## 🧪 Quick Test Checklist

- [ ] Browser console shows `[Shop]` logs
- [ ] No red error messages in console
- [ ] Network tab shows successful XHR request to `/rest/v1/cars`
- [ ] Response contains car array with data
- [ ] Shop page displays vehicle grid with images
- [ ] Filters work (can filter by brand, price, etc.)
- [ ] Search functionality works
- [ ] "View Details" button navigates to car page

## 📞 Advanced Debugging

### Check Supabase Project Status
```bash
# In browser console, paste:
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('KEY available:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
```

### Manual Database Query Test
```bash
# In browser console:
import { supabase } from '@/integrations/supabase/client'
const { data, error } = await supabase.from('cars').select('*')
console.log(data, error)
```

## 🎯 Next Steps After Fixing

1. Verify images display (if URL format is correct)
2. Test filters work properly
3. Test search by brand/model/year
4. Test "View Details" navigation
5. Test "WhatsApp Enquiry" button
6. Test admin "Add Car" button adds to shop

---

**Build Status:** ✅ Passed (7.98s)

Once you identify which step is failing, let me know the exact error and I can provide the specific fix!
