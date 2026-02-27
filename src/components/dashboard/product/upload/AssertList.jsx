
import React, { useState } from 'react';
import { FileText, VideoIcon, Image, ChevronDown, LayoutGrid, List, Edit, File, X, Download } from 'lucide-react';
import PreviewModal from './PreviewModal';
import { Can, usePermission } from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";
import { addToast } from '@/features/toast/toastSlice';
import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { assignAssertToReviewer } from '@/features/upload/uploadThunk';
import { feedbackDownload } from '@/features/products/productThunk';



const AssertList = ({ assets, onReplace, productType, onToggleDownloadable, onAddUpload, setAssets }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [gridView, setGridView] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [feedbackPopup, setFeedbackPopup] = useState(null);
  const { productId, nodeId } = useParams();

  const { assignees } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const filteredAssets = assets.filter(asset => {
    if (statusFilter !== '' && asset.review_status != statusFilter) return false;
    if (assigneeFilter !== '' && asset.assignee_id !== assigneeFilter) return false;
    return true;
  });

  const editpermission = usePermission(productType == 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT);

  const handleDownload = async (file) => {
    console.log("Download file:", file);
    const type = file.file_type.startsWith('video') ? 'video' : file.file_type.startsWith('image') ? 'image' : 'file';
    try {
      const blob = await dispatch(feedbackDownload({ file: file.file_name, type: type })).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.original_name || file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      dispatch(addToast({ type: "error", message: "Failed to download file" }));
    }
  };



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

  const handleAssign = async () => {

    if (selectedFiles.length === 0) {
      dispatch(addToast({ type: "error", message: "Please select at least one file" }));
      return
    }
    if (selectedAssignee === null || selectedAssignee === undefined || selectedAssignee === '') {
      dispatch(addToast({ type: "error", message: "Please select an assignee" }));
      return
    }
    console.log("selectedAssignee", selectedAssignee, selectedFiles)
    const payload = {
      nodeId: nodeId,
      payload: {
        parent_id: nodeId, // node id
        assignee_id: selectedAssignee,
        assets: selectedFiles.map(file => file._id),
        product_type: productType,
        product_id: productId
      }
    }
    console.log("payload", payload)
    try {
      await dispatch(assignAssertToReviewer(payload)).unwrap();
      dispatch(addToast({ type: "success", message: "Assets assigned successfully" }));
      setAssets(prev => prev.map(asset =>
        selectedFiles.includes(asset) ? { ...asset, assignee_id: selectedAssignee, review_status: 1 } : asset
      ))
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to assign assets" }));
    }
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

          <Can permission={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
            {/* Assignee Filter  */}
            <div className="flex items-center relative" style={{ minWidth: '100px', maxWidth: '400px' }}>
              <label className="text-base font-semibold text-gray-600 mr-4">Assigner   </label>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="appearance-none border border-gray-300 bg-white px-3 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="">All</option>
                {assignees?.map((assignee) => (
                  <option key={assignee._id} value={assignee._id}>
                    {assignee.user_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 pointer-events-none" size={16} />
            </div>
            <div />
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
                className="bg-[#03a9f4] text-sm font-semibold hover:bg-blue-500 cursor-pointer text-white px-4 py-[6px] rounded-md"
                onClick={handleAssign}>
                Assign
              </button>

            </div>
          </Can>
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
                className="bg-white border border-gray-200 hover:shadow-md transition p-3 flex gap-3 items-start overflow-hidden"
              >
                {/* Checkbox */}
                <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                  <input
                    type="checkbox"
                    disabled={!editpermission || file.review_status === 2 || file.review_status === -1}
                    checked={selectedFiles.includes(file)}
                    onChange={() => handleSelectFile(file)}
                    className="mt-1"
                  />
                </div>

                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0 cursor-pointer" onClick={() => handleFileClick(file)}>
                  {file.type?.startsWith("video") ? (
                    <VideoIcon size={28} className="text-blue-600" />
                  ) : file.type?.startsWith("image") ? (
                    <Image size={28} className="text-green-600" />
                  ) : (
                    <FileText size={28} className="text-gray-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  {/* Name + Edit */}
                  <div className='flex items-start gap-2 min-w-0'>
                    <div
                      className="flex-1 min-w-0 text-sm font-semibold text-gray-800 cursor-pointer truncate"
                      onClick={() => handleFileClick(file)}
                      title={file.original_name || file.file_name || file.name}
                    >
                      {file.original_name || file.file_name || file.name}
                    </div>
                    <Can permission={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
                      <span className="text-blue-600 cursor-pointer hover:underline flex-shrink-0" onClick={(e) => handleEdit(file, e)}>
                        <Edit size={16} />
                      </span>
                    </Can>
                  </div>

                  {/* Type */}
                  <div className="text-xs text-gray-500">
                    {file.type?.startsWith("video") ? "Video" : file.type?.startsWith("image") ? "Image" : "File"}
                  </div>

                  {/* Status & Downloadable */}
                  <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Status */}
                    <div className="flex-shrink-0">
                      {file.review_status === 0 && (
                        <span className='bg-yellow-500 text-xs rounded text-white px-2 py-1'>Draft</span>
                      )}
                      {file.review_status === 1 && (
                        <span className='bg-[#03a9f4] text-xs rounded text-white px-2 py-1'>In Review</span>
                      )}
                      {file.review_status === 2 && (
                        <span className='bg-green-600 text-xs rounded text-white px-2 py-1'>Approved</span>
                      )}
                      {file.review_status === 3 && (
                        <span className='bg-yellow-500 text-xs rounded text-white px-2 py-1'>Draft</span>
                      )}
                      {file.review_status === -1 && (
                        <div className='flex items-center'>
                          <span className='bg-red-600 text-xs rounded text-white px-2 py-1'>Rejected</span>
                          <FileText
                            className='ml-2 cursor-pointer text-red-600'
                            size={16}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeedbackPopup(file);
                            }}
                          />
                        </div>
                      )}
                      {file.review_status === -2 && (
                        <span className='bg-red-600 text-xs rounded text-white px-2 py-1'>Cancelled</span>
                      )}
                      {file.review_status === undefined && (
                        <span className='bg-green-600 text-xs rounded text-white px-2 py-1'>Approved</span>
                      )}
                    </div>

                    {/* Downloadable */}
                    <label className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                      <input
                        type="checkbox"
                        disabled={!editpermission}
                        checked={file.is_downloadable === "true" || file.is_downloadable === true}
                        className="w-3 h-3"
                        onChange={(e) => handleDownloadable(file, e)}
                      />
                      Download
                    </label>
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
                <th className="px-6 py-3"><input type="checkbox" disabled={!editpermission} checked={filteredAssets.length > 0 && selectedFiles.length === filteredAssets.length} onChange={handleSelectAll} /></th>
                <th className="px-6 py-3">S.no</th>
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">Asset Name</th>
                <th className="px-6 py-3">Asset Type</th>
                <th className="px-6 py-3">Allow Download</th>
                <th className="px-6 py-3 text-start">Status</th>
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
                    <td className="px-6 py-3 text-center"><input type="checkbox" disabled={!editpermission || file.review_status === 2 || file.review_status === -1} checked={selectedFiles.includes(file)} onChange={() => handleSelectFile(file)} /></td>
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

                      <input type="checkbox" disabled={!editpermission} checked={file.is_downloadable === "true" || file.is_downloadable === true} className='w-3 h-3' onChange={(e) => handleDownloadable(file, e)} />

                    </td>

                    {/* Status */}
                    <td className="px-6 py-3 text-start ">
                      {file.review_status === 0 && (
                        <span className='bg-yellow-500 text-xs rounded-xs text-white px-2 py-1'>Draft</span>
                      )}
                      {file.review_status === 1 && (
                        <span className='bg-[#03a9f4] text-xs rounded-xs text-white px-2 py-1'>In Review</span>
                      )}
                      {file.review_status === 2 && (
                        <span className='bg-green-600 text-xs rounded-xs text-white px-2 py-1'>Approved</span>
                      )}
                      {file.review_status === 3 && (
                        <span className='bg-yellow-500 text-xs rounded-xs text-white px-2 py-1'>Draft</span>
                      )}

                      {file.review_status === -1 && (
                        <div className='flex gap-2 items-center justify-start'>
                          <span className='bg-red-600 text-xs rounded-xs text-white px-2 py-1'>Rejected</span>
                          <FileText
                            size={20}
                            className='cursor-pointer text-red-600'
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeedbackPopup(file);
                            }}
                          />
                        </div>
                      )}
                      {file.review_status === -2 && (
                        <span className='bg-red-600 text-xs rounded-xs text-white px-2 py-1'>Cancelled</span>
                      )}
                      {file.review_status === undefined && (
                        <span className='bg-green-600 text-xs rounded-xs text-white px-2 py-1'>Approved</span>
                      )}
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

      {/* Feedback Modal */}
      {feedbackPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setFeedbackPopup(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Rejection Feedback</h3>
              <X size={20} className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setFeedbackPopup(null)} />
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{feedbackPopup.review_feedback || "No feedback provided"}</p>

            {feedbackPopup.review_attachment && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Attachment:</p>
                <div className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded cursor-pointer" onClick={() => handleDownload(feedbackPopup.review_attachment)}>
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    <span className="text-sm text-gray-700 truncate">{feedbackPopup.review_attachment.original_name}</span>
                  </div>
                  <Download size={18} className="text-blue-600 flex-shrink-0" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

};

export default AssertList;