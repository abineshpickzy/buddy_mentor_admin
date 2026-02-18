
import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
const TreeNode = ({ node }) => {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [price, setPrice] = useState(0);
  const [trialDays, setTrialDays] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="relative pl-4">

      {/* ================= NODE HEADER ================= */}
      <div className="flex items-start gap-2 h-auto">

        {/* Node Name Box */}
        <div
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="relative flex flex-col">

            {/* Node Label */}
            <span className="block bg-blue-50 px-3 py-1 rounded text-gray-800 font-medium">
              {node.name}
            </span>

            {(settingsOpen && open && node.children?.length > 0) && (
              <div className="flex-1">
                 <div className="w-[4px] min-h-44 bg-red-500 ml-12"/>
              </div>
            )}
          </div>
        </div>

        {/* Settings + Expand Icon */}
        <div className="flex flex-col gap-2">

          <div className="flex items-center gap-2">

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-1 rounded focus:outline-none cursor-pointer"
            >
     <svg viewBox="0 0 24 24" width="22" height="22" fill="#4b5563">
  <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.75.75 0 0 0 .18-.96l-1.92-3.32a.75.75 0 0 0-.9-.34l-2.39.96a7.3 7.3 0 0 0-1.63-.94l-.36-2.54A.75.75 0 0 0 13.9 2h-3.8a.75.75 0 0 0-.74.64l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.75.75 0 0 0-.9.34L2.16 8.52a.75.75 0 0 0 .18.96l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.75.75 0 0 0-.18.96l1.92 3.32a.75.75 0 0 0 .9.34l2.39-.96c.51.42 1.05.76 1.63.94l.36 2.54a.75.75 0 0 0 .74.64h3.8a.75.75 0 0 0 .74-.64l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96a.75.75 0 0 0 .9-.34l1.92-3.32a.75.75 0 0 0-.18-.96l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z"/>
</svg>



            </button>

            {/* Expand Arrow */}
            {node.children?.length > 0 && (
              open ? (
                <ChevronDown
                  size={16}
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              ) : (
                <ChevronRight
                  size={16}
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setOpen(true)}
                />
              )
            )}
          </div>

          {/* ================= SETTINGS PANEL ================= */}
          {settingsOpen && (
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-6 mt-2">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-sm text-gray-600">

                {/* Price */}
                <div className="flex items-center gap-3">
                  <p className="w-24 text-right font-medium">Price:</p>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value === ""
                          ? 0
                          : parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-md text-center"
                  />
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3">
                  <p className="w-24 text-right font-medium">Duration:</p>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) =>
                      setDuration(
                        e.target.value === ""
                          ? 0
                          : parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-md text-center"
                  />
                  <span>weeks</span>
                </div>

                {/* Trial Days */}
                <div className="flex items-center gap-3">
                  <p className="w-24 text-right font-medium">Trial Days:</p>
                  <input
                    type="text"
                    value={trialDays}
                    onChange={(e) =>
                      setTrialDays(
                        e.target.value === ""
                          ? 0
                          : parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-md text-center"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <p className="w-24 text-right font-medium">Is Active:</p>

                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative w-14 h-7 rounded-full transition ${isActive ? "bg-blue-600" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-7" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>


  {/* ================= CHILD CONNECTOR TREE ================= */}
{open && node.children?.length > 0 && (
  <div className="relative py-4 ">

    {/* MASTER VERTICAL TRUNK */}
    <div className="absolute left-12 top-0 bottom-0 w-[4px] bg-red-500"></div>

    <div className="space-y-5">
      {node.children.map((child, index) => {
        const isLastChild = index === node.children.length - 1;
        return (
          <div key={child._id} className="relative flex items-start">

            {/* HORIZONTAL BRANCH */}
            <div className="absolute left-12 top-4 w-12 h-[4px] bg-red-500"></div>

            {/* CHEVRON RIGHT ARROW */}
            <div className="absolute left-[89px] top-[10px]">
              <ChevronRight size={16} className="text-red-500" strokeWidth={5} />
            </div>

            {/* CHILD CONTENT */}
            <div className="pl-22"> 
              <TreeNode node={child} isLast={isLastChild} />
            </div>

            {/* STOP VERTICAL LINE AFTER LAST CHILD */}
            {isLastChild && (
              <div className="absolute left-12 top-5 w-[4px] h-full bg-white"></div>
            )}

          </div>
        );
      })}
    </div>
  </div>
)}



    </div>
  );
};

export default TreeNode;