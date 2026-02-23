import React, { useState, useMemo } from "react";
import { ChevronDown, FileText } from "lucide-react";

const sampleLogs = [
    {
        id: 1,
        title: "Nishanth (Reviewer) assigned to Ratheesh (Content owner)",
        date: "22-Feb-2026",
        type: "Reviewer comment",
        comment: "This is feedback comment",
        file: "feedback.pdf",
    },
    {
        id: 2,
        title: "Ratheesh (Content owner) assigned to Nishanth (Reviewer)",
        date: "21-Feb-2026",
        type: "Assigner comment",
        comment: "comment area",
        file: null,
    },
    {
        id: 3,
        title: "Ratheesh (Content owner)",
        date: "21-Feb-2026",
        type: "Upload",
        comment: "<File name> uploaded on 21-Feb-2026",
        file: "file.pdf",
    },
    {
        id: 4,
        title: "Priya (Reviewer) assigned to Vikram (Content owner)",
        date: "20-Feb-2026",
        type: "Reviewer comment",
        comment: "Please update the introduction section",
        file: "review_notes.pdf",
    },
    {
        id: 5,
        title: "Vikram (Content owner) assigned to Priya (Reviewer)",
        date: "19-Feb-2026",
        type: "Assigner comment",
        comment: "Ready for review",
        file: null,
    },
    {
        id: 6,
        title: "Ananya (Content owner)",
        date: "18-Feb-2026",
        type: "Upload",
        comment: "final_draft.docx uploaded on 18-Feb-2026",
        file: "final_draft.docx",
    },
    {
        id: 7,
        title: "Michael (Reviewer) assigned to Sarah (Content owner)",
        date: "17-Feb-2026",
        type: "Reviewer comment",
        comment: "Check references in chapter 3",
        file: "reference_check.pdf",
    },
    {
        id: 8,
        title: "Sarah (Content owner) assigned to Michael (Reviewer)",
        date: "16-Feb-2026",
        type: "Assigner comment",
        comment: "Second revision ready",
        file: null,
    },
    {
        id: 9,
        title: "David (Content owner)",
        date: "15-Feb-2026",
        type: "Upload",
        comment: "images.zip uploaded on 15-Feb-2026",
        file: "images.zip",
    },
    {
        id: 10,
        title: "Emma (Reviewer) assigned to James (Content owner)",
        date: "14-Feb-2026",
        type: "Reviewer comment",
        comment: "Great work! Minor formatting issues",
        file: "formatting_feedback.pdf",
    },
    {
        id: 11,
        title: "James (Content owner) assigned to Emma (Reviewer)",
        date: "13-Feb-2026",
        type: "Assigner comment",
        comment: "Please review chapter 5",
        file: null,
    },
    {
        id: 12,
        title: "Robert (Content owner)",
        date: "12-Feb-2026",
        type: "Upload",
        comment: "presentation.pptx uploaded on 12-Feb-2026",
        file: "presentation.pptx",
    },
    {
        id: 13,
        title: "Lisa (Reviewer) assigned to John (Content owner)",
        date: "11-Feb-2026",
        type: "Reviewer comment",
        comment: "Add more examples in section 2",
        file: "examples_suggestions.pdf",
    },
    {
        id: 14,
        title: "John (Content owner) assigned to Lisa (Reviewer)",
        date: "10-Feb-2026",
        type: "Assigner comment",
        comment: "First draft complete",
        file: null,
    },
    {
        id: 15,
        title: "Maria (Content owner)",
        date: "09-Feb-2026",
        type: "Upload",
        comment: "data_analysis.xlsx uploaded on 09-Feb-2026",
        file: "data_analysis.xlsx",
    },
    {
        id: 16,
        title: "Thomas (Reviewer) assigned to Patricia (Content owner)",
        date: "08-Feb-2026",
        type: "Reviewer comment",
        comment: "Methodology section needs clarification",
        file: "methodology_review.pdf",
    },
    {
        id: 17,
        title: "Patricia (Content owner) assigned to Thomas (Reviewer)",
        date: "07-Feb-2026",
        type: "Assigner comment",
        comment: "Updated based on feedback",
        file: null,
    },
    {
        id: 18,
        title: "Jennifer (Content owner)",
        date: "06-Feb-2026",
        type: "Upload",
        comment: "source_code.zip uploaded on 06-Feb-2026",
        file: "source_code.zip",
    },
    {
        id: 19,
        title: "Daniel (Reviewer) assigned to Nancy (Content owner)",
        date: "05-Feb-2026",
        type: "Reviewer comment",
        comment: "Check data consistency in table 3",
        file: "data_check.pdf",
    },
    {
        id: 20,
        title: "Nancy (Content owner) assigned to Daniel (Reviewer)",
        date: "04-Feb-2026",
        type: "Assigner comment",
        comment: "Ready for final review",
        file: null,
    },
    {
        id: 21,
        title: "Kevin (Content owner)",
        date: "03-Feb-2026",
        type: "Upload",
        comment: "figures_v2.zip uploaded on 03-Feb-2026",
        file: "figures_v2.zip",
    },
    {
        id: 22,
        title: "Laura (Reviewer) assigned to Brian (Content owner)",
        date: "02-Feb-2026",
        type: "Reviewer comment",
        comment: "Abstract needs to be more concise",
        file: "abstract_feedback.pdf",
    },
    {
        id: 23,
        title: "Brian (Content owner) assigned to Laura (Reviewer)",
        date: "01-Feb-2026",
        type: "Assigner comment",
        comment: "Please review appendix",
        file: null,
    },
    {
        id: 24,
        title: "Amy (Content owner)",
        date: "31-Jan-2026",
        type: "Upload",
        comment: "bibliography.bib uploaded on 31-Jan-2026",
        file: "bibliography.bib",
    },
    {
        id: 25,
        title: "Peter (Reviewer) assigned to Helen (Content owner)",
        date: "30-Jan-2026",
        type: "Reviewer comment",
        comment: "Update figure captions",
        file: "caption_feedback.pdf",
    },
    {
        id: 26,
        title: "Helen (Content owner) assigned to Peter (Reviewer)",
        date: "29-Jan-2026",
        type: "Assigner comment",
        comment: "Revision complete",
        file: null,
    },
    {
        id: 27,
        title: "George (Content owner)",
        date: "28-Jan-2026",
        type: "Upload",
        comment: "supplementary_materials.pdf uploaded on 28-Jan-2026",
        file: "supplementary_materials.pdf",
    },
    {
        id: 28,
        title: "Susan (Reviewer) assigned to Mark (Content owner)",
        date: "27-Jan-2026",
        type: "Reviewer comment",
        comment: "Add conclusion section",
        file: "conclusion_feedback.pdf",
    },
    {
        id: 29,
        title: "Mark (Content owner) assigned to Susan (Reviewer)",
        date: "26-Jan-2026",
        type: "Assigner comment",
        comment: "Draft ready for comments",
        file: null,
    },
    {
        id: 30,
        title: "Rachel (Content owner)",
        date: "25-Jan-2026",
        type: "Upload",
        comment: "interview_transcripts.docx uploaded on 25-Jan-2026",
        file: "interview_transcripts.docx",
    },
    {
        id: 31,
        title: "Edward (Reviewer) assigned to Karen (Content owner)",
        date: "24-Jan-2026",
        type: "Reviewer comment",
        comment: "Clarify research questions",
        file: "research_questions.pdf",
    },
    {
        id: 32,
        title: "Karen (Content owner) assigned to Edward (Reviewer)",
        date: "23-Jan-2026",
        type: "Assigner comment",
        comment: "Questions addressed",
        file: null,
    },
    {
        id: 33,
        title: "Christopher (Content owner)",
        date: "22-Jan-2026",
        type: "Upload",
        comment: "survey_data.csv uploaded on 22-Jan-2026",
        file: "survey_data.csv",
    },
    {
        id: 34,
        title: "Donna (Reviewer) assigned to Paul (Content owner)",
        date: "21-Jan-2026",
        type: "Reviewer comment",
        comment: "Literature review needs updating",
        file: "lit_review_feedback.pdf",
    },
    {
        id: 35,
        title: "Paul (Content owner) assigned to Donna (Reviewer)",
        date: "20-Jan-2026",
        type: "Assigner comment",
        comment: "Added recent papers",
        file: null,
    },
    {
        id: 36,
        title: "Michelle (Content owner)",
        date: "19-Jan-2026",
        type: "Upload",
        comment: "statistical_analysis.r uploaded on 19-Jan-2026",
        file: "statistical_analysis.r",
    },
    {
        id: 37,
        title: "Steven (Reviewer) assigned to Deborah (Content owner)",
        date: "18-Jan-2026",
        type: "Reviewer comment",
        comment: "Check ethical considerations section",
        file: "ethics_feedback.pdf",
    },
    {
        id: 38,
        title: "Deborah (Content owner) assigned to Steven (Reviewer)",
        date: "17-Jan-2026",
        type: "Assigner comment",
        comment: "Ethics section updated",
        file: null,
    },
    {
        id: 39,
        title: "Kenneth (Content owner)",
        date: "16-Jan-2026",
        type: "Upload",
        comment: "figures_v3.png uploaded on 16-Jan-2026",
        file: "figures_v3.png",
    },
    {
        id: 40,
        title: "Ratheesh (Content owner) assigned to Nishanth (Reviewer)",
        date: "15-Jan-2026",
        type: "Assigner comment",
        comment: "Final version for approval",
        file: null,
    }
];

const LogsList = () => {
    const [isOpen, setIsOpen] = useState(false); // MAIN TOGGLE
    const [openLogId, setOpenLogId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const logsPerPage = 6;

    const totalPages = Math.ceil(sampleLogs.length / logsPerPage);

    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * logsPerPage;
        return sampleLogs.slice(start, start + logsPerPage);
    }, [currentPage]);

    const toggleLog = (id) => {
        setOpenLogId(openLogId === id ? null : id);
    };

    return (
        <div className="mt-8 ">

            {/* MAIN HEADER WITH CHEVRON */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-3 cursor-pointer select-none"
            >

                <h2 className="text-xl text-gray-600 font-semibold">
                    Media content upload / edit / review logs
                </h2>
                <ChevronDown
                    size={30}
                    className={`transition-transform text-gray-600 duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>

            {/* ONLY SHOW LOGS WHEN MAIN IS OPEN */}
            {isOpen && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 ">

                    {paginatedLogs.map((log) => (
                        <div
                            key={log.id}
                            className="rounded-sm "
                        >
                            {/* Log Header */}
                            <div
                                onClick={() => toggleLog(log.id)}
                                className="flex justify-between items-center rounded-t-lg px-4 py-3 cursor-pointer bg-[#dae1ef] "
                            >
                                <div className="flex items-center gap-2">
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openLogId === log.id ? "rotate-180" : ""
                                            }`}
                                    />
                                    <span className="font-medium text-gray-600 text-sm">
                                        {log.title}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600">
                                    {log.date}
                                </span>
                            </div>

                            {/* Log Content */}
                            {openLogId === log.id && (
                                <div className="p-4 bg-[#f1f5fc] rounded-b-lg border-t border-gray-200 shadow  ">
                                    <p className="text-sm font-semibold mb-2 text-gray-600">
                                        {log.type}
                                    </p>

                                    <div className="flex items-start gap-3 bg-white p-3 rounded-md">
                                        <FileText size={20} className="text-blue-500 mt-1" />
                                        <p className="text-sm text-gray-700">
                                            {log.comment}
                                        </p>
                                    </div>

                                    {log.file && (
                                        <div className="mt-3 text-sm text-green-600 cursor-pointer hover:underline">
                                            Download File
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}


                           {/* Pagination */}
            <div className="flex justify-start mt-8 items-center gap-2 mt-6 select-none">
                {/* PREV */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-[#dae1ef] rounded hover:bg-[#c5d0e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    PREV
                </button>

                {/* Page Numbers */}
                {(() => {
                    const pages = [];
                    let start = Math.max(1, currentPage - 2);
                    let end = Math.min(totalPages, currentPage + 2);

                    if (start > 1) {
                        pages.push(
                            <button
                                key={1}
                                onClick={() => setCurrentPage(1)}
                                className="px-3 py-2 text-sm text-gray-600 rounded hover:bg-[#dae1ef] transition-colors"
                            >
                                1
                            </button>
                        );
                        if (start > 2) {
                            pages.push(<span key="start-ellipsis" className="px-2 text-gray-500">...</span>);
                        }
                    }

                    for (let i = start; i <= end; i++) {
                        pages.push(
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`px-3 py-2 text-sm rounded transition-colors ${currentPage === i
                                        ? "bg-[#dae1ef] text-gray-700 font-semibold"
                                        : "text-gray-600 hover:bg-[#dae1ef]"
                                    }`}
                            >
                                {i}
                            </button>
                        );
                    }

                    if (end < totalPages) {
                        if (end < totalPages - 1) {
                            pages.push(<span key="end-ellipsis" className="px-2 text-gray-500">...</span>);
                        }
                        pages.push(
                            <button
                                key={totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-3 py-2 text-sm text-gray-600 rounded hover:bg-[#dae1ef] transition-colors"
                            >
                                {totalPages}
                            </button>
                        );
                    }

                    return pages;
                })()}

                {/* NEXT */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-[#dae1ef] rounded hover:bg-[#c5d0e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    NEXT
                </button>
            </div>

                </div>
            )}
         
        </div>
    );
};

export default LogsList;