const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  layout = "column",       // ✅ NEW
  labelWidth = "w-32",     // ✅ NEW
}) => {
  // COLUMN (default – your current behavior)
  if (layout === "column") {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm text-gray-700 font-medium">
            {label}
          </label>
        )}
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border border-gray-300 bg-white px-3 py-2 text-sm
          focus:outline-none focus:ring-1 focus:ring-gray-500 ${className}`}
        />
      </div>
    );
  }

  // ROW (like the image)
  return (
    <div className="flex items-center gap-4">
      {label && (
        <label className={`text-sm text-gray-700 font-medium ${labelWidth}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex-1 border border-gray-300 bg-white px-3 py-2 text-sm
        focus:outline-none focus:ring-1 focus:ring-gray-500 ${className}`}
      />
    </div>
  );
};

export default Input;
