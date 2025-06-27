import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { MdArrowForward, MdArrowBack } from "react-icons/md";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  const getPageNumbers = () => {
    const pages = new Set();

    // Всегда показываем первую и вторую страницы
    pages.add(1);
    if (totalPages > 1) pages.add(2);

    // Добавляем текущую страницу и соседние
    if (currentPage > 2) pages.add(currentPage - 1);
    pages.add(currentPage);
    if (currentPage < totalPages - 1) pages.add(currentPage + 1);

    // Всегда показываем последние 2 страницы
    if (totalPages > 2) pages.add(totalPages - 1);
    if (totalPages > 1) pages.add(totalPages);

    return [...pages].sort((a, b) => a - b);
  };

  return (
    <div className="flex justify-center mt-4 p-2 bg-base-200 rounded-lg">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 mx-1 bg-primary rounded-md text-white flex items-center"
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <MdArrowBack className="text-lg" />
      </button>

      {getPageNumbers().map((number, index, arr) => (
        <React.Fragment key={number}>
          {index > 0 && number !== arr[index - 1] + 1 && (
            <span className="px-2 py-2 mx-1 text-base-content">...</span>
          )}
          <button
            onClick={() => handlePageChange(number)}
            className={`px-4 py-2 mx-1 rounded-md transition ${
              currentPage === number
                ? "bg-neutral text-neutral-content font-semibold"
                : "bg-base-100 text-base-content hover:bg-neutral hover:text-neutral-content"
            }`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </button>
        </React.Fragment>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 mx-1 bg-primary text-neatural rounded-md text-white flex items-center"
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <MdArrowForward className="text-lg" />
      </button>
    </div>
  );
};

CustomPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default CustomPagination;
