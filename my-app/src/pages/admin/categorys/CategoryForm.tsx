import { useState, type ChangeEvent, type JSX } from "react";
import { toast } from "react-toastify";
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "../../../api/adminApiService";
import type { Category } from "../../../types/types";

interface CategoryFormData {
  name: string;
  description: string;
}

interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export default function CategoryForm({ category, onClose, onSave }: CategoryFormProps): JSX.Element {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    const data = {
      name: formData.name,
      description: formData.description,
    };

    try {
      if (category) {
        await UPDATE_CATEGORY(category.id, data);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await CREATE_CATEGORY(data);
        toast.success("Thêm danh mục thành công!");
      }
      onClose();
      await onSave();
    } catch (error) {
      toast.error("Không thể lưu danh mục");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">{category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên danh mục"
              required
              className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả danh mục"
              className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {category ? "Cập nhật danh mục" : "Thêm danh mục"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}