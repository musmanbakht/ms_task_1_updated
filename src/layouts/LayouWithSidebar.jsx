import React from "react";
import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar/Sidebar";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
export default function LayoutWithSidebar() {
  return (
    <div>
      <Sidebar />
      <div className="relative md:ml-64 bg-amber-800 h-full">
        <Navbar />
        <div className="p-4">
          <Outlet /> {/* This will render nested routes */}
        </div>
      </div>
    </div>
  );
}
