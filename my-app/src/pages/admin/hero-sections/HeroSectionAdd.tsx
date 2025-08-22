import { useState, type ChangeEvent, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CREATE_HERO_SECTION } from "../../../api/adminApiService";
import type { HeroSection } from "../../../types/types";

interface HeroSectionFormData {
  heading: string;
  subheading: string;
  backgroundImage: File | null;
}

export default function HeroSectionAdd(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<HeroSectionFormData>({
    heading: "",
    subheading: "",
    backgroundImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "backgroundImage" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, backgroundImage: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const data = new FormData();
    data.append("heading", formData.heading);
    data.append("subheading", formData.subheading);
    if (formData.backgroundImage) data.append("backgroundImageFile", formData.backgroundImage);

    try {
      await CREATE_HERO_SECTION(data);
      toast.success("Thêm hero section thành công!");
      navigate("/admin/hero-sections");
    } catch (error) {
      toast.error("Không thể thêm hero section");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Thêm Hero Section Mới</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleInputChange}
            placeholder="Nhập tiêu đề hero section"
            required
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phụ đề</label>
          <textarea
            name="subheading"
            value={formData.subheading}
            onChange={handleInputChange}
            placeholder="Nhập phụ đề hero section"
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Hình nền</label>
          <input
            type="file"
            name="backgroundImage"
            onChange={handleInputChange}
            accept="image/*"
            className="block w-full"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Xem trước hình nền:</p>
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-48 h-48 object-cover rounded"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/hero-sections")}
            className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}