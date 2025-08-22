import { toast } from "react-toastify";
import { DELETE_BRAND } from "../../../api/adminApiService";
import type { Brand } from "../../../types/types";
import type { JSX } from "react";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
}

export default function BrandTable({ brands, onEdit, setBrands }: BrandTableProps): JSX.Element {
  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      try {
        await DELETE_BRAND(id);
        setBrands((prev) => prev.filter((brand) => brand.id !== id));
        toast.success("Xóa thương hiệu thành công!");
      } catch (error) {
        toast.error("Không thể xóa thương hiệu");
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
              Tên thương hiệu
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
          {brands.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                Không có thương hiệu nào
              </td>
            </tr>
          ) : (
            brands.map((brand, index) => (
              <tr key={brand.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brand.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{brand.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(brand)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
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