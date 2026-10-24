const CART_KEY = "cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch {
    // ignore
  }
}

export const CART_SET = "cart/set";
export const CART_ADD = "cart/add";
export const CART_REMOVE = "cart/remove";
export const CART_QTY = "cart/qty";
export const CART_CLEAR = "cart/clear";

const initialState = {
  items: typeof window !== "undefined" ? loadCart() : [],
};

function upsert(items, product, qty = 1) {
  const id = String(product.id);
  const existing = items.find((i) => String(i.id) === id);
  if (existing) {
    return items.map((i) =>
      String(i.id) === id
        ? { ...i, quantity: (i.quantity || 0) + qty }
        : i
    );
  }
  return [
    ...items,
    {
      id: String(product.id),
      name: product.name || product.title,
      title: product.title || product.name,
      price: Number(product.price) || 0,
      img: product.img || product.image,
      image: product.image || product.img,
      quantity: qty,
      category: product.category,
    },
  ];
}

export function cartReducer(state = initialState, action) {
  switch (action.type) {
    case CART_SET:
      return { ...state, items: action.payload };
    case CART_ADD: {
      const next = upsert(state.items, action.payload.product, action.payload.qty || 1);
      return { ...state, items: next };
    }
    case CART_REMOVE: {
      const next = state.items.filter(
        (i) => String(i.id) !== String(action.payload)
      );
      return { ...state, items: next };
    }
    case CART_QTY: {
      const next = state.items.map((i) =>
        String(i.id) === String(action.payload.id)
          ? { ...i, quantity: Math.max(1, action.payload.qty) }
          : i
      );
      return { ...state, items: next };
    }
    case CART_CLEAR:
      return { ...state, items: [] };
    default:
      // re-sync from localStorage on init actions from other tabs
      return state;
  }
}

// --- actions / thunks ---
export const syncCartFromStorage = () => ({
  type: CART_SET,
  payload: loadCart(),
});

export const addToCart = (product, qty = 1) => (dispatch, getState) => {
  dispatch({ type: CART_ADD, payload: { product, qty } });
  const items = getState().cart.items;
  saveCart(items);
  return items;
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE, payload: id });
  saveCart(getState().cart.items);
};

export const setQty = (id, qty) => (dispatch, getState) => {
  dispatch({ type: CART_QTY, payload: { id, qty } });
  saveCart(getState().cart.items);
};

export const clearCart = () => (dispatch, getState) => {
  dispatch({ type: CART_CLEAR });
  saveCart(getState().cart.items);
};

export const selectCartCount = (state) =>
  state.cart.items.reduce((n, i) => n + (i.quantity || 0), 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (sum, i) => sum + Number(i.price || 0) * (i.quantity || 0),
    0
  );

export const isInCart = (state, id) =>
  state.cart.items.some((i) => String(i.id) === String(id));
