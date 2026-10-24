// Dummy frontend-only auth. No backend, no database, no Firebase.
// Any valid email + any non-empty password logs in.
// Session persists in localStorage "auth-user" only.

const SESSION_KEY = "auth-user";
const USERS_KEY = "auth-users";

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export const AUTH_LOGIN = "auth/login";
export const AUTH_LOGOUT = "auth/logout";

const initialState = {
  user: typeof window !== "undefined" ? loadSession() : null,
  error: null,
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      return { ...state, user: action.payload, error: null };
    case AUTH_LOGOUT:
      return { ...state, user: null, error: null };
    default:
      return state;
  }
}

// Dummy login: accept anything, derive name from email prefix
export const dummyLogin = ({ email }) => (dispatch) => {
  const normEmail = String(email).trim().toLowerCase();
  const user = { name: normEmail.split("@")[0] || "User", email: normEmail };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  dispatch({ type: AUTH_LOGIN, payload: user });
  return user;
};

export const dummyLogout = () => (dispatch) => {
  localStorage.removeItem(SESSION_KEY);
  dispatch({ type: AUTH_LOGOUT });
};

export const isEmailRegistered = (email) => {
  const norm = String(email || "").trim().toLowerCase();
  return loadUsers().some((u) => u.email === norm);
};

// Frontend-only signup: username + email + password stored in localStorage.
export const dummySignup = ({ username, email, password }) => (dispatch) => {
  const name = String(username || "").trim() || "User";
  const normEmail = String(email).trim().toLowerCase();
  const users = loadUsers().filter((u) => u.email !== normEmail);
  users.push({ name, email: normEmail, password: String(password || "") });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const user = { name, email: normEmail };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  dispatch({ type: AUTH_LOGIN, payload: user });
  return user;
};

export const selectUser = (state) => state.auth.user;
