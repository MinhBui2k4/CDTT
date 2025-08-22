import { useState, useEffect, type JSX, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProductTable from "./ProductTable";
import { GET_ALL_PRODUCTS, GET_PRODUCTS_NEW, GET_PRODUCTS_SALES, GET_PRODUCTS_AVAILABLE, GET_ALL_BRANDS, GET_ALL_CATEGORIES_ADMIN } from "../../../api/adminApiService";
import type { Product } from "../../../types/product";
import type { PaginatedResponse, Brand, Category } from "../../../types/types";
import ErrorBoundary from "../../../components/ErrorBoundary";

export default function ProductManagement(): JSX.Element {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterBrandId, setFilterBrandId] = useState<number | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);
  const [filterNew, setFilterNew] = useState<boolean>(false);
  const [filterSale, setFilterSale] = useState<boolean>(false);
  const [filterAvailability, setFilterAvailability] = useState<boolean>(false);
  const pageSize = 10;

  useEffect(() => {
    fetchBrandsAndCategories();
    fetchProducts();
  }, [currentPage, filterBrandId, filterCategoryId, filterNew, filterSale, filterAvailability]);

  const fetchBrandsAndCategories = async (): Promise<void> => {
    try {
      const [brandsResponse, categoriesResponse] = await Promise.all([
        GET_ALL_BRANDS(),
        GET_ALL_CATEGORIES_ADMIN(),
      ]);
      setBrands((brandsResponse as PaginatedResponse<Brand>).content || []);
      setCategories((categoriesResponse as PaginatedResponse<Category>).content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách thương hiệu hoặc danh mục");
    }
  };

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      let response: PaginatedResponse<Product>;

      if (filterNew) {
        response = await GET_PRODUCTS_NEW({
          pageNumber: currentPage,
          pageSize,
          sortBy: "id",
          sortOrder: "asc",
        });
      } else if (filterSale) {
        response = await GET_PRODUCTS_SALES({
          pageNumber: currentPage,
          pageSize,
          sortBy: "id",
          sortOrder: "asc",
        });
      } else if (filterAvailability) {
        response = await GET_PRODUCTS_AVAILABLE({
          pageNumber: currentPage,
          pageSize,
          sortBy: "id",
          sortOrder: "asc",
        });
      } else {
        response = await GET_ALL_PRODUCTS({
          brandId: filterBrandId || undefined,
          categoryId: filterCategoryId || undefined,
          pageNumber: currentPage,
          pageSize,
          sortBy: "id",
          sortOrder: "asc",
        });
      }

      setProducts(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setCurrentPage(0); // Reset về trang đầu khi thay đổi bộ lọc

    if (name === "brand") {
      setFilterBrandId(value ? Number(value) : null);
    } else if (name === "category") {
      setFilterCategoryId(value ? Number(value) : null);
    } else if (name === "status") {
      setFilterNew(value === "new");
      setFilterSale(value === "sale");
      setFilterAvailability(value === "availability");
    }
  };

  const handleEdit = (product: Product): void => {
    navigate(`/admin/products/edit/${product.id}`);
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        <div className="flex space-x-4">
          <select
            name="brand"
            value={filterBrandId || ""}
            onChange={handleFilterChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={filterCategoryId || ""}
            onChange={handleFilterChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={filterNew ? "new" : filterSale ? "sale" : filterAvailability ? "availability" : ""}
            onChange={handleFilterChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="new">Sản phẩm mới</option>
            <option value="sale">Sản phẩm giảm giá</option>
            <option value="availability">Sản phẩm còn hàng</option>
          </select>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <span className="mr-2">➕</span> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
        </div>
        <ErrorBoundary>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            setProducts={setProducts}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </ErrorBoundary>
        <div className="p-4 flex justify-center items-center">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}