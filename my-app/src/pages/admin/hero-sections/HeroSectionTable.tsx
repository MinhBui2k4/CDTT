import { toast } from "react-toastify";
import { DELETE_HERO_SECTION } from "../../../api/adminApiService";
import type { HeroSection } from "../../../types/types";
import type { JSX } from "react";

interface HeroSectionTableProps {
  heroSections: HeroSection[];
  onEdit: (heroSection: HeroSection) => void;
  onView: (heroSection: HeroSection) => void;
  setHeroSections: React.Dispatch<React.SetStateAction<HeroSection[]>>;
}

export default function HeroSectionTable({
  heroSections,
  onEdit,
  onView,
  setHeroSections,
}: HeroSectionTableProps): JSX.Element {
  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa hero section này?")) {
      try {
        await DELETE_HERO_SECTION(id);
        setHeroSections((prev) => prev.filter((item) => item.id !== id));
        toast.success("Xóa hero section thành công!");
      } catch (error) {
        toast.error("Không thể xóa hero section");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phụ đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hình nền
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {heroSections.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                Không có hero section nào
              </td>
            </tr>
          ) : (
            heroSections.map((item, index) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.heading}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">
                  {item.subheading}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.backgroundImage ? (
                    <img
                      src={`http://localhost:8080/api/hero/image/${item.backgroundImage}`}
                      alt={item.heading}
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/60x60/e2e8f0/64748b?text=Hero";
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(item)}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}