const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  className = "",
  layout = "column",
  labelWidth = "w-32",
}) => {
  // COLUMN layout
  if (layout === "column") {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm text-gray-700 font-medium">
            {label}
          </label>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full bg-white border border-gray-300 px-3 py-2 text-sm
          focus:outline-none focus:ring-1 focus:ring-gray-500 ${className}`}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ROW layout (matches Input)
  return (
    <div className="flex items-center gap-4">
      {label && (
        <label className={`text-sm text-gray-700 font-medium ${labelWidth}`}>
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`flex-1 bg-white border border-gray-300 px-3 py-2 text-sm
        focus:outline-none focus:ring-1 focus:ring-gray-500 ${className}`}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
