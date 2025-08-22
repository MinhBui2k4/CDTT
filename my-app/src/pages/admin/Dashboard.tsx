"use client"

import { useState, useEffect, type JSX } from "react";
import { toast } from "react-toastify";
import { 
  GET_ALL_PRODUCTS, 
  GET_ORDERS, 
  GET_ALL_CONTACTS, 
  GET_ALL_USERS, 
  GET_ALL_CATEGORIES_ADMIN, 
  GET_ALL_BRANDS, 
  GET_ALL_NEWS, 
  GET_ALL_HERO_SECTIONS 
} from "../../api/adminApiService";
import type { PaginatedResponse, Order, Contact, UserDTO, Category, Brand, News, HeroSection } from "../../types/types";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";
import type { Product } from "../../types/product";
import { useNavigate } from "react-router-dom";

// Đăng ký các thành phần Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalContacts: number;
  totalUsers: number;
  totalCategories: number;
  totalBrands: number;
  totalNews: number;
  totalHeroSections: number;
}

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalContacts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalNews: 0,
    totalHeroSections: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const [
          productsResponse,
          ordersResponse,
          contactsResponse,
          usersResponse,
          categoriesResponse,
          brandsResponse,
          newsResponse,
          heroSectionsResponse,
        ] = await Promise.all([
          GET_ALL_PRODUCTS({ pageNumber: 0, pageSize: 1 }),
          GET_ORDERS({ page: 0, size: 5, sortOrder: "desc"}), 
          GET_ALL_CONTACTS({ pageNumber: 0, pageSize: 1 }),
          GET_ALL_USERS({ pageNumber: 0, pageSize: 1 }),
          GET_ALL_CATEGORIES_ADMIN({ pageNumber: 0, pageSize: 1 }),
          GET_ALL_BRANDS({ pageNumber: 0, pageSize: 1 }),
          GET_ALL_NEWS({ pageNumber: 0, pageSize: 1 }),
          GET_ALL_HERO_SECTIONS({ pageNumber: 0, pageSize: 1 }),
        ] as [
          Promise<PaginatedResponse<Product>>,
          Promise<PaginatedResponse<Order>>,
          Promise<PaginatedResponse<Contact>>,
          Promise<PaginatedResponse<UserDTO>>,
          Promise<PaginatedResponse<Category>>,
          Promise<PaginatedResponse<Brand>>,
          Promise<PaginatedResponse<News>>,
          Promise<PaginatedResponse<HeroSection>>
        ]);

        setStats({
          totalProducts: productsResponse.totalElements,
          totalOrders: ordersResponse.totalElements,
          totalContacts: contactsResponse.totalElements,
          totalUsers: usersResponse.totalElements,
          totalCategories: categoriesResponse.totalElements,
          totalBrands: brandsResponse.totalElements,
          totalNews: newsResponse.totalElements,
          totalHeroSections: heroSectionsResponse.totalElements,
        });

        setRecentOrders(ordersResponse.content || []);
      } catch (error) {
        toast.error("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tính tổng thu nhập từ các đơn hàng gần đây
  const totalRevenue = recentOrders.reduce((sum, order) => sum + (order.total + (order.shippingCost ?? 0)), 0).toLocaleString("vi-VN");

  // Dữ liệu mẫu cho biểu đồ đường nhỏ (thay bằng dữ liệu thực tế từ API)
  const revenueTrendData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        data: [100000, 200000, 500000, 800000, 1112350000], // Dữ liệu mẫu tăng dần
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn (Tổng quan chính)
  const pieChartData = {
    labels: ["Sản phẩm", "Đơn hàng", "Khách hàng", "Liên hệ"],
    datasets: [
      {
        data: [stats.totalProducts, stats.totalOrders, stats.totalUsers, stats.totalContacts],
        backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"],
        hoverBackgroundColor: ["#2563EB", "#059669", "#7C3AED", "#D97706"],
      },
    ],
  };

  // Dữ liệu cho biểu đồ cột (Danh mục, Thương hiệu, Tin tức, Hero Sections)
  const barChartData = {
    labels: ["Danh mục", "Thương hiệu", "Tin tức", "Hero Sections"],
    datasets: [
      {
        label: "Số lượng",
        data: [stats.totalCategories, stats.totalBrands, stats.totalNews, stats.totalHeroSections],
        backgroundColor: ["#EF4444", "#14B8A6", "#EC4899", "#F97316"],
        borderColor: ["#DC2626", "#0F766E", "#DB2777", "#EA580C"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn legend cho biểu đồ đường nhỏ
      },
    },
    scales: {
      x: {
        display: false, 
      },
      y: {
        display: false, 
      },
    },
  };

  if (loading) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động cửa hàng</p>
      </div>

      {/* Thêm phần hiển thị tổng thu nhập với biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng thu nhập</p>
            <p className="text-2xl font-semibold text-gray-900">111.350.000 đ</p>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
              +13.6%
            </span>
          </div>
          <div className="w-1/3 h-16">
            <Line data={revenueTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Biểu đồ tổng quan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan chính</h3>
            <div className="h-80">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê khác</h3>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h3>
        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-500">Không có đơn hàng gần đây</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Đơn hàng: 
                    <button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="text-blue-600 hover:text-blue-900 underline ml-1"
                    >
                      {order.id}
                    </button>
                  </p>
                  <p className="text-sm text-gray-600">Người dùng id: {order.userId}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {(order.total + (order.shippingCost ?? 0)).toLocaleString("vi-VN")} đ
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : order.status === "ORDERED" || order.status === "CONFIRMED"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status === "ORDERED"
                      ? "Đã đặt hàng"
                      : order.status === "CONFIRMED"
                        ? "Đã xác nhận"
                        : order.status === "PROCESSING"
                          ? "Đang xử lý"
                          : order.status === "SHIPPED"
                            ? "Đang giao"
                            : order.status === "COMPLETED"
                              ? "Hoàn thành"
                              : "Đã hủy"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}