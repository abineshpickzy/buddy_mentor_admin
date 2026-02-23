import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TreeNode from "./SettingsTree";
import { editNode } from "@/features/products/productThunk";
import { useDispatch } from "react-redux";
import { addToast } from "@/features/toast/toastSlice";

const ProgramSettings = () => {
  const context = useOutletContext();
  const product = context?.product;
  const fetchProduct = context?.refetchProduct;
  const dispatch = useDispatch();

  const editNodeHandler = async (data) => {
    try {
      const { nodeid, ...nodeData } = data;
      await dispatch(editNode({ id: nodeid, data: nodeData })).unwrap();
      await fetchProduct();
      dispatch(addToast({ type: "success", message: "Node updated successfully" }));
    } catch (error) {
      console.error("Failed to update node:", error);
      dispatch(addToast({ type: "error", message: "Failed to update node" }));
    }
  };
  
  return (
    <div className="border-2 border-gray-200 p-8 bg-white rounded-lg">
      {product?.programs ? (
        <Tree data={product.programs} editNodeHandler={editNodeHandler} />
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default ProgramSettings;

/* ================= TREE COMPONENT ================= */
const Tree = ({ data, editNodeHandler }) => {
  return (
    <div className="space-y-2">
      {data
        .sort((a, b) => a.order_no - b.order_no)
        .map((node) => (
          <TreeNode key={node._id} node={node} level={0} editNodeHandler={editNodeHandler} type={1} />
        ))}
    </div>
  );
};



