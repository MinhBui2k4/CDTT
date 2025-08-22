import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/products/ProductManagement";
import CategoryManagement from "./pages/admin/categorys/CategoryManagement";
import BrandManagement from "./pages/admin/brands/BrandManagement";
import LoginForm from "./pages/admin/auth/LoginForm";
import ProtectedRoute from "./pages/admin/auth/ProtectedRoute";
import ContactManagement from "./pages/admin/contacts/ContactManagement";
import PaymentMethodManagement from "./pages/admin/payment-methods/PaymentMethodManagement";
import NewsManagement from "./pages/admin/news/NewsManagement";
import HeroSectionManagement from "./pages/admin/hero-sections/HeroSectionManagement";
import RoleManagement from "./pages/admin/roles/RoleManagement";
import OrderManagement from "./pages/admin/orders/OrderManagement";
import UserManagement from "./pages/admin/users/UserManagement";
import ProductView from "./pages/admin/products/ProductView";
import ProductAdd from "./pages/admin/products/ProductAdd";
import ProductEdit from "./pages/admin/products/ProductEdit";
import OrderView from "./pages/admin/orders/OrderView";
import OrderUpdateStatus from "./pages/admin/orders/OrderUpdateStatus";
import ContactUpdateStatus from "./pages/admin/contacts/ContactUpdateStatus";
import ContactView from "./pages/admin/contacts/ContactView";
import NewsAdd from "./pages/admin/news/NewsAdd";
import NewsEdit from "./pages/admin/news/NewsEdit";
import HeroSectionAdd from "./pages/admin/hero-sections/HeroSectionAdd";
import HeroSectionEdit from "./pages/admin/hero-sections/HeroSectionEdit";
import UserView from "./pages/admin/users/UserView";
import UserAdd from "./pages/admin/users/UserAdd";
import UserEdit from "./pages/admin/users/UserEdit";
import NewsView from "./pages/admin/news/NewsView";
import HeroSectionView from "./pages/admin/hero-sections/HeroSectionView";

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            {/* products */}
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id" element={<ProductView />} />
            <Route path="products/add" element={<ProductAdd />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            
            {/* orders */}
            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/:id" element={<OrderView />} />
            <Route path="orders/update/:id" element={<OrderUpdateStatus />} />

            {/* contacts */}
            <Route path="contacts" element={<ContactManagement />} />
            <Route path="contacts/:id" element={<ContactView />} />
            <Route path="contacts/update/:id" element={<ContactUpdateStatus />} />

            {/* news */}
            <Route path="news" element={<NewsManagement />} />
            <Route path="news/add" element={<NewsAdd />} />
            <Route path="news/edit/:id" element={<NewsEdit />} />
            <Route path="news/:id" element={<NewsView />} />

            {/* hero-sections */}
            <Route path="hero-sections" element={<HeroSectionManagement />} />
            <Route path="hero-sections/add" element={<HeroSectionAdd />} />
            <Route path="hero-sections/edit/:id" element={<HeroSectionEdit />} />
            <Route path="hero-sections/:id" element={<HeroSectionView />} />
            {/* users */}
            <Route path="users" element={<UserManagement />} />
            <Route path="users/:id" element={<UserView />} />
            <Route path="users/add" element={<UserAdd />} />
            <Route path="users/edit/:id" element={<UserEdit />} />

            {/* categories */}
            <Route path="categories" element={<CategoryManagement />} />

            {/* brands */}
            <Route path="brands" element={<BrandManagement />} />

            {/* payment-methods */}
            <Route path="payment-methods" element={<PaymentMethodManagement />} />

            {/* roles */}
            <Route path="roles" element={<RoleManagement />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}