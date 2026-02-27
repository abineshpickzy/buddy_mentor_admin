import React, { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { fetchReviewList } from "@/features/products/productThunk";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";


const Review = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [reviewList, setReviewList] = useState([]);
  const [productName, setProductName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviewList = reviewList.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.parent_name?.toLowerCase().includes(query) ||
      item.parent_path?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const loadData = async () => {
      if (!productId) {
        console.log("No productId available");
        return;
      }
      try {
        console.log("Fetching review list for productId:", productId);
        const result = await dispatch(fetchReviewList(productId)).unwrap();
        setReviewList(result.data);
        setProductName(result.product?.name || "");
        console.log("review list:", result.data);
      } catch (error) {
        console.error("Failed to fetch review list:", error);
      }
    }
    loadData();
  }, [productId]);

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


        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <tr className="bg-[#9e9e9e] text-sm text-center text-white">
              <th className="p-2 w-12">S.no</th>
              <th className="p-2">Product name</th>
              <th className="p-2">Chapter name</th>
              <th className="p-2">Path</th>
              <th className="p-2">Total Assets</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviewList.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  {searchQuery ? "No matching reviews found" : "No reviews found"}
                </td>
              </tr>
            ) : (
              filteredReviewList.map((item, index) => (
                <tr
                  key={item._id}
                  className="text-sm odd:bg-[#e6e6e6] text-center border-b-2 border-[#d8dbdd]"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{productName}</td>
                  <td className="p-2">{item.parent_name}</td>
                  <td className="p-2 text-gray-600">{item.parent_path}</td>
                  <td className="p-2 text-gray-600 ">{item.total_assets}</td>
                  <td className="p-2">
                    <span className="bg-[#03a9f4] text-xs rounded text-white px-2 py-1">In Review</span>
                  </td>
                  <td className="p-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => navigate(`/dashboard/${productId}/review/${item.parent_id}`, { state: { parentPath: item.parent_path, product_type: item.product_type, parent_id: item.parent_id } })}
                    >
                      View
                    </button>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Review;