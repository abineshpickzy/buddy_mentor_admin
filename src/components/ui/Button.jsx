const Button = ({ text, onClick,loading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-2 rounded text-white text-sm font-medium
      ${disabled || loading ? "bg-gray-400" : "bg-gray-700 hover:bg-gray-800"}`}
    >
      { loading ? "Logging in..." : text}
    </button>
  );
};

export default Button;
