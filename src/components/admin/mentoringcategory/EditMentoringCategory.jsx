import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import CategoryTree from "./CategoryTree";
import { fetchProductById, deleteBasicNode, deleteProgramNode, updateProduct, viewProductImage } from "../../../features/products/productThunk";
import { addToast } from "@/features/toast/toastSlice";
import NoImageAvailable from "@/assets/No_Image_Available.jpg";

const EditMentoringCategory = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [basis, setBasis] = useState([]);
  const [program, setProgram] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchProduct = async () => {
    try {
      const result = await dispatch(fetchProductById(productId)).unwrap();
      console.log("Fetched product data:", result);
      console.log("Product name:", result.data.product.name);
      setCategoryName(result.data.product.name || "");
      setBasis(result.data.basics || []);
      setProgram(result.data.programs || []);

      setOriginalData({
        name: result.data.product.name || "",
        basics: result.data.basics || [],
        programs: result.data.programs || [],
        hasImage: !!result.data.product.image
      });

      if (result.data.product.image) {
        dispatch(viewProductImage({ file: result.data.product.image })).unwrap()
          .then(blob => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              setPreview(imageUrl);
            }
          })
          .catch(() => {
            console.error("Error loading product icon");
            setPreview(NoImageAvailable);
          });
      } else {
        setPreview(NoImageAvailable);
      }
    } catch (error) {
      console.error("Fetch product error:", error);
      dispatch(addToast({ message: "Failed to fetch product", type: "error" }));
    }
  };

  useEffect(() => {
    if (!originalData) return;

    const nameChanged = categoryName !== originalData.name;
    const imageChanged = profileImage !== null;
    const basicsChanged = JSON.stringify(basis) !== JSON.stringify(originalData.basics);
    const programsChanged = JSON.stringify(program) !== JSON.stringify(originalData.programs);

    setHasChanges(nameChanged || imageChanged || basicsChanged || programsChanged);
  }, [categoryName, basis, program, profileImage, originalData]);

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
      console.log("node:", result.name);
      console.log("childeren:", result.children)
      console.log(" Type of children:", typeof result.children);
      if (node._id) result._id = node._id;
      return result;
    });
  };

  const handleUpdate = async () => {
    const payload = {
      product_name: categoryName,
      basics: addOrderNumbers(basis),
      programs: addOrderNumbers(program)
    };
    console.log("editing payload :", payload)

    if (!payload.product_name.trim()) {
      dispatch(addToast({ message: "Product name is required", type: "error" }));
      return;
    }
    if (!payload.basics.length) {
      dispatch(addToast({ message: "Add atleast one basic Program", type: "error" }));
      return;
    }
    const fd = new FormData();

    if (profileImage) {
      fd.append("product_icon", profileImage);
    }
    fd.append("product_name", payload.product_name);
    fd.append("basics", JSON.stringify(payload.basics));
    fd.append("programs", JSON.stringify(payload.programs));


    try {
      console.log("Calling updateProduct with id:", productId);

      const result = await dispatch(updateProduct({ id: productId, data: fd })).unwrap();
      console.log("Update result:", result);
      dispatch(addToast({ message: "Product Updated Successfully", type: "success" }));
      navigate("/admin/mentoring-product");
    } catch (error) {
      console.error("Update error:", error);
      dispatch(addToast({ message: error?.message || "Failed to update category", type: "error" }));
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
                value={categoryName || ""}
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
              disabled={!hasChanges}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
