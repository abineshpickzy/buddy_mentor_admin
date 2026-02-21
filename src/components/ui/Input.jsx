const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  layout = "column",
  labelWidth = "w-32",
  mailError=null,
  mailErrormessage,
  error,
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
          className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm
          focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-gray-500'} ${className}`}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }

  // ROW (like the image)
  return (
    <div className="space-y-1">
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
          className={`flex-1 border ${error ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm
          focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-gray-500'} ${className}`}
        />
      </div>
      <div className="flex items-center justify-between">
          {error && <span className="text-red-500 text-xs ml-36">{error}</span>}
          {mailError!==null &&    <div className={`text-xs mt-1 flex items-center text-start gap-1 ${error? 'ml-0' : 'ml-36'} ${
                                mailError ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {mailError ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {mailErrormessage}
                            </div>}
      </div>
    
    </div>
  );
};

export default Input;
