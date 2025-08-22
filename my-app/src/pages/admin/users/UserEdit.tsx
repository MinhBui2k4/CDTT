import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_USER_BY_ID, UPDATE_USER } from "../../../api/adminApiService";
import type { UserDTO } from "../../../types/types";

interface UserFormData {
  fullName: string;
  email: string;
  avatar: File | null;
  password: string;
  phone: string;
}

export default function UserEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    avatar: null,
    password: "",
    phone: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      if (!id) {
        toast.error("ID người dùng không hợp lệ");
        navigate("/admin/users");
        return;
      }

      try {
        setLoading(true);
        const response = await GET_USER_BY_ID(Number(id), false);
        setUser(response);
        setFormData({
          fullName: response.fullName || "",
          email: response.email,
          avatar: null,
          password: "",
          phone: response.phone || "",
        });
      } catch (error) {
        toast.error("Không thể tải thông tin người dùng");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!user) return;

    try {
      const userData = new FormData();
      userData.append("id", user.id.toString());
      userData.append("fullName", formData.fullName || "");
      userData.append("email", formData.email);
      userData.append("phone", formData.phone || "");
      if (formData.avatar) userData.append("avatarFile", formData.avatar);
      if (formData.password) userData.append("password", formData.password);

      await UPDATE_USER(user.id, userData);
      toast.success("Cập nhật người dùng thành công!");
      navigate("/admin/users");
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật người dùng");
    }
  };

  if (loading || !user) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chỉnh sửa người dùng #{user.id}</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Nhập tên người dùng"
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
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Avatar</label>
          <input
            type="file"
            name="avatar"
            onChange={handleInputChange}
            className="block w-full"
          />
          <div className="flex space-x-4 mt-2">
            {user.avatarUrl && (
              <div>
                <p className="text-sm text-gray-600">Avatar hiện tại:</p>
                <img
                  src={`http://localhost:8080/api/users/image/${user.avatarUrl}`}
                  alt="Avatar hiện tại"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=User";
                  }}
                />
              </div>
            )}
            {avatarPreview && (
              <div>
                <p className="text-sm text-gray-600">Avatar mới:</p>
                <img
                  src={avatarPreview}
                  alt="Avatar mới"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
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
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}