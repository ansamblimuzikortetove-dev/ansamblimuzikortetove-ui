import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollTop.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <ScrollToTop />
        <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
