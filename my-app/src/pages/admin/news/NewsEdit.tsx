import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_NEWS_BY_ID, UPDATE_NEWS } from "../../../api/adminApiService";
import type { News } from "../../../types/types";

interface NewsFormData {
  title: string;
  content: string;
  image: File | null;
}

export default function NewsEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        setFormData({
          title: newsResponse.title || "",
          content: newsResponse.content || "",
          image: null,
        });
        if (newsResponse.image) {
          setImagePreview(`http://localhost:8080/api/news/image/${newsResponse.image}`);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin tin tức");
        navigate("/admin/news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id, navigate]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!news) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image) data.append("imageFile", formData.image);

    try {
      await UPDATE_NEWS(news.id, data);
      toast.success("Cập nhật tin tức thành công!");
      navigate("/admin/news");
    } catch (error) {
      toast.error("Không thể cập nhật tin tức");
    }
  };

  if (loading || !news) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Chỉnh sửa tin tức</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Nhập tiêu đề tin tức"
            required
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nội dung</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Nhập nội dung tin tức"
            className="block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
            className="block w-full"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Hình ảnh hiện tại/đã chọn:</p>
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-48 h-48 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=Image";
                }}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/news")}
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