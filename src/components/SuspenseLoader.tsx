const SuspenseLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-6 h-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
    </div>
  );
};

export default SuspenseLoader;
