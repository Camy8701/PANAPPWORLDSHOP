const columns = [
  {
    intro: "Get your order delivered quickly, straight to your door.",
    title: "Fast Shipping",
    meta: "3-5 business days",
    offsetClass: "lg:pt-0",
    titleSpacing: "mt-12 lg:mt-16",
    titleClass: "lg:whitespace-nowrap",
  },
  {
    intro: "Return your items hassle-free. Our flexible policy makes it simple.",
    title: "Easy Returns",
    meta: "7 days from delivery",
    offsetClass: "lg:pt-28",
    titleSpacing: "mt-10 lg:mt-12",
    titleClass: "lg:whitespace-nowrap",
  },
  {
    intro: "Pay for your order with confidence. Your details are always protected.",
    title: "Secure Payments",
    meta: "Bank-grade SSL protection",
    offsetClass: "lg:pt-40",
    titleSpacing: "mt-10 lg:mt-12",
    titleClass: "lg:whitespace-nowrap",
  },
  {
    intro: "Get the help you need, fast. Our dedicated team is here for you.",
    title: "Customer Support",
    meta: "hello@panappworld.com",
    offsetClass: "lg:pt-52",
    titleSpacing: "mt-10 lg:mt-12",
    titleClass: "max-w-[10rem] md:max-w-[10.5rem]",
  },
];

const PanappWhySection = () => {
  return (
    <section className="bg-[#161413] text-[#f3ecd8]">
      <div className="mx-auto max-w-[1580px] px-6 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, index) => (
            <article
              key={column.title}
              className="relative border-t border-white/6 py-8 md:py-10 lg:min-h-[34rem] lg:border-t-0 lg:px-5 lg:py-0"
            >
              {index > 0 ? (
                <span className="absolute left-0 top-0 hidden h-full w-px border-l border-dashed border-white/10 lg:block" />
              ) : null}

              <div className={column.offsetClass}>
                {index === 0 ? (
                  <h2 className="mb-12 flex items-end gap-1.5 leading-none lg:mb-14">
                    <span
                      className="text-[2.35rem] italic tracking-[-0.08em] text-[#f4ecd7] md:text-[3rem]"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}
                    >
                      why
                    </span>
                    <span className="pb-0.5 text-[2.35rem] font-black uppercase tracking-[-0.08em] text-[#d6532a] md:text-[3rem]">
                      PANAPP?
                    </span>
                  </h2>
                ) : null}

                <p className="max-w-[14ch] text-[0.92rem] font-medium uppercase leading-[1.4] tracking-[0.12em] text-[#ddd3bc] md:text-[0.98rem]">
                  {column.intro}
                </p>

                <div className={column.titleSpacing}>
                  <h3
                    className={[
                      "text-[2.95rem] font-black uppercase leading-[0.86] tracking-[-0.09em] text-[#f7efd9] md:text-[3.55rem]",
                      column.titleClass,
                    ].join(" ")}
                  >
                    {column.title}
                  </h3>
                  <p className="mt-2 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-white/22 md:text-[0.8rem]">
                    {column.meta}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PanappWhySection;
