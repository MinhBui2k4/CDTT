import { useState, useEffect, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_CONTACT_BY_ID } from "../../../api/adminApiService";
import type { Contact } from "../../../types/types";

export default function ContactView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContact = async (): Promise<void> => {
      if (!id) {
        toast.error("ID liên hệ không hợp lệ");
        navigate("/admin/contacts");
        return;
      }

      try {
        setLoading(true);
        const contactResponse = await GET_CONTACT_BY_ID(Number(id));
        setContact(contactResponse);
      } catch (error) {
        toast.error("Không thể tải chi tiết liên hệ");
        navigate("/admin/contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id, navigate]);

  const getStatusStyle = (status: Contact["status"]): string => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || !contact) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chi tiết liên hệ: {contact.name}</h2>
        <button
          onClick={() => navigate("/admin/contacts")}
          className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Đóng
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <p className="text-gray-900">{contact.id}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <p className="text-gray-900">{contact.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{contact.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <p className="text-gray-900">{contact.phone || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tin nhắn</label>
          <p className="text-gray-600">{contact.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(contact.status)}`}
          >
            {contact.status === "PENDING" ? "Đang chờ" : contact.status === "RESOLVED" ? "Đã giải quyết" : "Đã đóng"}
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
          <p className="text-gray-900">{new Date(contact.createdAt).toLocaleString("vi-VN")}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <p className="text-gray-900">{contact.userId || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}