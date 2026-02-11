const FullScreenLoader = () => {
  return (
    <div className="fixed z-50  top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-transparent">
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
