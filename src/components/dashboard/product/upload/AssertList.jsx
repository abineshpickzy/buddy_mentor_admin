
import React, { useState } from 'react';
import { FileText, VideoIcon, Image, ChevronDown, LayoutGrid, List } from 'lucide-react';
import PreviewModal from './PreviewModal';
import { Can } from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";



const AssertList = ({ assets, onReplace, productType, onToggleDownloadable }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [gridView, setGridView] = useState(false);

  const filteredAssets = assets.filter(asset => {
    if (!statusFilter) return true;
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

  return (
    <div>
      {/* Filters */}
      <div className="bg-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center relative" style={{ minWidth: '200px', maxWidth: '400px' }}>
          <label className="text-sm font-medium text-gray-600 mr-2">View:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-gray-300 bg-white px-3 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="">All</option>
            <option value="InReview">InReview</option>
            <option value="Approved">Approved</option>
          </select>
          <ChevronDown className="absolute right-2 pointer-events-none" size={16} />
        </div>
        {
          gridView ? (
            <List className="w-8 text-black cursor-pointer" fill onClick={() => setGridView(!gridView)} />
          ) : (

            <LayoutGrid className=" w-8 text-black cursor-pointer " fill onClick={() => setGridView(!gridView)} />
          )

        }
      </div>

      {gridView ? (

        /* ================= GRID VIEW ================= */
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <div className="w-28 h-24 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0">
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
                    <div className="text-base font-semibold text-gray-800">
                      {file.original_name || file.file_name || file.name}
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
                        Download
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
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-300 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Sno</th>
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">Asset Name</th>
                <th className="px-6 py-3">Asset Type</th>
                <th className="px-6 py-3 text-center">Is Downloadable</th>
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

                      <input type="checkbox" checked={file.is_downloadable} className='w-3 h-3' onChange={(e) => handleDownloadable(file, e)} />

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className=" py-1 text-xs rounded-full ">
                        {file.status || "Approved"}
                      </span>
                    </td>

                    {/* Action */}
                    <Can permission={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
                      <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline" onClick={(e) => handleEdit(file, e)}>
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