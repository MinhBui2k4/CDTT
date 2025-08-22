import { useState, useEffect, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_USER_BY_ID } from "../../../api/adminApiService";
import type { UserDTO } from "../../../types/types";

export default function UserView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detailedUser, setDetailedUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async (): Promise<void> => {
      if (!id) {
        toast.error("ID người dùng không hợp lệ");
        navigate("/admin/users");
        return;
      }

      try {
        setLoading(true);
        const response = await GET_USER_BY_ID(Number(id), true); // Include orders
        setDetailedUser(response);
      } catch (error) {
        toast.error("Không thể tải chi tiết người dùng");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id, navigate]);

  if (loading || !detailedUser) return <p className="text-center py-8">Đang tải...</p>;

  const getStatusLabelAndStyle = (
    status: string
  ): { label: string; className: string } => {
    switch (status) {
      case "ORDERED":
        return { label: "Đã đặt hàng", className: "bg-blue-100 text-blue-800" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", className: "bg-green-100 text-green-800" };
      case "PROCESSING":
        return { label: "Đang xử lý", className: "bg-yellow-100 text-yellow-800" };
      case "SHIPPED":
        return { label: "Đã giao", className: "bg-purple-100 text-purple-800" };
      case "COMPLETED":
        return { label: "Hoàn thành", className: "bg-teal-100 text-teal-800" };
      case "CANCELLED":
        return { label: "Đã hủy", className: "bg-red-100 text-red-800" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chi tiết người dùng #{detailedUser.id}</h2>
        <button
          onClick={() => navigate("/admin/users")}
           className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Đóng
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar</label>
            <img
              src={
                detailedUser.avatarUrl
                  ? `http://localhost:8080/api/users/image/${detailedUser.avatarUrl}`
                  : "https://placehold.co/100x100/e2e8f0/64748b?text=User"
              }
              alt={detailedUser.fullName || "User"}
              className="w-24 h-24 rounded-full object-cover mt-2"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=User";
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên</label>
            <p className="text-gray-900">{detailedUser.fullName || "N/A"}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{detailedUser.email || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <p className="text-gray-900">{detailedUser.phone || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vai trò</label>
          <p className="text-gray-900">
            {detailedUser.roles?.map((role) => role.name).join(", ") || "N/A"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Đơn hàng</label>
          {Array.isArray(detailedUser.orders) && detailedUser.orders.length > 0 ? (
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedUser.orders.map((order, index) => {
                    const { label, className } = getStatusLabelAndStyle(order.status);
                    return (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            className="text-blue-600 hover:text-blue-900 underline"
                          >
                            #{order.id}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${className}`}
                          >
                            {label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(order.total + (order.shippingCost ?? 0)).toLocaleString("vi-VN")} ₫
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Không có đơn hàng nào</p>
          )}
        </div>
      </div>
    </div>
  );
}