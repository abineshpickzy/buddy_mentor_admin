import { ChevronDown } from "lucide-react";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  className = "",
  layout = "column",
  labelWidth = "w-32",
  error,
}) => {
  // COLUMN layout
  if (layout === "column") {
    return (
      <div className="space-y-1 ">
        {label && (
          <label className="block text-sm text-gray-700 font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`appearance-none w-full bg-white border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 pr-8 text-sm
            focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-gray-500'} ${className}`}
          >
            <option value="">Select</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }

  // ROW layout (matches Input)
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-4">
        {label && (
          <label className={`text-sm text-gray-700 font-medium ${labelWidth}`}>
            {label}
          </label>
        )}
        <div className="relative flex-1">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`appearance-none w-full bg-white border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 pr-8 text-sm
            focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-gray-500'} ${className}`}
          >
            <option value="">Select</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      {error && <span className="text-red-500 text-xs ml-36">{error}</span>}
    </div>
  );
};

export default Select;
