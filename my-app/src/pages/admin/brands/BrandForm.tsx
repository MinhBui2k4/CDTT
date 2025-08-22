import { useState, type ChangeEvent, type JSX } from "react";
import { toast } from "react-toastify";
import { CREATE_BRAND, UPDATE_BRAND } from "../../../api/adminApiService";
import type { Brand } from "../../../types/types";

interface BrandFormData {
  name: string;
  description: string;
}

interface BrandFormProps {
  brand: Brand | null;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export default function BrandForm({ brand, onClose, onSave }: BrandFormProps): JSX.Element {
  const [formData, setFormData] = useState<BrandFormData>({
    name: brand?.name || "",
    description: brand?.description || "",
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
      if (brand) {
        await UPDATE_BRAND(brand.id, data);
        toast.success("Cập nhật thương hiệu thành công!");
      } else {
        await CREATE_BRAND(data);
        toast.success("Thêm thương hiệu thành công!");
      }
      onClose();
      await onSave();
    } catch (error) {
      toast.error("Không thể lưu thương hiệu");
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
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 ">{brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tên thương hiệu</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên thương hiệu"
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
              placeholder="Nhập mô tả thương hiệu"
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
              {brand ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}