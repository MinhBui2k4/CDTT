import axiosInstance from "./axiosConfig";
import type { AddressDTO, Brand, Category, Contact, HeroSection, News, Order, PaginatedResponse, PaymentMethod, Role, User, UserDTO } from "../types/types";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Product } from "../types/product";

interface CallApiParams {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  params?: Record<string, string | number>;
  requireAuth?: boolean;
  isMultipart?: boolean;
}

async function callApi<T>({
  endpoint,
  method = "GET",
  body = null,
  params = undefined,
  requireAuth = true,
  isMultipart = false,
}: CallApiParams): Promise<T> {
  const token = localStorage.getItem("authToken");

  if (requireAuth && !token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  const queryString = params && typeof params === "object"
    ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";
  const url = `${endpoint}${queryString ? `?${queryString}` : ""}`;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    },
    data: body || null,
  };

  if (requireAuth && token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response: AxiosResponse<T> = await axiosInstance(config);
    console.log("API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("API call error:", error.response?.data || error.message);
    throw error;
  }
}
// Admin APIs

// Product Management APIs
export async function GET_ALL_PRODUCTS(
  params: {
    categoryId?: number;
    brandId?: number;
    search?: string;
    priceStart?: number;
    priceEnd?: number;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Product>> {
  // Tạo đối tượng params chỉ chứa các giá trị không phải undefined
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  // Chỉ thêm các trường nếu chúng có giá trị
  if (params.categoryId !== undefined) queryParams.categoryId = params.categoryId;
  if (params.brandId !== undefined) queryParams.brandId = params.brandId;
  if (params.search !== undefined) queryParams.search = params.search;
  if (params.priceStart !== undefined) queryParams.priceStart = params.priceStart;
  if (params.priceEnd !== undefined) queryParams.priceEnd = params.priceEnd;

  return callApi<PaginatedResponse<Product>>({
    endpoint: "/products",
    method: "GET",
    params: queryParams,
    requireAuth: false,
  });
}
export async function GET_PRODUCT_BY_ID(id: number): Promise<Product> {
  return callApi<Product>({
    endpoint: `/products/${id}`,
    method: "GET",
    requireAuth: false, // API này không yêu cầu quyền admin
  });
}

export async function SEARCH_PRODUCT(
  search: string,
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Product>> {
  return callApi<PaginatedResponse<Product>>({
    endpoint: "/products/search",
    method: "GET",
    params: {
      search,
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 10,
      sortBy: params.sortBy ?? "id",
      sortOrder: params.sortOrder ?? "asc",
    },
    requireAuth: false, // API này không yêu cầu quyền admin
  });
}

export async function CREATE_PRODUCT(formData: FormData): Promise<Product> {
  return callApi<Product>({
    endpoint: "/products",
    method: "POST",
    body: formData,
    requireAuth: true,
    isMultipart: true,
  });
}

export async function UPDATE_PRODUCT(id: number, formData: FormData): Promise<Product> {
  return callApi<Product>({
    endpoint: `/products/${id}`,
    method: "PUT",
    body: formData,
    requireAuth: true,
    isMultipart: true,
  });
}

export async function DELETE_PRODUCT(id: number): Promise<void> {
  return callApi<void>({
    endpoint: `/products/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

export async function GET_PRODUCTS_NEW(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Product>> {
  return callApi<PaginatedResponse<Product>>({
    endpoint: "/products/new",
    method: "GET",
    params: {
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 10,
      sortBy: params.sortBy ?? "id",
      sortOrder: params.sortOrder ?? "asc",
    },
    requireAuth: false, // API này không yêu cầu quyền admin
  });
}

export async function GET_PRODUCTS_SALES(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Product>> {
  return callApi<PaginatedResponse<Product>>({
    endpoint: "/products/sales",
    method: "GET",
    params: {
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 10,
      sortBy: params.sortBy ?? "id",
      sortOrder: params.sortOrder ?? "asc",
    },
    requireAuth: false, // API này không yêu cầu quyền admin
  });
}

export async function GET_PRODUCTS_AVAILABLE(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Product>> {
  return callApi<PaginatedResponse<Product>>({
    endpoint: "/products/availability",
    method: "GET",
    params: {
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 10,
      sortBy: params.sortBy ?? "id",
      sortOrder: params.sortOrder ?? "asc",
    },
    requireAuth: false, // API này không yêu cầu quyền admin
  });
}

// Category Management APIs
export async function CREATE_CATEGORY(data: Omit<Category, "id">): Promise<Category> {
  return callApi<Category>({
    endpoint: "/admin/categories",
    method: "POST",
    body: data,
    requireAuth: true,
  });
}

export async function GET_CATEGORY_BY_ID(id: number): Promise<Category> {
  return callApi<Category>({
    endpoint: `/admin/categories/${id}`,
    method: "GET",
    requireAuth: false,
  });
}

export async function GET_ALL_CATEGORIES_ADMIN(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Category>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<Category>>({
    endpoint: "/admin/categories",
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function UPDATE_CATEGORY(id: number, data: Omit<Category, "id">): Promise<Category> {
  return callApi<Category>({
    endpoint: `/admin/categories/${id}`,
    method: "PUT",
    body: data,
    requireAuth: true,
  });
}

export async function DELETE_CATEGORY(id: number): Promise<void> {
  return callApi<void>({
    endpoint: `/admin/categories/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

// Brand Management APIs
export async function CREATE_BRAND(data: Omit<Brand, "id">): Promise<Brand> {
  return callApi<Brand>({
    endpoint: "/admin/brands",
    method: "POST",
    body: data,
    requireAuth: true,
  });
}

export async function GET_BRAND_BY_ID(id: number): Promise<Brand> {
  return callApi<Brand>({
    endpoint: `/admin/brands/${id}`,
    method: "GET",
    requireAuth: false,
  });
}

export async function GET_ALL_BRANDS(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Brand>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<Brand>>({
    endpoint: "/admin/brands",
    method: "GET",
    params: queryParams,
    requireAuth: false,
  });
}

export async function UPDATE_BRAND(id: number, data: Omit<Brand, "id">): Promise<Brand> {
  return callApi<Brand>({
    endpoint: `/admin/brands/${id}`,
    method: "PUT",
    body: data,
    requireAuth: true,
  });
}

export async function DELETE_BRAND(id: number): Promise<void> {
  return callApi<void>({
    endpoint: `/admin/brands/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

// Payment Method Management APIs
export async function GET_ALL_PAYMENT_METHODS(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<PaymentMethod>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<PaymentMethod>>({
    endpoint: "/admin/payment-methods",
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function CREATE_PAYMENT_METHOD(data: any): Promise<any> {
  return callApi({
    endpoint: "/admin/payment-methods",
    method: "POST",
    body: data,
    requireAuth: true,
  });
}

export async function UPDATE_PAYMENT_METHOD(id: number, data: any): Promise<any> {
  return callApi({
    endpoint: `/admin/payment-methods/${id}`,
    method: "PUT",
    body: data,
    requireAuth: true,
  });
}

export async function DELETE_PAYMENT_METHOD(id: number): Promise<void> {
  return callApi({
    endpoint: `/admin/payment-methods/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

// Contact Management APIs
export async function CREATE_CONTACT(data: Omit<Contact, "id" | "createdAt" | "status" | "userId">): Promise<Contact> {
  return callApi<Contact>({
    endpoint: "/contacts",
    method: "POST",
    body: data,
    requireAuth: false,
  });
}

export async function GET_ALL_CONTACTS(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Contact>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<Contact>>({
    endpoint: "/contacts",
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function GET_CONTACT_BY_ID(id: number): Promise<Contact> {
  return callApi<Contact>({
    endpoint: `/contacts/${id}`,
    method: "GET",
    requireAuth: true,
  });
}

export async function UPDATE_CONTACT_STATUS(
  id: number,
  status: "PENDING" | "RESOLVED" | "CLOSED"
): Promise<Contact> {
  return callApi<Contact>({
    endpoint: `/contacts/${id}/status`,
    method: "PUT",
    body: { status },
    requireAuth: true,
  });
}

export async function DELETE_CONTACT(id: number): Promise<void> {
  return callApi<void>({
    endpoint: `/contacts/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

// News Management APIs
export async function CREATE_NEWS(formData: FormData): Promise<News> {
  return callApi<News>({
    endpoint: "/news",
    method: "POST",
    body: formData,
    requireAuth: true,
    isMultipart: true,
  });
}

export async function GET_ALL_NEWS(
  params: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
  } = {}
): Promise<PaginatedResponse<News>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
  };
  if (params.search !== undefined) queryParams.search = params.search;

  return callApi<PaginatedResponse<News>>({
    endpoint: "/news",
    method: "GET",
    params: queryParams,
    requireAuth: false,
  });
}

export async function GET_NEWS_BY_ID(id: number): Promise<News> {
  return callApi<News>({
    endpoint: `/news/${id}`,
    method: "GET",
    requireAuth: false,
  });
}

export async function UPDATE_NEWS(id: number, formData: FormData): Promise<News> {
  return callApi<News>({
    endpoint: `/news/${id}`,
    method: "PUT",
    body: formData,
    requireAuth: true,
    isMultipart: true,
  });
}

export async function DELETE_NEWS(id: number): Promise<void> {
  return callApi<void>({
    endpoint: `/news/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}
// Hero Section Management APIs
export async function CREATE_HERO_SECTION(formData: FormData): Promise<HeroSection> {
  return callApi<HeroSection>({
    endpoint: "/hero",
    method: "POST",
    body: formData,
    requireAuth: true,
    isMultipart: true,
  });
}

export async function UPDATE_HERO_SECTION(id: number, formData: FormData): Promise<HeroSection> {
  return callApi<HeroSection>({
    endpoint: `/hero/${id}`,
    method: "PUT",
    body: formData,
    requireAuth: true,
    isMultipart: true,
  });
}

export async function GET_ALL_HERO_SECTIONS(
  params: {
    pageNumber?: number;
    pageSize?: number;
  } = {}
): Promise<PaginatedResponse<HeroSection>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 5,
  };

  return callApi<PaginatedResponse<HeroSection>>({
    endpoint: "/hero",
    method: "GET",
    params: queryParams,
    requireAuth: false,
  });
}

export async function GET_HERO_SECTION_BY_ID(id: number): Promise<HeroSection> {
  return callApi<HeroSection>({
    endpoint: `/hero/${id}`,
    method: "GET",
    requireAuth: false,
  });
}

export async function DELETE_HERO_SECTION(id: number): Promise<void> {
  return callApi<void>({
    endpoint: `/hero/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

// Role Management APIs
export async function GET_ALL_ROLES(): Promise<Role[]> {
  return callApi<Role[]>({
    endpoint: "/admin/roles",
    method: "GET",
    requireAuth: true,
  });
}

export async function GET_ROLE_BY_ID(id: number): Promise<Role> {
  return callApi<Role>({
    endpoint: `/admin/roles/${id}`,
    method: "GET",
    requireAuth: true,
  });
}

export async function CREATE_ROLE(data: Omit<Role, "id">): Promise<Role> {
  return callApi<Role>({
    endpoint: "/admin/roles",
    method: "POST",
    body: data,
    requireAuth: true,
  });
}

export async function UPDATE_ROLE(id: number, data: Omit<Role, "id">): Promise<Role> {
  return callApi<Role>({
    endpoint: `/admin/roles/${id}`,
    method: "PUT",
    body: data,
    requireAuth: true,
  });
}

export async function DELETE_ROLE(id: number): Promise<void> {
  return callApi<void>({
    endpoint: `/admin/roles/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

// User Management APIs
export async function GET_ALL_USERS(
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<UserDTO>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<UserDTO>>({
    endpoint: "/users",
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function GET_USER_BY_ID(id: number, includeOrders: boolean = false): Promise<UserDTO> {
  const queryParams: Record<string, string | number> = {
    includeOrders,
  };

  return callApi<UserDTO>({
    endpoint: `/users/${id}`,
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function GET_USER_BY_EMAIL(email: string): Promise<UserDTO> {
  return callApi<UserDTO>({
    endpoint: `/users/email/${email}`,
    method: "GET",
    requireAuth: true,
  });
}

export async function GET_PROFILE(): Promise<UserDTO> {
  return callApi<UserDTO>({
    endpoint: "/users/profile",
    method: "GET",
    requireAuth: true,
  });
}

export async function UPDATE_USER(id: number, formData: FormData): Promise<UserDTO> {
  return callApi<UserDTO>({
    endpoint: "/users",
    method: "PUT",
    body: formData,
    requireAuth: true,
    isMultipart: true,
  });
}

export async function DELETE_USER(id: number): Promise<string> {
  return callApi<string>({
    endpoint: `/users/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}

// Order Management APIs
export async function UPDATE_ORDER_STATUS(
  id: number,
  status: Order["status"]
): Promise<Order> {
  return callApi<Order>({
    endpoint: `/orders/admin/${id}/status`,
    method: "PUT",
    body: { status },
    requireAuth: true,
  });
}


export async function GET_ORDERS(params: {
  page?: number;
  size?: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
} = {}): Promise<PaginatedResponse<Order>> {
  const queryParams: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 10,
    sort: params.sort ?? "orderDate",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<Order>>({
    endpoint: "/orders/admin/all",
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function GET_ORDERS_BY_STATUS(status: string, params: {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}): Promise<PaginatedResponse<Order>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<Order>>({
    endpoint: `/orders/status/${status.toUpperCase()}`,
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function GET_ORDER_BY_ID(id: number): Promise<Order> {
  return callApi<Order>({
    endpoint: `/orders/${id}`,
    method: "GET",
    requireAuth: true,
  });
}
// Auth APIs
export async function LOGIN(body: { email: string; password: string }): Promise<{
  roles: string[];
  message: string;
  userId: string;
  email: string;
  token: string;
}> {
  return callApi({
    endpoint: "/auth/login",
    method: "POST",
    body,
    requireAuth: false,
  });
}

export async function CREATE_USER(body: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  roleName: "USER" | "ADMIN";
}): Promise<UserDTO> {
  return callApi<UserDTO>({
    endpoint: "/users/create",
    method: "POST",
    body,
    requireAuth: true,
  });
}

// Address Management APIs
export async function GET_ALL_ADDRESSES(params: {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}): Promise<PaginatedResponse<AddressDTO>> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "id",
    sortOrder: params.sortOrder ?? "asc",
  };

  return callApi<PaginatedResponse<AddressDTO>>({
    endpoint: "/users/addresses",
    method: "GET",
    params: queryParams,
    requireAuth: true,
  });
}

export async function GET_ADDRESS_BY_ID(id: number): Promise<AddressDTO> {
  return callApi<AddressDTO>({
    endpoint: `/users/addresses/${id}`,
    method: "GET",
    requireAuth: true,
  });
}
