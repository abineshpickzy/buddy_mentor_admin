import React from "react";
import { Edit, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserRow = ({ user, index }) => {
    
  
  const navigate = useNavigate();
  return (
    <tr className="border-t hover:bg-gray-50">
      
      <td className="p-2 text-center">{index + 1}</td>

      {/* Profile */}
      <td className="p-2">
        <div className="flex justify-center">
          <img
            src={user.profile}
            alt={user.firstName}
            className="w-8 h-8 rounded-full"
          />
        </div>
      </td>

      {/* Action */}
      <td className="p-2"  onClick={() => navigate(`/admin/users/${user.id}`)}>
        <div className="flex justify-center" >
          <Edit size={16} className="text-blue-500 cursor-pointer" />
        </div>
      </td>

      <td className="p-2">{user.firstName}</td>
      <td className="p-2">{user.lastName}</td>
      <td className="p-2 truncate max-w-[160px]">
        {user.email}
      </td>
      <td className="p-2">{user.adminId}</td>
      <td className="p-2 text-center">{user.lastConnection}</td>
      <td className="p-2 text-center">{user.created}</td>

      {/* Status */}
      <td className="p-2 text-center">
        <span
          className={`px-2 py-1 rounded text-xs ${
            user.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {user.status}
        </span>
      </td>

      {/* Lock */}
      <td className="p-2">
        <div className="flex justify-center">
          <Lock size={16} className="text-yellow-500 cursor-pointer" />
        </div>
      </td>

      {/* Delete */}
      <td className="p-2">
        <div className="flex justify-center">
          <Trash2 size={16} className="text-red-500 cursor-pointer" />
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
