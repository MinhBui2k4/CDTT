import { useState, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NewsTable from "./NewsTable";
import { GET_ALL_NEWS } from "../../../api/adminApiService";
import type { News, PaginatedResponse } from "../../../types/types";

export default function NewsManagement(): JSX.Element {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 10;

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = (await GET_ALL_NEWS({
        pageNumber: currentPage,
        pageSize,
        sortBy: "asc",
        sortOrder: "desc",
      })) as PaginatedResponse<News>;
      setNews(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem: News): void => {
    navigate(`/admin/news/edit/${newsItem.id}`);
  };

  const handleView = (newsItem: News): void => {
    navigate(`/admin/news/${newsItem.id}`);
  };

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const renderPagination = (): JSX.Element => {
    if (totalElements <= pageSize) return <></>;

    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow);

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Trước
        </button>
        {startPage > 0 && (
          <>
            <button
              onClick={() => handlePageChange(0)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 1 && <span className="px-3 py-1">...</span>}
          </>
        )}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {page + 1}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-3 py-1">...</span>}
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Sau
        </button>
      </div>
    );
  };

  if (loading) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết</h1>
        </div>
        <button
          onClick={() => navigate("/admin/news/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">➕</span> Thêm tin tức
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Danh sách bài viết</h2>
        </div>
        <NewsTable news={news} onEdit={handleEdit} onView={handleView} setNews={setNews} />
        <div className="p-4 flex justify-center items-center">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}