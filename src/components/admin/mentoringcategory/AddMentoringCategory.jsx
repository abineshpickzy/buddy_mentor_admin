import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CategoryTree from "./CategoryTree";
import { checkAvailability,createProduct } from "../../../features/products/productThunk";
import {addToast} from "@/features/toast/toastSlice";
import {showLoader,hideLoader} from "@/features/loader/loaderSlice";

const AddMentoringCategory = () => {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [basis, setBasis] = useState([]);
  const [program, setProgram] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    if (!categoryName.trim()) {
      setIsAvailable(null);
      setAvailabilityMessage("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await dispatch(checkAvailability({ product_name: categoryName.trim() })).unwrap();
        setIsAvailable(result.success);
        setAvailabilityMessage(result.message);
      } catch (error) {
        setIsAvailable(false);
        setAvailabilityMessage("Error checking availability");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [categoryName, dispatch]);

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


 

const handleProductNameChange = (e) => {
  setCategoryName(e.target.value);
}
  const handleCreate = async () => {
   console.log("basis :", basis,"program :",program,"categoryName :",categoryName);
    const payload = {
       
      product_name: categoryName,
      basics: addOrderNumbers(basis),
      programs: addOrderNumbers(program)
    };

     console.log("payload :",payload);
     
    if(!payload.product_name.trim()){
      dispatch(addToast({message:"Product name is required",type:"error"}));
      return;
    };
    if (!isAvailable) {
      dispatch(addToast({message:availabilityMessage,type:"error"}));
      return;
    }
    if(!payload.basics.length){
      dispatch(addToast({message:"Add atleast one basic Program",type:"error"}));
      return;
    };

     try {
      dispatch(showLoader());
      await dispatch(createProduct(payload)).unwrap();
      dispatch(addToast({message:"Product Created Successfully",type:"success"}));
      setCategoryName("");
      navigator("/admin/mentoring-category");
     } catch (error) {
      dispatch(addToast({message:"Failed to create category",type:"error"}));
     }
     finally{
      dispatch(hideLoader());
     }
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
        <div className="mb-6 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium">
            Product Name :
          </label>
          <div className="flex flex-col">
            <input
              className="w-full md:w-[450px] bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="EPC Core Foundation"
              value={categoryName}
              onChange={handleProductNameChange}
            />
            {isAvailable !== null && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                isAvailable ? 'text-green-600' : 'text-red-600'
              }`}>
                {isAvailable ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {availabilityMessage}
              </p>
            )}
          </div>
        </div>

        {/* Mentoring Basis */}
        <div className="mb-8 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Basic Programs :
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={basis} onChange={setBasis} />
          </div>
        </div>

        {/* Mentoring Program */}
        <div className="mb-10 flex flex-col md:flex-row gap-2 md:gap-0">
          <label className="md:w-[200px] text-sm text-gray-700 font-medium pt-1">
            Programs in Category :
          </label>
          <div className="w-full md:w-auto overflow-x-auto">
            <CategoryTree value={program} onChange={setProgram} />
          </div>
          
        </div>

        {/* Create Button */}
        <div className="flex justify-center">
          <button
           
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded text-sm font-medium "
          >
            + Create Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMentoringCategory;
