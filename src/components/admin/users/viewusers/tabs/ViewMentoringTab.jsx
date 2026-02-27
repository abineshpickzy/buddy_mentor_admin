import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { listProducts } from "@/features/products/productThunk";

const ViewMentoringTab = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { user } = useOutletContext();
  const { productlist } = useSelector((state) => state.products);
  const [assignedCategories, setAssignedCategories] = useState([]);

  useEffect(() => {
    if (user) {
      setAssignedCategories(user.product || []);
    }
    if (productlist.length === 0) {
      dispatch(listProducts());
    }
  }, [user]);

  const assignedProductObjects = productlist.filter(p => assignedCategories.includes(p._id));
  const filteredAssignedCategories = assignedProductObjects.filter((product) =>
    product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm">Search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-gray-300 focus:outline-none px-3 py-1 text-sm"
          />
        </div>
      </div>

      <table className="w-full mt-4 text-sm">
        <thead className="bg-gray-300 text-left">
          <tr>
            <th className="p-2">S.no</th>
            <th className="p-2">Category Name</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignedCategories.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                {search ? "No matching categories found" : "No categories assigned"}
              </td>
            </tr>
          ) : (
            filteredAssignedCategories.map((cat, i) => (
              <tr key={cat._id} className="bg-gray-100 even:bg-gray-200">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{cat.name}</td>
                <td className="p-2">{cat.status === 1 ? "Active" : "Inactive"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewMentoringTab;
