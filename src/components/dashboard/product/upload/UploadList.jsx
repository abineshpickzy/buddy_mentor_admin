import React from "react";
import { X, FileText, Loader2, CheckCircle2, AlertCircle, VideoIcon } from "lucide-react";

const UploadList = ({ uploadingFile, handleCancelUpload }) => {
  if (!uploadingFile?.length) return null;

 const getStatusBadge = (file) => {
  if (file.status === "Cancelled") {
    return (
      <span className="flex items-center justify-between gap-1 text-xs font-medium py-1">
        <div className="flex items-center gap-2 text-primary">
          <VideoIcon size={24} className="ml-2" />
          {file.name}
        </div>
        <span className="flex items-center gap-1 text-yellow-600">
          <AlertCircle size={14} />
          Cancelled
        </span>
      </span>
    );
  }

  if (file.status === "Failed") {
    return (
      <span className="flex items-center justify-between gap-1 text-xs font-medium py-1">
        <div className="flex items-center gap-2 text-primary">
          <VideoIcon size={24} className="ml-2" />
          {file.name}
        </div>
        <span className="flex items-center gap-1 text-red-600">
          <AlertCircle size={14} />
          Failed
        </span>
      </span>
    );
  }

  if (file.status === "Completed") {
    return (
      <span className="flex items-center justify-between gap-1 text-xs font-medium py-1">
        <div className="flex items-center gap-2 text-primary">
          <VideoIcon size={24} className="ml-2" />
          {file.name}
        </div>
        <span className="flex items-center gap-1 text-green-600">
          <CheckCircle2 size={14} />
          Completed
        </span>
      </span>
    );
  }

  return (
    <span className="flex items-center justify-between gap-1 text-xs font-medium py-1">
      <div className="flex items-center gap-2 text-primary">
        <VideoIcon size={24} className="ml-2" />
        {file.name}
      </div>
      <span className="flex items-center gap-1 text-blue-600">
        <Loader2 size={14} className="animate-spin" />
        Uploading...
      </span>
    </span>
  );
};


  return (
    <div className="flex flex-col py-4">
      <h3  className=' text-xl font-semibold text-primary leading-tight'>Uploading Files</h3>
      {uploadingFile.map((file) => (
        <div
          key={file.uid}
          className=" p-4 flex flex-col border-b-2 border-gray-200 max-w-sm"
        >
          { file.fileType?.startsWith("video/")? (
           
           <div>
              {getStatusBadge(file)}
             <div className="relative">
              <video controls className="w-full h-32 object-contain rounded-xl" >
                <source src={file.previewURL} type={file.fileType} />
              </video>
              {file.progress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="28" 
                        stroke="#3b82f6" 
                        strokeWidth="4" 
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - file.progress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{file.progress}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelUpload(file.uid)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
             </div>
           </div>
        )
          : 
           file.fileType?.startsWith("image/")? (
            <img src={file.previewURL} alt={file.name} className="w-full h-full object-cover" />
           ) :
           (
              <div>
                <FileText className="mx-auto my-3 text-gray-400" size={32} />
                <p className="text-center text-sm text-gray-600 truncate">
                  {file.name}
                </p>
              </div>
           )
          }

        </div>
      ))}
    </div>
  );
};

export default UploadList;
