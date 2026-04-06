import { motion } from "framer-motion";

const columns = [
  {
    intro: "Get your order delivered quickly, straight to your door.",
    title: "Fast Shipping",
    meta: "3-5 business days",
    offsetClass: "lg:pt-0",
  },
  {
    intro: "Return your items hassle-free. Our flexible policy makes it simple.",
    title: "Easy Returns",
    meta: "7 days from delivery",
    offsetClass: "lg:pt-28",
  },
  {
    intro: "Pay for your order with confidence. Your details are always protected.",
    title: "Secure Payments",
    meta: "Bank-grade SSL protection",
    offsetClass: "lg:pt-40",
  },
  {
    intro: "Get the help you need, fast. Our dedicated team is here for you.",
    title: "Customer\nSupport",
    meta: "hello@panappworld.com",
    offsetClass: "lg:pt-52",
  },
];

const PanappWhySection = () => {
  return (
    <section className="bg-[#161413] text-[#f3ecd8]">
      <div className="mx-auto max-w-[1580px] px-6 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4">
          {columns.map((column, index) => (
            <motion.article
              key={column.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.19, 1, 0.22, 1],
              }}
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

                <p className="max-w-[18rem] text-[0.82rem] font-medium uppercase leading-[1.5] tracking-[0.12em] text-[#ddd3bc] md:text-[0.88rem]">
                  {column.intro}
                </p>

                <div className="mt-8 lg:mt-10">
                  <h3
                    className="text-[2.2rem] font-black uppercase leading-[0.88] tracking-[-0.06em] text-white md:text-[2.6rem]"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {column.title}
                  </h3>
                  <p className="mt-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/20 md:text-[0.76rem]">
                    {column.meta}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PanappWhySection;
