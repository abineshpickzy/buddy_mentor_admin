import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


import UserTab from "@/components/admin/users/editusers/tabs/UserTab";
import RolesTab from "@/components/admin/users/editusers/tabs/RolesTab";
import LocationsTab from "@/components/admin/users/editusers/tabs/LocationsTab";
import MentoringTab from "@/components/admin/users/editusers/tabs/MentoringTab";
import axios from "@/api/axios";

import { useDispatch, useSelector } from "react-redux";


//  sample data
// const userDataFromAPI = {
//   id: 1,
//   profile: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
//   firstName: "Ratheesh",
//   lastName: "TR",
//   email: "macratheesh@pickzy.com",
//   adminId: "EC.PM.001",
//   lastConnection: "10/10/2018",
//   created: "10/10/2018",
//   status: "Active"
// };




const TABS = [
  { key: "user", label: "User" },
  { key: "roles", label: "Roles" },
  { key: "locations", label: "Locations" },
  { key: "mentoring", label: "Mentoring Category" },
];

const EditUserPage = () => {
   const { userId } = useParams();
   const [activeTab, setActiveTab] = useState("user");

   const dispatch = useDispatch();
   const users = useSelector((state) => state.users.users);
 

  

  const [user, setUser] = useState(null);


  useEffect(() => {
    // // Fetch user data based on userId
    // const fetchUserData = async () => {
    //   try {
    //     const response = await axios.get(`/user/${userId}/vw`);
    //     console.log("Fetched user data:", response.data);
    //     const user = response.data;
    //     setUser(user.data);
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };

    // fetchUserData();

    const user = users.find((u) => u._id === userId || u.id === userId);
    if (user) {
      setUser(user);
    } else {
      console.warn("User not found in Redux store for ID:", userId);
    }
      
  },[userId,dispatch]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <h2 className="text-sm text-gray-500 mb-3">
        Users &gt; {}{user ? `${user.user_name}` : "Loading..."} &gt; Edit
      </h2>

      {/* Tabs */}
      <div className="border-b border-gray-300 mb-6">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
             className={`px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-md ${activeTab === tab.key ? "bg-white" : "bg-gray-200"} font-medium`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 border border-gray-300">
        {activeTab === "user" && <UserTab  user={user} onSave={(data) =>{ console.log("updated data", data);  
          setActiveTab("roles");
        }} />}
        {activeTab === "roles" && <RolesTab  userRoles={[]} onSave={(roles) => console.log("Saved roles:", roles)} />}
        {activeTab === "locations" && <LocationsTab />}
        {activeTab === "mentoring" && <MentoringTab />}
      </div>
    </div>
  );
};

export default EditUserPage;
