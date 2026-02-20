import { Menu, LogOut } from "lucide-react";
import logo  from "@/assets/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import {logout} from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {PERMISSIONS} from "@/permissions/permissions";
import { CanModule } from "@/permissions";
import {viewUserImage} from "@/features/users/userThunk";
import { useState, useEffect } from "react";
import ConfirmModal from "@/components/admin/mentoringcategory/ConfirmModel";


const Navbar = ( { onMenuClick } ) => {
  const location = useLocation();  
  const dispatch = useDispatch(); 

  const {user} = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/40");
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
          setProfileImage("https://i.pravatar.cc/40");
        });
    }

    return () => {
      if (profileImage !== "https://i.pravatar.cc/40") {
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
      <header className="sticky top-0 z-50 bg-gray-300 border-b max-w-screen">
        <div className="flex items-center justify-between px-4 py-4">

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
                <CanModule key={tab.label} module={tab.module}>
                  <NavLink
                    // key={tab.label}
                    to={tab.link}
                    className={`px-4 py-1 rounded text-sm font-medium
                      ${
                        isActiveTab(tab.link)
                          ? "bg-blue-500 text-white"
                          : "bg-white border"
                      }`}
                  >
                    {tab.label}
                  </NavLink>
                 </CanModule>
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
              src={profileImage}
              alt="profile"
              className="w-8 h-8 rounded-full border object-fill"
            />
            {user?.user_name ||"Admin"}

            {/* Logout */}
            <button className=" md:flex items-center gap-1 border px-3 py-1 bg-white text-sm" onClick={() => setShowLogoutModal(true)}>
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
