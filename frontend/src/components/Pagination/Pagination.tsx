import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  onPageChange: (direction: number) => void; // direction can be -1 (prev) or 1 (next)
  totalPages: number; // Add totalPages prop to know the last page
}

const Pagination = ({ currentPage, onPageChange, totalPages }: PaginationProps) => {
  return (
    <section className="w-full flex justify-center items-center ">
      <div className="flex justify-between items-center w-[70vw] xl:w-[30vw] w-text-2xl xl:text-lg 2xl:text-md ">
        {/* Previous button - disabled when on the first page */}
        <button
          className="flex items-center hover:text-gray-400 text"
          onClick={() => onPageChange(-1)}
          disabled={currentPage === 1}
          aria-label="navigate previous"
        >
          <FaChevronLeft className="mr-2" size={20} />
          Prev Page
        </button>

        <span className="w-2 text">{currentPage}</span>

        {/* Next button - disabled when on the last page */}
        <button
          className="flex items-center hover:text-gray-400 text"
          onClick={() => onPageChange(1)}
          disabled={currentPage === totalPages} // Disable if on last page
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
