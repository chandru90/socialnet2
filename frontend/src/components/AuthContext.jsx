import { setPosts } from "@/redux/postSlice";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [AuthUser, setAuthUser] = useState(null);
  const [SelectedPost, setSelectedPost] = useState(null);
  const [Posts, setPosts] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        suggestedUsers,
        setSuggestedUsers,
        setAuthUser,
        AuthUser,
        setSelectedPost,
        SelectedPost,
        Posts,
        setPosts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
