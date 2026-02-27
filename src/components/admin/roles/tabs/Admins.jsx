import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PERMISSIONS } from "@/permissions/permissions";
import { usePermission } from "@/permissions";

const Admins = ({ onSelectionChange }) => {
    const { activeRole } = useSelector((state) => state.roles);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const { user } = useSelector((state) => state.auth);

    const permission = usePermission(PERMISSIONS.ROLES_EDIT);


    useEffect(() => {
        if (activeRole) {
            console.log("Active role changed, assigned admins:", activeRole);
            setAdmins(activeRole?.users || []);
            setSelectedAdmins([]);
        }
    }, [activeRole]); // Remove roles dependency

    useEffect(() => {
        onSelectionChange?.(selectedAdmins);
    }, [selectedAdmins, onSelectionChange]);

    const handleSelectAll = (checked) => {
        setSelectedAdmins(checked ? selectableAdmins.map(admin => admin._id) : []);
    };

    const handleSelectAdmin = (adminId, checked) => {
        setSelectedAdmins(prev =>
            checked
                ? [...prev, adminId]
                : prev.filter(id => id !== adminId)
        );
    };

    const selectableAdmins = admins.filter(admin => admin._id !== user._id);
    const isAllSelected = selectableAdmins.length > 0 && selectedAdmins.length === selectableAdmins.length;
    const isIndeterminate = selectedAdmins.length > 0 && selectedAdmins.length < selectableAdmins.length;

    return (
        <div className="">
            <table className="w-full">
                <thead>
                    <tr className="bg-[#9e9e9e] text-sm text-left text-white">
                        <th className="p-2 w-10">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                disabled={!permission}
                                ref={(el) => {
                                    if (el) el.indeterminate = isIndeterminate;
                                }}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email id</th>
                    </tr>
                </thead>

                <tbody>
                    {admins.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="p-4 text-center text-gray-400">
                                No admins assigned
                            </td>
                        </tr>
                    ) : (
                        admins.map(admin => (
                            <tr key={admin._id} className="text-sm odd:bg-[#e6e6e6] border-b-2 border-[#d8dbdd]">
                                <td className="p-2 text-center">
                                    <input
                                        disabled={admin._id == user._id || !permission}
                                        type="checkbox"
                                        checked={selectedAdmins.includes(admin._id)}
                                        onChange={(e) => handleSelectAdmin(admin._id, e.target.checked)}
                                    />
                                </td>
                                <td className="p-2">{admin.user_name}</td>
                                <td className="p-2">{admin.email_id}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Admins;