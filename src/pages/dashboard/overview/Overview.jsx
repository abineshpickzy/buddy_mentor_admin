import { useSelector } from "react-redux";
import { Users, BookOpen, Video, FileText, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  const { productlist } = useSelector((state) => state.products);

  const navigate = useNavigate();


  const assignedProducts = productlist.filter(p => user?.product?.includes(p._id));

  const stats = [
    { label: "Assigned Products", value: assignedProducts.length, icon: BookOpen, color: "bg-blue-500" },
    { label: "Total Products", value: productlist.length, icon: Video, color: "bg-green-500" },
    // { label: "Active Sessions", value: "12", icon: Users, color: "bg-purple-500" },
    // { label: "Completion Rate", value: "78%", icon: TrendingUp, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.user_name || "Admin"}!</h1>
        <p className="text-blue-100">Here's what's happening with your mentoring products today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assigned Products */}
      <div className="bg-white rounded-lg ">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Assigned Products</h2>
        </div>
        <div className="p-6">
          {assignedProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products assigned yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedProducts.map((product) => (
                <div key={product._id} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick ={() => navigate(`/dashboard/${product._id}`)}>
                    <div className="bg-blue-100 p-2 rounded">
                      <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-semibold">{product.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{product.description || "No description available"}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded ${product.status ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                      {product.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <Clock size={16} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activity {item}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-blue-600" />
                  <span className="font-medium">Create New Content</span>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-green-600" />
                  <span className="font-medium">Manage Users</span>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <Video size={20} className="text-purple-600" />
                  <span className="font-medium">Upload Assets</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
