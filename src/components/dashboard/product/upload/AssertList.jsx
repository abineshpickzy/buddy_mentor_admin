
import React, { useState } from 'react';
import { FileText, VideoIcon, Image, ChevronDown, LayoutGrid, List, Edit ,File} from 'lucide-react';
import PreviewModal from './PreviewModal';
import { Can } from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";
import { addToast } from '@/features/toast/toastSlice';

import { useSelector, useDispatch } from 'react-redux';



const AssertList = ({ assets, onReplace, productType, onToggleDownloadable, onAddUpload }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [gridView, setGridView] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAssignee , setSelectedAssignee] = useState(null);

  const {assignees} = useSelector((state) => state.products);
  const dispatch =useDispatch();

  const filteredAssets = assets.filter(asset => {
    if (statusFilter === '' || statusFilter === '2') return true;
    return asset.status === statusFilter;
  });




  const handleFileClick = (file) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const handleEdit = (file, e) => {
    e.stopPropagation();
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const handleDownloadable = (file, e) => {
    e.stopPropagation();
    const updatedAssets = assets.map(asset =>
      asset._id === file._id ? { ...asset, is_downloadable: !asset.is_downloadable } : asset
    );
    onToggleDownloadable?.(updatedAssets, file);
  };

  const handleSelectFile = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter(f => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleSelectAll = () => {


    if (selectedFiles.length === filteredAssets.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredAssets);
    }
  };

  const handleAssign = () => {

    if(selectedFiles.length === 0){
      dispatch(addToast({ type: "error", message: "Please select at least one file" }));
      return
    }
    if(selectedAssignee === null || selectedAssignee === undefined || selectedAssignee === ''){
      dispatch(addToast({ type: "error", message: "Please select an assignee" }));
      return
    }
    console.log("selectedAssignee", selectedAssignee, selectedFiles)
    setSelectedFiles([]);
    setSelectedAssignee(null);
    
  };

  return (
    <div>
      {/* Filters */}
     
     <div className="flex items-center justify-between ">
       <div className="text-xl font-semibold text-gray-600">Assets</div>
        <div className=" py-4 flex items-center justify-end gap-4">
        {/* Status Filter  */}
        <div className="flex items-center relative" style={{ minWidth: '100px', maxWidth: '400px' }}>
          <label className="text-base font-semibold text-gray-600 mr-4">Status   </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-gray-300 bg-white px-3 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="">All</option>
            <option value="0">Draft</option>
            <option value="1">InReview</option>
            <option value="2">Approved</option>
            <option value="-1">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2 pointer-events-none" size={16} />
        </div>

         {/* Assignee Filter  */}
        <div className="flex items-center relative" style={{ minWidth: '100px', maxWidth: '400px' }}>
          <label className="text-base font-semibold text-gray-600 mr-4">View   </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-gray-300 bg-white px-3 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="">All</option>
          {assignees?.map((assignee) => (
              <option key={assignee._id} value={assignee._id}>
                {assignee.user_name}
              </option>
            ))
}
          </select>
          <ChevronDown className="absolute right-2 pointer-events-none" size={16} />
        </div>
          <div/>
        {/* Assign to admins */}
        <div className="flex items-center gap-4">
           <div className="flex items-center relative" style={{ minWidth: '250px', maxWidth: '400px' }}>
          <label className="text-base font-semibold text-gray-600 mr-2 min-w-[80px]">Assign To   </label>
          <select
            value={selectedAssignee || ''}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="appearance-none border border-gray-300 bg-white px-3 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="" className=''>Select Assignee</option>
            {assignees?.map((assignee) => (
              <option key={assignee._id} value={assignee._id}>
                {assignee.user_name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 pointer-events-none" size={16} />
        </div>
        <button
          className="bg-[#03a9f4] text-sm font-semibold hover:bg-[#03a9f4] cursor-pointer text-white px-4 py-[6px] rounded-md" 
          onClick={handleAssign}>
            Assign 
          </button>

        </div>
        {
          gridView ? (
            <List className="w-8 text-black cursor-pointer" onClick={() => setGridView(!gridView)} />
          ) : (
            <LayoutGrid className=" w-8 text-black cursor-pointer " fill="black" onClick={() => setGridView(!gridView)} />
          )
        }
        {onAddUpload && (
          <Can permission={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
            <button
              className="bg-blue-500 text-sm font-semibold hover:bg-blue-600 text-white px-10 py-[6px] rounded-md"
              onClick={onAddUpload}
            >
              Add / Upload
            </button>
          </Can>
        )}
      </div>
     </div>

      {gridView ? (

        /* ================= GRID VIEW ================= */
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-4">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No assets found
            </div>
          ) : (
            filteredAssets.map((file, index) => (
              <div
                key={file._id || index}
                className="bg-white border border-gray-200 hover:shadow-md transition cursor-pointer p-4 flex gap-4 items-start"
                onClick={() => handleFileClick(file)}
              >
                {/* LEFT SIDE PREVIEW */}
                <div className="w-28 h-full flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0">
                  {file.type?.startsWith("video") ? (
                    <VideoIcon size={40} className="text-blue-600" />
                  ) : file.type?.startsWith("image") ? (
                    <Image size={40} className="text-green-600" />
                  ) : (
                    <FileText size={40} className="text-gray-600" />
                  )}
                </div>

                {/* RIGHT SIDE CONTENT */}
                <div className="flex flex-col flex-1 justify-between">

                  {/* Top Section */}
                  <div>
                    <div className='flex items-start justify-between'>
                      <div className="text-base font-semibold text-gray-800">
                      {file.original_name || file.file_name || file.name}

                    </div>
                      <Can permission={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
                      <span className=" text-blue-600 cursor-pointer hover:underline" onClick={(e) => handleEdit(file, e)}>
                        <Edit size={20}/>
                      </span>
                    </Can>
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {file.type?.startsWith("video")
                        ? "Video"
                        : file.type?.startsWith("image")
                          ? "Image"
                          : "File"}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div
                    className="mt-4 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm font-medium text-green-600">
                      {file.status || "Approved"}
                    </span>

                    <div className="flex items-center gap-4">
                      {/* Download Toggle */}
                      <label className="flex items-center gap-1 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={file.is_downloadable}
                          className="w-3 h-3"
                          onChange={(e) => handleDownloadable(file, e)}
                        />
                        Downloadable
                      </label>

                    </div>
                  
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* ================= LIST VIEW ================= */

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#9e9e9e] text-sm text-center text-white">
                <th className="px-6 py-3"><input type="checkbox" checked={filteredAssets.length > 0 && selectedFiles.length === filteredAssets.length} onChange={handleSelectAll} /></th>
                <th className="px-6 py-3">Sno</th>
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">Asset Name</th>
                <th className="px-6 py-3">Asset Type</th>
                <th className="px-6 py-3">Allow Download</th>
                <th className="px-6 py-3">Status</th>
                <Can permission={productType == 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}><th className="px-6 py-3">Action</th></Can>
              </tr>
            </thead>

            <tbody className=''>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-2 text-center text-gray-500">
                    No assets found
                  </td>
                </tr>
              ) : (
                filteredAssets.map((file, index) => (
                  <tr
                    key={file._id || index}
                    className="text-sm odd:bg-[#e6e6e6] border-b-2 border-[#d8dbdd]"
                  >
                    <td className="px-6 py-3 text-center"><input type="checkbox" checked={selectedFiles.includes(file)} onChange={() => handleSelectFile(file)} /></td>
                    {/* Sno */}
                    <td className="px-6 py-3 text-center">{index + 1}</td>

                    {/* Icon */}
                    <td className="px-6 py-3 text-center">
                      {file.type?.startsWith("video") && (
                        <VideoIcon size={20} className="text-blue-600 mx-auto" />
                      )}

                      {file.type.startsWith("image") && (
                        <Image size={20} className="text-green-600 mx-auto" />
                      )}

                      {!file.type?.startsWith("video") &&
                        !file.type.startsWith("image") && (
                          <FileText size={20} className="text-gray-600 mx-auto" />
                        )}
                    </td>

                    {/* Asset Name */}
                    <td
                      className="px-6 py-3 text-center font-medium text-primary cursor-pointer hover:underline"
                      onClick={() => handleFileClick(file)}
                    >
                      {file.original_name ||
                        file.file_name ||
                        file.name}
                    </td>

                    {/* Asset Type */}
                    <td className="px-6 py-3 text-center capitalize">
                      {file.type?.startsWith("video")
                        ? "Video"
                        : file.type?.startsWith("image")
                          ? "Image"
                          : "File"}
                    </td>

                    {/* Is Downloadable */}
                    <td className="px-6 py-3 text-center">

                      <input type="checkbox" checked={file.is_downloadable} className='w-3 h-3' onChange={(e) => handleDownloadable(file, e)} />

                    </td>

                    {/* Status */}
                    <td className="px-6 py-3 text-center">
                      
                        {file.status? file.status==0?  <span className='bg-yellow-500 text-xs rounded-xs text-white px-2 py-1'>Draft</span>
                        :file.status==1 ? <span className='bg-[#03a9f4] text-xs rounded-xs text-white px-2 py-1'>In Review</span>
                        :file.status==2 ? <span className='bg-green-600 text-xs rounded-xs text-white px-2 py-1'>Approved</span>
                        :file.status==3 ? <div className='flex gap-2 items-center justify-center'> <span className='bg-red-600 text-xs rounded-xs text-white px-2 py-1'>Rejected</span> <File size={20} className='text-red-600'/></div>
                        :<span className='bg-red-600 text-xs rounded-xs text-white px-2 py-1'>Cancelled</span> :  <span className='bg-green-600 text-xs rounded-xs text-white px-2 py-1'>Approved</span>}
                      
                    </td>

                    {/* Action */}
                    <Can permission={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
                      <td className="px-6 py-3 text-center text-blue-600 cursor-pointer hover:underline" onClick={(e) => handleEdit(file, e)}>
                        Edit
                      </td>
                    </Can>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}




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