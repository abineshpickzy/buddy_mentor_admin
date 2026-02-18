import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, NavLink } from "react-router-dom";
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
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

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
      navigate("/admin/mentoring-product");
    } catch (error) {
      dispatch(addToast({ message: "Failed to update category", type: "error" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <h2 className="text-sm text-gray-500 mb-3">
        <NavLink to="/admin/mentoring-product" className="text-primary hover:underline p-2">Mentoring Product</NavLink> &gt; Edit Product
      </h2>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex">
          <button className="px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-sm bg-white font-medium">
            Category
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT - FORM */}
          <div className="md:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium">
            Product Name :
          </label>
          <input
            className="w-full md:w-[450px] bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Basic Programs :
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={basis} onChange={setBasis} editMode={true} onDeleteNode={handleDeleteNode} nodeType="basic" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Programs in Category :
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={program} onChange={setProgram} editMode={true} onDeleteNode={handleDeleteNode} nodeType="program" />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Category
        </button>
          </div>

          {/* RIGHT - PROFILE PHOTO */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Category photo</span>

            <label className="w-40 h-40 border-2 border-dashed rounded flex items-center justify-center cursor-pointer overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Category preview"
                  className="w-full h-full object-fill"
                />
              ) : (
                <span className="text-xs text-gray-400 text-center px-4">
                  Click to upload
                </span>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMentoringCategory;
