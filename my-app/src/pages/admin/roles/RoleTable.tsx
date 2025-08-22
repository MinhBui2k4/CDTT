import { toast } from "react-toastify";
import { DELETE_ROLE } from "../../../api/adminApiService";
import type { Role } from "../../../types/types";
import type { JSX } from "react";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export default function RoleTable({ roles, onEdit, setRoles }: RoleTableProps): JSX.Element {
  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa vai trò này?")) {
      try {
        await DELETE_ROLE(id);
        setRoles((prev) => prev.filter((role) => role.id !== id));
        toast.success("Xóa vai trò thành công!");
      } catch (error) {
        toast.error("Không thể xóa vai trò");
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
              Tên vai trò
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                Không có vai trò nào
              </td>
            </tr>
          ) : (
            roles.map((role, index) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(role)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
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