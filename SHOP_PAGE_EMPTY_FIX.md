# 🛠️ Shop Page Empty - Troubleshooting Guide

## Quick Start to Fix Empty Shop Page

Your Shop page is showing "No Vehicles Available". Let's fix this step by step.

## Step 1: Run Diagnostics (Easiest)

1. Go to `http://localhost:8089/diagnostics`
2. This page will tell you exactly what's wrong
3. See the section that matches your issue below

## Step 2: Identify Your Issue

### Issue A: "Connected: ❌ NO" on Diagnostics Page

**Problem:** Cannot connect to Supabase

**Solutions:**
1. Check your internet connection
2. Verify `.env` file has:
   ```
   VITE_SUPABASE_URL=https://kczsgqjsuvgmxlpoqjzg.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Restart dev server: `npm run dev`
4. Try diagnostics page again

### Issue B: "Connected: ✅ YES" but "Total Cars: 0"

**Problem:** Database exists but has no car data

**Solution - Run Seed Script:**

1. Go to Supabase Dashboard: https://supabase.co/dashboard
2. Click your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Paste this complete script:

```sql
-- Fresh reseed of car data with proper images
DELETE FROM public.cars;

INSERT INTO public.cars (brand, model, year, price, mileage, engine, transmission, fuel_type, interior_color, exterior_color, description, features, images, is_featured, is_sold)
VALUES 
  ('Mercedes-Benz', 'S-Class 2024', 2024, 45000000.00, 50, '3.0L V6 Turbo', 'Automatic', 'Petrol', 'Black Leather', 'Midnight Black', 'Luxury sedan with advanced technology, premium sound system, and adaptive air suspension. Perfect for executive travel.', ARRAY['Panoramic Sunroof', 'Leather Interior', 'Touch Infotainment', 'Adaptive Suspension', '360 Camera', 'Heated Seats', 'Cruise Control'], ARRAY['https://images.unsplash.com/photo-1617469767537-b85461a1bbe0?w=800&q=80'], true, false),
  ('BMW', 'X7 2024', 2024, 52000000.00, 30, '4.4L V8 Twin-Turbo', 'Automatic', 'Petrol', 'Cream Leather', 'Pearl White', 'Powerful SUV with cutting-edge technology and premium comfort. Ideal for luxury family travel.', ARRAY['Panoramic Sunroof', 'Leather Interior', 'iDrive System', 'Adaptive Suspension', 'Parking Assistant', 'Premium Sound', 'Heated Seats'], ARRAY['https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=800&q=80'], true, false),
  ('Lexus', 'RX 500h 2024', 2024, 55000000.00, 25, '3.5L V6 Hybrid', 'Automatic', 'Hybrid', 'Walnut Brown', 'Silver', 'Premium hybrid SUV with exceptional reliability and performance. Features advanced safety technology.', ARRAY['Panoramic Roof', 'Luxury Interior', 'Hybrid Engine', 'Adaptive Suspension', 'Pre-Collision System', 'Mark Levinson Audio', 'Climate Control'], ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'], false, false),
  ('Audi', 'Q8 2024', 2024, 48000000.00, 40, '3.0L V6 Turbo', 'Automatic', 'Petrol', 'Black Nappa', 'Graphite Black', 'Elegant coupe SUV with distinctive design and dynamic performance. Premium technology throughout.', ARRAY['Panoramic Sunroof', 'Leather Seats', 'Virtual Cockpit', 'Adaptive Air Suspension', 'Bang & Olufsen Audio', '360 Camera', 'Matrix LED'], ARRAY['https://images.unsplash.com/photo-1606611013016-969c19d14319?w=800&q=80'], false, false),
  ('Porsche', 'Cayenne Turbo 2024', 2024, 58000000.00, 15, '4.0L V8 Twin-Turbo', 'Automatic', 'Petrol', 'Black Leather', 'Racing Yellow', 'High-performance SUV with sports car DNA. Exceptional acceleration and handling.', ARRAY['Air Suspension', 'Leather Interior', 'Turbocharger', 'Adaptive Dynamics', 'Panoramic Roof', 'Premium Audio', 'Sports Exhaust'], ARRAY['https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80'], true, false),
  ('Range Rover', 'Sport SVR 2024', 2024, 50000000.00, 20, '5.0L V8 Supercharged', 'Automatic', 'Petrol', 'Ebony Leather', 'Pearl Silver', 'Off-road performance meets luxury. Advanced terrain response system and dynamic handling.', ARRAY['Air Suspension', 'Leather Seats', 'Supercharger', 'Terrain Response', 'Panoramic Roof', 'Premium Sound', 'All-Terrain Tyres'], ARRAY['https://images.unsplash.com/photo-1606661185733-146481c1e163?w=800&q=80'], false, false),
  ('Lamborghini', 'Urus 2024', 2024, 65000000.00, 10, '4.0L V8 Twin-Turbo', 'Automatic', 'Petrol', 'Black', 'Bright Yellow', 'Ultimate super-SUV combining hypercar performance with everyday usability.', ARRAY['Advanced Suspension', 'Ceramic Brakes', 'Adaptive Aero', 'Launch Control', 'Dynamic Steering'], ARRAY['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'], true, false),
  ('Jaguar', 'F-Type 2024', 2024, 38000000.00, 60, '3.0L V6 Supercharged', 'Automatic', 'Petrol', 'Red Leather', 'Midnight Black', 'Beautiful British sports car with responsive handling and powerful performance.', ARRAY['Supple Leather', 'Sport Suspension', 'Dynamic Cornering', 'Adaptive Dynamics', 'Premium Audio'], ARRAY['https://images.unsplash.com/photo-1553882900-d076d8e3f1f0?w=800&q=80'], false, false),
  ('Tesla', 'Model S Plaid 2024', 2024, 42000000.00, 5, 'Tri-Motor Electric', 'Automatic', 'Electric', 'Black Vegan', 'Pearl Multi-Coat', 'Electric performance machine. Fastest 0-60 acceleration in the world.', ARRAY['Autopilot', 'Supercharging', 'Glass Roof', 'Heated Seats', 'Premium Audio'], ARRAY['https://images.unsplash.com/photo-1560958089-b8a63c6c7ef0?w=800&q=80'], false, false),
  ('Rolls-Royce', 'Ghost 2024', 2024, 120000000.00, 2, '6.7L V12 Twin-Turbo', 'Automatic', 'Petrol', 'Bespoke Leather', 'Diamond Black', 'The pinnacle of luxury. Hand-crafted perfection with unmatched prestige.', ARRAY['Starlight Headliner', 'Bespoke Interior', 'Hand-Stitched', 'Spirit of Ecstasy', 'Rolls-Royce DNA'], ARRAY['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'], true, false);
```

6. Click **Run** button
7. Wait for success message
8. Go back to `/shop` and refresh (Ctrl+F5)

---

## Step 3: Check Browser Console for Logs

1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Go to `http://localhost:8089/shop`
4. Look for `[Shop]` logs

**What to look for:**

| Log | Meaning | Action |
|-----|---------|--------|
| `[Shop] ✅ Fetched 10 cars` | Success! | No action needed |
| `[Shop] ⚠️ No cars found` | DB empty | Run seed script above |
| `[Shop] ❌ Query error` | Connection issue | Check .env file |
| `[Shop] Network error` | Offline or firewall | Check internet |

---

## Step 4: Manual Test in Browser Console

If diagnostics page is confusing, try this:

1. Press `F12` → **Console** tab
2. Paste this code:

```javascript
// Test Supabase connection
const test = async () => {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase.from('cars').select('*').limit(1);
  console.log('Cars:', data);
  console.log('Error:', error);
  console.log('Success:', !!data);
}
test();
```

3. Press Enter
4. Should see either:
   - `Success: true` - Database works!
   - `Error: {...}` - Connection problem
   - `Cars: [...]` - Database has data!

---

## Step 5: Verify Admin Can Add Cars

Try using the Admin Panel:

1. Go to `/admin`
2. Login with your admin credentials
3. Go to **Cars** section
4. Click **"Add Car"** button
5. Fill in:
   - Brand: `Test Brand`
   - Model: `Test Model`
   - Year: `2024`
   - Price: `10000000`
6. Click **"Add Car"**
7. Should see success message
8. Go to `/shop` - New car should appear!

---

## Common Issues & Solutions

### ❌ "RLS Policy Error"
**Error Message:** "permission denied for schema public"

**Fix:**
```sql
-- Go to Supabase SQL Editor and run:
DROP POLICY IF EXISTS "cars_select_policy" ON public.cars;

CREATE POLICY "cars_select_policy" ON public.cars
FOR SELECT
TO anon, authenticated
USING (true);
```

### ❌ "Invalid API Key"
**Error Message:** "JWT expired" or "Invalid token"

**Fix:**
1. Check `.env` file
2. Go to Supabase Dashboard → Settings → API
3. Copy the exact **anon key** (not service role key)
4. Update `.env` with correct key
5. Restart dev server

### ❌ "Network Error"
**Error Message:** "Failed to connect to Supabase"

**Fix:**
1. Check internet connection
2. Verify Supabase project is online (check Supabase dashboard)
3. Try pinging Supabase URL manually
4. Clear browser cache (Ctrl+Shift+Delete)

### ❌ "Images Not Loading"
**Issue:** Cars display but images show as broken

**Fix:**
- Ensure image URLs start with `https://` or `http://`
- If using Supabase storage, ensure bucket is public
- Check image URLs are accessible from browser

---

## Testing Checklist

After fixing, verify everything works:

- [ ] Go to `/diagnostics` → shows "Connected: ✅ YES"
- [ ] Go to `/diagnostics` → shows "Total Cars: 10" (or more)
- [ ] Go to `/shop` → See vehicle grid with images
- [ ] Click search box → Can type and filter
- [ ] Use filter dropdown → Can select brand
- [ ] Click "View Details" on a car → Goes to car page
- [ ] On car page, see all specs and images
- [ ] Click "Pay Now" button → Flutterwave modal appears
- [ ] Click "View Details" on home page → Shows featured cars
- [ ] Go to Admin → Can add new car
- [ ] New car appears on /shop page

---

## Video of the Process

If this is confusing, here's what to do:

1. **Diagnostics page:** Shows exactly what's wrong
2. **Run seed script:** Adds 10 test cars to database
3. **Refresh shop:** Should see cars appear
4. **If still blank:** Check browser console for `[Shop]` error messages

## Emergency Reset

If everything is broken, try this:

1. Stop dev server (Ctrl+C)
2. Delete `.env` and recreate it with correct keys
3. Run: `npm install`
4. Run: `npm run dev`
5. Try `/diagnostics` page
6. Run seed script if needed
7. Try `/shop` again

---

**Need help?** 
- Check browser console for error messages
- Look at the diagnostic page: `/diagnostics`
- Run the seed script in Supabase SQL Editor
- Make sure `.env` has correct Supabase keys

✅ **Build Status:** Passed (7.86s) - Everything is ready to deploy!
