import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCards from "./ProductCards";
import Pagination from "./Pagination";
import ShopCategory from "./ShopCategory";
import ShopSidebarExtras from "./ShopSidebarExtras";
import {
  fetchProducts,
  fetchCategories,
  setCategory,
} from "../redux/slices/productsSlice";
import { setSearchTerm } from "../redux/slices/uiSlice";
import { getCategoryLabel, toApiCategory } from "../utils/format";
import { filterProducts } from "../utils/search";

const Shop = () => {
  const dispatch = useDispatch();
  const { items, categories, activeCategory, loading } = useSelector(
    (s) => s.products
  );
  const globalSearch = useSelector((s) => s.ui.searchTerm);

  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const productsPerPage = 12;
  const shopTopRef = useRef(null);

  const scrollToShopTop = () => {
    if (shopTopRef.current) {
      shopTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setLocalSearch(globalSearch || "");
    setCurrentPage(1);

    if (globalSearch?.trim()) {
      // Search the whole catalogue, not just the previously selected category.
      dispatch(setCategory("All"));
    } else {
      const categoryParam = searchParams.get("category");
      dispatch(
        setCategory(categoryParam ? toApiCategory(categoryParam) : "All")
      );
    }
  }, [dispatch, globalSearch, searchParams]);

  const searchTerm = (localSearch || "").toLowerCase();
  const searched = filterProducts(items, searchTerm);
  const filtered = searched.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const filterItem = (cat) => {
    setCurrentPage(1);
    dispatch(setCategory(toApiCategory(cat)));
    scrollToShopTop();
  };

  const handlePaginate = (page) => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / productsPerPage));
    const next = Math.min(Math.max(1, Number(page) || 1), totalPages);
    setCurrentPage(next);
    scrollToShopTop();
  };

  const handleTagClick = (tag) => {
    setLocalSearch(tag);
    dispatch(setSearchTerm(tag));
    dispatch(setCategory("All"));
    setCurrentPage(1);
    scrollToShopTop();
  };

  const showResult = `Showing ${filtered.length ? indexOfFirst + 1 : 0}-${
    Math.min(indexOfLast, filtered.length)
  } of ${filtered.length} results`;

  return (
    <div>
      <PageHeader title={"Our Shop Pages"} curPage={"Shop"} />
      <div className="shop-page padding-tb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <article ref={shopTopRef}>
                <div className="shop-title d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <p className="mb-0">{showResult}</p>
                </div>

                {/* Category pills (spec: category filter) */}
                <div className="d-flex flex-wrap gap-2 my-3">
                  <button
                    className={`btn btn-sm ${activeCategory === "All" ? "btn-warning" : "btn-outline-secondary"}`}
                    onClick={() => filterItem("All")}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      className={`btn btn-sm ${activeCategory === c ? "btn-warning" : "btn-outline-secondary"}`}
                      onClick={() => filterItem(c)}
                    >
                      {getCategoryLabel(c)}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <p className="text-center py-5">Loading products...</p>
                ) : (
                  <ProductCards products={currentProducts} GridList={true} />
                )}

                <Pagination
                  productsPerPage={productsPerPage}
                  totalProducts={filtered.length}
                  paginate={handlePaginate}
                  activePage={currentPage}
                />
              </article>
            </div>
            <div className="col-lg-4 col-12">
              <aside>
                <div className="widget widget-search">
                  <form
                    className="search-wrapper mb-3"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      type="text"
                      placeholder="Search products or categories..."
                      value={localSearch}
                      onChange={(e) => {
                        setLocalSearch(e.target.value);
                        dispatch(setSearchTerm(e.target.value));
                        setCurrentPage(1);
                      }}
                    />
                    <button type="submit">
                      <i className="icofont-search-2"></i>
                    </button>
                  </form>
                  {localSearch && (
                    <small className="text-muted">
                      {filtered.length} match{filtered.length === 1 ? "" : "es"} for “{localSearch}”
                    </small>
                  )}
                </div>
                <ShopCategory
                  filterItem={filterItem}
                  menuItems={categories}
                  selectedCategory={activeCategory}
                />
                <ShopSidebarExtras
                  products={items}
                  onTagClick={handleTagClick}
                  activeTag={localSearch}
                />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
