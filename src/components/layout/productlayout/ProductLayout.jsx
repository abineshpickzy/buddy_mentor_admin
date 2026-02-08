import { NavLink, useParams, Outlet } from "react-router-dom";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "basis", label: "Basis" },
  { key: "program", label: "Program" },
  { key: "settings", label: "Settings" },
];

const ProductLayout = () => {
  const { productId } = useParams();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className=" mb-6">
        <div className="flex">
          {TABS.map(tab => (
            <NavLink
              key={tab.key}
              to={`/dashboard/${productId}/${tab.key}`}
              className={({ isActive }) =>
                `px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-sm
                 ${isActive ? "bg-white text-primary" : "bg-gray-200"}`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Child route renders here */}
      <div className="bg-gray-50 p-6 ">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductLayout;
