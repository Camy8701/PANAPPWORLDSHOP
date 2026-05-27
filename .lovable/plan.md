# Homepage Rails + Mobile-Optimized ProductCard

Two compounding changes: the new card is used by the new homepage rails, so we build the card first, then the homepage.

## 1. ProductCard upgrade (`src/components/home/ProductCard.tsx`)

Goals: works great on touch, second image visible without hover, CTA always reachable, denser 2-col mobile grid.

- **Touch-aware second image**: detect coarse pointer (`matchMedia('(hover: none)')`). On touch, auto-cycle to image 2 after a short delay when the card is in view (IntersectionObserver), or swap on first tap before navigation. On hover-capable devices, keep current hover swap.
- **Always-visible CTA on mobile**: below the image on small screens, render a full-width "Add to bag" / "Buy now" pill that links to PDP (keeps current ATC flow on PDP where size is required). On `md+`, keep the existing hover-reveal overlay — no visual regression on desktop.
- **Quick-add hint**: small "+" icon button top-right of the image on mobile, links to PDP focused on size selector (uses existing route with `?action=add`).
- **Sold out & low stock chips**: keep current Sold Out; add subtle "Last sizes" chip when applicable (only if data already on product — otherwise skip).
- **Image polish**: keep `loading="lazy"`, add `decoding="async"` and `sizes` attribute for responsive delivery. No srcset changes (images come from Supabase storage at fixed sizes).
- **Typography/price**: keep Bebas/Inter, keep `formatPrice`. No structural visual change on desktop.

## 2. Homepage rails (`src/pages/Index.tsx` + new components)

Goal: surface products above the fold without breaking the editorial vibe.

New layout order:
```
HeroSlider                (unchanged)
NewArrivalsRail           (new — 8 most recent products, 2-col mobile / 4-col desktop)
HeroGallerySection        (unchanged)
FeaturedRail              (new — products where featured=true, horizontal scroll on mobile)
PanappWhySection          (unchanged)
TrustStrip                (new — shipping / returns / secure checkout, 3 icons + tiny copy)
ParallaxDreamSection      (unchanged)
EmailCaptureBand          (new — minimal inline form, "10% off first order")
```

New files:
- `src/components/home/ProductRail.tsx` — reusable titled rail (eyebrow + title + "View all" link + grid/scroller). Uses the upgraded `ProductCard`. Shows `ProductGridSkeleton` while loading. Hides itself if no products.
- `src/components/home/TrustStrip.tsx` — three-up strip (free EU shipping over €X, 30-day returns, secure checkout). Pure presentational.
- `src/components/home/EmailCaptureBand.tsx` — inline form, posts to a new lightweight `newsletter_signups` table later (this iteration: UI only with a `toast` success; no backend change in this step, flagged as TODO so we don't bloat scope).

Data:
- Reuse existing `useProducts()`; client-side slice for "new arrivals" (sort by `created_at desc`, take 8) and "featured" (filter `featured === true`, take 8). No schema changes.

Mobile grid:
- `NewArrivalsRail` uses `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` with tight gutters matching collection page.
- `FeaturedRail` on mobile becomes a horizontal snap-scroller (`overflow-x-auto snap-x`) so the editorial feel survives the small screen.

## 3. Out of scope (next steps)
- Sticky add-to-cart + accordions on PDP (step 3)
- Cart free-shipping bar (step 4)
- Collection filters (step 5)
- Header cart badge / search (step 6)

## Technical notes
- No backend, schema, RLS, or edge-function changes.
- No new dependencies.
- Respect existing tokens in `index.css` (off-white bg, `#990000` accent, Bebas Neue / Inter). No hard-coded colors in components beyond what already exists in the card.
- Keep crosshair cursor + mix-blend header behavior untouched (sections use existing background tone).
- All new components are presentational and < 120 lines each.
