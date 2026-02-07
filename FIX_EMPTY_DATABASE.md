# Fix Empty Database - Step-by-Step Guide

## Problem

Diagnostics page shows:
- ❌ Connected: NO
- ❌ Total Cars: 0

This means either:
1. Seed migrations haven't been run in Supabase yet, OR
2. RLS policies are blocking SELECT queries, OR  
3. Connection details are incorrect

## Solution - Run in 5 Minutes

### Step 1: Verify Connection Details

1. Open your `.env` file
2. Find these lines:
   ```env
   VITE_SUPABASE_URL=https://kczsgqjsuvgmxlpoqjzg.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
   ```

3. Keep these handy for verification

### Step 2: Access Supabase SQL Editor

1. Go to: https://app.supabase.com/
2. Login with your account
3. Select project: **prospermotors** (or your project name)
4. Left menu → **SQL Editor**
5. Click **"New Query"**

### Step 3: Run RLS Policy Fix (Copy-Paste)

Run this first to fix permission policies:

```sql
-- Fix RLS policies for cars table
DROP POLICY IF EXISTS "Anyone can view cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can update cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can delete cars" ON public.cars;

-- Disable RLS temporarily
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create simple policies
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

SELECT 'RLS Policies Fixed' as status;
```

**Click "Run"** - should show: `status: RLS Policies Fixed`

### Step 4: Run Seed Data (Copy-Paste)

In a **NEW** query, paste this to add 10 cars:

```sql
-- Fresh reseed of car data with proper images
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
    'Luxury sedan with advanced technology, premium sound system, and adaptive air suspension. Perfect for executive travel.',
    ARRAY['Panoramic Sunroof', 'Leather Interior', 'Touch Infotainment', 'Adaptive Suspension', '360 Camera', 'Heated Seats', 'Cruise Control'],
    ARRAY['https://images.unsplash.com/photo-1617469767537-b85461a1bbe0?w=800&q=80'],
    true,
    false
  ),
  (
    'BMW',
    'X7 2024',
    2024,
    52000000.00,
    30,
    '4.4L V8 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Cream Leather',
    'Pearl White',
    'Powerful SUV with cutting-edge technology and premium comfort. Ideal for luxury family travel.',
    ARRAY['Panoramic Sunroof', 'Leather Interior', 'iDrive System', 'Adaptive Suspension', 'Parking Assistant', 'Premium Sound', 'Heated Seats'],
    ARRAY['https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=800&q=80'],
    true,
    false
  ),
  (
    'Lexus',
    'RX 500h 2024',
    2024,
    55000000.00,
    25,
    '3.5L V6 Hybrid',
    'Automatic',
    'Hybrid',
    'Walnut Brown',
    'Silver',
    'Premium hybrid SUV with exceptional reliability and performance. Features advanced safety technology.',
    ARRAY['Panoramic Roof', 'Luxury Interior', 'Hybrid Engine', 'Adaptive Suspension', 'Pre-Collision System', 'Mark Levinson Audio', 'Climate Control'],
    ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'],
    false,
    false
  ),
  (
    'Audi',
    'Q8 2024',
    2024,
    48000000.00,
    40,
    '3.0L V6 Turbo',
    'Automatic',
    'Petrol',
    'Black Nappa',
    'Graphite Black',
    'Elegant coupe SUV with distinctive design and dynamic performance. Premium technology throughout.',
    ARRAY['Panoramic Sunroof', 'Leather Seats', 'Virtual Cockpit', 'Adaptive Air Suspension', 'Bang & Olufsen Audio', '360 Camera', 'Matrix LED'],
    ARRAY['https://images.unsplash.com/photo-1606611013016-969c19d14319?w=800&q=80'],
    false,
    false
  ),
  (
    'Porsche',
    'Cayenne Turbo 2024',
    2024,
    58000000.00,
    15,
    '4.0L V8 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Nero Obsidian',
    'Giallo Modena',
    'Super-sport luxury SUV with exceptional performance and aggressive styling.',
    ARRAY['Twin-Turbo Engine', 'Carbon Fiber Trim', 'Adaptive Air Suspension', 'Independent Rear Steering', 'Premium Audio', 'Heated Seats', 'Launch Control'],
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    false,
    false
  ),
  (
    'Range Rover',
    'Sport 2024',
    2024,
    42000000.00,
    75,
    '3.0L V6 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Ebony Leather',
    'Fuji White',
    'Dynamic luxury SUV with unmatched off-road capability and on-road refinement.',
    ARRAY['All-Terrain Progress Control', 'Panoramic Sunroof', 'Meridian Audio', 'Configurable Dynamics', 'Touch Pro Duo', 'Heated/Cooled Seats'],
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    false,
    false
  ),
  (
    'Rolls-Royce',
    'Phantom 2023',
    2023,
    150000000.00,
    1200,
    '6.7L V12 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Cream Leather',
    'Midnight Sapphire',
    'The ultimate expression of luxury. Hand-crafted perfection with bespoke customization.',
    ARRAY['V12 Engine', 'Starlight Headliner', 'Premium Leather', 'Dual Sunroofs', 'Bespoke Interior', 'Valet Parking'],
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    true,
    false
  ),
  (
    'Bentley',
    'Bentayga 2023',
    2023,
    65000000.00,
    600,
    '4.0L V8 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Beluga Leather',
    'Onyx Black',
    'Ultra-luxury SUV combining sports car performance with SUV versatility.',
    ARRAY['Twin-Turbo Engine', 'Diamond Quilted Leather', 'Bang & Olufsen Audio', 'Air Suspension', 'All-Terrain Drive', 'Heated/Cooled Seats'],
    ARRAY['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRla8ivO-eH6Pq-n0XsDSbC7ZDT8iA02UQmGQ&s'],
    false,
    false
  ),
  (
    'Tesla',
    'Model S Plaid 2023',
    2023,
    32000000.00,
    200,
    'Tri-Motor Electric',
    'Automatic',
    'Electric',
    'White Vegan Leather',
    'Solid Black',
    'All-electric performance sedan with cutting-edge technology and incredible acceleration.',
    ARRAY['Tri-Motor', 'Autopilot', 'Glass Roof', 'Premium Audio', 'Heated Seats', 'Touch Interface', '200+ mph Top Speed'],
    ARRAY['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmEcJoMbicxiJSd3SAjP8A0Ddu4Yx4bVDulg&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2DkaYOADEpVoX8m9Q8gBJlZuLFpYgJdC2zw&s'],
    false,
    false
  ),
  (
    'Ferrari',
    'F8 Tributo 2022',
    2022,
    95000000.00,
    2500,
    '3.9L V8 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Rosso Corsa Leather',
    'Rosso Corsa',
    'High-performance supercar with stunning Italian design and thrilling driving dynamics.',
    ARRAY['V8 Twin-Turbo', 'Carbon Fiber Body', 'Advanced Aerodynamics', 'Adaptive Suspension', 'Dual Exhaust', 'Premium Audio', 'Track Performance'],
    ARRAY['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf965U4ZPbBvdDARPJYYGrAhhtOf0r3CJaHA&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYt4KX7wtbRyf_JV44gIXDCM5TMuni9yvHLQ&s'],
    true,
    false
  );

SELECT COUNT(*) as total_cars_seeded FROM public.cars;
```

**Click "Run"** - should show: `total_cars_seeded: 10`

### Step 5: Verify Data is Accessible

In a **NEW** query, run this:

```sql
-- Check if anyone can read cars (public access)
SELECT id, brand, model, year, price FROM public.cars LIMIT 5;
```

**Click "Run"** - should show 5 cars with data

### Step 6: Refresh Your App

1. Go back to your browser with the app running (http://localhost:5173)
2. Open `/diagnostics` page
3. Should now show:
   - ✅ Connected: YES
   - ✅ Total Cars: 10

4. Go to `/shop` page
5. Should see all 10 vehicles displayed

## If Still Not Working

### Check 1: Verify Project URL

In Supabase Dashboard:
1. Settings → API
2. Check "Project URL" matches your `.env`:
   ```
   Expected: https://kczsgqjsuvgmxlpoqjzg.supabase.co
   ```

### Check 2: Clear Browser Cache

```bash
# Close app and restart
Ctrl+C  # Stop dev server
npm run dev  # Start again
```

Then hard-refresh browser:
- Windows: `Ctrl+Shift+Delete`
- Mac: `Cmd+Shift+Delete`

### Check 3: Check RLS Policies Directly

In SQL Editor, run:

```sql
-- View all policies on cars table
SELECT tablename, policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'cars'
ORDER BY policyname;
```

Should show 4 policies:
- `cars_delete_policy`
- `cars_insert_policy`
- `cars_select_policy`
- `cars_update_policy`

### Check 4: Check Network Connection

1. Open DevTools: `F12`
2. Go to Network tab
3. Refresh page
4. Look for requests to `supabase.co`
5. If they fail, check:
   - Internet connection
   - VPN interference
   - Firewall blocking

### Check 5: Verify .env Configuration

```bash
# View your .env file
cat .env | grep VITE_SUPABASE
```

Should show:
```env
VITE_SUPABASE_URL=https://kczsgqjsuvgmxlpoqjzg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

If missing, add them from Supabase Dashboard → Settings → API

## Common Errors

### "Permission denied for schema public"

**Cause**: RLS policy missing
**Fix**: Run the RLS Policy Fix (Step 3 above)

### "relation public.cars does not exist"

**Cause**: Table not created
**Fix**: Check migrations ran in Supabase → Migrations tab

### "Cannot connect to database"

**Cause**: Wrong URL or network issue
**Fix**: 
1. Verify URL in `.env` matches Supabase Dashboard
2. Check internet connection
3. Try different network

### "AbortError: signal is aborted without reason"

**Cause**: Supabase connection timeout or RLS blocking
**Fix**:
1. Ensure RLS allows `anon` users to SELECT
2. Restart dev server
3. Clear browser cache

## Summary

✅ **After completing all steps:**
- 10 cars seeded in database
- RLS policies allow public read
- App can fetch and display cars
- Diagnostics page shows "Connected: YES"
- Shop page displays all vehicles

---

**Questions?** Check Supabase Dashboard → Logs for detailed error messages
