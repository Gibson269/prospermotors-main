# Quick Start: Adding Your First Vehicle

## 📍 Step-by-Step

### Step 1: Login to Admin
1. Navigate to `http://localhost:5173/admin`
2. Login with your admin credentials:
   - Email: `admin@prosperousmotors.com`
   - Password: `ChangeMe123!` (or your updated password)
3. You should see the admin dashboard

### Step 2: Go to Cars Management
1. Click **"Cars"** in the left sidebar
2. You should see the Cars page with an **"Add Car"** button
3. Click **"Add Car"** button (green button with + icon)
4. A dialog form should open

### Step 3: Fill in Required Fields

**Basic Information:**
- **Brand:** Mercedes-Benz
- **Model:** S-Class
- **Year:** 2024

**Pricing & Condition:**
- **Price (NGN):** 45000000
- **Mileage (km):** 5000

### Step 4: Fill Optional Details (Recommended)

**Specifications:**
- **Engine:** 3.0L V6 Turbo
- **Transmission:** Automatic
- **Fuel Type:** Petrol

**Colors:**
- **Exterior Color:** Obsidian Black
- **Interior Color:** Saddle Brown Leather

**Details:**
- **Description:** Premium luxury sedan with advanced technology and comfort features
- **Features:** Sunroof, Heated Seats, Navigation System, Panoramic Roof, Leather Interior

### Step 5: Add Images

1. Copy a car image URL (e.g., from a free stock photo site)
2. Paste into "Enter image URL" field
3. Click the **"+"** button
4. Repeat for multiple images (recommended: 3-5 images)

**Good Image Sources:**
- https://www.pexels.com (free high-quality photos)
- https://pixabay.com (free images)
- Direct URLs from manufacturer websites

### Step 6: Set Features

**Optional Toggles:**
- **Featured:** Check this to show on homepage
- **Sold:** Leave unchecked (only check if already sold)

### Step 7: Save the Car

1. Click **"Add Car"** button at bottom of form
2. You should see a success message
3. Car should appear in the table below

---

## ✅ Verification

After adding a car, verify it:

1. **In Admin:**
   - Car appears in the Cars table
   - Image shows in table preview
   - Price displays correctly

2. **In Shop:**
   - Go to `http://localhost:5173/shop`
   - Car should appear in the grid
   - Image should display
   - Price should show in NGN format
   - All details should be visible

3. **Edit Check:**
   - Click edit icon on car
   - Form should populate with saved data
   - Can modify and save changes

---

## 🛠️ If Something Goes Wrong

### Error: "Failed to add car"
- Check all required fields are filled (Brand, Model, Year, Price)
- Check price is a valid number
- Check you're logged in as admin
- Check browser console for detailed error

### Error: Image not showing
- Verify image URL is valid (starts with http/https)
- Try a different image URL
- Some URLs may have CORS restrictions

### Car added but not showing in Shop
- Go back to Cars and click refresh
- Try clearing browser cache (Ctrl+Shift+Delete)
- Check car `is_sold` is set to false

---

## 📊 Sample Vehicles

Here are sample vehicles you can add:

### Vehicle 1: Mercedes-Benz S-Class
```
Brand: Mercedes-Benz
Model: S-Class
Year: 2024
Price: 45000000
Mileage: 5000
Engine: 3.0L V6 Turbo
Transmission: Automatic
Fuel Type: Petrol
Exterior Color: Obsidian Black
Interior Color: Saddle Brown Leather
Features: Sunroof, Heated Seats, Navigation, Panoramic Roof
Featured: Yes
```

### Vehicle 2: BMW 7 Series
```
Brand: BMW
Model: 7 Series
Year: 2023
Price: 42000000
Mileage: 8000
Engine: 3.5L Twin-Turbo
Transmission: Automatic
Fuel Type: Petrol
Exterior Color: Alpine White
Interior Color: Oyster Leather
Features: M Sport Package, Night Vision, Gesture Control
Featured: Yes
```

### Vehicle 3: Audi A8
```
Brand: Audi
Model: A8
Year: 2024
Price: 40000000
Mileage: 0
Engine: 3.0L V6 TFSI
Transmission: Automatic
Fuel Type: Petrol
Exterior Color: Glacier White
Interior Color: Nappa Leather
Features: Virtual Cockpit, Automated Driving, Bang & Olufsen Sound
Featured: No
```

### Vehicle 4: Range Rover Sport
```
Brand: Range Rover
Model: Sport
Year: 2023
Price: 38000000
Mileage: 12000
Engine: 3.0L Supercharged V6
Transmission: Automatic
Fuel Type: Petrol
Exterior Color: Fuji White
Interior Color: Ebony Leather
Features: All-Terrain Response, Terrain Response 2, Panoramic Sunroof
Featured: Yes
```

### Vehicle 5: Porsche 911
```
Brand: Porsche
Model: 911 Carrera
Year: 2024
Price: 55000000
Mileage: 0
Engine: 3.0L Twin-Turbo Flat-6
Transmission: PDK Automatic
Fuel Type: Petrol
Exterior Color: Guards Red
Interior Color: Black Leather
Features: Sport Chrono, Adaptive Suspension, Sport Exhaust
Featured: Yes
```

---

## 🎯 Best Practices

1. **Add at least 4-6 featured cars** on homepage
2. **Use high-quality images** (high resolution)
3. **Complete descriptions** help customers
4. **Set realistic prices** in NGN
5. **Regular updates** - add new inventory regularly
6. **Remove sold vehicles** - mark as sold instead of deleting
7. **Keep features list relevant** - highlight key selling points

---

## 📈 After Adding Vehicles

1. Go to Shop page (`/shop`) to see public view
2. Test filters and search
3. Add 1-2 vehicles to cart
4. Complete checkout process
5. Check order appears in `/admin/orders`

---

## 🚀 Ready?

Start adding vehicles now! Each vehicle takes ~2 minutes to add.

**Goal:** Get 10 vehicles in system first, then refine as needed.

