export type ProductCategory = 'beds_mattresses' | 'pillows_cushions' | 'footwear_shoes' | 'clothing_accessories';

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  oldPrice?: number;
  category: ProductCategory;
  image: string;
  advantages: string[];
  sizes?: string[]; // e.g. ["Solteiro", "Casal", "Queen", "King"] or ["35", "36", "37"] or ["P", "M", "G"]
  densities?: string[]; // e.g. ["D28", "D33", "D45"] or ["Soft", "Médio", "Firme"]
  colors?: string[]; // e.g. ["Branco", "Cinza", "Azul"]
  sku: string;
  inStock: boolean;
}

export interface CartItem {
  id: string; // Unique identifier for the cart item (combining product ID and custom options like size/density)
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedDensity?: string;
  selectedColor?: string;
}

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
}

export interface PromoBanner {
  text: string;
  bgColor: string;
  textColor: string;
  emoji: string;
  active: boolean;
}

export interface HeroBanner {
  tagline: string;
  titleLine1: string;
  titleHighlighted: string;
  description: string;
  backgroundImage: string;
  badgeTitle1: string;
  badgeDesc1: string;
  badgeTitle2: string;
  badgeDesc2: string;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  addressStreet?: string;
  addressNumber?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  paymentMethod: 'pix' | 'credit_card' | 'debit_card' | 'cash';
  notes?: string;
}
