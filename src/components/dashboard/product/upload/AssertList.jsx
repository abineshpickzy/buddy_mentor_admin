
import React, { useEffect, useState } from 'react';
import { FileText, VideoIcon, Loader2, CheckCircle2, AlertCircle, SquarePen, Image, FileSearchCorner } from 'lucide-react';
import PreviewModal from './PreviewModal';



const AssertList = ({ assets }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFileClick = (file) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const getStatusBadge = (file) => {
    if (file.type.startsWith("video")) {
      return (
        <span className="flex items-center justify-between px-2 text-xs font-medium py-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-base"> <VideoIcon size={24} fill="rgba(22, 56, 94, 1)" />{file.file_name ? file.file_name : file.name}</div>
          <span className='text-primary/90 cursor-pointer '><SquarePen className="" size={18} strokeWidth={2.5} /></span>
        </span>
      );
    }

    if (file.type==="image") {
      console.log(file);
      return (
        <span className="flex items-center justify-between px-2 text-xs font-medium py-1" >
          <div className="flex items-center gap-2 text-primary font-semibold text-base cursor-pointer" onClick={() => handleFileClick(file)}> <Image size={24} className="black " />{file.original_name? file.original_name : file.name}</div>
          <span className='text-primary/90 cursor-pointer'> <SquarePen className="" size={18} strokeWidth={2.5} /></span>
        </span>
      );
    }
    console.log(file.original_name);
    return (
      
      <span className="flex items-center justify-between px-2 text-xs font-medium py-1" >
        <div className="flex items-center gap-2 text-primary font-semibold text-base cursor-pointer" onClick={() => handleFileClick(file)}> <FileText size={24} className="black" />{file.original_name? file.original_name : file.name}</div>
        <span className='text-primary/90 cursor-pointer flex items-center gap-6'> <FileSearchCorner className="text-primary/50" size={18} strokeWidth={2.5} />  <SquarePen size={18} strokeWidth={2.5} /></span>
      </span>
    );
  };


  return (
    <div className="flex flex-col ">
      {/* <h3 className=' text-xl font-semibold text-primary '>Assets</h3> */}
      {assets.map((file, index) => (
        <div
          key={file._id}
          className=" px-4 flex flex-col  max-w-sm"
        >
          {file.type?.startsWith("video") ?

            // video
            (

              <div >
                {getStatusBadge(file)}
                <iframe
                  src={file.cloudflare_uid?`https://videodelivery.net/${file.cloudflare_uid}/iframe` : file.src}
                  loading="lazy"
                  title={file.file_name}
                  allowFullScreen
                  className="w-full h-32 rounded-md"
                  frameBorder="0"
                />

              </div>
            )
            :

        

              //  file
              (
                <div>
                  {getStatusBadge(file)}
                </div>
              )
          }

          {index !== assets.length - 1 && (
            <div className=" h-[1.5px] w-full my-4 bg-gray-200" />

          )}
        </div>
      ))}
      <PreviewModal 
        open={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        file={previewFile} 
      />
    </div>
  );
};

export default AssertList;