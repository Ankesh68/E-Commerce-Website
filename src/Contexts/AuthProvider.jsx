import React, { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dummyLogin, dummyLogout, selectUser } from "../redux/slices/authSlice";

// Dummy frontend-only auth context. No backend, no Firebase.
export const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  logOut: async () => {},
});

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const login = async (email) => {
    const u = dispatch(dummyLogin({ email }));
    return { user: u };
  };

  const logOut = async () => {
    dispatch(dummyLogout());
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
