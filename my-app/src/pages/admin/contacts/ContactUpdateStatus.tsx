import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_CONTACT_BY_ID, UPDATE_CONTACT_STATUS } from "../../../api/adminApiService";
import type { Contact } from "../../../types/types";

export default function ContactUpdateStatus(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [status, setStatus] = useState<Contact["status"]>("PENDING");
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
        setStatus(contactResponse.status);
      } catch (error) {
        toast.error("Không thể tải thông tin liên hệ");
        navigate("/admin/contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id, navigate]);

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setStatus(e.target.value as Contact["status"]);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!contact) return;

    try {
      await UPDATE_CONTACT_STATUS(contact.id, status);
      toast.success("Cập nhật trạng thái liên hệ thành công!");
      navigate("/admin/contacts");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái liên hệ");
    }
  };

  if (loading || !contact) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Cập nhật trạng thái liên hệ</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <p className="text-gray-900">{contact.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{contact.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tin nhắn</label>
          <p className="text-gray-600">{contact.message}</p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING">Đang chờ</option>
            <option value="RESOLVED">Đã giải quyết</option>
            <option value="CLOSED">Đã đóng</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/contacts")}
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