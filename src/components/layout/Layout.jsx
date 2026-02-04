import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, closeSidebar } from '@/features/sidebar/sidebarSlice';
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

const Layout = ({ children, sidebarItems }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.sidebar);

  const handleMenuClick = () => {
    dispatch(toggleSidebar());
  };

  const handleSidebarClose = () => {
    dispatch(closeSidebar());
  };

  // if (!isAuthenticated) {
  //   return children;
  // }

  return (
    <div className="h-screen flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      
      <div className="flex flex-1">
        <Sidebar 
          open={isOpen} 
          onClose={handleSidebarClose} 
          items={sidebarItems} 
        />
        
        <main className={`flex-1 p-4 overflow-auto transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;