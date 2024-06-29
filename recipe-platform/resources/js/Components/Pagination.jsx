const Pagination = ({ recipesPerPage, totalRecipes, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRecipes / recipesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <a
                            href="#"
                            onClick={() => paginate(number)}
                            className={`${
                                currentPage === number
                                    ? "bg-[#FF5C8D] text-[#FDEFF4]"
                                    : "bg-[#FDEFF4] text-[#FF5C8D]"
                            } px-3 py-2 rounded-l-md font-semibold hover:bg-[#FFC0D3]`}
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
