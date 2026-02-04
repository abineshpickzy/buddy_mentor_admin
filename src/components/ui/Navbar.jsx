import { Menu, LogOut } from "lucide-react";
import logo  from "@/assets/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import {logout} from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Navbar = ( { onMenuClick } ) => {
  const location = useLocation();  
  const dispatch = useDispatch(); 

  const isActiveTab = (tabLink) => {
    const basePath = tabLink.split('/').slice(0, 2).join('/');
    return location.pathname.startsWith(basePath);
  };

  const tabs = [
    { label: "Mentees Dashboard", link: "/dashboard/overview" },
    { label: "Accounting FP", link: "/account" },
    { label: "Admin", link: "/admin/mentoring-category" }
  ];

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-gray-300 border-b">
        <div className="flex items-center justify-between px-4 py-2">

          {/* LEFT */}
          <div className="flex items-center gap-3">
           <button
            className="p-1 hover:bg-gray-400 rounded"
            onClick={() => {
              console.log('Menu clicked');
              onMenuClick();
            }}
          >
            <Menu size={22}  />
          </button>

            {/* Logo */}
             <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />

            {/* Tabs (Desktop) */}
            <nav className=" md:flex gap-2 ml-4">
              {tabs.map((tab) => (
                <NavLink
                  to={tab.link}
                  key={tab.label}
                  className={`px-4 py-1 rounded text-sm font-medium
                    ${
                      isActiveTab(tab.link)
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    }`}
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Country */}
            <select className=" md:block border px-2 py-1 text-sm bg-white">
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>

            {/* Avatar */}
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-8 h-8 rounded-full border"
            />

            {/* Logout */}
            <button className=" md:flex items-center gap-1 border px-3 py-1 bg-white text-sm" onClick={() => dispatch(logout())}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

   
    </>
  );
};

export default Navbar;
