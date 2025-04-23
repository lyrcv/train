// Component phân trang

import React from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationControl = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Tính toán trang bắt đầu và kết thúc
  // Nếu tổng số trang <= 8 thì hiển thị tất cả các trang
  let startPage = Math.max(2, currentPage - 3);
  let endPage = Math.min(totalPages - 1, currentPage + 3);

  if (currentPage <= 4) {
    startPage = 2;
    endPage = 8;
  }

  if (currentPage >= totalPages - 3) {
    startPage = totalPages - 7;
    endPage = totalPages - 1;
  }

  // Giới hạn phạm vi không vượt quá giới hạn
  startPage = Math.max(2, startPage);
  endPage = Math.min(totalPages - 1, endPage);

  // Nút tới trang 1
  pages.push(
    <Pagination.First
      key="first"
      onClick={() => onPageChange(1)}
      disabled={currentPage === 1}
    />
  );

  // Nút tới trang trước
  pages.push(
    <Pagination.Prev
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />
  );

  // Trang 1
  pages.push(
    <Pagination.Item
      key={1}
      active={currentPage === 1}
      onClick={() => onPageChange(1)}
    >
      1
    </Pagination.Item>
  );

  // Dấu ...
  if (startPage > 2) {
    pages.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
  }

  // Các trang giữa
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Dấu ...
  if (endPage < totalPages - 1) {
    pages.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
  }

  // Trang cuối
  if (totalPages > 1) {
    pages.push(
      <Pagination.Item
        key={totalPages}
        active={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }

  // Nút tới trang kế
  pages.push(
    <Pagination.Next
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    />
  );

  // Nút tới trang cuối
  pages.push(
    <Pagination.Last
      key="last"
      onClick={() => onPageChange(totalPages)}
      disabled={currentPage === totalPages}
    />
  );

  return (
    <Pagination className="justify-content-center mt-4">{pages}</Pagination>
  );
};

export default PaginationControl;
