import { useState, useEffect, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_PRODUCT_BY_ID, GET_CATEGORY_BY_ID, GET_BRAND_BY_ID } from "../../../api/adminApiService";
import type { Product } from "../../../types/product";
import type { Brand, Category } from "../../../types/types";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function ProductView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<string>("Đang tải...");
  const [brand, setBrand] = useState<string>("Đang tải...");
  const [loading, setLoading] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      if (!id) {
        toast.error("ID sản phẩm không hợp lệ");
        navigate("/admin/products");
        return;
      }

      try {
        setLoading(true);
        const productData = await GET_PRODUCT_BY_ID(Number(id));
        setProduct(productData);

        const [categoryData, brandData]: [Category, Brand] = await Promise.all([
          GET_CATEGORY_BY_ID(productData.categoryId),
          GET_BRAND_BY_ID(productData.brandId),
        ]);
        setCategory(categoryData.name);
        setBrand(brandData.name);

        if (productData.image) {
          setPreviewImage(`http://localhost:8080/api/products/image/${productData.image}`);
        }
        if (productData.images && productData.images.length > 0) {
          const previewList = productData.images.map(img => `http://localhost:8080/api/products/images/${img}`);
          setPreviewImages(previewList);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin sản phẩm, danh mục hoặc thương hiệu");
        setCategory("N/A");
        setBrand("N/A");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const getStatus = (): { label: string; className: string } => {
    if (!product) return { label: "N/A", className: "" };
    if (product.quantity === 0) {
      return { label: "Hết hàng", className: "bg-red-100 text-red-800" };
    }
    if (product.quantity <= 10) {
      return { label: "Sắp hết", className: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "Còn hàng", className: "bg-green-100 text-green-800" };
  };

  if (loading || !product) {
    return <p className="text-center py-8">Đang tải...</p>;
  }

  const { label: statusLabel, className: statusClass } = getStatus();

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">Chi tiết sản phẩm: {product.name}</h2>
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Đóng
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ảnh sản phẩm */}
        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ảnh chính</label>
            <img
              src={previewImage || "https://placehold.co/200x200/e2e8f0/64748b?text=Product"}
              alt="Ảnh chính"
              className="w-60 h-60 rounded-lg object-cover mt-2"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/200x200/e2e8f0/64748b?text=Product";
              }}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Ảnh phụ</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {previewImages.length > 0 ? (
                previewImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Ảnh phụ ${index + 1}`}
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=Image";
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có ảnh phụ</p>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
            <p>{product.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <p>{product.sku || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá</label>
            <p>{product.price.toLocaleString("vi-VN")} ₫</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá cũ</label>
            <p>{product.oldPrice ? product.oldPrice.toLocaleString("vi-VN") + " ₫" : "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <p>{category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
            <p>{brand}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số lượng</label>
            <p>{product.quantity}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Điểm đánh giá</label>
            <p>{product.rating ? product.rating.toFixed(1) : "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số lượng đánh giá</label>
            <p>{product.review || "0"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClass}`}>
                {statusLabel}
              </span>
              {product.new && (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                  Mới
                </span>
              )}
              {product.sale && (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                  Đang giảm giá
                </span>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <CKEditor
              editor={ClassicEditor}
              data={product.description || "Không có mô tả"}
              config={{
                toolbar: [], // Loại bỏ toolbar để chỉ đọc
                isReadOnly: true, // Chế độ chỉ đọc
              }}
              disabled={true} // Đảm bảo không thể chỉnh sửa
              onChange={() => {}} // Hàm rỗng vì không cần xử lý thay đổi
            />
          </div>
        </div>
      </div>
    </div>
  );
}