import { useParams,NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import EditUserLayout from "../../../../components/admin/users/editusers/EditUserLayout";


import UserTab from "@/components/admin/users/editusers/tabs/UserTab";
import RolesTab from "@/components/admin/users/editusers/tabs/RolesTab";
import LocationsTab from "@/components/admin/users/editusers/tabs/LocationsTab";
import MentoringTab from "@/components/admin/users/editusers/tabs/MentoringTab";
import axios from "@/api/axios";

import { useDispatch, useSelector } from "react-redux";




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

    const user = users.find((u) => u._id === userId || u.id === userId);
    if (user) {
      setUser(user);
    } else {
      console.warn("User not found in Redux store for ID:", userId);
    }
      
  },[userId,dispatch,users]);

  return (
   <EditUserLayout></EditUserLayout>
  );
};

export default EditUserPage;
