import React from 'react';
import { Outlet, useNavigate, useLocation, useParams, useOutletContext } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { productId } = useParams();
    const context = useOutletContext();

    const tabs = [
        { name: 'Core Foundation', path: 'core-foundation' },
        { name: 'Program', path: 'program' }
    ];

    const isActiveTab = (path) => {
        return location.pathname.includes(path);
    };

    return (
        <div className=" mt-6 ">
            {/* Tabs */}
            <div className="flex -mb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.path}
                        onClick={() => navigate(`/dashboard/${productId}/settings/${tab.path}`)}
                        className={`px-6 py-1 text-primary border-2 border-gray-200 border-b-white rounded-t-lg py-1 ${
                            isActiveTab(tab.path) ? 'bg-white' : 'bg-gray-200'
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                <Outlet context={context} />
            </div>
        </div>
    );
};

export default Settings;