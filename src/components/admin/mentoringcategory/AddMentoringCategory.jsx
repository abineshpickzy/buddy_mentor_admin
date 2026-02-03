import React, { useState } from "react";
import CategoryTree from "./CategoryTree";

const AddMentoringCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [basis, setBasis] = useState([]);
  const [program, setProgram] = useState([]);

  const handleCreate = () => {
    const payload = {
      mentoringCategory: categoryName,
      mentoringBasis: basis,
      mentoringProgram: program
    };

    console.log("🚀 CREATE CATEGORY PAYLOAD");
    console.log(payload);
  };
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pt-6 px-4 sm:px-6">
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 max-w-6xl mx-auto w-full">
        Mentoring Category &gt;{" "}
        <span className="text-gray-600 font-medium">New Category</span>
      </div>

      {/* Container */}
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
        
        {/* Mentoring Category */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium">
            Mentoring Category:
          </label>
          <input
            className="w-full md:w-[420px] bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="EPC Core Foundation"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
        </div>

        {/* Mentoring Basis */}
        <div className="mb-8 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Mentoring Basis:
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={basis} onChange={setBasis} />
          </div>
        </div>

        {/* Mentoring Program */}
        <div className="mb-10 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Mentoring Program:
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={program} onChange={setProgram} />
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded text-sm font-medium"
          >
            + Create Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMentoringCategory;
