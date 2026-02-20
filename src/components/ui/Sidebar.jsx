import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { CanModule } from "@/permissions";


const Sidebar = ({ open, onClose, items }) => {
  return (
    <div
      className={`w-64 bg-white shadow-md border-r border-gray-200  transition-all duration-300  fixed top-18 left-0 h-[calc(100vh-4rem)] overflow-y-auto z-40 ${open ? 'block' : 'hidden'}`}
    >
      {/* Close button for mobile */}
      <div className="flex justify-end p-4 md:hidden">
        <button onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      {/* Sidebar items */}
      <nav className="flex flex-col gap-2 p-4">
        {items.map((item) => (
          <div key={item.label}>
          
          {
            item.module ? (  
            <CanModule module={item.module}>
            <NavLink
            key={item.label}
            to={item.link}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-left text-sm rounded transition-colors ${
                isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            {item.icon && <item.icon size={18} />}
            {item.label}
          </NavLink>
          </CanModule>) : (   
            <NavLink
            key={item.label}
            to={item.link}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-left text-sm rounded transition-colors ${
                isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            {item.icon && <item.icon size={18} />}
            {item.label}
          </NavLink>
        )
          } 
         
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
