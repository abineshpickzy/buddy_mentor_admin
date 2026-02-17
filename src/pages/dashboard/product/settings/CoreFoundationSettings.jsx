import React, { useState } from "react";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

const sampleData = [ { "_id": "698d93c7941e374dbc6dc3f6", "name": "EPC CORE FOUNDATION", "order_no": 1, "parent_id": "698d93c7941e374dbc6dc3f5", "children": [ { "_id": "698d93c7941e374dbc6dc3f7", "name": "MODULE1", "order_no": 1, "parent_id": "698d93c7941e374dbc6dc3f6", "children": [ { "_id": "698d93c7941e374dbc6dc3f8", "name": "chapter1", "order_no": 1, "parent_id": "698d93c7941e374dbc6dc3f7", "children": [ { "_id": "698d93c7941e374dbc6dc3f9", "name": "PepTalk", "order_no": 1, "parent_id": "698d93c7941e374dbc6dc3f8", "children": [] }, { "_id": "698d93c7941e374dbc6dc3fa", "name": "lessons", "order_no": 2, "parent_id": "698d93c7941e374dbc6dc3f8", "children": [] } ] }, { "_id": "698d93c7941e374dbc6dc3fb", "name": "chapter2", "order_no": 2, "parent_id": "698d93c7941e374dbc6dc3f7", "children": [ { "_id": "698d954f941e374dbc6dc40e", "name": "session1", "order_no": 1, "parent_id": "698d93c7941e374dbc6dc3fb", "children": [] } ] } ] }, { "_id": "698d93c7941e374dbc6dc3fc", "name": "MODULE2", "order_no": 2, "parent_id": "698d93c7941e374dbc6dc3f6", "children": [ { "_id": "698d93c7941e374dbc6dc3fd", "name": "chapter1", "order_no": 1, "parent_id": "698d93c7941e374dbc6dc3fc", "children": [] }, { "_id": "698d93c7941e374dbc6dc3fe", "name": "chapter2", "order_no": 2, "parent_id": "698d93c7941e374dbc6dc3fc", "children": [] }, { "_id": "698d9488941e374dbc6dc40b", "name": "chapter3", "order_no": 3, "parent_id": "698d93c7941e374dbc6dc3fc", "children": [ { "_id": "698d9488941e374dbc6dc40c", "name": "PepTalk Test", "order_no": 1, "parent_id": "698d9488941e374dbc6dc40b", "children": [] }, { "_id": "698d9488941e374dbc6dc40d", "name": "lessons Test", "order_no": 2, "parent_id": "698d9488941e374dbc6dc40b", "children": [] } ] } ] }, { "_id": "698d954f941e374dbc6dc40f", "name": "MODULE3", "order_no": 3, "parent_id": "698d93c7941e374dbc6dc3f6", "children": [ { "_id": "698d954f941e374dbc6dc410", "name": "chapter1", "order_no": 1, "parent_id": "698d954f941e374dbc6dc40f", "children": [ { "_id": "698d954f941e374dbc6dc411", "name": "session1", "order_no": 1, "parent_id": "698d954f941e374dbc6dc410", "children": [] } ] } ] } ] }, { "_id": "698daa558947bd58d9994662", "name": "EPC CORE FOUNDATION2", "order_no": 2, "parent_id": "698d93c7941e374dbc6dc3f5", "children": [ { "_id": "698daa558947bd58d9994663", "name": "Module1", "order_no": 1, "parent_id": "698daa558947bd58d9994662", "children": [ { "_id": "698daa558947bd58d9994664", "name": "chapter1", "order_no": 1, "parent_id": "698daa558947bd58d9994663", "children": [ { "_id": "698daa558947bd58d9994665", "name": "session1", "order_no": 1, "parent_id": "698daa558947bd58d9994664", "children": [] } ] } ] }, { "_id": "698daa558947bd58d9994666", "name": "Module2", "order_no": 2, "parent_id": "698daa558947bd58d9994662", "children": [ { "_id": "698daa558947bd58d9994667", "name": "chapter1", "order_no": 1, "parent_id": "698daa558947bd58d9994666", "children": [ { "_id": "698daa558947bd58d9994668", "name": "session1", "order_no": 1, "parent_id": "698daa558947bd58d9994667", "children": [] } ] } ] } ] } ];

const CoreFoundationSettings = () => {
  return (
    <div className="border-2 border-gray-200 p-8 bg-white rounded-lg">
      <Tree data={sampleData} />
    </div>
  );
};

export default CoreFoundationSettings;

/* ================= TREE COMPONENT ================= */
const Tree = ({ data }) => {
  return (
    <div className="space-y-2">
      {data
        .sort((a, b) => a.order_no - b.order_no)
        .map((node) => (
          <TreeNode key={node._id} node={node} />
        ))}
    </div>
  );
};

/* ================= TREE NODE ================= */
const TreeNode = ({ node }) => {
  const [open, setOpen] = useState(false); // for expanding children
  const [settingsOpen, setSettingsOpen] = useState(false); // for settings panel
  const [price, setPrice] = useState(0);
  const [trialDays, setTrialDays] = useState(0);

  const [duration, setDuration] = useState(0);
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="pl-4 relative">
      <div className="flex items-start gap-2">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
          {node.children?.length > 0 ? (
            open ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <div style={{ width: 16 }} />
          )}
          <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">{node.name}</span>
        </div>
        <div className="flex flex-col justify-center gap-2">
            
        <div className="flex items-center">
             <button
          onClick={() =>{setSettingsOpen(!settingsOpen);
            setOpen(!open)
          }}
          className="p-1  rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="#616264">
  <path d="M19.14,12.94c0.04-0.31,0.06-0.63,0.06-0.94s-0.02-0.63-0.06-0.94l2.03-1.58
    c0.18-0.14,0.23-0.4,0.12-0.61l-1.92-3.32c-0.11-0.22-0.37-0.3-0.59-0.22l-2.39,0.96
    c-0.5-0.38-1.03-0.7-1.62-0.94L14.5,2.5C14.46,2.22,14.22,2,13.94,2h-3.88
    C9.78,2,9.54,2.22,9.5,2.5L9.13,5.35C8.54,5.59,8.01,5.92,7.51,6.29L5.12,5.33
    C4.9,5.25,4.64,5.33,4.53,5.55L2.61,8.87c-0.11,0.21-0.06,0.47,0.12,0.61l2.03,1.58
    C4.72,11.37,4.7,11.69,4.7,12s0.02,0.63,0.06,0.94l-2.03,1.58
    c-0.18,0.14-0.23,0.4-0.12,0.61l1.92,3.32c0.11,0.22,0.37,0.3,0.59,0.22l2.39-0.96
    c0.5,0.38,1.03,0.7,1.62,0.94l0.37,2.85c0.04,0.28,0.28,0.5,0.56,0.5h3.88
    c0.28,0,0.52-0.22,0.56-0.5l0.37-2.85c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96
    c0.22,0.08,0.48,0,0.59-0.22l1.92-3.32c0.11-0.21,0.06-0.47-0.12-0.61l-2.03-1.58z
    M12,15.6c-1.99,0-3.6-1.61-3.6-3.6s1.61-3.6,3.6-3.6s3.6,1.61,3.6,3.6S13.99,15.6,12,15.6z"/>
</svg>

        </button>
        {settingsOpen?<ChevronUp size={20}/>:<ChevronDown size={20}/>}
        </div>

{settingsOpen && (
  <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-6 mt-2">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-2 text-sm text-gray-500">

      {/* Price */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <p className="sm:w-20 text-right font-medium">
          Price:
        </p>

        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full sm:w-20 px-3 py-2 border rounded-md text-center"
          placeholder="0.0"
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <p className="sm:w-20 text-right font-medium">
          Duration:
        </p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full sm:w-20 px-3 py-2 border rounded-md text-center"
            placeholder="0"
          />
          <span className="text-gray-500">weeks</span>
        </div>
      </div>

      {/* Trial Days */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <p className="sm:w-20 text-right font-medium">
          Trial Days:
        </p>

        <input
          type="text"
          value={trialDays}
          onChange={(e) => setTrialDays(parseFloat(e.target.value))}
          className="w-full sm:w-20 px-3 py-2 border rounded-md text-center"
          placeholder="0"
        />
      </div>

      {/* Active Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <p className="sm:w-20 text-right font-medium">
          Is Active:
        </p>

        <button
          onClick={() => setIsActive(!isActive)}
          className={`relative w-14 h-7 rounded-full transition ${
            isActive ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              isActive ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

    </div>
  </div>
)}




        </div>
      </div>




      {open && node.children?.length > 0 && (
        <div className="ml-4 mt-2 space-y-2">
          {node.children
            .sort((a, b) => a.order_no - b.order_no)
            .map((child) => (
              <TreeNode key={child._id} node={child} />
            ))}
        </div>
      )}
    </div>
  );
};
