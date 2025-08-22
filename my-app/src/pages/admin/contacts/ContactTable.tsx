import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DELETE_CONTACT } from "../../../api/adminApiService";
import type { Contact } from "../../../types/types";
import type { JSX } from "react";

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

export default function ContactTable({
  contacts,
  onEdit,
  setContacts,
}: ContactTableProps): JSX.Element {
  const navigate = useNavigate();

  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) {
      try {
        await DELETE_CONTACT(id);
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
        toast.success("Xóa liên hệ thành công!");
      } catch (error) {
        toast.error("Không thể xóa liên hệ");
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
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tin nhắn
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
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
          {contacts.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                Không có liên hệ nào
              </td>
            </tr>
          ) : (
            contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">
                  {contact.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      contact.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : contact.status === "RESOLVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {contact.status === "PENDING"
                      ? "Đang chờ"
                      : contact.status === "RESOLVED"
                      ? "Đã giải quyết"
                      : "Đã đóng"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(contact.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/contacts/${contact.id}`)}
                    className="text-gray-600 hover:text-gray-800 mr-2"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onEdit(contact)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
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