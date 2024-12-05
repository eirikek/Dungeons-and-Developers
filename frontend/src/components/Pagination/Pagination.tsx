import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PaginationProps from '../../interfaces/PaginationProps.ts';

/**
 * Pagination component provides navigation between pages for a paginated list of monsters or equipment.

 * @param {number} currentPage - The current page number being displayed.
 * @param {function} onPageChange - A function to handle page change
 * @param {number} totalPages - The total number of pages available.
 *
 * Features:
 * - Renders the "Previous" and "Next" buttons
 * - Shows the current page and total pages like `currentPage / totalPages` .
 */
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
