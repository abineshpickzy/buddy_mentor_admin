
import { NavLink, useParams, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {fetchProductById} from "@/features/products/productThunk";
import {CanModule} from "@/permissions";


const TABS = [
  { key: "overview", label: "Overview", module:"mentoring_product.overview" },
  { key: "basis", label: "Basis" ,module:"mentoring_product.core_foundation" },
  { key: "program", label: "Program" ,module:"mentoring_product.program" },
  { key: "settings", label: "Settings" ,module:"mentoring_product.settings" },
];

const ProductLayout = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
 
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const result = await dispatch(fetchProductById(productId)).unwrap();
      setProduct(result.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Tabs */}
      <div className=" sticky top-0 ">
        <div className="flex">
          {TABS.map(tab => (
             <CanModule key={tab.key} module={tab.module}>
              <NavLink
              to={`/dashboard/${productId}/${tab.key}`}
              className={({ isActive }) =>
                `px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-sm
                 ${isActive ? "bg-white text-primary" : "bg-gray-200"}`
              }
            >
              {tab.label}
            </NavLink>
             </CanModule>
          ))}
        </div>
      </div>

      {/* Child route renders here */}
      <div className="bg-gray-50 p-6 ">
        <Outlet context={{product, refetchProduct: fetchProduct}} />
      </div>
    </div>
  );
};

export default ProductLayout;
