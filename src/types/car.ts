export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  engine?: string;
  transmission?: string;
  fuel_type?: string;
  interior_color?: string;
  exterior_color?: string;
  description?: string;
  features?: string[];
  images?: string[];
  is_featured?: boolean;
  is_sold?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  car: Car;
  quantity: number;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  items: CartItem[];
  total_amount: number;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
