import { useState, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeroSectionTable from "./HeroSectionTable";
import { GET_ALL_HERO_SECTIONS } from "../../../api/adminApiService";
import type { HeroSection, PaginatedResponse } from "../../../types/types";

export default function HeroSectionManagement(): JSX.Element {
  const navigate = useNavigate();
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 10;

  useEffect(() => {
    fetchHeroSections();
  }, [currentPage]);

  const fetchHeroSections = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = (await GET_ALL_HERO_SECTIONS({
        pageNumber: currentPage,
        pageSize,
      })) as PaginatedResponse<HeroSection>;
      setHeroSections(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách hero section");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (heroSection: HeroSection): void => {
    navigate(`/admin/hero-sections/edit/${heroSection.id}`);
  };

  const handleView = (heroSection: HeroSection): void => {
    navigate(`/admin/hero-sections/${heroSection.id}`);
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Banner</h1>
        </div>
        <button
          onClick={() => navigate("/admin/hero-sections/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">➕</span> Thêm Hero Section
        </button>
      </div>  

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Danh sách banner</h2>
        </div>
        <HeroSectionTable
          heroSections={heroSections}
          onEdit={handleEdit}
          onView={handleView}
          setHeroSections={setHeroSections}
        />
        <div className="p-4 flex justify-center items-center">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}