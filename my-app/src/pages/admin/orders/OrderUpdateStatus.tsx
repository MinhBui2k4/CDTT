import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_ORDER_BY_ID, UPDATE_ORDER_STATUS } from "../../../api/adminApiService";
import type { Order } from "../../../types/types";

export default function OrderUpdateStatus(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<Order["status"]>("ORDERED");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      if (!id) {
        toast.error("ID đơn hàng không hợp lệ");
        navigate("/admin/orders");
        return;
      }

      try {
        setLoading(true);
        const orderResponse = await GET_ORDER_BY_ID(Number(id));
        setOrder(orderResponse);
        setStatus(orderResponse.status);
      } catch (error) {
        toast.error("Không thể tải thông tin đơn hàng");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setStatus(e.target.value as Order["status"]);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!order) return;

    try {
      await UPDATE_ORDER_STATUS(order.id, status);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      navigate("/admin/orders");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  if (loading || !order) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Cập nhật trạng thái đơn hàng #{order.id}</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Trạng thái hiện tại</label>
          <p className="text-gray-900">
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
          </p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Trạng thái mới</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ORDERED">Đã đặt hàng</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đã giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
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