import { useState, useEffect, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_HERO_SECTION_BY_ID } from "../../../api/adminApiService";
import type { HeroSection } from "../../../types/types";

export default function HeroSectionView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
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
      } catch (error) {
        toast.error("Không thể tải thông tin hero section");
        navigate("/admin/hero-sections");
      } finally {
        setLoading(false);
      }
    };
    fetchHeroSection();
  }, [id, navigate]);

  if (loading || !heroSection) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chi tiết Hero Section</h2>
        <button
          onClick={() => navigate("/admin/hero-sections")}
          className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Đóng
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700">Tiêu đề</h3>
          <p className="mt-1 text-gray-900">{heroSection.heading}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Phụ đề</h3>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{heroSection.subheading}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Hình nền</h3>
          {heroSection.backgroundImage ? (
            <img
              src={`http://localhost:8080/api/hero/image/${heroSection.backgroundImage}`}
              alt={heroSection.heading}
              className="mt-2 max-w-md w-full object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/64748b?text=Image";
              }}
            />
          ) : (
            <p className="mt-1 text-gray-900">Không có hình nền</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Ngày tạo</h3>
          <p className="mt-1 text-gray-900">
            {new Date(heroSection.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
}