import React from "react";
import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar/Sidebar";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
export default function LayoutWithSidebar() {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <div className="relative md:ml-64 h-full bg-gray-100">
        <div className="p-4">
          <Outlet /> {/* This will render nested routes */}
        </div>
      </div>
    </div>
  );
}
