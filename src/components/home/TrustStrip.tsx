import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const items = [
  {
    Icon: Truck,
    title: "Free EU Shipping",
    sub: "On orders over €150",
  },
  {
    Icon: RotateCcw,
    title: "30-Day Returns",
    sub: "Easy & free exchanges",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Checkout",
    sub: "Stripe encrypted payments",
  },
];

const TrustStrip = () => {
  return (
    <section className="border-y border-foreground/10 py-10 lg:py-14 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {items.map(({ Icon, title, sub }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center gap-2"
          >
            <Icon strokeWidth={1.25} className="w-7 h-7" />
            <p className="text-[11px] font-semibold uppercase tracking-fashion">
              {title}
            </p>
            <p className="text-[10px] uppercase tracking-fashion text-foreground/60">
              {sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;
