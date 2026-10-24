import { fakestoreApi } from "../../api/fakestore";
import { normalizeList, normalizeFakeStore, toApiCategory } from "../../utils/format";

// --- action types ---
export const PRODUCTS_START = "products/start";
export const PRODUCTS_STOP = "products/stop";
export const PRODUCTS_SUCCESS = "products/success";
export const PRODUCTS_FAIL = "products/fail";
export const CATEGORIES_SUCCESS = "products/categories_success";
export const SET_CATEGORY = "products/set_category";
export const PRODUCT_DETAIL_SUCCESS = "products/detail_success";

const initialState = {
  items: [],
  categories: [],
  activeCategory: "All",
  detail: null,
  loading: false,
  error: null,
};

export function productsReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_START:
      return { ...state, loading: true, error: null, detail: null };
    case PRODUCTS_STOP:
      return { ...state, loading: false };
    case PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload };
    case SET_CATEGORY:
      return { ...state, activeCategory: action.payload };
    case PRODUCT_DETAIL_SUCCESS:
      return { ...state, detail: action.payload };
    case PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// --- thunks: FakeStore API is the only product source ---
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: PRODUCTS_START });
  try {
    const data = await fakestoreApi.getProducts();
    dispatch({ type: PRODUCTS_SUCCESS, payload: normalizeList(data) });
  } catch (e) {
    dispatch({ type: PRODUCTS_SUCCESS, payload: [] });
    dispatch({ type: PRODUCTS_FAIL, payload: e.message });
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    const cats = await fakestoreApi.getCategories();
    dispatch({ type: CATEGORIES_SUCCESS, payload: cats || [] });
  } catch {
    dispatch({ type: CATEGORIES_SUCCESS, payload: [] });
  }
};

export const fetchByCategory = (cat) => async (dispatch) => {
  const apiCat = toApiCategory(cat);
  dispatch({ type: SET_CATEGORY, payload: apiCat });
  if (!apiCat || apiCat === "All") return dispatch(fetchProducts());

  dispatch({ type: PRODUCTS_START });
  try {
    const data = await fakestoreApi.getByCategory(apiCat);
    dispatch({ type: PRODUCTS_SUCCESS, payload: normalizeList(data) });
  } catch (e) {
    dispatch({ type: PRODUCTS_SUCCESS, payload: [] });
    dispatch({ type: PRODUCTS_FAIL, payload: e.message });
  }
};

export const fetchProductDetail = (id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_START });
  try {
    const data = await fakestoreApi.getProduct(id);
    const normalized = normalizeFakeStore(data);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: normalized });
    dispatch({ type: PRODUCTS_STOP });
    return normalized;
  } catch (e) {
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: null });
    dispatch({ type: PRODUCTS_FAIL, payload: e.message });
    return null;
  }
};

export const setCategory = (cat) => ({ type: SET_CATEGORY, payload: cat });
