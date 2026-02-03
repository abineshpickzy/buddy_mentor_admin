import { useState } from "react";
import { Trash2, Search } from "lucide-react";

const ALL_CATEGORIES = [
  { id: 1, name: "EPC Core Foundation", status: "live" },
  { id: 2, name: "Production", status: "live" },
  { id: 3, name: "Manufacturing", status: "live" },
];

const MentoringTab = () => {
  const [mode, setMode] = useState("list"); // list | add
  const [search, setSearch] = useState("");

  //  Assigned categories (final saved state)
  const [assignedCategories, setAssignedCategories] = useState([]);

  //  Temporary selection state (Add mode only)
  const [selected, setSelected] = useState([]);

  /* -------------------- HELPERS -------------------- */

  const openAddMode = () => {
    // pre-check already assigned categories
    setSelected(assignedCategories.map((c) => c.id));
    setMode("add");
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleAdd = () => {
    // Assigned categories = exactly what is checked
    const newAssigned = ALL_CATEGORIES.filter((cat) =>
      selected.includes(cat.id)
    );

    setAssignedCategories(newAssigned);
    setMode("list");
  };

  const handleDelete = (id) => {
    setAssignedCategories((prev) =>
      prev.filter((c) => c.id !== id)
    );
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-4">

      {/* ================= LIST MODE ================= */}
      {mode === "list" && (
        <>
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={openAddMode}
              className="px-4 py-1 border rounded bg-white text-sm"
            >
              + Add
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm">Search</span>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-3 py-1 text-sm"
                />
                <Search
                  size={14}
                  className="absolute right-2 top-2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border mt-4 text-sm">
            <thead className="bg-gray-300 text-left">
              <tr>
                <th className="p-2">Sno</th>
                <th className="p-2">Category Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {assignedCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No categories assigned
                  </td>
                </tr>
              ) : (
                assignedCategories.map((cat, i) => (
                  <tr key={cat.id} className="border-t bg-gray-100">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{cat.name}</td>
                    <td className="p-2">{cat.status}</td>
                    <td className="p-2">
                      <Trash2
                        size={18}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(cat.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* ================= ADD MODE ================= */}
      {mode === "add" && (
        <>
          <p className="text-sm text-gray-500">
            Mentoring Category &gt; Add
          </p>

          <div className="space-y-3 mt-4">
            {ALL_CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(cat.id)}
                  onChange={() => toggleSelect(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setMode("list")}
              className="px-6 py-2 border rounded text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MentoringTab;
