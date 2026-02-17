
import React from 'react';
import { FileText ,VideoIcon, Loader2, CheckCircle2, AlertCircle,SquarePen ,Image ,FileSearchCorner} from 'lucide-react';



const AssertList = ({assets}) => {

     const getStatusBadge = (file) => {
    if (file.type.startsWith("video/")) {
      return (
        <span className="flex items-center justify-between px-2 text-xs font-medium py-1">
         <div className="flex items-center gap-2 text-primary font-semibold text-base"> <VideoIcon size={24} fill="rgba(22, 56, 94, 1)" />{file.name}</div>
          <span className='text-primary/90 cursor-pointer '><SquarePen className="" size={18} strokeWidth={2.5} /></span>
        </span>
      );
    }

    if (file.type.startsWith("image/")) {
      return (
        <span className="flex items-center justify-between px-2 text-xs font-medium py-1">
         <div className="flex items-center gap-2 text-primary font-semibold text-base"> <Image size={24}  className="black " />{file.name}</div>
        <span className='text-primary/90 cursor-pointer'> <SquarePen className="" size={18} strokeWidth={2.5}  /></span>
        </span>
      );
    }

    return (
        <span className="flex items-center justify-between px-2 text-xs font-medium py-1">
         <div className="flex items-center gap-2 text-primary font-semibold text-base"> <FileText size={24}  className="black" />{file.name}</div>
          <span className='text-primary/90 cursor-pointer flex items-center gap-6'> <FileSearchCorner className="text-primary/50" size={18} strokeWidth={2.5} />  <SquarePen size={18} strokeWidth={2.5}  /></span>
        </span> 
      );
  };


    return (
<div className="flex flex-col ">
        {/* <h3 className=' text-xl font-semibold text-primary '>Assets</h3> */}
      {assets.map((file, index) => (
        <div
          key={file.id}
          className=" px-4 flex flex-col  max-w-sm"
        >
          { file.type?.startsWith("video/")? (
           
           <div >
              {getStatusBadge(file)}
            <iframe
  src={file.src}           
  loading="lazy"
  allow="autoplay; fullscreen"
  allowFullScreen
  className="w-full h-32 rounded-md"
  frameBorder="0"
/>

           </div>
        )
          : 
           file.type?.startsWith("image/")? (
            <div>
            { getStatusBadge(file)}
            <img src={file.src} alt={file.name} className="h-32 object-cover" />
            </div>
           ) :
           (
              <div>
                {getStatusBadge(file)}
              </div>
           )
          }
          
          { index!==assets.length-1&&(
            <div className=" h-[1.5px] w-full my-4 bg-gray-200"/>
            
          )}
        </div>
      ))}
    </div>
    );
};

export default AssertList;