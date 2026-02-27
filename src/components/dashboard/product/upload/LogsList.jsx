import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, Image, Video } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAssertLogs } from "@/features/upload/uploadThunk";
import { feedbackDownload } from "@/features/products/productThunk";

const actionMap = {
    0: "Uploaded",
    1: "Assigned",
    2: "Commented",
    3: "Replaced",
    4: "Approved",
    5: "Rejected",
};

const LogsList = ({ refetchTrigger }) => {
    const { nodeId } = useParams();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [openLogId, setOpenLogId] = useState(null);
    const [logs, setLogs] = useState([]);

    const [limit, setLimit] = useState(10);
    const [skip, setSkip] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);

    const toggleLog = (id) => {
        setOpenLogId(openLogId === id ? null : id);
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await dispatch(
                    getAssertLogs({ nodeId, limit, skip })
                ).unwrap();

                setLogs(response.data);
                setTotalCount(response.total_count);
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        if (nodeId && isOpen) fetchLogs();
    }, [limit, skip, isOpen, nodeId, refetchTrigger]);

    const handlePageChange = (page) => {
        setSkip((page - 1) * limit);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setSkip(0);
    };

    return (
        <div className="mt-8">

            {/* HEADER */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between cursor-pointer"
            >
                <h2 className="text-base text-gray-600 font-semibold">
                    Media content upload / edit / review logs
                </h2>
                <ChevronDown
                    size={28}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {isOpen && (
                <>
                    {logs.length === 0 ? (
                        <div className="mt-6 text-center text-gray-500">
                            No logs yet
                        </div>
                    ) : (
                        <>
                            {/* LOG GRID */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {logs.map((log, index) => {
                                    const uniqueId = `${log.asset_id}-${index}`;

                                    return (
                                        <div key={uniqueId} className="rounded-sm">

                                            {/* CARD HEADER */}
                                            <div
                                                onClick={() => toggleLog(uniqueId)}
                                                className="flex justify-between items-center rounded-t-lg px-4 py-3 cursor-pointer bg-[#dae1ef]"
                                            >
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <ChevronDown
                                                        size={18}
                                                        className={`transition-transform duration-300 flex-shrink-0 ${openLogId === uniqueId ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-gray-600 text-sm truncate">
                                                            {log.display_user}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {actionMap[log.action]?.toLowerCase() || "unknown"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="text-xs text-gray-600">
                                                    {new Date(log.created_at).toLocaleDateString("en-GB")}
                                                </span>
                                            </div>

                                            {/* CARD BODY */}
                                            {openLogId === uniqueId && (
                                                <div className="p-4 bg-[#f1f5fc] rounded-b-lg border-t border-gray-200 shadow">

                                                    {/* Action 0: Uploaded */}
                                                    {log.action === 0 && (
                                                        <>
                                                            <p className="text-sm font-semibold mb-2 text-gray-600">
                                                                Uploaded {log.asset_snapshot.type}
                                                            </p>
                                                            {log.asset_snapshot && (
                                                                <div className="flex items-start text-green-600 gap-3 bg-white p-3 rounded-md">
                                                                    {log.asset_snapshot.type === "image" ? (
                                                                        <Image size={20} className="text-blue-500 mt-1" />
                                                                    ) : (
                                                                        log.asset_snapshot.type === "video" ? (
                                                                            <Video size={20} className="text-blue-500 mt-1" />
                                                                        ) : (
                                                                            <FileText size={20} className="text-blue-500 mt-1" />
                                                                        )
                                                                    )}
                                                                    <div>
                                                                        <p className="text-sm text-gray-700">
                                                                            {log.asset_snapshot.original_name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            Type: {log.asset_snapshot.type}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Action 1: Assigned */}
                                                    {log.action === 1 && (
                                                        <>
                                                            <p className="text-sm font-semibold mb-2 text-gray-600">
                                                                Assigned {log.asset_snapshot.type}
                                                            </p>
                                                            {log.asset_snapshot && (
                                                                <div className="flex items-start gap-3 bg-white p-3 rounded-md">
                                                                    <FileText size={20} className="text-blue-500 mt-1" />
                                                                    <div>
                                                                        <p className="text-sm text-gray-700">
                                                                            {log.asset_snapshot.original_name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            Type: {log.asset_snapshot.type}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Action 2: Commented */}
                                                    {log.action === 2 && (
                                                        <>
                                                            <p className="text-sm font-semibold mb-2 text-gray-600">
                                                                Commented
                                                            </p>
                                                            <div className="bg-white p-3 rounded-md">
                                                                <p className="text-sm text-gray-700">
                                                                    Comment added
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Action 3: Replaced */}
                                                    {log.action === 3 && (
                                                        <>
                                                            <p className="text-sm font-semibold mb-2 text-gray-600">
                                                                Replaced
                                                            </p>
                                                            {log.asset_snapshot && (
                                                                <div className="bg-white p-3 rounded-md">
                                                                    <p className="text-xs text-gray-500 mb-2">New File:</p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                        {log.asset_snapshot.type === "image" ? (
                                                                            <Image size={20} className="text-orange-500 mt-1" />
                                                                        ) : log.asset_snapshot.type === "video" ? (
                                                                            <Video size={20} className="text-orange-500 mt-1" />
                                                                        ) : (
                                                                            <FileText size={20} className="text-orange-500 mt-1" />
                                                                        )}
                                                                        <div>
                                                                            <p className="text-sm text-gray-700">
                                                                                {log.asset_snapshot.original_name}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                Type: {log.asset_snapshot.type}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {log.prev_asset_sanpshot && (
                                                                <div className="bg-white p-3 rounded-md">
                                                                    <p className="text-xs text-gray-500 mb-2">Previous File:</p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                        {log.prev_asset_sanpshot.type === "image" ? (
                                                                            <Image size={20} className="text-orange-500 mt-1" />
                                                                        ) : log.prev_asset_sanpshot.type === "video" ? (
                                                                            <Video size={20} className="text-orange-500 mt-1" />
                                                                        ) : (
                                                                            <FileText size={20} className="text-orange-500 mt-1" />
                                                                        )}
                                                                        <div>
                                                                            <p className="text-sm text-gray-700">
                                                                                {log.prev_asset_sanpshot.original_name}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                Type: {log.prev_asset_sanpshot.type}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Action 4: Approved */}
                                                    {log.action === 4 && (
                                                        <>
                                                            <p className="text-sm font-semibold mb-2 text-green-600">
                                                                Approved
                                                            </p>

                                                            {log.asset_snapshot && (
                                                                <div className="bg-white p-3 rounded-md">
                                                                    <p className="text-xs text-gray-500 mb-2">Approved File:</p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                                        {log.asset_snapshot.type === "image" ? (
                                                                            <Image size={20} className="text-green-500 mt-1" />
                                                                        ) : log.asset_snapshot.type === "video" ? (
                                                                            <Video size={20} className="text-green-500 mt-1" />
                                                                        ) : (
                                                                            <FileText size={20} className="text-green-500 mt-1" />
                                                                        )}
                                                                        <div>
                                                                            <p className="text-sm text-gray-700">
                                                                                {log.asset_snapshot.original_name}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                Type: {log.asset_snapshot.type}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {log.feedback && (
                                                                <div className="bg-white p-3 rounded-md mt-2">
                                                                    <p className="text-xs text-gray-500 mb-1">Feedback:</p>
                                                                    <p className="text-sm text-gray-700">{log.feedback}</p>
                                                                </div>
                                                            )}
                                                            {log.attachment && (
                                                                <div className="bg-white p-3 rounded-md">
                                                                    <p className="text-xs text-gray-500 mb-2">Attachments:</p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                                        {log.attachment.type === "image" ? (
                                                                            <Image size={20} className="text-green-500 mt-1" />
                                                                        ) : log.attachment.type === "video" ? (
                                                                            <Video size={20} className="text-green-500 mt-1" />
                                                                        ) : (
                                                                            <FileText size={20} className="text-green-500 mt-1" />
                                                                        )}
                                                                        <div>
                                                                            <p className="text-sm text-gray-700">
                                                                                {log.attachment.original_name}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                Type: {log.attachment.type}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Action 5: Rejected */}
                                                    {log.action === 5 && (
                                                        <>
                                                            <p className="text-sm font-semibold mb-2 text-red-600">
                                                                Rejected
                                                            </p>

                                                            {log.asset_snapshot && (
                                                                <div className="bg-white p-3 rounded-md">
                                                                    <p className="text-xs text-gray-500 mb-2">Rejected File:</p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                                        {log.asset_snapshot.type === "image" ? (
                                                                            <Image size={20} className="text-red-500 mt-1" />
                                                                        ) : log.asset_snapshot.type === "video" ? (
                                                                            <Video size={20} className="text-red-500 mt-1" />
                                                                        ) : (
                                                                            <FileText size={20} className="text-red-500 mt-1" />
                                                                        )}
                                                                        <div>
                                                                            <p className="text-sm text-gray-700">
                                                                                {log.asset_snapshot.original_name}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                Type: {log.asset_snapshot.type}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {log.feedback && (
                                                                <div className="bg-white p-3 rounded-md mt-2">
                                                                    <p className="text-xs text-gray-500 mb-1">Feedback:</p>
                                                                    <p className="text-sm text-gray-700">{log.feedback}</p>
                                                                </div>
                                                            )}
                                                            {log.attachment && (
                                                                <div className="bg-white p-3 rounded-md">
                                                                    <p className="text-xs text-gray-500 mb-2">Attachments:</p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                                        {log.attachment.type === "image" ? (
                                                                            <Image size={20} className="text-red-500 mt-1" />
                                                                        ) : log.attachment.type === "video" ? (
                                                                            <Video size={20} className="text-red-500 mt-1" />
                                                                        ) : (
                                                                            <FileText size={20} className="text-red-500 mt-1" />
                                                                        )}
                                                                        <div>
                                                                            <p className="text-sm text-gray-700">
                                                                                {log.attachment.original_name}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                Type: {log.attachment.type}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* PAGINATION */}
                            <div className="flex items-center justify-between mt-6 bg-black/70 text-white px-4 py-2 rounded">

                                {/* LEFT SIDE - Rows Per Page */}
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-gray-300">Rows per page:</span>

                                    {[10, 25, 50].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => handleLimitChange(size)}
                                            className={`px-2 py-1 rounded ${limit === size
                                                ? "bg-gray-600 text-white font-semibold"
                                                : "text-gray-300 hover:text-white"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {/* RIGHT SIDE - Page Controls */}
                                <div className="flex items-center gap-4 text-sm">

                                    {/* First Page */}
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(1)}
                                        className="disabled:opacity-40"
                                    >
                                        ⏮
                                    </button>

                                    {/* Previous */}
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="disabled:opacity-40"
                                    >
                                        ‹
                                    </button>

                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-8 h-8 rounded ${currentPage === page
                                                    ? "bg-gray-600 text-white font-semibold"
                                                    : "text-gray-300 hover:text-white"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    {/* Next */}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="disabled:opacity-40"
                                    >
                                        ›
                                    </button>

                                    {/* Last Page */}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(totalPages)}
                                        className="disabled:opacity-40"
                                    >
                                        ⏭
                                    </button>

                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default LogsList;