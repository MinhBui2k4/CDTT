import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_HERO_SECTION_BY_ID, UPDATE_HERO_SECTION } from "../../../api/adminApiService";
import type { HeroSection } from "../../../types/types";

interface HeroSectionFormData {
  heading: string;
  subheading: string;
  backgroundImage: File | null;
}

export default function HeroSectionEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [formData, setFormData] = useState<HeroSectionFormData>({
    heading: "",
    subheading: "",
    backgroundImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHeroSection = async (): Promise<void> => {
      if (!id) {
        toast.error("ID hero section không hợp lệ");
        navigate("/admin/hero-sections");
        return;
      }

      try {
        setLoading(true);
        const heroSectionResponse = await GET_HERO_SECTION_BY_ID(Number(id));
        setHeroSection(heroSectionResponse);
        setFormData({
          heading: heroSectionResponse.heading || "",
          subheading: heroSectionResponse.subheading || "",
          backgroundImage: null,
        });
        if (heroSectionResponse.backgroundImage) {
          setImagePreview(`http://localhost:8080/api/hero/image/${heroSectionResponse.backgroundImage}`);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin hero section");
        navigate("/admin/hero-sections");
      } finally {
        setLoading(false);
      }
    };
    fetchHeroSection();
  }, [id, navigate]);

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
    if (!heroSection) return;

    const data = new FormData();
    data.append("heading", formData.heading);
    data.append("subheading", formData.subheading);
    if (formData.backgroundImage) data.append("backgroundImageFile", formData.backgroundImage);

    try {
      await UPDATE_HERO_SECTION(heroSection.id, data);
      toast.success("Cập nhật hero section thành công!");
      navigate("/admin/hero-sections");
    } catch (error) {
      toast.error("Không thể cập nhật hero section");
    }
  };

  if (loading || !heroSection) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chỉnh sửa Hero Section</h2>
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
              <p className="text-sm text-gray-600">Hình nền hiện tại/đã chọn:</p>
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-48 h-48 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=Image";
                }}
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
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}