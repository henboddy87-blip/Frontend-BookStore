export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  genre: string;
  rating: number;
  reviews: number;
  pages: number;
  publisher: string;
  publishedYear: number;
  isbn: string;
  language: string;
  format: 'Hardcover' | 'Paperback' | 'E-Book' | 'Audiobook';
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  inStock: boolean;
  stockCount: number;
  tags: string[];
}

export interface CartItem extends Book {
  quantity: number;
  selectedFormat: string;
}

export interface WishlistItem extends Book {}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
  joinDate?: string;
  ordersCount?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  estimatedDelivery: string;
}

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
}
