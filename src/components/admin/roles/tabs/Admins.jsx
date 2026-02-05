import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Admins = ({ onSelectionChange }) => {
    const { activeRole } = useSelector((state) => state.roles);
    // const { users } = useSelector((state) => state.users);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const { user } = useSelector((state) => state.auth);
    // const roles = useSelector((state) => state.roles.roles);

    useEffect(() => {
        if (activeRole){
            console.log("Active role changed, assigned admins:", activeRole);
            setAdmins(activeRole?.users || []);
            setSelectedAdmins([]);
        }
    }, [activeRole]); // Remove roles dependency

    useEffect(() => {
        onSelectionChange?.(selectedAdmins);
    }, [selectedAdmins, onSelectionChange]);

    const handleSelectAll = (checked) => {
        setSelectedAdmins(checked ? admins.filter(admin => admin._id!==user._id).map(admin => admin._id) : []);
    };

    const handleSelectAdmin = (adminId, checked) => {
        setSelectedAdmins(prev => 
            checked 
                ? [...prev, adminId]
                : prev.filter(id => id !== adminId)
        );
    };

    const isAllSelected = admins.length > 0 && selectedAdmins.length === admins.length;
    const isIndeterminate = selectedAdmins.length > 0 && selectedAdmins.length < admins.length;

    return (
        <div className="">
            <table className="w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 w-10">
                            <input 
                                type="checkbox" 
                                checked={isAllSelected}
                                ref={(el) => {
                                    if (el) el.indeterminate = isIndeterminate;
                                }}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email id</th>
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
                            <tr key={admin._id} className="">
                                <td className="p-2 text-center">
                                    <input 
                                       disabled={admin._id==user._id}
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