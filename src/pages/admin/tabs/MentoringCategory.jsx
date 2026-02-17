import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Can } from '@/permissions';
import { PERMISSIONS } from "../../../permissions/permissions";
import { usePermission } from '@/permissions';
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { listProducts } from "@/features/products/productThunk";

const MentoringCategory = () => {
  const [statusFilter, setStatusFilter] = useState("Open");
  const productlist  = useSelector((state) => state.products.productlist);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editPermission = usePermission(PERMISSIONS.MENTORING_PROGRAM_EDIT);
  const deletePermission = usePermission(PERMISSIONS.MENTORING_PROGRAM_DELETE);

  useEffect(() => {
    const fetchProductlist = async () => {
      try {
        if (!productlist || productlist.length === 0)
        await dispatch(listProducts()).unwrap();   
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductlist();
  }, [dispatch]);

  return (
    <div className="w-full bg-white rounded-md  p-6">
      {/* Header */}
      <div className="flex items-center text-gray-600 justify-between mb-4">
        <h2 className="text-lg font-semibold">Mentoring Category</h2>
      </div>

      <div className="flex justify-between items-center bg-gray-100 p-4 mb-2 ">

        {/* Filter */}
        <div className="flex items-center gap-2">
          <label className="text-base font-medium text-gray-600">Status</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none border border-gray-300  bg-white px-3 py-1 pr-8 text-base cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              {/* <option>Open</option> */}
              <option>Live</option>
              {/* <option>Closed</option> */}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div>
          <Can permission={PERMISSIONS.MENTORING_PROGRAM_CREATE}>
            <NavLink to="/admin/mentoring-category/add" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
              <span className="text-lg leading-none">+</span> New
            </NavLink>
          </Can>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-sm text-left">
              <th className="p-2 w-12">Sno</th>
              <th className="p-2">Icon</th>
              <th className="p-2">Category name</th>
              <th className="p-2">Status</th>
              {(editPermission || deletePermission) && <th className="p-2">Action</th>}
              <th></th>
            </tr>
          </thead>

          <tbody>
            {productlist?.map((item, index) => (
              <tr
                key={item._id}
                className=" text-sm even:bg-gray-100"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 font-medium">{item.name.charAt(0)}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-green-600 capitalize">
                  {item.status == 1 ? "live" : "open"}
                </td>
                {editPermission && <td className="p-2 flex gap-4 text-blue-600">
                  <button className="hover:underline cursor-pointer" onClick={()=>navigate(`/admin/mentoring-category/edit/${item._id}`) }>edit</button>

                </td>
                }
                {deletePermission &&
                  <td>
                    <button className="text-red-500 hover:underline cursor-pointer">
                      delete
                    </button>
                  </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentoringCategory;
