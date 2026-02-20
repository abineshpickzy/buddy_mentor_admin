
import React, {  useState } from 'react';
import { FileText, VideoIcon,Image, } from 'lucide-react';
import PreviewModal from './PreviewModal';
import {Can} from "@/permissions";
import {PERMISSIONS} from "@/permissions/permissions";



const AssertList = ({ assets, onReplace, productType }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFileClick = (file) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

 const handleEdit = (file, e) => {
    e.stopPropagation();
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };


return (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-300 text-gray-600 uppercase text-xs">
        <tr>
          <th className="px-6 py-3">Sno</th>
          <th className="px-6 py-3">Icon</th>
          <th className="px-6 py-3">Asset Name</th>
          <th className="px-6 py-3">Asset Type</th>
          <th className="px-6 py-3 text-center">Is Downloadable</th>
          <th className="px-6 py-3">Status</th>
         <Can permissions={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}> <th className="px-6 py-3">Action</th></Can>
        </tr>
      </thead>

      <tbody className=''>
        {assets.length === 0 ? (
          <tr>
            <td colSpan="7" className="px-6 py-2 text-center text-gray-500">
              No assets found
            </td>
          </tr>
        ) : (
          assets.map((file, index) => (
          <tr
            key={file._id || index}
            className="even:bg-gray-200 "
          >
            {/* Sno */}
            <td className="px-6 py-4">{index + 1}</td>

            {/* Icon */}
            <td className="px-6 py-4">
              {file.type?.startsWith("video") && (
                <VideoIcon size={20} className="text-blue-600" />
              )}

              {file.type.startsWith("image") && (
                <Image size={20} className="text-green-600" />
              )}

              {!file.type?.startsWith("video") &&
                !file.type.startsWith("image") && (
                  <FileText size={20} className="text-gray-600" />
                )}
            </td>

            {/* Asset Name */}
            <td
              className="px-6 py-4 font-medium text-primary cursor-pointer hover:underline"
              onClick={() => handleFileClick(file)}
            >
              {file.original_name ||
                file.file_name ||
                file.name}
            </td>

            {/* Asset Type */}
            <td className="px-6 py-4 capitalize">
              {file.type?.startsWith("video")
                ? "Video"
                : file.type?.startsWith("image")
                ? "Image"
                : "File"}
            </td>

            {/* Is Downloadable */}
            <td className="px-6 py-4 text-center ">
            
              {file.is_downloadable ? (
                <span className="py-1 text-xs rounded-full text-green-600">
                  Yes
                </span>
              ) : (
                <span className="py-1 text-xs rounded-full text-red-600">
                  No
                </span>
              )}
              
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              <span className=" py-1 text-xs rounded-full ">
                {file.status || "Approved"}
              </span>
            </td>

            {/* Action */}
              <Can permissions={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
                  <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline" onClick={(e) => handleEdit(file, e)}>
              Edit
            </td>
              </Can>
          
          </tr>
          ))
        )}
      </tbody>
    </table>

    {/* Preview Modal */}
    <PreviewModal
      open={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      file={previewFile}
      onReplace={() => {
        setIsPreviewOpen(false);
        onReplace(previewFile);
      }}
      productType={productType}
    />
  </div>
);

};

export default AssertList;