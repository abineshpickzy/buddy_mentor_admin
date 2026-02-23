import React from "react";
import { Search, ChevronDown } from "lucide-react";

const sampleData = [
  {
    id: 1,
    product: "EPC",
    chapter: "Wisdom tree",
    path: "Core Foundation/Business and facility life/Facility life/Wisdom tree",
    status: "In review",
  },
];

const Review = () => {
  return (
    <div className="w-full rounded-md ">
      {/* Header */}
      <div className="flex items-center text-gray-600 justify-between mb-4">
        <h2 className="text-lg font-semibold">Waiting for review</h2>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center bg-[#f5f5f5] p-3 mb-1">
        <div className="flex items-center gap-4">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-base font-medium text-gray-600">Status</label>
            <div className="relative">
              <select className="appearance-none min-w-[200px] border border-gray-300 bg-white px-3 py-1 pr-8 text-base cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-500">
                <option>In Review</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Product Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-base font-medium text-gray-600">Product</label>
            <div className="relative">
              <select className="appearance-none min-w-[200px] border border-gray-300 bg-white px-3 py-1 pr-8 text-base cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-500">
                <option>All</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-sm pl-3 pr-10 py-1 text-base w-64 bg-white focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <Search
            size={16}
            className="absolute right-3 top-2.5 text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#9e9e9e] text-sm text-left text-white">
              <th className="p-2 w-12">Sno</th>
              <th className="p-2">Product name</th>
              <th className="p-2">Chapter name</th>
              <th className="p-2">Path</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {sampleData.map((item, index) => (
              <tr
                key={item.id}
                className="text-sm odd:bg-[#e6e6e6] border-b-2 border-[#d8dbdd]"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.product}</td>
                <td className="p-2">{item.chapter}</td>
                <td className="p-2 text-gray-600">{item.path}</td>
                <td className="p-2">
                  <span className="text-gray-700">{item.status}</span>
                </td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Review;