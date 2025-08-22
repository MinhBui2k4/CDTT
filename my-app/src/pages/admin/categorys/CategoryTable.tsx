import { toast } from "react-toastify";
import { DELETE_CATEGORY } from "../../../api/adminApiService";
import type { Category } from "../../../types/types";
import type { JSX } from "react";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export default function CategoryTable({ categories, onEdit, setCategories }: CategoryTableProps): JSX.Element {
  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await DELETE_CATEGORY(id);
        setCategories((prev) => prev.filter((category) => category.id !== id));
        toast.success("Xóa danh mục thành công!");
      } catch (error) {
        toast.error("Không thể xóa danh mục");
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
              Tên danh mục
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mô tả
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                Không có danh mục nào
              </td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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