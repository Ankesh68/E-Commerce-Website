export const UI_SEARCH = "ui/search";
export const UI_TOGGLE_SEARCH = "ui/toggle_search";

const initialState = {
  searchTerm: "",
  searchOpen: false,
};

export function uiReducer(state = initialState, action) {
  switch (action.type) {
    case UI_SEARCH:
      return { ...state, searchTerm: action.payload };
    case UI_TOGGLE_SEARCH:
      return {
        ...state,
        searchOpen:
          typeof action.payload === "boolean"
            ? action.payload
            : !state.searchOpen,
      };
    default:
      return state;
  }
}

export const setSearchTerm = (term) => ({ type: UI_SEARCH, payload: term });
export const toggleSearch = (open) => ({ type: UI_TOGGLE_SEARCH, payload: open });
