import { useState } from "react";

const LocationsTab = () => {
  const [country, setCountry] = useState("India");
  const [states, setStates] = useState(["Tamil Nadu", "Kerala"]);
  const [cities, setCities] = useState(["Chennai"]);

  return (
    <div className="max-w-xl">
      <h3 className="text-sm font-medium mb-4">Location Access</h3>

      {/* Country */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Country:</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border px-3 py-2 bg-white"
        >
          <option>India</option>
          <option>USA</option>
        </select>
      </div>

      {/* States */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm">States:</label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" />
            Select All
          </label>
        </div>

        <div className="border h-32 p-2 overflow-y-auto">
          {["Tamil Nadu", "Kerala"].map((state) => (
            <label key={state} className="block text-sm">
              <input
                type="checkbox"
                checked={states.includes(state)}
                readOnly
                className="mr-2"
              />
              {state}
            </label>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm">City:</label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" />
            Select All
          </label>
        </div>

        <div className="border h-32 p-2">
          <label className="block text-sm">
            <input type="checkbox" checked readOnly className="mr-2" />
            Chennai
          </label>
          <label className="block text-sm text-gray-400">
            <input type="checkbox" disabled className="mr-2" />
            Madurai
          </label>
        </div>
      </div>

      {/* Save */}
      <button className="px-6 py-2 bg-gray-400 text-white rounded">
        Save
      </button>
    </div>
  );
};

export default LocationsTab;
