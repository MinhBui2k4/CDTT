import { useState, useEffect, type JSX } from "react";
import { toast } from "react-toastify";
import PaymentMethodTable from "./PaymentMethodTable";
import PaymentMethodForm from "./PaymentMethodForm";
import { GET_ALL_PAYMENT_METHODS } from "../../../api/adminApiService";
import type { PaymentMethod, PaginatedResponse } from "../../../types/types";

export default function PaymentMethodManagement(): JSX.Element {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPaymentMethods();
  }, [currentPage]);

  const fetchPaymentMethods = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await GET_ALL_PAYMENT_METHODS({
        pageNumber: currentPage,
        pageSize,
        sortBy: "id",
        sortOrder: "asc",
      }) as PaginatedResponse<PaymentMethod>;
      setPaymentMethods(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách phương thức thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const handleFormOpen = (paymentMethod: PaymentMethod | null = null): void => {
    setEditingPaymentMethod(paymentMethod);
    setIsFormOpen(true);
  };

  const handleFormClose = (): void => {
    setIsFormOpen(false);
    setEditingPaymentMethod(null);
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý phương thức thanh toán</h1>
        <button
          onClick={() => handleFormOpen()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">➕</span> Thêm phương thức thanh toán
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Danh sách phương thức thanh toán</h2>
        </div>
        <PaymentMethodTable
          paymentMethods={paymentMethods}
          onEdit={handleFormOpen}
          setPaymentMethods={setPaymentMethods}
        />
        {/* Chỉ hiển thị phân trang nếu paymentMethods.length >= 10 */}
        {paymentMethods.length >= 10 && (
          <div className="p-4 flex justify-center items-center">
            {renderPagination()}
          </div>
        )}
      </div>

      {isFormOpen && (
        <PaymentMethodForm
          paymentMethod={editingPaymentMethod}
          onClose={handleFormClose}
          onSave={fetchPaymentMethods}
        />
      )}
    </div>
  );
}