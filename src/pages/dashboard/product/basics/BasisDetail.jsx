import { useEffect, useState, useRef, use } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import TreeMenu from "@/components/dashboard/product/TreeMenu";
import NewModel from "@/components/dashboard/product/NewModel";
import UploadModel from "@/components/dashboard/product/upload/UploadModel";
import { useDispatch, useSelector } from "react-redux";
import { addNode, getAssertFiles } from "@/features/products/productThunk";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";
import { addToast } from "@/features/toast/toastSlice";
import { addFile, setStatus, deleteFile } from "@/features/upload/uploadSlice";
import { uploadFile, saveVideoFile, saveAssert, cancelUpload, replaceAssetFile,toggleDownloadable } from "@/features/upload/uploadThunk";
import UploadList from "@/components/dashboard/product/upload/UploadList";
import AssertList from "@/components/dashboard/product/upload/AssertList";
import CancelConfirmModal from "@/components/dashboard/product/CancelConfirmModel";
import { PERMISSIONS } from "@/permissions/permissions";
import { Can } from "@/permissions";

import * as tus from "tus-js-client";

// sample data

const BasisDetail = () => {
  const { nodeId } = useParams();
  const { product, refetchProduct } = useOutletContext();

  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const currentNodeIdRef = useRef(nodeId);

  const dispatch = useDispatch();
  const currentFiles = useSelector((state) => state.upload.currentFiles);

  const [uploadingFile, setUploadingFile] = useState([]);
  const [assertFiles, setAssertFiles] = useState([]);
  const activeUploadsRef = useRef({});

  const [nodename, setnodename] = useState("");
  const [nodes, setNodes] = useState([]);

  const [isNewModelOpen, setIsNewModelOpen] = useState(false);
  const [isUploadModelOpen, setIsUploadModelOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingUid, setCancellingUid] = useState(null);
  const [replaceMode, setReplaceMode] = useState(false);
  const [replacingFile, setReplacingFile] = useState(null);


  const handleNewSubmit = async (data) => {
    console.log("product", product)
    const payload = {
      parent_id: nodeId,
      name: data.name,
      type: 0
    }

    console.log("Submitted payload:", payload);
    try {
      dispatch(showLoader());
      await dispatch(addNode(payload)).unwrap();
      await refetchProduct();
      dispatch(addToast({ message: "Node Added Successfully", type: "success" }));
      setIsNewModelOpen(false);
    }
    catch (error) {
      console.error("Error adding basic program:", error);
      dispatch(addToast({ message: "Failed to add new Node", type: "error" }));
    }
    finally {
      dispatch(hideLoader());
    }
  }


  // Upload file
  const handleUploadSubmit = async (file, isDownloadable = false) => {

    console.log("Uploaded file:", file);

    if (!file) return;

    // Replace mode
    if (replaceMode && replacingFile) {

      console.log("Replacing file:", replacingFile);
      if (file.type.startsWith('video')) {
        const payload = {
          file_name: file.name,
          file_size: file.size,
          file_type: file.type
        }

        const res = await dispatch(uploadFile(payload)).unwrap();
        const { uploadURL, uid } = res;

        const previewURL = URL.createObjectURL(file);
        const newFile = { name: file.name, nodeId: nodeId, uploadURL: uploadURL, status: "Uploading", uid: uid, progress: 0, fileType: file.type, previewURL }

        dispatch(addFile(newFile));
        setIsUploadModelOpen(false);
        dispatch(addToast({ message: "File Replacing Started", type: "success" }));

        const upload = new tus.Upload(file, {
          uploadUrl: uploadURL,
          chunkSize: 5 * 1024 * 1024,
          retryDelays: [0, 3000, 5000, 10000],
          onError: async function (error) {
            console.error(error);
            dispatch(setStatus({ uid: uid, status: "Failed", progress: 0 }));
            delete activeUploadsRef.current[uid];
          },
          onProgress: function (bytesUploaded, bytesTotal) {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            dispatch(setStatus({ uid: uid, status: "Uploading", progress: percentage }));
          },
          onSuccess: async function () {
            try {
              const replacePayload = {
                nodeId: nodeId,
                assetId: replacingFile._id,
                payload: {
                  cloudflare_uid: uid,
                  file_name: file.name,
                  type: "video",
                  product_type: 0
                }
              };
              await dispatch(replaceAssetFile(replacePayload)).unwrap();
              dispatch(setStatus({ uid: uid, status: "Completed", progress: 100 }));
              dispatch(addToast({ message: `File ${file.name} Replaced Successfully`, type: "success" }));
              if (currentNodeIdRef.current === newFile.nodeId) {
                setAssertFiles((prevFiles) => [
                  ...prevFiles.filter(f => f._id !== replacingFile._id),
                  { id: uid, name: file.name, type: file.type, src: URL.createObjectURL(file) }
                ]);
              }
              dispatch(deleteFile({ uid: uid }));
              delete activeUploadsRef.current[uid];
            } catch (error) {
              console.error("Error replacing file:", error);
              dispatch(deleteFile({ uid: uid }));
              dispatch(addToast({ message: `Failed to replace file ${file.name}`, type: "error" }));
            }
          },
        });

        activeUploadsRef.current[uid] = upload;
        upload.start();

      }
      //  if (file.type.startsWith('image'))
      else {

        console.log("Replace assert file:", replacingFile, "with:", file);

        try {

          const fd = new FormData();
          fd.append('file', file);
          fd.append('type', 'file');
          fd.append('product_type', 0);

          const replacePayload = {
            nodeId: nodeId,
            assetId: replacingFile._id,
            payload: fd
          };

          await dispatch(replaceAssetFile(replacePayload)).unwrap();
          dispatch(addToast({ message: `File ${file.name} Replaced Successfully`, type: "success" }));
          setAssertFiles((prevFiles) => [
            ...prevFiles.filter(f => f._id !== replacingFile._id),
            { _id: file.name, name: file.name, type: file.type, src: URL.createObjectURL(file) }
          ]);
          setIsUploadModelOpen(false); 
        } catch (error) {
          console.error("Error replacing file:", error);
          dispatch(addToast({ message: `Failed to replace file ${file.name}`, type: "error" }));
        }


      }
      setReplaceMode(false);
      setReplacingFile(null);
      return;
    }


    // Normal upload mode
    // 1 Ask backend for TUS upload URL

    if (file.type.startsWith('video/')) {
      const payload = {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      }

      const res = await dispatch(uploadFile(payload)).unwrap();
      const { uploadURL, uid } = res;



      const previewURL = URL.createObjectURL(file);

      const newFile = { name: file.name, nodeId: nodeId, uploadURL: uploadURL, status: "Uploading", uid: uid, progress: 0, fileType: file.type, previewURL }

      dispatch(addFile(newFile));
      setIsUploadModelOpen(false);
      dispatch(addToast({ message: "File Uploading Started", type: "success" }));


      // 2 Upload in chunks
      const upload = new tus.Upload(file, {
        uploadUrl: uploadURL,
        chunkSize: 5 * 1024 * 1024, // 5MB chunks
        retryDelays: [0, 3000, 5000, 10000],
        onError: async function (error) {
          console.error(error);
          dispatch(setStatus({ id: uploadURL, status: "Failed", progress: 0 }));
          delete activeUploadsRef.current[uid];
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
          dispatch(setStatus({ uid: uid, status: "Uploading", progress: percentage }));
        },
        onSuccess: async function () {
          console.log("Complteted :", newFile)
          try {
            const payload = {
              parent_id: nodeId,
              cloudflare_uid: uid,
              file_name: file.name,
              type: "video",
              product_type: 0,
              is_downloadable: isDownloadable
            }
            await dispatch(saveVideoFile(payload)).unwrap();
            dispatch(setStatus({ uid: uid, status: "Completed", progress: 100 }));
            dispatch(addToast({ message: `File ${file.name} Uploaded Successfully`, type: "success" }));
            if (currentNodeIdRef.current === newFile.nodeId) {
              setAssertFiles((prevFiles) => [...prevFiles, { id: uid, name: file.name, type: file.type, src: URL.createObjectURL(file) }]);
            }
            dispatch(deleteFile({ uid: uid }));
            delete activeUploadsRef.current[uid];

          } catch (error) {
            console.error("Error saving file:", error);
            dispatch(addToast({ message: `Failed to upload file ${file.name}`, type: "error" }));

          }
        },
      });

      activeUploadsRef.current[uid] = upload;
      upload.start();
    }

    else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("parent_id", nodeId);
      formData.append("product_type", 0);
      console.log("Form Data:", formData.get("file"));
      try {
        await dispatch(saveAssert(formData)).unwrap();
        dispatch(addToast({ message: `File ${file.name} Uploaded Successfully`, type: "success" }));
        setAssertFiles((prevFiles) => [...prevFiles, { _id: file.name, name: file.name, type: file.type, src: URL.createObjectURL(file) }]);
        setIsUploadModelOpen(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        dispatch(addToast({ message: `Failed to upload file ${file.name}`, type: "error" }));
        setIsUploadModelOpen(false);
      }

    }

  }


  // Handle replace from AssertList
  const handleReplace = (file) => {
    setReplacingFile(file);
    setReplaceMode(true);
    setIsUploadModelOpen(true);
  };

  // Handle toggle downloadable
  const handleToggleDownloadable = async (newAssert, file) => {
      setAssertFiles(newAssert);
      console.log(file);
    try {
            const data = {
          nodeId: nodeId,
          assetId: file._id,
          payload: { 
            is_downloadable: !file.is_downloadable,
            product_type: 0
           }
      }
      console.log(data)
      await dispatch(toggleDownloadable(data)).unwrap();

    } catch (error) {
      console.error("Error toggling downloadable:", error);
    }
  };

  // cancel upload click
  const handleCancelClick = (uid) => {
    setCancellingUid(uid);
    setIsCancelModalOpen(true);
  }

  // cancel upload
  const handleCancelUpload = async () => {
    const upload = activeUploadsRef.current[cancellingUid];
    if (upload) {
      upload.abort();
    }
    try {
      await dispatch(cancelUpload({ uid: cancellingUid })).unwrap();
      dispatch(deleteFile({ uid: cancellingUid }));
      delete activeUploadsRef.current[cancellingUid];
      dispatch(addToast({ message: `File ${currentFiles.find(f => f.uid === cancellingUid)?.name || ''} Upload Canceled`, type: "warning" }));
    } catch (error) {
      console.error("Error canceling upload:", error);
    }
    setIsCancelModalOpen(false);
    setCancellingUid(null);
  }



  // Find node
  const findNodeChildren = (tree, id) => {
    for (const node of tree) {
      if (node._id === id) {
        setnodename(node.name);
        return node.children || [];
      }

      if (node.children?.length) {
        const found = findNodeChildren(node.children, id);
        if (found !== null) return found;
      }
    }

    return null;
  };



  // Find breadcrumbs
  const findBreadcrumbs = (tree, targetId) => {
    for (const node of tree) {
      // If this is the node → return it as breadcrumb start
      if (node._id === targetId) {
        return [{ _id: node._id, name: node.name }];
      }

      // Search children
      if (node.children && node.children.length > 0) {
        const childPath = findBreadcrumbs(node.children, targetId);

        // If found in children → prepend current node
        if (childPath.length) {
          return [{ _id: node._id, name: node.name }, ...childPath];
        }
      }
    }

    // Not found
    return [];
  };


  // Find node
  useEffect(() => {
    currentNodeIdRef.current = nodeId;
    if (!product?.basics?.length || !nodeId) return;
    const children = findNodeChildren(product.basics, nodeId);
    setNodes(children);
    const path = findBreadcrumbs(product.basics, nodeId);
    setBreadcrumbs(path);
  }, [product, nodeId]);


  // get Assert Files
  useEffect(() => {
    if (nodeId) {
      try {
        dispatch(getAssertFiles({ id: nodeId, type: 0 })).unwrap()
          .then(res => {
            console.log(res);
            setAssertFiles(res.data);
          })
      } catch (error) {
        console.error("Error getting files:", error);
      }
    }
  }, [nodeId, dispatch]);


  // set current files in uploading
  useEffect(() => {
    setUploadingFile(currentFiles.filter((file) => file.nodeId === nodeId));
    console.log("Current files:", currentFiles);
  }, [currentFiles, nodeId]);

  const { loading } = useSelector(state => state.upload);
  // loader
  useEffect(() => {
    if (loading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [loading, dispatch]);

  return (
    <div className="space-y-8">

      {/* ================= BREADCRUMBS ================= */}
      {breadcrumbs.length > 0 && (
        <div className="py-2">
          <span
            className="text-primary/75 cursor-pointer hover:underline pr-2"
            onClick={() => navigate(`/dashboard/${product.product._id}/basis`)}
          >
            Basic
          </span>
          <span className="text-primary/75 pr-2"> &gt; </span>

          {breadcrumbs.map((node, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <span key={node._id}>
                <span
                  className={
                    isLast
                      ? "font-semibold text-primary"
                      : "text-primary/75 cursor-pointer hover:underline pr-2"
                  }
                  onClick={
                    isLast
                      ? undefined
                      : () =>
                        navigate(
                          `/dashboard/${product.product._id}/basis/${node._id}`
                        )
                  }
                >
                  {node.name}
                </span>
                {!isLast && (
                  <span className="text-primary/75 pr-2"> &gt; </span>
                )}
              </span>
            );
          })}
        </div>
      )}



      {/* ================= ASSETS TABLE SECTION ================= */}
      <div className=" rounded-lg ">

        <div className="flex items-center justify-between">
          <div className=" py-4 border-b border-gray-200 text-lg font-semibold text-primary">
            Assets
          </div>
         <Can permission={PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_EDIT}>
           <button
            className="bg-blue-500 text-sm font-semibold  hover:bg-blue-600 text-white px-10 py-[6px] rounded-md"
            onClick={() => setIsUploadModelOpen(true)}
          >
            Add / Upload
          </button>
         </Can>
        </div>

        <AssertList assets={assertFiles} onReplace={handleReplace} productType={0} onToggleDownloadable={handleToggleDownloadable} />

        {/* Uploading Files */}
        {uploadingFile.length > 0 && (
          <div className="pb-4">
            <UploadList
              uploadingFile={uploadingFile}
              handleCancelUpload={handleCancelClick}
            />
          </div>
        )}
      </div>

      {/* ================= TREE SECTION ================= */}
      <div className="pt-6  border-t-2 border-gray-300">

        <div>
          <h4 className="text-lg font-semibold text-primary mb-4">
            {nodename || "Select a node to view details"}
          </h4>
           <Can permission={PERMISSIONS.MENTORING_PRODUCT_CORE_FOUNDATION_CREATE}>
          <button
            className="bg-blue-500 text-sm font-semibold  hover:bg-blue-600 text-white px-10 py-[6px] rounded-md"
            onClick={() => setIsNewModelOpen(true)}
          >
            New
          </button>
           </Can>

        </div>


        {nodes.length > 0 ? (
          <TreeMenu nodes={nodes} />
        ) : (
          <p className="text-gray-500">No basic nodes available</p>
        )}
      </div>

      {/* ================= MODALS ================= */}
      <NewModel
        open={isNewModelOpen}
        onCancel={() => setIsNewModelOpen(false)}
        onSubmit={handleNewSubmit}
      />

      <UploadModel
        open={isUploadModelOpen}
        onCancel={() => {
          setIsUploadModelOpen(false);
          setReplaceMode(false);
          setReplacingFile(null);
        }}
        onSubmit={handleUploadSubmit}
        replaceMode={replaceMode}
        originalFile={replacingFile}
      />

      <CancelConfirmModal
        name={currentFiles.find(f => f.uid === cancellingUid)?.name || ""}
        open={isCancelModalOpen}
        onCancel={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelUpload}
      />
    </div>
  );

};

export default BasisDetail;
