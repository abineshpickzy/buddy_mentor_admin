const Alert = ({ text, type = "error" }) => {
  const styles =
    type === "error"
      ? "border-red-400 bg-red-50 text-red-700"
      : "border-blue-400 bg-blue-50 text-blue-700";

  return (
    <div className={`border p-2 text-sm ${styles}`}>
      {text}
    </div>
  );
};

export default Alert;
