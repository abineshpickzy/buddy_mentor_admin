const FullScreenLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        <span className="text-sm text-gray-500">
          Loading…
        </span>
      </div>
    </div>
  );
};

export default FullScreenLoader;
