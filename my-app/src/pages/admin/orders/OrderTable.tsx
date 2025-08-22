import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import type { Order } from "../../../types/types";

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  currentPage: number;
  pageSize: number;
}

export default function OrderTable({ orders, onViewDetails, onUpdateStatus, currentPage, pageSize }: OrderTableProps): JSX.Element {
  const navigate = useNavigate();
  const startIndex = currentPage * pageSize;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Đơn hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người dùng
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
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                Không có đơn hàng nào
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === "ORDERED"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PROCESSING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "SHIPPED"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "COMPLETED"
                        ? "bg-teal-100 text-teal-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "ORDERED"
                      ? "Đã đặt hàng"
                      : order.status === "CONFIRMED"
                      ? "Đã xác nhận"
                      : order.status === "PROCESSING"
                      ? "Đang xử lý"
                      : order.status === "SHIPPED"
                      ? "Đã giao"
                      : order.status === "COMPLETED"
                      ? "Hoàn thành"
                      : "Đã hủy"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(order.total + order.shippingCost).toLocaleString("vi-VN")} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="text-gray-600 hover:text-gray-800 mr-2"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onUpdateStatus(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Cập nhật
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}