import { useState, useEffect, type JSX, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderTable from "./OrderTable";
import { GET_ORDERS, GET_ORDERS_BY_STATUS } from "../../../api/adminApiService";
import type { Order, PaginatedResponse } from "../../../types/types";

export default function OrderManagement(): JSX.Element {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const pageSize = 15;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      let response: PaginatedResponse<Order>;
      if (statusFilter) {
        response = await GET_ORDERS_BY_STATUS(statusFilter, {
          pageNumber: currentPage,
          pageSize,
          sortBy: "orderDate",
          sortOrder: "desc",
        });
      } else {
        response = await GET_ORDERS({
          page: currentPage,
          size: pageSize,
          sort: "orderDate",
          sortOrder: "desc",
        });
      }
      setOrders(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(e.target.value);
    setCurrentPage(0); // Reset về trang đầu khi thay đổi bộ lọc
  };

  const handleViewDetails = (order: Order): void => {
    navigate(`/admin/orders/${order.id}`);
  };

  const handleUpdateStatus = (order: Order): void => {
    navigate(`/admin/orders/update/${order.id}`);
  };

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const renderPagination = (): JSX.Element => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow);

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Trước
        </button>
        {startPage > 0 && (
          <>
            <button
              onClick={() => handlePageChange(0)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 1 && <span className="px-3 py-1">...</span>}
          </>
        )}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {page + 1}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-3 py-1">...</span>}
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Sau
        </button>
      </div>
    );
  };

  if (loading) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        </div>
        <div className="space-x-4">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ORDERED">Đã đặt hàng</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đã giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Danh sách đơn hàng</h2>
        </div>
        <OrderTable
          orders={orders}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
          currentPage={currentPage}
          pageSize={pageSize}
        />
        <div className="p-4 flex justify-center items-center">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}