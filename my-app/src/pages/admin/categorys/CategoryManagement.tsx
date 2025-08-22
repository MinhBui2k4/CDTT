import { useState, useEffect, type JSX } from "react";
import { toast } from "react-toastify";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import { GET_ALL_CATEGORIES_ADMIN } from "../../../api/adminApiService";
import type { Category, PaginatedResponse } from "../../../types/types";

export default function CategoryManagement(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await GET_ALL_CATEGORIES_ADMIN({
        pageNumber: currentPage,
        pageSize,
        sortBy: "id",
        sortOrder: "asc",
      }) as PaginatedResponse<Category>;
      setCategories(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleFormOpen = (category: Category | null = null): void => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = (): void => {
    setIsFormOpen(false);
    setEditingCategory(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        </div>
        <button
          onClick={() => handleFormOpen()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">➕</span> Thêm danh mục
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Danh sách danh mục</h2>
        </div>
        <CategoryTable
          categories={categories}
          onEdit={handleFormOpen}
          setCategories={setCategories}
        />
        {/* Chỉ hiển thị phân trang nếu categories.length >= 10 */}
        {categories.length >= 10 && (
          <div className="p-4 flex justify-center items-center">
            {renderPagination()}
          </div>
        )}
      </div>

      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          onClose={handleFormClose}
          onSave={fetchCategories}
        />
      )}
    </div>
  );
}