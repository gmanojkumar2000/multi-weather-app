import React from "react";

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center animate-pulse gap-2" aria-busy="true">
      <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-12 w-12 bg-gray-200 rounded-full mb-2" />
      <div className="h-8 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-16 bg-gray-200 rounded" />
    </div>
  );
} 