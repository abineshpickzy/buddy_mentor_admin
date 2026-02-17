import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import TreeMenu from "@/components/dashboard/product/TreeMenu";
import NewModel from "@/components/dashboard/product/NewModel";
import UploadModel from "@/components/dashboard/product/upload/UploadModel";
import { useDispatch, useSelector } from "react-redux";
import { addNode } from "@/features/products/productThunk";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";
import { addToast } from "@/features/toast/toastSlice";
import { addFile, setStatus, deleteFile } from "@/features/upload/uploadSlice";
import { uploadFile, saveVideoFile, cancelUpload } from "@/features/upload/uploadThunk";
import UploadList from "@/components/dashboard/product/upload/UploadList";
import AssertList from "@/components/dashboard/product/upload/AssertList";
import CancelConfirmModal from "@/components/dashboard/product/CancelConfirmModel";

import * as tus from "tus-js-client";

// sample data
const assets = [
  {
    id: 1,
    name: 'test1.png',
    type: 'image/',
    src: 'https://picsum.photos/200',
  },
  {
    id: 3,
    name: 'test3.pdf',
    type: 'other/',
  }
]

const ProgramDetails = () => {
  const { nodeId } = useParams();
  const { product, refetchProduct } = useOutletContext();

  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const currentNodeIdRef = useRef(nodeId);

  const dispatch = useDispatch();
  const currentFiles = useSelector((state) => state.upload.currentFiles);

  const [uploadingFile, setUploadingFile] = useState([]);
  const [assertFiles, setAssertFiles] = useState(assets || []);
  const activeUploadsRef = useRef({});

  const [nodename, setnodename] = useState("");
  const [nodes, setNodes] = useState([]);

  const [isNewModelOpen, setIsNewModelOpen] = useState(false);
  const [isUploadModelOpen, setIsUploadModelOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingUid, setCancellingUid] = useState(null);


  const handleNewSubmit = async (data) => {
    const payload = {
      parent_id: nodeId,
      name: data.name,
      type: 1
    }

    try {
      dispatch(showLoader());
      await dispatch(addNode(payload)).unwrap();
      await refetchProduct();
      dispatch(addToast({ message: "Node Added Successfully", type: "success" }));
      setIsNewModelOpen(false);
    }
    catch (error) {
      console.error("Error adding program:", error);
      dispatch(addToast({ message: "Failed to add new Node", type: "error" }));
    }
    finally {
      dispatch(hideLoader());
    }
  }


  // Upload file
  const handleUploadSubmit = async (file) => {
    if (!file) return;

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

      // Upload in chunks
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
            const payload = {
              parent_id: nodeId,
              cloudflare_uid: uid,
              file_name: file.name,
              type: "video",
              product_type: 1
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
          }
        },
      });

      activeUploadsRef.current[uid] = upload;
      upload.start();
    }
  }


  // cancel upload
  const handleCancelClick = (uid) => {
    setCancellingUid(uid);
    setIsCancelModalOpen(true);
  }

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
      if (node._id === targetId) {
        return [{ _id: node._id, name: node.name }];
      }

      if (node.children && node.children.length > 0) {
        const childPath = findBreadcrumbs(node.children, targetId);

        if (childPath.length) {
          return [{ _id: node._id, name: node.name }, ...childPath];
        }
      }
    }

    return [];
  };


  // Find node
  useEffect(() => {
    currentNodeIdRef.current = nodeId;
    if (!product?.programs?.length || !nodeId) return;
    const children = findNodeChildren(product.programs, nodeId);
    setNodes(children);
    const path = findBreadcrumbs(product.programs, nodeId);
    setBreadcrumbs(path);
  }, [product, nodeId]);


  // set current files in uploading
  useEffect(() => {
    setUploadingFile(currentFiles.filter((file) => file.nodeId === nodeId));
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
    <div className="">

      {breadcrumbs.length > 0 && (
        <div className="py-2 mb-4">
          <span
            className="text-primary/75 cursor-pointer hover:underline pr-2"
            onClick={() => navigate(`/dashboard/${product.product._id}/program`)}
          >
            Programs
          </span>
          <span className="text-primary/75 pr-2"> &gt; </span>
          {breadcrumbs.map((node, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={node._id}>
                <span
                  className={isLast ? "font-semibold text-primary" : "text-primary/75 cursor-pointer hover:underline pr-2"}
                  onClick={isLast ? undefined : () => navigate(`/dashboard/${product.product._id}/program/${node._id}`)}
                >
                  {node.name}
                </span>
                {!isLast && <span className="text-primary/75 pr-2"> &gt; </span>}
              </span>
            );
          })}
        </div>
      )}
      <h3 className="text-xl text-primary font-semibold mb-4">{nodename}</h3>

      {/* Buttons */}
      <div className="flex items-center mb-6">
        <div className="w-md "><button className="bg-blue-500 text-white py-1 px-8 rounded" onClick={() => setIsUploadModelOpen(true)}>Add / Upload</button></div>
        <div className="flex-1 ml-4">
          <button
            className="bg-blue-500 text-white py-1 px-8 rounded"
            onClick={() => setIsNewModelOpen(true)}
          >
            New
          </button></div>
      </div>

      {/* content block */}
      <div className="flex gap-4">

        {/* left media block */}
        <div className="w-md border-r-2 border-gray-200">
          {/* media assets list  */}

          <AssertList assets={assertFiles} />

          {/* uploading files */}
          <UploadList uploadingFile={uploadingFile} handleCancelUpload={handleCancelClick} />

        </div>

        {/* right tree block */}
        <div className="flex-1">
          {/* tree */}
          {nodes.length > 0 ? (
            <TreeMenu nodes={nodes} type="program" />
          ) : (
            <p className="text-gray-500 mt-4">No program nodes available</p>
          )}
        </div>
      </div>



      <NewModel
        open={isNewModelOpen}
        onCancel={() => setIsNewModelOpen(false)}
        onSubmit={handleNewSubmit}
      />
      <UploadModel
        open={isUploadModelOpen}
        onCancel={() => setIsUploadModelOpen(false)}
        onSubmit={handleUploadSubmit}
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

export default ProgramDetails;
