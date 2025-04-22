// Layout chứa Header, Footer và chia nội dung chính của web

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Dashboard from "../frontend/Dashboard";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />

<div className="container-fluid">
  <div className="row">
    {/* Sidebar */}
    <div className="col-md-3 col-lg-2 bg-white border-end shadow-sm min-vh-100 p-0">
      <Dashboard />
    </div>

    {/* Nội dung chính */}
    <div className="col-md-9 col-lg-10 bg-light p-4 min-vh-100">
      {children}
    </div>
  </div>
</div>

<Footer />
    </>
  );
};

export default Layout;
