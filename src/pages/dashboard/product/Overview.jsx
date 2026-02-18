import React from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { BookOpen, FolderTree, Video, FileText, Image as ImageIcon } from 'lucide-react';

const Overview = () => {
    const { productId } = useParams();
    const { product } = useOutletContext();
    const navigate = useNavigate();

    const countNodes = (nodes) => {
        if (!nodes || nodes.length === 0) return 0;
        let count = nodes.length;
        nodes.forEach(node => {
            if (node.children) count += countNodes(node.children);
        });
        return count;
    };

    const basicsCount = countNodes(product?.basics);
    const programsCount = countNodes(product?.programs);

    return (
        <div className="max-w-6xl">
            <h1 className="text-3xl font-bold text-primary mb-8">Product Overview</h1>

            {/* Product Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold text-primary mb-4">{product?.product?.name}</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <span className="font-medium">Product ID:</span>
                        <p className="text-sm text-gray-600">{product?.product?._id}</p>
                    </div>
                    <div className=' flex items-center gap-2 '> 
                        <span className="font-medium">Status:</span>
                        <p className="text-sm">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Active
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Basics Card */}
                <div 
                    className=" rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/dashboard/${productId}/basis`)}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <BookOpen className="text-white" size={28} />
                            </div>
                            <h3 className="text-xl font-semibold text-primary">Basic Programs</h3>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{basicsCount}</p>
                    <p className="text-sm text-gray-600">Total nodes</p>
                </div>

                {/* Programs Card */}
                <div 
                    className=" rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/dashboard/${productId}/program`)}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 p-3 rounded-lg">
                                <FolderTree className="text-white" size={28} />
                            </div>
                            <h3 className="text-xl font-semibold text-primary">Vertical Programs</h3>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 mb-2">{programsCount}</p>
                    <p className="text-sm text-gray-600">Total nodes</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                        className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                        onClick={() => navigate(`/dashboard/${productId}/basis`)}
                    >
                        <BookOpen className="text-blue-500" size={32} />
                        <span className="text-sm font-medium text-gray-700">Manage Basics</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                        onClick={() => navigate(`/dashboard/${productId}/program`)}
                    >
                        <FolderTree className="text-purple-500" size={32} />
                        <span className="text-sm font-medium text-gray-700">Manage Programs</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                        onClick={() => navigate(`/dashboard/${productId}/settings`)}
                    >
                        <Video className="text-green-500" size={32} />
                        <span className="text-sm font-medium text-gray-700">Media Assets</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                        onClick={() => navigate(`/dashboard/${productId}/settings`)}
                    >
                        <FileText className="text-orange-500" size={32} />
                        <span className="text-sm font-medium text-gray-700">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;