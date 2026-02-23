import React, { useState } from "react";
import { X, Upload } from "lucide-react";

const UploadModel = ({ open, onCancel, onSubmit, replaceMode = false, originalFile = null }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [downloadable, setDownloadable] = useState(false);

  if (!open) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = () => {
    if (file) {
      onSubmit(file, downloadable);
      setFile(null);
      setPreview(null);
      setDownloadable(false);
    }
  };

  const handleCancel = () => {

    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] rounded shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700">{replaceMode ? 'Replace File' : 'Upload File'}</h2>
          <X
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={handleCancel}
          />
        </div>

        {/* Body */}
        <div className="mb-6">
          <label className="block border-2 border-dashed border-gray-300 rounded p-8 text-center cursor-pointer hover:border-blue-500 transition">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview ? (
              file.type.startsWith('image/') ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
              ) : file.type.startsWith('video/') ? (
                <video src={preview} controls className="max-h-48 mx-auto rounded" />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center text-sm font-medium">
                    {file.name.split('.').pop().toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-600">{file.name}</p>
                </div>
              )
            ) : (
              <>
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              </>
            )}
          </label>
          {
            !replaceMode && <div className="flex items-center justify-end pt-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="download" checked={downloadable} onChange={() => setDownloadable(prev => !prev)} />
                downloadable
              </label>
            </div>
          }

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="border px-4 py-2 text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {replaceMode ? 'Replace' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModel;
