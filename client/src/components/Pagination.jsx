import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxDisplayedPages = 5;
  
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate range of pages to display
  const getPageNumbers = () => {
    if (totalPages <= maxDisplayedPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first and last page, and pages around current
    const pages = [1];
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(currentPage + 1, totalPages - 1);
    
    // Adjust if we're at the start or end
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 3, 2);
    }
    
    // Add ellipsis before middle pages if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis after middle pages if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Add last page if we have more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // If only 1 page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-1 py-8 md:space-x-2">
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          currentPage === 1
            ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            : 'bg-gray-100 text-gray-700 hover:bg-secondary hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-secondary'
        }`}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={`page-${page}-${index}`}
          onClick={() => typeof page === 'number' && handlePageChange(page)}
          disabled={page === '...'}
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            page === currentPage
              ? 'bg-secondary font-semibold text-white'
              : page === '...'
              ? 'cursor-default bg-transparent'
              : 'bg-gray-100 text-gray-700 hover:bg-secondary hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-secondary'
          }`}
          aria-label={page === '...' ? 'More pages' : `Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          currentPage === totalPages
            ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            : 'bg-gray-100 text-gray-700 hover:bg-secondary hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-secondary'
        }`}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination; 