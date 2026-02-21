import { Menu, LogOut, ChevronDown } from "lucide-react";
import logo  from "@/assets/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import {logout} from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {PERMISSIONS} from "@/permissions/permissions";
import { CanModule } from "@/permissions";
import {viewUserImage} from "@/features/users/userThunk";
import { useState, useEffect } from "react";
import ConfirmModal from "@/components/admin/mentoringcategory/ConfirmModel";
import NoImageAvailable from "@/assets/No_Image_Available.jpg";


const Navbar = ( { onMenuClick } ) => {
  const location = useLocation();  
  const dispatch = useDispatch(); 

  const {user} = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState(NoImageAvailable);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (user?.profile_image && user.profile_image !== 'null' && user.profile_image !== null) {
      dispatch(viewUserImage({ file: user.profile_image, width: 100 })).unwrap()
        .then(blob => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setProfileImage(imageUrl);
          }
        })
        .catch(() => {
          setProfileImage(NoImageAvailable);
        });
    }

    return () => {
      if (profileImage !== NoImageAvailable) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [user?.profile_image, dispatch]);

  const isActiveTab = (tabLink) => {
    const basePath = tabLink.split('/').slice(0, 2).join('/');
    return location.pathname.startsWith(basePath);
  };

  const tabs = [
    { label: "Mentees Dashboard", link: "/dashboard/overview", module:"admin" },
    { label: "Accounting FP", link: "/account" ,module:"account_fp"},
    { label: "Admin", link: "/admin" ,module: "admin"}
  ];

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#bdbdbd] max-w-screen">
        <div className="flex items-center justify-between px-4 py-3">

          {/* LEFT */}
          <div className="flex items-center gap-4">
           <button
            className="rounded text-white p-1"
            onClick={() => {
              console.log('Menu clicked');
              onMenuClick();
            }}
          >
            <Menu size={22} 
            strokeWidth={3}
              className=""
  />
          </button>

            {/* Logo */}
             <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
       

            {/* Tabs (Desktop) */}
            <nav className=" md:flex gap-2 ml-4">
              {tabs.map((tab) => (
                <CanModule key={tab.label} module={tab.module}>
                  <NavLink
                    // key={tab.label}
                    to={tab.link}
                    className={`px-8 py-1 rounded text-sm font-medium
                      ${
                        isActiveTab(tab.link)
                          ? "bg-blue-500 text-white"
                          : "bg-[#f5f5f5] border-2 border-[#909090] "
                      }`}
                  >
                    {tab.label}
                  </NavLink>
                 </CanModule>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">
            {/* Country */}
            <div className="flex items-center relative" style={{ minWidth: '150px' }}>
              <select
                className="appearance-none rounded-xs border-2 border-[#909090] bg-white px-3 py-1 text-sm font-medium w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="INDIA">India</option>
              </select>
              <ChevronDown className="absolute right-2 pointer-events-none" size={16} />
            </div>

            <div className="flex items-center gap-2">
               {/* Avatar */}
            <img
              src={profileImage}
              alt="profile"
              className="w-8 h-8 rounded-full border object-fill"
            />
            {user?.user_name ||"Admin"}
            </div>

            {/* Logout */}
            <button className=" md:flex items-center gap-1 rounded border-2 border-[#909090] px-6 py-1 bg-[#e0e0e0] text-sm font-medium" onClick={() => setShowLogoutModal(true)}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <ConfirmModal
        
        name="Logout"
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          dispatch(logout());
          setShowLogoutModal(false);
        }}
      />

   
    </>
  );
};

export default Navbar;
