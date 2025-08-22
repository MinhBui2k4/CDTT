// src/types/index.ts
import type { Product } from "./product";

export interface Brand {
  id: number;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "PENDING" | "RESOLVED" | "CLOSED";
  createdAt: string; // LocalDateTime sẽ được chuyển thành chuỗi ISO
  userId: number | null;
}

export interface HeroSection {
  id: number;
  heading: string;
  subheading: string;
  backgroundImage: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number; // ID của User
}

export interface News {
  id: number;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: "ORDERED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  total: number;
  shippingCost: number;
  paymentMethodId: number;
  shippingAddressId: number;
  items: OrderItem[];
  timeline: OrderTimeline[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product; // Có thể bao gồm thông tin sản phẩm nếu API trả về
}

export interface OrderTimeline {
  id: number;
  orderId: number;
  status: Order["status"];
  date: string;
  description: string | null;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string | null;
}

export interface Role {
  id: number;
  name: "ADMIN" | "USER";
}

export interface User {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  roles: Role[];
  addresses?: AddressDTO[];
  orders?: Order[];
}

export interface UserDTO {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  roles: Role[];
  orders?: Order[];
}


export interface AddressDTO {
  id: number;
  userId: number;
  name: string;
  phone: string;
  address: string;
  ward: string | null;
  district: string | null;
  province: string | null;
  type: string | null;
  isDefault: boolean;
}

export interface PaginatedResponse<T> {
  message: string | null;
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}