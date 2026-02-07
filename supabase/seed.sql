-- Supabase seed script for Prosperous Motors
-- This script sets up the admin user and seed car data

-- ============================================
-- ADMIN USER SETUP
-- ============================================
-- Note: The admin user must be created through Supabase Auth UI or API first
-- This script assumes the user already exists in auth.users table

-- Add admin role to the first user created (usually the admin)
-- Replace the email with your actual admin email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email = 'admin@prosperousmotors.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- SEED CAR DATA
-- ============================================
-- Clear existing cars first to ensure clean state
DELETE FROM public.cars;

-- Insert luxury and premium cars into the inventory
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
    ARRAY['https://images.unsplash.com/photo-1617469767537-b85461a1bbe0?w=800&q=80', 'https://images.unsplash.com/photo-1609708536573-a4787e2355a7?w=800&q=80'],
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
    'Tan Leather',
    'Alpine White',
    'Premium luxury SUV with advanced driver assistance systems and spacious interior for 7 passengers.',
    ARRAY['7-Seater', 'Panoramic Sunroof', 'Premium Audio', 'Adaptive Headlights', 'Lane Assist', 'Traffic Jam Assist', 'Gesture Control'],
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80', 'https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    true,
    false
  ),
  (
    'Lexus',
    'RX 500h F-Sport',
    2024,
    38000000.00,
    100,
    '3.5L V6 Hybrid',
    'Automatic',
    'Hybrid',
    'Caramel Leather',
    'Pearl White',
    'Luxury hybrid SUV combining performance with fuel efficiency. Advanced safety features and quiet ride.',
    ARRAY['Hybrid Engine', 'Panoramic Roof', 'Mark Levinson Audio', 'Pre-Collision System', 'Adaptive Dynamic Suspension', 'Power Tailgate'],
    ARRAY['https://images.unsplash.com/photo-1606611282867-04ca886e944e?w=800&q=80'],
    false,
    false
  ),
  (
    'Audi',
    'Q8 2023',
    2023,
    35000000.00,
    500,
    '3.0L V6 TFSI',
    'Automatic',
    'Petrol',
    'Black Nappa',
    'Quantum Gray',
    'Sleek luxury SUV with stunning coupe-like design and excellent handling dynamics.',
    ARRAY['Panoramic Sunroof', 'Bang & Olufsen Audio', 'Virtual Cockpit', 'Matrix LED Headlights', 'Air Suspension', 'Adaptive Cruise Control'],
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    false,
    false
  ),
  (
    'Porsche',
    'Cayenne Turbo',
    2023,
    55000000.00,
    800,
    '4.0L V8 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Black Leather',
    'Racing Yellow',
    'High-performance luxury SUV with sports car dynamics and commanding presence.',
    ARRAY['Turbo Engine', 'Panoramic Sunroof', 'Premium Sound System', 'Ceramic Brakes', 'All-Wheel Drive', 'Adaptive Suspension', 'Sport Chrono'],
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    true,
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
    'Phantom 2022',
    2022,
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
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    false,
    false
  ),
  (
    'Tesla',
    'Model S Plaid',
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
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    false,
    false
  ),
  (
    'Lamborghini',
    'Urus Performante',
    2023,
    75000000.00,
    400,
    '4.0L V8 Twin-Turbo',
    'Automatic',
    'Petrol',
    'Nero Obsidian',
    'Giallo Modena',
    'Super-sport luxury SUV with exceptional performance and aggressive styling.',
    ARRAY['Twin-Turbo Engine', 'Carbon Fiber', 'Adaptive Air Suspension', 'Independent Rear Steering', 'Premium Audio', 'Heated Seats', 'Launch Control'],
    ARRAY['https://images.unsplash.com/photo-1606611283424-569d7ecabc15?w=800&q=80'],
    false,
    false
  );

-- Verify the seeded data
SELECT COUNT(*) as total_cars FROM public.cars;

-- Verify the admin role was assigned
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@prosperousmotors.com';
