import { useState, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DELETE_PRODUCT, GET_ALL_BRANDS, GET_ALL_CATEGORIES_ADMIN } from "../../../api/adminApiService";
import type { Product } from "../../../types/product";
import type { Brand, Category, PaginatedResponse } from "../../../types/types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  currentPage: number;
  pageSize: number;
}

export default function ProductTable({
  products,
  onEdit,
  setProducts,
  currentPage,
  pageSize,
}: ProductTableProps): JSX.Element {
  const navigate = useNavigate();
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});
  const [brandMap, setBrandMap] = useState<Record<number, string>>({});
  const [loadingMaps, setLoadingMaps] = useState<boolean>(true);

  useEffect(() => {
    const fetchMaps = async (): Promise<void> => {
      try {
        setLoadingMaps(true);
        const [brandsResponse, categoriesResponse] = await Promise.all([
          GET_ALL_BRANDS(),
          GET_ALL_CATEGORIES_ADMIN(),
        ]);

        const brands = (brandsResponse as PaginatedResponse<Brand>).content || [];
        const categories = (categoriesResponse as PaginatedResponse<Category>).content || [];

        const brandMapping = brands.reduce((map: Record<number, string>, brand: Brand) => {
          map[brand.id] = brand.name;
          return map;
        }, {});

        const categoryMapping = categories.reduce((map: Record<number, string>, category: Category) => {
          map[category.id] = category.name;
          return map;
        }, {});

        setBrandMap(brandMapping);
        setCategoryMap(categoryMapping);
      } catch (error) {
        toast.error("Không thể tải danh sách thương hiệu hoặc danh mục");
      } finally {
        setLoadingMaps(false);
      }
    };

    fetchMaps();
  }, []);

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await DELETE_PRODUCT(id);
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Xóa sản phẩm thành công!");
      } catch (error) {
        toast.error("Không thể xóa sản phẩm");
      }
    }
  };

  const getStatus = (product: Product): { label: string; className: string } => {
    if (product.quantity === 0) {
      return { label: "Hết hàng", className: "bg-red-100 text-red-800" };
    }
    if (product.quantity <= 10) {
      return { label: "Sắp hết", className: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "Còn hàng", className: "bg-green-100 text-green-800" };
  };

  if (loadingMaps) return <p className="text-center py-4">Đang tải dữ liệu thương hiệu và danh mục...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => {
            const stt = currentPage * pageSize + index + 1; // STT liên tục qua các trang
            const { label, className } = getStatus(product);

            return (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{stt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        product.image
                          ? `http://localhost:8080/api/products/image/${product.image}`
                          : "https://placehold.co/60x60/e2e8f0/64748b?text=Product"
                      }
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/60x60/e2e8f0/64748b?text=Product";
                      }}
                    />
                    <span className="font-medium px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{categoryMap[product.categoryId] || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{brandMap[product.brandId] || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.price.toLocaleString("vi-VN")} ₫</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${className}`}>
                    {label}
                  </span>
                  {product.new && (
                    <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      Mới
                    </span>
                  )}
                  {product.sale && (
                    <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                      Giảm giá
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    👁️
                  </button>
                  <button onClick={() => onEdit(product)} className="text-gray-600 hover:text-gray-800">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-gray-600 hover:text-gray-800">
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}