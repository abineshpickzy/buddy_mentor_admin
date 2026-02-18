
import { useOutletContext } from "react-router-dom";
import TreeNode from "./SettingsTree";

const CoreFoundationSettings = () => {
  const context = useOutletContext();
  const product = context?.product;
  
  return (
    <div className="border-2 border-gray-200 p-8 bg-white rounded-lg">
      {product?.basics ? (
        <Tree data={product.basics} />
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default CoreFoundationSettings;

/* ================= TREE COMPONENT ================= */
const Tree = ({ data }) => {
  return (
    <div className="space-y-2">
      {data
        .sort((a, b) => a.order_no - b.order_no)
        .map((node) => (
          <TreeNode key={node._id} node={node} level={0} />
        ))}
    </div>
  );
};





