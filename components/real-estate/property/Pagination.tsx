// components/real-estate/property/Pagination.tsx
"use client";

import { Paginate } from "@/types/global"; // Import từ file types của bạn

interface PaginationProps {
  paginateInfo: Paginate<any>;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ paginateInfo, onPageChange, className = "" }: PaginationProps) => {
  const { meta, links } = paginateInfo;
  const { current_page, last_page, from, to, total } = meta;

  // Không hiển thị pagination nếu chỉ có 1 trang
  if (last_page <= 1) return null;

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page < 1 || page > last_page || page === current_page) return;
    onPageChange(page);
  };

  // Lấy links từ meta.links (đã có sẵn)
  const pageLinks = meta.links.filter(
    (link) => link.label !== "&laquo; Previous" && link.label !== "Next &raquo;"
  );

  // Hoặc tự tạo links nếu muốn custom
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số trang hiển thị tối đa

    let startPage = Math.max(1, current_page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(last_page, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`mbp_pagination text-center ${className}`}>
      <ul className="page_navigation">
        {/* Nút Previous */}
        <li className={`page-item ${!links.prev ? "disabled" : ""}`}>
          <button
            className="page-link pointer"
            onClick={() => handlePageChange(current_page - 1)}
            disabled={!links.prev}
            aria-label="Previous"
          >
            <span className="fas fa-angle-left" />
          </button>
        </li>

        {/* Các nút số trang */}
        {pageNumbers.map((page) => (
          <li
            key={page}
            className={`page-item ${page === current_page ? "active" : ""}`}
          >
            <button
              className="page-link pointer"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Nút Next */}
        <li className={`page-item ${!links.next ? "disabled" : ""}`}>
          <button
            className="page-link pointer"
            onClick={() => handlePageChange(current_page + 1)}
            disabled={!links.next}
            aria-label="Next"
          >
            <span className="fas fa-angle-right" />
          </button>
        </li>
      </ul>

      {/* Thông tin tổng số bản ghi */}
      {total > 0 && (
        <p className="mt10 pagination_page_count text-center">
          {from} - {to} of {total} properties
        </p>
      )}
    </div>
  );
};

export default Pagination;