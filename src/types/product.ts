export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  event_date: string | null;
  status: 'active' | 'inactive' | 'sold_out' | 'upcoming';
  slug: string;
  image_url: string | null;
  max_quantity: number | null;
  sold_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_method: string;
  pix_key: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface PaymentData {
  recipientType: string;
  recipient: string;
  amount: string;
  description: string;
}