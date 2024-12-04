import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  onPageChange: (direction: number) => void; // direction can be -1 (prev) or 1 (next)
  totalPages: number;
}

const Pagination = ({ currentPage, onPageChange, totalPages }: PaginationProps) => {
  return (
    <section className="w-full flex justify-center items-center py-4">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Previous button - invisible when on the first page */}
        <button
          className={`flex items-center pagination ${currentPage === 1 ? 'invisible' : 'hover:text-gray-400'}`}
          onClick={() => onPageChange(-1)}
          disabled={currentPage === 1}
          aria-label="navigate previous"
        >
          <FaChevronLeft className="mr-2" size={20} />
          Prev Page
        </button>

        {/* Current page and total pages */}
        <span className="pagination">
          {currentPage} / {totalPages}
        </span>

        {/* Next button - invisible when on the last page */}
        <button
          className={`flex items-center pagination ${currentPage === totalPages ? 'invisible' : 'hover:text-gray-400'}`}
          onClick={() => onPageChange(1)}
          disabled={currentPage === totalPages}
          aria-label="navigate next"
        >
          Next Page
          <FaChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </section>
  );
};

export default Pagination;
