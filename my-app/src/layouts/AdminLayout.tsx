import { useState, type JSX } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { name: "Bảng điều khiển", path: "/admin", icon: "🏠" },
  { name: "Quản lý sản phẩm", path: "/admin/products", icon: "📦" },
  { name: "Quản lý danh mục", path: "/admin/categories", icon: "📋" },
  { name: "Quản lý thương hiệu", path: "/admin/brands", icon: "🏷️" },
  // { name: "Quản lý phương thức thanh toán", path: "/admin/payment-methods", icon: "💳" },
  { name: "Quản lý đơn hàng", path: "/admin/orders", icon: "🛒" },
  // { name: "Quản lý liên hệ", path: "/admin/contacts", icon: "📞" },
  // { name: "Quản lý báo", path: "/admin/news", icon: "📰" },
  { name: "Quản lý banner", path: "/admin/hero-sections", icon: "🖼️" },
  // { name: "Roles", path: "/admin/roles", icon: "👤" },
  { name: "Quản lý người dùng", path: "/admin/users", icon: "👥" },
];

export default function AdminLayout(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRoles");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <span className={`text-xl font-bold ${isSidebarOpen ? "block" : "hidden"}`}>Bảng điều khiển</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center p-4 hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className={isSidebarOpen ? "block" : "hidden"}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow p-4 flex justify-between items-center "
                  style={{ marginLeft: isSidebarOpen ? "16rem" : "4rem", transition: "margin-left 0.3s" }}>
          {/* <h1 className="text-2xl font-bold">TechStore Admin</h1> */}
          {/* <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <span className="text-xl font-bold text-red-600 md:text-2xl">
                Minh<span className="text-gray-800">Tech</span>
              </span>
            </Link>
          </div> */}
            <div>
              <button
                onClick={handleLogout}
                className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50"
              >
                Đăng xuất
              </button>
            </div>
          </header>
        {/* Content */}
        <main className="pt-20 p-6 mt-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}