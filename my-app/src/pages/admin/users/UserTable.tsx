import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DELETE_USER } from "../../../api/adminApiService";
import type { UserDTO } from "../../../types/types";
import type { JSX } from "react";

interface UserTableProps {
  users: UserDTO[];
  onViewDetails: (user: UserDTO) => void;
  onEdit: (user: UserDTO) => void;
  setUsers: React.Dispatch<React.SetStateAction<UserDTO[]>>;
}

export default function UserTable({
  users,
  onViewDetails,
  onEdit,
  setUsers,
}: UserTableProps): JSX.Element {
  const navigate = useNavigate();

  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await DELETE_USER(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success("Xóa người dùng thành công!");
      } catch (error) {
        toast.error("Không thể xóa người dùng");
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
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vai trò
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                Không có người dùng nào
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.fullName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.roles?.map((role) => role.name).join(", ") || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(user)}
                    className="text-gray-600 hover:text-gray-800 mr-2"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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