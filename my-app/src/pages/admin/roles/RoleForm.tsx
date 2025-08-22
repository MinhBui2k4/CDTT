import { useState, type ChangeEvent, type JSX } from "react";
import { toast } from "react-toastify";
import { CREATE_ROLE, UPDATE_ROLE } from "../../../api/adminApiService";
import type { Role } from "../../../types/types";

interface RoleFormData {
  name: string;
}

interface RoleFormProps {
  role: Role | null;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export default function RoleForm({ role, onClose, onSave }: RoleFormProps): JSX.Element {
  const [formData, setFormData] = useState<RoleFormData>({
    name: role?.name || "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    const data = {
      name: formData.name,
    };

    try {
      if (role) {
        await UPDATE_ROLE(role.id, data);
        toast.success("Cập nhật vai trò thành công!");
      } else {
        await CREATE_ROLE(data);
        toast.success("Thêm vai trò thành công!");
      }
      onClose();
      await onSave();
    } catch (error) {
      toast.error("Không thể lưu vai trò");
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
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">{role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tên vai trò</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên vai trò (ADMIN, USER)"
              required
              className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {role ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}