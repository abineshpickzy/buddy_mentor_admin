import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { previewFile } from "@/features/upload/uploadThunk";
import {Can} from "@/permissions";
import {PERMISSIONS} from "@/permissions/permissions";

const PreviewModal = ({ open, onClose, file, onReplace, productType }) => {
  const dispatch = useDispatch();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !file?.file_name || file.file_name === 'null' || file.file_name === null) return;

    let objectUrl = null;

    const fetchFile = async () => {
      setLoading(true);
      try {
        const blob = await dispatch(
          previewFile({
            file: file.file_name,
            type: file.type,
            width: 400,
          })
        ).unwrap();

        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (error) {
        console.error("Error fetching file:", error);
      } finally {
        setLoading(false);
      }
    };

    if(file?.type?.startsWith("video")) {
      console.log(file)
      if(file?.cloudflare_uid)
        setPreviewUrl(`https://videodelivery.net/${file.cloudflare_uid}/iframe`);
    }
    else {
      fetchFile();
    }
   

    // cleanup memory when modal closes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setPreviewUrl(null);
    };
  }, [open, file, dispatch]);

  if (!open || !file) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
          Loading...
        </div>
      );
    }

    if (!previewUrl && !file.src) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
          Preview not available
        </div>
      );
    }

    if (file.type?.startsWith("image")) {
      return (
        <img
          src={previewUrl || file.src}
          alt={file.file_name}
          className="max-w-full max-h-[80vh] min-h-[50vh] object-contain"
        />
      );
    }

    if (file.type?.startsWith("video")) {
      return (
        <iframe
          src={previewUrl || file.src}
          controls
          className="w-full object-contain min-h-[50vh] max-h-[80vh]"
        />
      );
    }

    return (
      <iframe
        src={previewUrl || file.src}
        className="w-full min-h-[80vh] max-h-[80vh]"
        title={file.file_name}
      />
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate">
            {file.file_name || file.name}
          </h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex justify-center items-center">
          {renderContent()}
        </div>

        {/* Footer with Replace Button */}
        {onReplace && (
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
            <Can permission={productType === 0 ? PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT : PERMISSIONS.MENTORING_PRODUCT_PROGRAM_EDIT}>
               <button
              onClick={onReplace}
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
            >
              Replace
            </button>
            </Can>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
