import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import CategoryTree from "./CategoryTree";
import { fetchProductById, deleteBasicNode, deleteProgramNode,updateProduct } from "../../../features/products/productThunk";
import { addToast } from "@/features/toast/toastSlice";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";

const EditMentoringCategory = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [basis, setBasis] = useState([]);
  const [program, setProgram] = useState([]);

  const fetchProduct = async () => {
    try {
      dispatch(showLoader());
      const result = await dispatch(fetchProductById(productId)).unwrap();
      setCategoryName(result.data.product.name);
      setBasis(result.data.basics || []);
      setProgram(result.data.programs || []);
    } catch (error) {
      dispatch(addToast({ message: "Failed to fetch product", type: "error" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId, dispatch]);

  const handleDeleteNode = async (nodeId, nodeType) => {
    try {
      if (nodeType === 'basic') {
         console.log('delete basic', nodeId);
        await dispatch(deleteBasicNode(nodeId)).unwrap();
      } else {
        await dispatch(deleteProgramNode(nodeId)).unwrap();
      }
      dispatch(addToast({ message: "Node deleted successfully", type: "success" }));
      await fetchProduct();
    } catch (error) {
      dispatch(addToast({ message: "Failed to delete node", type: "error" }));
      throw error;
    } 
  };

  const addOrderNumbers = (nodes) => {
    return nodes.map((node, index) => {
      const result = {
        name: node.name,
        order_no: index + 1,
        children: node.children?.length ? addOrderNumbers(node.children) : []
      };
      if (node._id) result._id = node._id;
      return result;
    });
  };

  const handleUpdate = async () => {
    const payload = {
      _id: productId,
      product_name: categoryName,
      basics: addOrderNumbers(basis),
      programs: addOrderNumbers(program)
    };
  
    if (!payload.product_name.trim()) {
      dispatch(addToast({ message: "Product name is required", type: "error" }));
      return;
    }
    if (!payload.basics.length) {
      dispatch(addToast({ message: "Add atleast one basic Program", type: "error" }));
      return;
    }

    try {
      dispatch(showLoader());
       console.log("payload :",payload);
      await dispatch(updateProduct(payload)).unwrap();
      dispatch(addToast({ message: "Product Updated Successfully", type: "success" }));
      navigate("/admin/mentoring-category");
    } catch (error) {
      dispatch(addToast({ message: "Failed to update category", type: "error" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pt-6 px-4 sm:px-6">
      <div className="text-sm text-gray-400 mb-6 max-w-6xl mx-auto w-full">
        Mentoring Category &gt;{" "}
        <span className="text-gray-600 font-medium">Edit Category</span>
      </div>

      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium">
            Product Name :
          </label>
          <input
            className="w-full md:w-[450px] bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Basic Programs :
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={basis} onChange={setBasis} editMode={true} onDeleteNode={handleDeleteNode} nodeType="basic" />
          </div>
        </div>

        <div className="mb-10 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Programs in Category :
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={program} onChange={setProgram} editMode={true} onDeleteNode={handleDeleteNode} nodeType="program" />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded text-sm font-medium"
          >
            Update Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMentoringCategory;
