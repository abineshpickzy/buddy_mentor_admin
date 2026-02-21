import React, { useState, useEffect } from "react";
import { Edit, Trash2, Lock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewUserImage } from "@/features/users/userThunk";
import {Can} from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";
import NoImageAvailable from "@/assets/No_Image_Available.jpg";

const UserRow = ({ user, index }) => {
  const [profileImage, setProfileImage] = useState(NoImageAvailable);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.profile_image && user.profile_image !== 'null' && user.profile_image !== null) {
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
  }, [user.profile_image, dispatch]);
  
  return (
    <tr className="text-sm odd:bg-[#e6e6e6] border-b-2 border-[#d8dbdd]">
      
      <td className="p-2 text-center">{index + 1}</td>

      {/* Profile */}
      <td className="p-2">
        <div className="flex justify-center">
          <img
            src={profileImage}
            alt={user.first_name || "User"}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </td>

      {/* Action */}
      <td className="p-2 min-w-[100px]">
        <div className="flex justify-center gap-4">
       
          <Can permission={PERMISSIONS.USERS_EDIT}>
            <Edit size={16} className="text-blue-500 cursor-pointer" onClick={() => navigate(`/admin/users/edit/${user._id || user.id}/user`)} />
          </Can>
             <Eye size={16} className="text-blue-500 cursor-pointer" onClick={() => navigate(`/admin/users/view/${user._id || user.id}/user`)} />
        </div>
      </td>

      <td className="p-2">{user.first_name || "Not found"}</td>
      <td className="p-2">{user.last_name || "Not found"}</td>
      <td className="p-2 truncate max-w-[160px]">
        {user.email_id || user.email || "Not found"}
      </td>
      <td className="p-2">{user.adminId || "Not found"}</td>
      <td className="p-2 text-center">{user.log?.recent ? new Date(user.log.recent).toLocaleDateString('en-GB') : "Not found"}</td>
      <td className="p-2 text-center">{user.created?.at ? new Date(user.created.at).toLocaleDateString('en-GB') : "Not found"}</td>

      {/* Status */}
      <td className="p-2 text-center">
        <span
          className={`px-2 py-1 rounded text-xs ${
            (user.status || "Inactive") === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {user.log?.is_active ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Lock */}
      <td className="p-2">
        <div className="flex justify-center">
          <Lock size={16} className="text-yellow-500 cursor-pointer" />
        </div>
      </td>

      {/* Delete */}
      <Can permission={PERMISSIONS.USERS_DELETE}>
           <td className="p-2">
        <div className="flex justify-center">
          <Trash2 size={16} className="text-red-500 cursor-pointer" />
        </div>
      </td>
      </Can>
    </tr>
  );
};

export default UserRow;
