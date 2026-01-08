export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string | Date;
}

export interface Category {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: User;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  categories?: Category[];
  reviews?: Review[];
}
