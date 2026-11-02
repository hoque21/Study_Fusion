import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("adminInfo"));
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState(() =>
    localStorage.getItem("adminToken")
  );

  const adminLogin = (token, adminData) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminInfo", JSON.stringify(adminData));
    setAdminToken(token);
    setAdmin(adminData);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        adminToken,
        adminLogin,
        adminLogout,
        isAdminAuthenticated: !!adminToken,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
