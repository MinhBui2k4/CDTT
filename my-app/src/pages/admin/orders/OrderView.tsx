import { useState, useEffect, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_ORDER_BY_ID, GET_ADDRESS_BY_ID, GET_USER_BY_ID, GET_PRODUCT_BY_ID } from "../../../api/adminApiService";
import type { Order, AddressDTO, User } from "../../../types/types";
import type { Product } from "../../../types/product";

export default function OrderView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detailedOrder, setDetailedOrder] = useState<Order | null>(null);
  const [shippingAddress, setShippingAddress] = useState<AddressDTO | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async (): Promise<void> => {
      if (!id) {
        toast.error("ID đơn hàng không hợp lệ");
        navigate("/admin/orders");
        return;
      }

      try {
        setLoading(true);
        const [orderResponse, addressResponse, userResponse] = await Promise.all([
          GET_ORDER_BY_ID(Number(id)),
          GET_ADDRESS_BY_ID((await GET_ORDER_BY_ID(Number(id))).shippingAddressId),
          GET_USER_BY_ID((await GET_ORDER_BY_ID(Number(id))).userId),
        ]);
        setDetailedOrder(orderResponse);
        setShippingAddress(addressResponse);
        setUser(userResponse);

        const productPromises = orderResponse.items.map((item) =>
          GET_PRODUCT_BY_ID(item.productId).catch(() => null)
        );
        const productResponses = await Promise.all(productPromises);
        setProducts(productResponses.filter((product): product is Product => product !== null));
      } catch (error) {
        toast.error("Không thể tải chi tiết đơn hàng");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  if (loading || !detailedOrder) return <p className="text-center py-8">Đang tải...</p>;

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

  const getTimelineStatusColor = (status: string): string => {
    switch (status) {
      case "ORDERED": return "bg-blue-500";
      case "CONFIRMED": return "bg-green-500";
      case "PROCESSING": return "bg-yellow-500";
      case "SHIPPED": return "bg-purple-500";
      case "COMPLETED": return "bg-teal-500";
      case "CANCELLED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const { label, className } = getStatusLabelAndStyle(detailedOrder.status);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chi tiết đơn hàng #{detailedOrder.id}</h2>
        <button
          onClick={() => navigate(-1)}
          className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Đóng
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
          <p className="text-gray-900">{user?.fullName || "N/A"} ({user?.email || "N/A"})</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày đặt hàng</label>
          <p className="text-gray-900">{new Date(detailedOrder.orderDate).toLocaleString("vi-VN")}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${className}`}>
            {label}
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
          {shippingAddress ? (
            <div className="text-gray-900">
              <p><strong>Tên người nhận:</strong> {shippingAddress.name}</p>
              <p><strong>Số điện thoại:</strong> {shippingAddress.phone}</p>
              <p><strong>Địa chỉ:</strong> {shippingAddress.address}</p>
              <p>
                {shippingAddress.ward && `${shippingAddress.ward}, `}
                {shippingAddress.district && `${shippingAddress.district}, `}
                {shippingAddress.province || "N/A"}
              </p>
              <p><strong>Loại địa chỉ:</strong> {shippingAddress.type || "N/A"}</p>
            </div>
          ) : (
            <p className="text-gray-500">Không có thông tin địa chỉ</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sản phẩm</label>
          <div className="mt-2">
            {detailedOrder.items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <div key={item.id} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        product?.image
                          ? `http://localhost:8080/api/products/image/${product.image}`
                          : "https://placehold.co/60x60/e2e8f0/64748b?text=Product"
                      }
                      alt={product?.name || `Sản phẩm #${item.productId}`}
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/60x60/e2e8f0/64748b?text=Product";
                      }}
                    />
                    <div>
                      <p className="text-gray-900">{product?.name || `Sản phẩm #${item.productId}`}</p>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-gray-900">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phí vận chuyển</label>
            <p className="text-gray-900">{detailedOrder.shippingCost.toLocaleString("vi-VN")} ₫</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tổng tiền</label>
            <p className="text-gray-900">{(detailedOrder.total + detailedOrder.shippingCost).toLocaleString("vi-VN")} ₫</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lịch sử trạng thái</label>
          <div className="relative pl-6">
            {detailedOrder.timeline.map((event, index) => (
              <div key={event.id} className="relative flex items-start mb-6">
                <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                <div className={`absolute left-[-10px] w-5 h-5 rounded-full ${getTimelineStatusColor(event.status)}`}></div>
                <div className="ml-6">
                  <p className="text-gray-900 font-medium">{getStatusLabelAndStyle(event.status).label}</p>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString("vi-VN")}</p>
                  {event.description && <p className="text-sm text-gray-500">{event.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}