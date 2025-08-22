import { useState, type ChangeEvent, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CREATE_USER } from "../../../api/adminApiService";

interface AddUserFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  roleName: "USER" | "ADMIN";
}

export default function UserAdd(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddUserFormData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    roleName: "USER",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false); // Thêm trạng thái showPassword

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await CREATE_USER({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        roleName: formData.roleName,
      });
      toast.success("Thêm người dùng thành công!");
      navigate("/admin/users");
    } catch (error: any) {
      toast.error(error?.message || "Không thể thêm người dùng");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Thêm người dùng mới</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Nhập họ và tên"
            required
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Nhập email"
            required
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Thay đổi type dựa trên showPassword
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              required
              className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Vai trò</label>
          <select
            name="roleName"
            value={formData.roleName}
            onChange={handleInputChange}
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}