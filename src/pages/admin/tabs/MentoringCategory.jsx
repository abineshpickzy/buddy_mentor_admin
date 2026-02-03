import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const MentoringCategory = () => {
  const [statusFilter, setStatusFilter] = useState("Open");

  const categories = [
    { id: 1, name: "EPC", status: "live" },
    { id: 2, name: "Production", status: "live" },
    { id: 3, name: "Manufacturing", status: "live" },
    { id: 4, name: "Infrastructure", status: "live" },
  ];

  return (
    <div className="w-full bg-white rounded-md  p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Mentoring Category</h2>

        <NavLink to="/admin/mentoring-category/add" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
          <span className="text-lg leading-none">+</span> New
        </NavLink>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm text-gray-600">Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option>Open</option>
          <option>Live</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-300 text-sm text-left">
              <th className="p-2 w-12">Sno</th>
              <th className="p-2">Icon</th>
              <th className="p-2">Category name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {categories.map((item, index) => (
              <tr
                key={item.id}
                className=" text-sm even:bg-gray-200"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 font-medium">{item.name.charAt(0)}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-green-600 capitalize">
                  {item.status}
                </td>
                <td className="p-2 flex gap-4 text-blue-600">
                  <button className="hover:underline">edit</button>
                  
                </td>
                <td>
                    <button className="text-red-500 hover:underline">
                    delete
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

export default MentoringCategory;
