import { toast } from "react-toastify";
import { DELETE_PAYMENT_METHOD } from "../../../api/adminApiService";
import type { PaymentMethod } from "../../../types/types";
import type { JSX } from "react";

interface PaymentMethodTableProps {
  paymentMethods: PaymentMethod[];
  onEdit: (paymentMethod: PaymentMethod) => void;
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

export default function PaymentMethodTable({
  paymentMethods,
  onEdit,
  setPaymentMethods,
}: PaymentMethodTableProps): JSX.Element {
  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa phương thức thanh toán này?")) {
      try {
        await DELETE_PAYMENT_METHOD(id);
        setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
        toast.success("Xóa phương thức thanh toán thành công!");
      } catch (error) {
        toast.error("Không thể xóa phương thức thanh toán");
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
              Mô tả
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paymentMethods.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                Không có phương thức thanh toán nào
              </td>
            </tr>
          ) : (
            paymentMethods.map((method, index) => (
              <tr key={method.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{method.description || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(method)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
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