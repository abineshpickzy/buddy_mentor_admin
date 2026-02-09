import { useParams,NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import EditUserLayout from "../../../../components/admin/users/editusers/EditUserLayout";



const TABS = [
  { key: "user", label: "User" },
  { key: "roles", label: "Roles" },
  { key: "locations", label: "Locations" },
  { key: "mentoring", label: "Mentoring Category" },
];

const EditUserPage = () => {
  return (
   <EditUserLayout></EditUserLayout>
  );
};

export default EditUserPage;
