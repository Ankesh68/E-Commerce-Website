import React from 'react'


const Pagination = ({ productsPerPage, totalProducts, paginate, activePage }) => {

    const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  const goTo = (page) => {
    const totalPages = pageNumbers.length;
    const next = Math.min(Math.max(1, Number(page) || 1), totalPages);
    paginate(next);
  };

  return (
    <ul className="default-pagination lab-ul">
    <li>
        <button
          type="button"
          aria-label="Previous page"
          disabled={activePage <= 1}
          onClick={() => goTo(activePage - 1)}
        ><i className="icofont-rounded-left"></i></button>
    </li>

    {pageNumbers.map((number) => (
        <li key={number} className={`page-item ${number === activePage ? 'bg-warning' : ''}`} >
          <button
            type="button"
            onClick={() => goTo(number)}
            className='bg-transparent'
            aria-label={`Go to page ${number}`}
            aria-current={number === activePage ? "page" : undefined}
          >
            {number}
          </button>
        </li>
      ))}

    <li>
        <button
          type="button"
          aria-label="Next page"
          disabled={activePage >= pageNumbers.length}
          onClick={() => goTo(activePage + 1)}
        ><i className="icofont-rounded-right"></i></button>
    </li>
</ul>
  
  )
}

export default Pagination;
