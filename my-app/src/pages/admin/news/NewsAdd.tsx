import { useState, type ChangeEvent, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CREATE_NEWS } from "../../../api/adminApiService";
import type { News } from "../../../types/types";

interface NewsFormData {
  title: string;
  content: string;
  image: File | null;
}

export default function NewsAdd(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image) data.append("imageFile", formData.image);

    try {
      await CREATE_NEWS(data);
      toast.success("Thêm tin tức thành công!");
      navigate("/admin/news");
    } catch (error) {
      toast.error("Không thể thêm tin tức");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Thêm tin tức mới</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Nhập tiêu đề tin tức"
            required
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nội dung</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Nhập nội dung tin tức"
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
            className="block w-full"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Xem trước hình ảnh:</p>
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
            onClick={() => navigate("/admin/news")}
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