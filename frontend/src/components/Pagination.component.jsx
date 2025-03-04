const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  const handlePageClick = (page) => {

    console.log("Page number: ", page);

    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }

  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`mx-1 px-3 py-1 border rounded transition-colors duration-200 ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  //dont render this component when there is only 1 page of blogs.
  if(totalPages <= 1){
    return;
  }

  return (
    <div className="flex items-center justify-center mt-4">

        <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Previous
        </button>

            {renderPageNumbers()}

        <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-1 px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Next
        </button>

    </div>
  );
};

export default Pagination;
