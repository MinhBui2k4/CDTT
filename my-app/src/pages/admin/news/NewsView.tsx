import { useState, useEffect, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_NEWS_BY_ID } from "../../../api/adminApiService";
import type { News } from "../../../types/types";

export default function NewsView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async (): Promise<void> => {
      if (!id) {
        toast.error("ID tin tức không hợp lệ");
        navigate("/admin/news");
        return;
      }

      try {
        setLoading(true);
        const newsResponse = await GET_NEWS_BY_ID(Number(id));
        setNews(newsResponse);
      } catch (error) {
        toast.error("Không thể tải thông tin tin tức");
        navigate("/admin/news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id, navigate]);

  if (loading || !news) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chi tiết tin tức</h2>
        <button
          onClick={() => navigate("/admin/news")}
        className="border bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Đóng
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700">Tiêu đề</h3>
          <p className="mt-1 text-gray-900">{news.title}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Nội dung</h3>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{news.content}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Hình ảnh</h3>
          {news.image ? (
            <img
              src={`http://localhost:8080/api/news/image/${news.image}`}
              alt={news.title}
              className="mt-2 max-w-md w-full object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/64748b?text=Image";
              }}
            />
          ) : (
            <p className="mt-1 text-gray-900">Không có hình ảnh</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Ngày tạo</h3>
          <p className="mt-1 text-gray-900">
            {new Date(news.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
}