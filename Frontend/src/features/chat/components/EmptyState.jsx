const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      
      {/* Logo / Brand */}
      <div className="mb-12 text-center">
        <h1 className=" text-3xl md:text-5xl tracking-wider font-bold tracking-tight text-white">
          InsightFlow AI
        </h1>

        <p className="mt-5 text-zinc-500 tracking-wide max-w-sm text-sm">
          Ask questions, explore ideas, generate content, and get instant
          answers powered by AI.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;