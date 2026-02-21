import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { CanModule } from "@/permissions";


const Sidebar = ({ open, onClose, items }) => {
  return (
    <div
      className={`w-64 bg-white shadow-md border-r-2 border-gray-200  transition-all duration-300  fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto z-40 ${open ? 'block' : 'hidden'}`}
    >
      {/* Close button for mobile */}
      <div className="flex justify-end p-4 md:hidden">
        <button onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      {/* Sidebar items */}
      <nav className="flex flex-col p-4 ">
        {items.map((item) => (
          item?.isdefault ? (
          <div      key={item.label} className=" border-2 border-[#d1d1d1] p-[1px] mb-4">
              <NavLink
              to={item.link}
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 px-3 py-2 text-left text-lg text-gray-900 font-bold transition-colors ${
                  isActive ? 'bg-blue-200' : 'hover:bg-gray-100'
                }`
              }
            >
              {/* {item.icon && <item.icon size={18} />} */}
              {item.label}
            </NavLink>
            
          </div>
          ) : (
            <div key={item.label} className="">
              {item.module ? (
                <CanModule module={item.module}>
                 <div className=" border-b-1 border-[#d1d1d1] ">
                   <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `flex items-center gap-6 px-3 py-3 text-left text-base text-gray-700   transition-colors ${
                        isActive ? 'bg-blue-200' : 'hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.icon && <item.icon size={18} />}
                    {item.label}
                  </NavLink>
                 </div>
                </CanModule>
              ) : (
                <div className=" border-b-1 border-[#d1d1d1] ">
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center gap-6 px-3 py-3 text-left text-base text-gray-700  transition-colors  ${
                      isActive ? 'bg-blue-200' : 'hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon && <item.icon size={22} className={`${item.iconClass? item.iconClass:''}`} />}
                  {item.label}
                </NavLink>
                </div>
              )}
            </div>
          )
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
