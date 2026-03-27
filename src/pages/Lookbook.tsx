const placeholders = Array.from({ length: 6 }, (_, i) => i);

const Lookbook = () => {
  return (
    <main className="pt-40 px-6 max-w-6xl mx-auto pb-20">
      <h1 className="font-display text-5xl tracking-wide-fashion text-center mb-12">LOOKBOOK</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placeholders.map((i) => (
          <div
            key={i}
            className={`bg-secondary flex items-center justify-center ${
              i % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[3/4]"
            }`}
          >
            <span className="text-xs uppercase tracking-fashion text-muted-foreground">
              Editorial {i + 1}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Lookbook;
