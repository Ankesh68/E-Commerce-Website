import { getWishlistItems, saveWishlistItems } from "../../utils/wishlist";

export const WISHLIST_SET = "wishlist/set";
export const WISHLIST_ADD = "wishlist/add";
export const WISHLIST_REMOVE = "wishlist/remove";
export const WISHLIST_CLEAR = "wishlist/clear";

const initialState = {
  items: typeof window !== "undefined" ? getWishlistItems() : [],
};

export function wishlistReducer(state = initialState, action) {
  switch (action.type) {
    case WISHLIST_SET:
      return { ...state, items: action.payload };
    case WISHLIST_ADD: {
      const exists = state.items.some(
        (i) => String(i.id) === String(action.payload.id)
      );
      if (exists) return state;
      const next = [...state.items, { ...action.payload, addedAt: Date.now() }];
      saveWishlistItems(next);
      return { ...state, items: next };
    }
    case WISHLIST_REMOVE: {
      const next = state.items.filter(
        (i) => String(i.id) !== String(action.payload)
      );
      saveWishlistItems(next);
      return { ...state, items: next };
    }
    case WISHLIST_CLEAR:
      saveWishlistItems([]);
      return { ...state, items: [] };
    default:
      return state;
  }
}

export const syncWishlist = () => ({
  type: WISHLIST_SET,
  payload: getWishlistItems(),
});

export const addToWishlistRedux = (product) => ({
  type: WISHLIST_ADD,
  payload: product,
});

export const removeFromWishlistRedux = (id) => ({
  type: WISHLIST_REMOVE,
  payload: id,
});

export const selectWishlistCount = (state) => state.wishlist.items.length;
export const isInWishlistRedux = (state, id) =>
  state.wishlist.items.some((i) => String(i.id) === String(id));
