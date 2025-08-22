import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CREATE_PRODUCT, GET_ALL_CATEGORIES_ADMIN, GET_ALL_BRANDS } from "../../../api/adminApiService";
import type { Brand, Category, PaginatedResponse } from "../../../types/types";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyUploadAdapter from "./../MyUploadAdapter"
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  rating: string;
  review: string;
  image: File | null;
  images: File[];
  quantity: string;
  categoryId: string;
  brandId: string;
  sku: string;
  availability: string;
  new: string;
  sale: string;
}

export default function ProductAdd(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    rating: "",
    review: "",
    image: null,
    images: [],
    quantity: "",
    categoryId: "",
    brandId: "",
    sku: "",
    availability: "true",
    new: "false",
    sale: "false",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageFields, setImageFields] = useState<number[]>([0]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<(string | null)[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const [categoriesResponse, brandsResponse]: [
          PaginatedResponse<Category>,
          PaginatedResponse<Brand>
        ] = await Promise.all([
          GET_ALL_CATEGORIES_ADMIN({ pageSize: 100 }),
          GET_ALL_BRANDS({ pageSize: 100 }),
        ]);
        setCategories(categoriesResponse.content);
        setBrands(brandsResponse.content);
      } catch (error) {
        toast.error("Không thể tải danh mục hoặc thương hiệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      const previewUrl = URL.createObjectURL(files[0]);
      setMainImagePreview(previewUrl);
    } else if (name.startsWith("image_") && files && files[0]) {
      const index = parseInt(name.split("_")[1]);
      setFormData((prev) => {
        const newImages = [...prev.images];
        newImages[index] = files[0];
        return { ...prev, images: newImages };
      });
      const previewUrl = URL.createObjectURL(files[0]);
      setAdditionalImagePreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = previewUrl;
        return newPreviews;
      });
    } else if (name === "quantity") {
      const quantityValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        quantity: value,
        availability: quantityValue === 0 ? "false" : "true",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addImageField = (): void => {
    setImageFields((prev) => [...prev, prev.length]);
    setAdditionalImagePreviews((prev) => [...prev, null]);
  };

  const removeImageField = (index: number): void => {
    setImageFields((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages };
    });
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors: string[] = [];

    const quantity = Number(formData.quantity);
    const price = Number(formData.price);
    const oldPrice = Number(formData.oldPrice);
    const rating = Number(formData.rating);
    const review = Number(formData.review);

    if (quantity < 0 ) {
      errors.push("Số lượng không được nhỏ hơn 0 ");
      isValid = false;
    }
    if (price <= 0) {
      errors.push("Giá sản phẩm phải lớn hơn 0");
      isValid = false;
    }
    if (oldPrice < 0) {
      errors.push("Giá cũ không được nhỏ hơn 0");
      isValid = false;
    }
    if (rating < 0 || rating > 5) {
      errors.push("Điểm đánh giá phải từ 0 đến 5");
      isValid = false;
    }
    if (review < 0) {
      errors.push("Số lượng đánh giá không được nhỏ hơn 0");
      isValid = false;
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    return isValid;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.description) data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.oldPrice) data.append("oldPrice", formData.oldPrice);
    if (formData.rating) data.append("rating", formData.rating);
    if (formData.review) data.append("review", formData.review);
    if (formData.image) data.append("imageFile", formData.image);
    formData.images.forEach((file) => {
      if (file) data.append("imageFiles", file);
    });
    if (formData.quantity) data.append("quantity", formData.quantity);
    if (formData.categoryId) data.append("categoryId", formData.categoryId);
    if (formData.brandId) data.append("brandId", formData.brandId);
    if (formData.sku) data.append("sku", formData.sku);
    data.append("availability", Number(formData.quantity) === 0 ? "false" : formData.availability);
    data.append("new", formData.new);
    data.append("sale", formData.sale);

    try {
      await CREATE_PRODUCT(data);
      toast.success("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Không thể thêm sản phẩm");
    }
  };

  if (loading) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">Thêm sản phẩm mới</h2>
        <button
          onClick={() => navigate("/admin/products")}
          className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Hủy
        </button>
      </div>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
                required
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Nhập mã SKU"
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Danh mục</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing and Inventory */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-4">Giá và tồn kho</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Giá</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Nhập giá sản phẩm"
                required
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Giá cũ</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                placeholder="Nhập giá cũ (nếu có)"
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Số lượng</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Nhập số lượng"
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Trạng thái tồn kho</label>
              <select
                name="availability"
                value={Number(formData.quantity) === 0 ? "false" : formData.availability}
                onChange={handleInputChange}
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                <option value="true">Còn hàng</option>
                <option value="false">Hết hàng</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sản phẩm mới</label>
              <select
                name="new"
                value={formData.new}
                onChange={handleInputChange}
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Có</option>
                <option value="false">Không</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Đang giảm giá</label>
              <select
                name="sale"
                value={formData.sale}
                onChange={handleInputChange}
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Có</option>
                <option value="false">Không</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-4">Đánh giá</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Điểm đánh giá</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="Nhập điểm đánh giá (0-5)"
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Số lượng đánh giá</label>
              <input
                type="number"
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                placeholder="Nhập số lượng đánh giá"
                className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-4">Hình ảnh</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ảnh chính</label>
              <div className="flex items-center space-x-4">
                {mainImagePreview && (
                  <img
                    src={mainImagePreview}
                    alt="Ảnh chính"
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="block"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ảnh phụ</label>
              <div className="space-y-2">
                {imageFields.map((index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {additionalImagePreviews[index] && (
                      <img
                        src={additionalImagePreviews[index]}
                        alt={`Ảnh phụ ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      name={`image_${index}`}
                      accept="image/*"
                      onChange={handleInputChange}
                      className="block"
                    />
                    {imageFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span className="mr-2">➕</span> Thêm ảnh phụ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            config={{
              extraPlugins: [function(editor) {
                editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                  return new MyUploadAdapter(loader);
                };
              }],
              // Các config khác nếu cần, ví dụ: toolbar, plugins...
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData((prev) => ({ ...prev, description: data }));
            }}
          />
        </div>


        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}