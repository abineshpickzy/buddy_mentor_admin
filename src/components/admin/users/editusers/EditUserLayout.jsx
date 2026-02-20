import { useParams, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {fetchUser} from "@/features/users/userThunk";

const TABS = [
  { key: "user", label: "User", path: "user" },
  { key: "roles", label: "Roles", path: "roles" },
  { key: "locations", label: "Locations", path: "locations" },
  { key: "mentoring", label: "Mentoring Product", path: "mentoring" },
];

const EditUserLayout = () => {
  const { userId } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
 
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const userData = await dispatch(fetchUser(userId)).unwrap();
      setUser(userData.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [dispatch, userId]);

  const isActiveTab = (tabPath) => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart === tabPath;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <h2 className="text-sm text-gray-500 mb-3">
        <NavLink to="/admin/users" className="text-primary hover:underline p-2">
          Users
        </NavLink>
        &gt; {user ? `${user.user_name}` : "Loading..."} &gt; Edit
      </h2>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex">
          {TABS.map((tab) => (
            <NavLink
              key={tab.key}
              to={tab.path}
              className={`px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-sm ${
                isActiveTab(tab.path) ? "bg-white" : "bg-gray-200"
              } font-medium`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 border border-gray-200">
        <Outlet context={{ user, refetchUser: fetchUserData }} />
      </div>
    </div>
  );
};

export default EditUserLayout;
