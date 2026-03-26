

# PANAPPWORLD -- Full-Stack E-Commerce Clothing Store

## Overview
Clone the Lynck Studio / Original Sin site design and rebrand it as **PANAPPWORLD**, then build a full-stack e-commerce backend using Lovable Cloud (Supabase). The site features a dark, high-fashion aesthetic with full-screen hero sliders, product grids, lookbook pages, and smooth animations.

---

## Phase 1: Frontend Clone (Storefront)

### 1. Global Layout & Styling
- Custom font setup (use a clean sans-serif like Inter or a fashion-forward font)
- Dark/light color system: white background, black text, crimson accent (#990000)
- Custom cursor (crosshair with diamond accents) on desktop
- Page transition animations (fade in/out)
- Global CSS: text-transform uppercase, letter-spacing, thin underline hover effects

### 2. Header Component
- Fixed position, z-index 15
- Left: brand name "PANAPPWORLD" stacked text
- Center: logo (text-based or SVG)
- Right top: "CART (n)" link
- Right below: "COLLECTION" and "LOOKBOOK" navigation links
- Mobile: hamburger menu with full-screen crimson overlay
- Blend mode on homepage (white text, mix-blend-mode: difference)

### 3. Homepage -- Hero Slider
- Full-viewport-height image slider with 4 slides
- Each slide: full-bleed background image (placeholder for now) with parallax inner movement
- Bottom-right: small product card thumbnail with "BUY NOW" button
- Slide controls: prev/next arrows, diamond-dot progress indicators
- Touch/swipe support on mobile

### 4. Homepage -- Product Grid (below slider)
- Grid of product cards (3-column desktop, single-column mobile)
- Each card: product image (aspect-ratio 37:46), hover reveals second image, name + price below
- "Sold Out" label in crimson for unavailable items
- Fade-in animation on scroll (intersection observer)

### 5. Collection Page (`/collection`)
- Top: collection filter tabs (e.g., "ALL", category names) separated by diamond decorators
- Product grid identical to homepage grid
- Padding-top to clear fixed header

### 6. Product Detail Page (`/product/:slug`)
- Large product images (gallery or single)
- Product name, price, size selector, "Add to Cart" button
- Description and details sections
- Related products section

### 7. Lookbook Page (`/lookbook`)
- Full-screen editorial image gallery
- Scroll-based or slider layout with fashion photography placeholders

### 8. Cart Sidebar
- Slide-in panel from right
- Line items with quantity, price
- Subtotal, "CHECKOUT" button
- "CLOSE" button at top

### 9. Footer
- Centered logo (click to scroll to top)
- Flavor text / brand description
- Links: Privacy Policy, Shipping & Returns, Terms of Service
- Hover color change to crimson

### 10. Additional Pages
- `/checkout` -- checkout form
- `/privacy-policy`, `/shipping-and-returns`, `/terms-of-service` -- static legal pages

---

## Phase 2: Backend (Lovable Cloud / Supabase)

### 11. Database Schema
Tables:
- **products**: id, name, slug, description, price, collection_id, images (jsonb), sizes (jsonb), in_stock, featured, created_at
- **collections**: id, name, slug, description
- **orders**: id, user_id, status, total, shipping_address (jsonb), created_at
- **order_items**: id, order_id, product_id, size, quantity, price
- **cart_items**: id, session_id, product_id, size, quantity
- **user_roles**: id, user_id, role (enum: admin, user)
- **profiles**: id (refs auth.users), full_name, email, avatar_url

### 12. Authentication
- Supabase Auth (email/password + optional social)
- Protected routes for admin dashboard and checkout
- RLS policies on all tables

### 13. Admin Dashboard (`/admin`)
- Protected route (admin role required)
- **Products management**: CRUD products, upload images, set prices/sizes/stock
- **Orders management**: view orders, update status (pending/shipped/delivered)
- **Analytics**: revenue chart, order count, top products, stock levels
- **Collections management**: create/edit collections

### 14. Checkout Flow
- Cart review -> Shipping info form -> Order confirmation
- Creates order + order_items in Supabase
- Stripe integration can be added later

---

## Technical Details

### File Structure
```text
src/
  components/
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
      CartSidebar.tsx
      CustomCursor.tsx
      PageTransition.tsx
    home/
      HeroSlider.tsx
      ProductGrid.tsx
      ProductCard.tsx
    product/
      ProductGallery.tsx
      SizeSelector.tsx
      AddToCart.tsx
    admin/
      Dashboard.tsx
      ProductManager.tsx
      OrderManager.tsx
      AnalyticsCharts.tsx
    ui/ (existing shadcn components)
  pages/
    Index.tsx
    Collection.tsx
    ProductDetail.tsx
    Lookbook.tsx
    Checkout.tsx
    AdminDashboard.tsx
    PrivacyPolicy.tsx
    ShippingReturns.tsx
    TermsOfService.tsx
  hooks/
    useCart.ts
    useProducts.ts
    useAuth.ts
  lib/
    supabase.ts
    utils.ts
  types/
    index.ts
```

### Key Design Tokens
- Primary background: white `#ffffff`
- Text: black `#000000`
- Accent: crimson `#990000`
- Button gradient: `linear-gradient(90deg, #222, #0d0c0c 50%, #222)`
- Font: uppercase, letter-spacing 0.02rem, font-weight 600
- Selection color: crimson bg, white text

### Animations
- Page transitions: opacity fade 0.5s cubic-bezier
- Scroll reveal: intersection observer with opacity + translateY
- Hover underline: scaleX transform with origin shift
- Slider: touch-driven translate with momentum
- Product card hover: second image opacity transition

### Placeholder Strategy
- Hero images: dark gradient placeholders with "PANAPPWORLD" text overlay
- Product images: neutral gray cards with product silhouette icons
- All wired to Supabase `images` jsonb field for easy replacement later

---

## Implementation Order
1. Global styles, layout (Header, Footer, CustomCursor)
2. Homepage (HeroSlider + ProductGrid with placeholder data)
3. Collection + Product Detail pages
4. Lookbook page
5. Set up Lovable Cloud (Supabase) -- database tables + seed data
6. Wire frontend to Supabase (products, collections)
7. Auth + Cart + Checkout
8. Admin Dashboard with analytics
9. Polish animations and responsive design

