import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchReviewerAssetList, approveReviewAssert, rejectReviewAssert } from "@/features/products/productThunk";
import { previewFile } from "../../../../features/upload/uploadThunk";
import { addToast } from "@/features/toast/toastSlice";
import { FileText, VideoIcon, Image as ImageIcon, ArrowLeft, Upload, Video, X, Fullscreen } from "lucide-react";

import { PERMISSIONS } from "@/permissions/permissions";
import { Can } from "@/permissions";


const ReviewAssets = () => {
  const { productId, nodeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const nodePath = location.state?.parentPath || "";
  const product_type = location.state?.product_type || 0;
  const parent_id = location.state?.parent_id || "";
  console.log("product_type", product_type)

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [previews, setPreviews] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [previewModal, setPreviewModal] = useState(null);

  useEffect(() => {
    const loadAssets = async () => {
      if (!nodeId) return;
      try {
        setLoading(true);
        const result = await dispatch(
          fetchReviewerAssetList({ nodeId: nodeId, product_type: product_type })
        ).unwrap();
        setAssets(result.data);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, [nodeId, dispatch]);

  // Load asset previews
  useEffect(() => {
    const loadPreviews = async () => {
      for (const asset of assets) {
        // Skip videos (Cloudflare iframe will be used)
        if (asset.type?.startsWith("video")) continue;

        try {
          const blob = await dispatch(
            previewFile({
              file: asset.file_name,
              type: asset.type,
              width: 400,
              height: 400,
            })
          ).unwrap();

          const objectUrl = URL.createObjectURL(blob);

          setPreviews((prev) => ({
            ...prev,
            [asset._id]: objectUrl,
          }));
        } catch (err) {
          console.error("Preview failed:", err);
        }
      }
    };

    if (assets.length > 0) {
      loadPreviews();
    }

    // Cleanup object URLs
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [assets]);

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (assetId, file) => {
    if (file) {
      const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        dispatch(addToast({ type: "error", message: "Only TXT, PDF, DOC, DOCX files are allowed" }));
        return;
      }
      setUploadedFiles((prev) => ({ ...prev, [assetId]: file }));
    }
  };

  const handleApprove = async (asset) => {
    console.log("Approve:", {
      assetId: asset._id,
      comment: comments[asset._id],
      uploadedFile: uploadedFiles[asset._id]
    });

    const fd = new FormData();
    fd.append("product_type", product_type);
    if (uploadedFiles[asset._id]) {
      fd.append("file", uploadedFiles[asset._id]);
    }
    if (comments[asset._id]) {
      fd.append("feedback", comments[asset._id]);
    }

    try {
      await dispatch(approveReviewAssert({
        parent_id: parent_id,
        assetId: asset._id,
        payload: fd
      })).unwrap();

      dispatch(addToast({ type: "success", message: "Asset approved successfully" }));
      setAssets((prev) => prev.filter((a) => a._id !== asset._id));
      assets.length === 1 && navigate(`/dashboard/${productId}/review`);
    } catch (e) {
      dispatch(addToast({ type: "error", message: "Failed to approve asset" }));
      console.error(e);
    }
  };
  const handleFileRemove = (assetId) => {
    setUploadedFiles((prev) => ({ ...prev, [assetId]: null }));
  };

  const handleReject = async (asset) => {
    console.log("Reject:", {
      assetId: asset._id,
      comment: comments[asset._id],
      uploadedFile: uploadedFiles[asset._id]
    });
    if (!comments[asset._id]) {
      dispatch(addToast({ type: "error", message: "Please provide rejection feedback" }))
      return;
    }
    const fd = new FormData();
    fd.append("product_type", product_type);
    if (uploadedFiles[asset._id]) {
      fd.append("file", uploadedFiles[asset._id]);
    }
    fd.append("feedback", comments[asset._id]);


    try {
      await dispatch(rejectReviewAssert({
        parent_id: parent_id,
        assetId: asset._id,
        payload: fd
      })).unwrap();

      dispatch(addToast({ type: "success", message: "Asset rejected successfully" }));
      setAssets((prev) => prev.filter((a) => a._id !== asset._id));
      assets.length === 1 && navigate(`/dashboard/${productId}/review`);
    } catch (e) {
      dispatch(addToast({ type: "error", message: "Failed to reject asset" }));
      console.error(e);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(`/dashboard/${productId}/review`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      {/* BREADCRUMBS */}
      <div className="">
        {/* <span
          className="text-primary/75 cursor-pointer hover:underline pr-2"
          onClick={() => navigate(`/dashboard/${productId}/review`)}
        >
         Review
        </span> */}
        {nodePath && (
          <nav className="flex items-center gap-2">
            {nodePath.split("/").map((path, index) => (
              <span
                key={index}
                className="text-primary/75 cursor-pointer pr-2"
              // onClick={() => navigate(`/dashboard/${productId}/review/${path}`)}
              >
                {path} {index < nodePath.split("/").length - 1 && " > "}
              </span>
            ))}
          </nav>
        )}

      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-600">Review Assets</h2>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : assets.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No assets found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (

            <div
              key={asset._id}
              className="bg-white rounded-lg border-1 border-gray-300 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Preview Section */}
              <div className="bg-gray-50 h-40 p-3 flex items-center justify-center overflow-hidden relative">
                {/* VIDEO - Cloudflare */}
                {asset.type?.startsWith("video") ? (
                  <iframe
                    src={`https://iframe.videodelivery.net/${asset.cloudflare_uid}`}
                    className="w-full h-full bg-gray-50"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen

                  />
                ) : previews[asset._id] ? (
                  asset.type?.startsWith("image") ? (
                    <>
                      <img
                        src={previews[asset._id]}
                        alt="preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setPreviewModal(asset)}
                        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition"
                        title="View full preview"
                      >
                        <Fullscreen size={16} className="text-gray-700" />
                      </button>
                    </>
                  ) : (
                    <>
                      <iframe
                        src={previews[asset._id]}
                        title="file-preview"
                        className="w-full h-full"
                      />
                      <button
                        onClick={() => setPreviewModal(asset)}
                        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition"
                        title="View full preview"
                      >
                        <Fullscreen size={16} className="text-gray-700" />
                      </button>
                    </>
                  )
                ) : (
                  <div className="text-gray-400 text-xs">{previews[asset._id] ? "loading Preview ..." : "Preview not available"}</div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                {/* Asset Name */}
                <h3 className="font-medium text-sm text-gray-800 mb-2 truncate" title={asset.original_name}>
                  {asset.original_name}
                </h3>

                {/* Status Badge */}
                <div className="mb-3">
                  {asset.review_status === 0 && (
                    <span className="bg-yellow-500 text-xs rounded text-white px-2 py-1">Draft</span>
                  )}
                  {asset.review_status === 1 && (
                    <span className="bg-[#03a9f4] text-xs rounded text-white px-2 py-1">In Review</span>
                  )}
                  {asset.review_status === 2 && (
                    <span className="bg-green-600 text-xs rounded text-white px-2 py-1">Approved</span>
                  )}
                  {asset.review_status === -1 && (
                    <span className="bg-red-600 text-xs rounded text-white px-2 py-1">Rejected</span>
                  )}
                </div>

                {/* Feedback Textarea */}
                <Can permission={PERMISSIONS.MENTORING_PRODUCT_REVIEW_EDIT}>
                  <textarea
                    value={comments[asset._id] || ""}
                    onChange={(e) => handleCommentChange(asset._id, e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                    rows={2}
                    placeholder="Feedback comment..."
                  />
                </Can>

                {/* Uploaded File Name */}
                {uploadedFiles[asset._id] && (
                  <div className="text-xs text-gray-600 mb-2 truncate flex items-center gap-1" title={uploadedFiles[asset._id].name}>
                    {uploadedFiles[asset._id].type.startsWith('video') ? (
                      <Video size={14} className="flex-shrink-0" />
                    ) : uploadedFiles[asset._id].type.startsWith('image') ? (
                      <ImageIcon size={14} className="flex-shrink-0" />
                    ) : (
                      <FileText size={14} className="flex-shrink-0" />
                    )}
                    <div className="flex-1 flex justify-between items-center ">{uploadedFiles[asset._id].name} <X size={12} className="flex-shrink-0 cursor-pointer text-red-500 bg-red-50 rounded" onClick={() => handleFileRemove(asset._id)} /></div>
                  </div>
                )}

                {/* Upload Button */}
                <Can permission={PERMISSIONS.MENTORING_PRODUCT_REVIEW_EDIT}>
                  <label className="flex items-center justify-center gap-1 bg-blue-500 text-white text-xs py-1.5 rounded cursor-pointer hover:bg-blue-600 transition mb-2">
                    <Upload size={14} />
                    Upload
                    <input
                      type="file"
                      hidden
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(asset._id, e.target.files[0])}
                    />
                  </label>
                </Can>
                <Can permission={PERMISSIONS.MENTORING_PRODUCT_REVIEW_EDIT}>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(asset)}
                      className="flex-1 border border-red-400 text-red-500 text-xs py-1.5 rounded hover:bg-red-50 transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(asset)}
                      className="flex-1 border border-green-500 text-green-600 text-xs py-1.5 rounded hover:bg-green-50 transition cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                </Can>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewModal(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
            >
              <X size={32} />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              {previewModal.type?.startsWith("image") ? (
                <img
                  src={previews[previewModal._id]}
                  alt={previewModal.original_name}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              ) : (
                <iframe
                  src={previews[previewModal._id]}
                  title={previewModal.original_name}
                  className="w-full h-[85vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAssets;