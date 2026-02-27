import { useEffect, useState } from "react";
import { Trash2, Search, Edit } from "lucide-react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {editUser} from "@/features/users/userThunk";
import { useDispatch } from "react-redux";
import { addToast } from "@/features/toast/toastSlice";
import {listProducts} from "@/features/products/productThunk";
import { updateUserProduct } from "@/features/auth/authSlice";

const MentoringTab = () => {
  const [mode, setMode] = useState("list"); 
  const [search, setSearch] = useState("");
  
 const dispatch = useDispatch();
  
 const { user, refetchUser } = useOutletContext();

  const { productlist } = useSelector((state) => state.products);
  const currentUser = useSelector((state) => state.auth.user);

  // Final saved categories
  const [assignedCategories, setAssignedCategories] = useState([]);

  // Temporary selection (store full objects)
  const [selected, setSelected] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);


  useEffect(() => {
    if (user) {
      setAssignedCategories(user.product || []);
    }
    if (productlist.length === 0) {
      dispatch(listProducts());
      
    }
  }, [user]);


  /* -------------------- HELPERS -------------------- */

  const openAddMode = () => {
    const assignedIds = user.product || [];
    const preSelected = productlist.filter(p => assignedIds.includes(p._id));
    setSelected(preSelected);
    setOriginalProducts(preSelected);
    setMode("add");
  };

  const toggleSelect = (product) => {
    setSelected((prev) =>
      prev.some((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );
  };

  useEffect(() => {
    const selectedIds = selected.map(p => p._id).sort();
    const originalIds = originalProducts.map(p => p._id).sort();
    setHasChanges(JSON.stringify(selectedIds) !== JSON.stringify(originalIds));
  }, [selected, originalProducts]);


  const handleAdd = async () => {
    console.log("Selected Products:", selected);
    
    try {
      await dispatch(
        editUser({
          userId: user._id,
          userData: {
            product: selected.map((p) => p._id),
          },
        })
      ).unwrap();
      await refetchUser();
      dispatch(addToast({ type: "success", message: "User updated successfully!" }));
      if(user._id== currentUser._id){
        dispatch(updateUserProduct(selected.map((p) => p._id)));
      }
    } catch (error) {
      console.error("Failed to save user:", error);
    }
    setMode("list");
  };

  const handleDelete = (id) => {
   
  };

  /* -------------------- FILTER -------------------- */

  const assignedProductObjects = productlist.filter(p => assignedCategories.includes(p._id));

  const filteredAssignedCategories = assignedProductObjects.filter((product) =>
    product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = productlist?.filter((product) =>
    product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-4">

      {/* ================= LIST MODE ================= */}
      {mode === "list" && (
        <>
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={openAddMode}
              className="px-4 py-1 border-2 border-gray-300 rounded bg-white text-sm"
            >
              + Add
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm">Search</span>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-2 border-gray-300 focus:outline-none px-3 py-1 text-sm"
                />
                <Search
                  size={14}
                  className="absolute right-2 top-2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mt-4 text-sm ">
            <thead className="bg-gray-300 text-left">
              <tr className="">
                <th className="p-2">S.no</th>
                <th className="p-2">Category Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssignedCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    {search ? "No matching categories found" : "No categories assigned"}
                  </td>
                </tr>
              ) : (
                filteredAssignedCategories.map((cat, i) => (
                  <tr key={cat._id} className=" bg-gray-100 even:bg-gray-200">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{cat.name}</td>
                    <td className="p-2">
                      {cat.status === 1 ? "Active" : "Inactive"}
                    </td>
                    <td className="p-2">
                      <Edit
                        size={18}
                        className="text-blue-500 cursor-pointer"
                        onClick={openAddMode}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* ================= ADD MODE ================= */}
      {mode === "add" && (
        <>
          <p className="text-sm text-gray-500">
            Mentoring Products &nbsp;&gt; Add
          </p>

          <div className="space-y-3 mt-4">
            {filteredProducts?.map((product) => (
              <label
                key={product._id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.some(
                    (p) => p._id === product._id
                  )}
                  onChange={() => toggleSelect(product)}
                />
                {product.name}
              </label>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setMode("list")}
              className="px-6 py-2 border rounded text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!hasChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MentoringTab;
