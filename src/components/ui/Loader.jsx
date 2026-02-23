import { useSelector } from 'react-redux';
import logo  from "@/assets/logo.png";
import { useEffect, useState } from 'react';

const Loader = () => {
  const { isLoading } = useSelector((state) => state.loader);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-100 transition-opacity duration-300 ${
      isLoading ? 'opacity-100' : 'opacity-0'
    }`}>
       
       <div className='animate-bounce bg-white rounded-full'>
        <img src={logo} alt="Loader" className="w-16 h-16 animate-pulse" />
        
       </div>
        <div className='animate-pulse text-white font-semibold'>Loading...</div>
    </div>
  );
};

export default Loader;
