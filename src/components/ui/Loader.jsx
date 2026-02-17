import { useSelector } from 'react-redux';
import logo  from "@/assets/logo.png";

const Loader = () => {
  const { isLoading } = useSelector((state) => state.loader);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex flex-col items-center justify-center z-100">
       
       <div className='animate-bounce bg-white rounded-full'>
        <img src={logo} alt="Loader" className="w-16 h-16 animate-pulse" />
        
       </div>
        <div className='animate-pulse text-white font-semibold font-montserrat'>Loading...</div>
    </div>
  );
};

export default Loader;
