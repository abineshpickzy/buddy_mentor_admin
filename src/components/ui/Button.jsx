const Button = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 rounded text-white text-sm font-medium
      ${disabled ? "bg-gray-400" : "bg-gray-700 hover:bg-gray-800"}`}
    >
      {text}
    </button>
  );
};

export default Button;
