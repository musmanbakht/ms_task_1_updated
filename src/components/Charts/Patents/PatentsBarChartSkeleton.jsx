import React from "react";

export default function PatentsBarChartSkeleton() {
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      {/* Header */}
      <div className="rounded-t mb-0 px-2 py-5 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <div className="h-3 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-5 w-40 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-2 flex-auto">
        <div className="relative h-[350px] flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-500 font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}
