import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import CategoryTree from "./CategoryTree";
import { fetchProductById, viewProductImage } from "../../../features/products/productThunk";
import NoImageAvailable from "@/assets/No_Image_Available.jpg";

const ViewMentoringCategory = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [basis, setBasis] = useState([]);
  const [program, setProgram] = useState([]);
  const [preview, setPreview] = useState(null);

  const fetchProduct = async () => {
    try {
      const result = await dispatch(fetchProductById(productId)).unwrap();
      setCategoryName(result.data.product.name || "");
      setBasis(result.data.basics || []);
      setProgram(result.data.programs || []);

      if (result.data.product.image) {
        dispatch(viewProductImage({ file: result.data.product.image })).unwrap()
          .then(blob => {
            if (blob) {
              setPreview(URL.createObjectURL(blob));
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
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId, dispatch]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-sm text-gray-500 mb-3">
        <NavLink to="/admin/mentoring-product" className="text-primary hover:underline p-2">Mentoring Product</NavLink> &gt; View Product
      </h2>

      <div className="mb-6">
        <div className="flex">
          <button className="px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-sm bg-white font-medium">
            Category
          </button>
        </div>
      </div>

      <div className="p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <label className="md:w-[200px] text-sm text-gray-700 font-medium">
                Product Name :
              </label>
              <input
                className="w-full md:w-[450px] bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
                value={categoryName || ""}
                disabled
              />
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-4">
                Basic Programs :
              </label>
              <div className="w-full md:w-auto overflow-x-auto">
                <CategoryTree value={basis} onChange={() => {}} editMode={false} viewMode={true} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-4">
                Programs in Category :
              </label>
              <div className="w-full md:w-auto overflow-x-auto">
                <CategoryTree value={program} onChange={() => {}} editMode={false} viewMode={true} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Category photo</span>
            <div className="w-40 h-40 border-2 border-dashed rounded flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="Category preview" className="w-full h-full object-fill" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-4">No image</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMentoringCategory;
