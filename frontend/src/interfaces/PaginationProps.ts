export default interface PaginationProps {
  currentPage: number;
  onPageChange: (direction: number) => void;
  totalPages: number;
}
