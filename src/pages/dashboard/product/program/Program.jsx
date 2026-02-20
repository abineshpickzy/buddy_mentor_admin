import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import TreeMenu from "@/components/dashboard/product/TreeMenu";
import NewModel from "@/components/dashboard/product/NewModel";
import { useDispatch } from "react-redux";
import { addNode } from "@/features/products/productThunk";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";
import { addToast } from "@/features/toast/toastSlice";
import { PERMISSIONS } from "@/permissions/permissions";
import {Can} from "@/permissions";

const Program = () => {
  const { product, refetchProduct } = useOutletContext();
  const [isNewModelOpen, setIsNewModelOpen] = useState(false);

  const dispatch = useDispatch();

  const programs = product?.programs || [];

  const handleNewSubmit = async (data) => {
    console.log("product", product)
    const payload = {
      parent_id: product.product._id,
      name: data.name,
      type: 1
    }
    console.log("Submitted payload:", payload);
    try {
      dispatch(showLoader());
      await dispatch(addNode(payload)).unwrap();
      await refetchProduct();
      dispatch(addToast({ message: "Node Added Successfully", type: "success" }));
      setIsNewModelOpen(false);
    }
    catch (error) {
      console.error("Error adding basic program:", error);
      dispatch(addToast({ message: "Failed to add new Node", type: "error" }));
    }
    finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-primary mb-4">Vertical Programs  </h1>

      <div className=" max-w-lg flex items-center justify-between gap-8 pb-4 mb-4  border-b border-gray-200">
         <Can permission={PERMISSIONS.MENTORING_PRODUCT_PROGRAM_CREATE}>
          <button
          className=" bg-blue-500 text-white py-1 px-6 rounded"
          onClick={() => setIsNewModelOpen(true)}
        >
          New
        </button>
         </Can>
      </div>

      {programs.length > 0 ? (
        <TreeMenu nodes={programs} type="program"
 />
      ) : (
        <p className="text-gray-500">No Verticels available</p>
      )}

      <NewModel
        open={isNewModelOpen}
        onCancel={() => setIsNewModelOpen(false)}
        onSubmit={handleNewSubmit}
      />
    </div>
  );
};

export default Program;
