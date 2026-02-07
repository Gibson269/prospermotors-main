#!/usr/bin/env node

/**
 * Seed Script for Prosperous Motors Database
 * This script directly inserts car data with proper Unsplash image URLs
 * Run this after setting up Supabase connection
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

const carsData = [
  {
    brand: 'Mercedes-Benz',
    model: 'S-Class 2024',
    year: 2024,
    price: 45000000,
    mileage: 50,
    engine: '3.0L V6 Turbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Black Leather',
    exterior_color: 'Midnight Black',
    description: 'Luxury sedan with advanced technology, premium sound system, and adaptive air suspension. Perfect for executive travel.',
    features: ['Panoramic Sunroof', 'Leather Interior', 'Touch Infotainment', 'Adaptive Suspension', '360 Camera', 'Heated Seats', 'Cruise Control'],
    images: ['https://images.unsplash.com/photo-1617469767537-b85461a1bbe0?w=800&q=80'],
    is_featured: true,
    is_sold: false
  },
  {
    brand: 'BMW',
    model: 'X7 2024',
    year: 2024,
    price: 52000000,
    mileage: 30,
    engine: '4.4L V8 Twin-Turbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Cream Leather',
    exterior_color: 'Pearl White',
    description: 'Powerful SUV with cutting-edge technology and premium comfort. Ideal for luxury family travel.',
    features: ['Panoramic Sunroof', 'Leather Interior', 'iDrive System', 'Adaptive Suspension', 'Parking Assistant', 'Premium Sound', 'Heated Seats'],
    images: ['https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=800&q=80'],
    is_featured: true,
    is_sold: false
  },
  {
    brand: 'Lexus',
    model: 'RX 500h 2024',
    year: 2024,
    price: 55000000,
    mileage: 25,
    engine: '3.5L V6 Hybrid',
    transmission: 'Automatic',
    fuel_type: 'Hybrid',
    interior_color: 'Walnut Brown',
    exterior_color: 'Silver',
    description: 'Premium hybrid SUV with exceptional reliability and performance. Features advanced safety technology.',
    features: ['Panoramic Roof', 'Luxury Interior', 'Hybrid Engine', 'Adaptive Suspension', 'Pre-Collision System', 'Mark Levinson Audio', 'Climate Control'],
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'],
    is_featured: false,
    is_sold: false
  },
  {
    brand: 'Audi',
    model: 'Q8 2024',
    year: 2024,
    price: 48000000,
    mileage: 40,
    engine: '3.0L V6 Turbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Black Nappa',
    exterior_color: 'Graphite Black',
    description: 'Elegant coupe SUV with distinctive design and dynamic performance. Premium technology throughout.',
    features: ['Panoramic Sunroof', 'Leather Seats', 'Virtual Cockpit', 'Adaptive Air Suspension', 'Bang & Olufsen Audio', '360 Camera', 'Matrix LED'],
    images: ['https://images.unsplash.com/photo-1606611013016-969c19d14319?w=800&q=80'],
    is_featured: false,
    is_sold: false
  },
  {
    brand: 'Porsche',
    model: 'Cayenne Turbo 2024',
    year: 2024,
    price: 58000000,
    mileage: 15,
    engine: '4.0L V8 Twin-Turbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Black Leather',
    exterior_color: 'Racing Yellow',
    description: 'High-performance SUV with sports car DNA. Exceptional acceleration and handling.',
    features: ['Air Suspension', 'Leather Interior', 'Turbocharger', 'Adaptive Dynamics', 'Panoramic Roof', 'Premium Audio', 'Sports Exhaust'],
    images: ['https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80'],
    is_featured: true,
    is_sold: false
  },
  {
    brand: 'Range Rover',
    model: 'Sport SVR 2024',
    year: 2024,
    price: 50000000,
    mileage: 20,
    engine: '5.0L V8 Supercharged',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Ebony Leather',
    exterior_color: 'Fuji White',
    description: 'Iconic SUV combining luxury with unmatched off-road capability. Commanding presence.',
    features: ['All-Terrain Response', 'Leather Seats', 'Panoramic Roof', 'Merlin Suspension', 'Meridian Audio', 'Terrain Management', 'Night Vision'],
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c3ca856d1?w=800&q=80'],
    is_featured: false,
    is_sold: false
  },
  {
    brand: 'Rolls-Royce',
    model: 'Phantom 2024',
    year: 2024,
    price: 85000000,
    mileage: 5,
    engine: '6.7L V12 Twin-Turbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Bespoke Cream',
    exterior_color: 'Diamond Black',
    description: 'The pinnacle of luxury automobiles. Unparalleled craftsmanship and exclusivity.',
    features: ['Bespoke Interior', 'Starlight Headliner', 'Self-Closing Doors', 'Adaptive Air Suspension', 'Rear Entertainment', 'Premium Audio', 'Climate Seats'],
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c3ca856d1?w=800&q=80'],
    is_featured: true,
    is_sold: false
  },
  {
    brand: 'Bentley',
    model: 'Bentayga Speed 2024',
    year: 2024,
    price: 68000000,
    mileage: 10,
    engine: '6.0L W12 Twin-Turbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Oyster Leather',
    exterior_color: 'Satin Moonlight',
    description: 'British luxury SUV with handcrafted elegance. Designed for the discerning clientele.',
    features: ['Handcrafted Interior', 'Panoramic Roof', 'Active Suspension', 'Mulliner Specifications', 'Premium Audio', 'Massage Seats', 'All-Weather Capability'],
    images: ['https://images.unsplash.com/photo-1609708536573-a4787e2355a7?w=800&q=80'],
    is_featured: true,
    is_sold: false
  },
  {
    brand: 'Tesla',
    model: 'Model S Plaid 2024',
    year: 2024,
    price: 42000000,
    mileage: 100,
    engine: 'Tri Motor',
    transmission: 'Automatic',
    fuel_type: 'Electric',
    interior_color: 'Black Vegan Leather',
    exterior_color: 'Ultra White',
    description: 'Revolutionary electric sedan with incredible performance. Zero emissions, maximum efficiency.',
    features: ['Tri Motor', 'Autopilot', 'Panoramic Glass', 'Premium Audio', 'Over-the-air Updates', 'Touchscreen Control', 'Supercharging'],
    images: ['https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=800&q=80'],
    is_featured: false,
    is_sold: false
  },
  {
    brand: 'Lamborghini',
    model: 'Urus S 2024',
    year: 2024,
    price: 75000000,
    mileage: 8,
    engine: '4.0L V8 Twin-Turbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: 'Black Alcantara',
    exterior_color: 'Rosso Corsa',
    description: 'Super SUV with Italian passion. Breathtaking performance and striking design.',
    features: ['Carbon Fiber', 'Magnetic Suspension', 'Rotund Control', 'Leather Interior', 'Premium Audio', 'Panoramic Roof', 'Air Suspension'],
    images: ['https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80'],
    is_featured: true,
    is_sold: false
  }
];

async function seedCars() {
  try {
    console.log('Starting database seed...');
    
    // Delete existing cars
    const { error: deleteError } = await supabase
      .from('cars')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError && deleteError.code !== 'PGRST204') {
      throw deleteError;
    }
    
    console.log('✓ Cleared existing cars');
    
    // Insert new cars
    const { data, error: insertError } = await supabase
      .from('cars')
      .insert(carsData)
      .select();
    
    if (insertError) {
      throw insertError;
    }
    
    console.log(`✓ Inserted ${data?.length || 0} cars successfully`);
    console.log('\nSeeded cars:');
    data?.forEach(car => {
      console.log(`  - ${car.brand} ${car.model} (${car.year})`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedCars();
