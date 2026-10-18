# CheckMargin

> **Production-Grade Batch Costing, Financial Pricing Engine & Margin Protection Platform for Small-Batch Product Businesses**

CheckMargin is a full-stack Next.js web application built for artisans, craft manufacturers, and D2C brands (candles, cold-process soaps, resin/Jesmonite decor, bakery/confectionery, organic skincare, apparel, handmade jewellery, and digital products). It calculates true cost per saleable unit and eliminates underpricing by factoring in raw materials, unit conversions, production scrap, direct craft labour, packaging, marketplace commissions, outbound logistics, RTO allowances, and statutory Indian GST.

Live Website: [https://checkmargin.netlify.app](https://checkmargin.netlify.app)

---

## 🚀 Key Features

* **Deterministic Batch Costing Engine**: Computes exact fractional material costs from wholesale pack prices with automatic unit conversion (grams, kg, ml, L, pieces, metres, packs).
* **Yield & Waste Absorption**: Automatically allocates total batch costs only across *saleable units*, ensuring defect rates and scrap don't silently eat profits.
* **Direct Labour & Economies-of-Scale Scaler**: Separate fixed setup time from variable unit craft time to model real batch scaling efficiency.
* **Analytical Target Margin Solver**: Solves for selling price $P$ accounting for marketplace fees, 18% GST on services, shipping, customer acquisition ad spend (CAC), and RTO loss reserves.
* **Complete Indian GST Catalog (173 Categories across 21 Industries)**: Comprehensive HSN and SAC codes with statutory GST slabs (0%, 1.5%, 3%, 5%, 12%, 18%) and Input Tax Credit (ITC) reconciliation.
* **Wholesale & B2B Tier Matrix**: Generates distributor (1.6×), wholesale (2×), and retail MSRP (4×) tiers with Minimum Order Quantity (MOQ) cashflow projections.
* **Ready-to-Order Shopping List**: Automatically calculates bulk procurement needs rounded up to whole supplier pack sizes with expected waste allowances.
* **Pre-loaded Industry Presets**: 14 instant one-click templates across candles, soaps, bakery, cosmetics, resin, ceramics, leather, and digital goods.
* **Neon PostgreSQL Database**: Cloud persistence for products, materials, recipes, and calculation history.
* **Neon Authentication**: Secure session management and route protection for workspaces.
* **SaaS Subscription Entitlements**: Free Starter tier (up to 3 cloud recipes) and Pro Studio (unlimited recipes, priority snapshots, PDF/CSV export).

---

## 💻 Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components)
* **Database**: [Neon PostgreSQL](https://neon.tech) (Serverless pooled connection)
* **Authentication**: [Neon Auth](https://neon.com/docs/auth/overview) (Better Auth engine with email/password & session cookies)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
* **Icons**: [Lucide React](https://lucide.dev)
* **Language**: TypeScript 5
* **Deployment**: [Netlify](https://netlify.com)

---

## 🛠️ Environment Configuration

Create a `.env.local` file in the project root:

```env
# Neon PostgreSQL Connection String (from Neon Console)
DATABASE_URL=postgresql://user:password@endpoint-pooler.region.aws.neon.tech/neondb?channel_binding=require&sslmode=require

# Neon Auth Configuration (from Neon Console -> Auth)
NEON_AUTH_BASE_URL=https://ep-your-subdomain.neonauth.region.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your_secret_cookie_key_at_least_32_characters_long

# Application Base URL
NEXT_PUBLIC_APP_URL=https://checkmargin.netlify.app

# Optional Payment Gateway Integration (Razorpay / Cashfree)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

---

## 📦 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/rohitr01/CheckMargin.git
cd CheckMargin

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the deterministic ground-truth financial test suite:

```bash
npm test
```

Tests verify:
1. Exact unit conversions (g to kg, ml to L).
2. Saleable yield efficiency and scrap absorption.
3. Indian GST output, CGST/SGST splits, and Input Tax Credit (ITC) reconciliation.
4. Channel commissions with 18% statutory GST on marketplace services.
5. RTO allowance reserves based on return risk.
6. Analytical target margin solver accuracy (solving for exact 40% margin).
7. Unattainable margin edge-case detection.
8. Industrial batch scaler setup vs. craft time efficiency.
9. Wholesale B2B MOQ order value and profit projections.

---

## 🚀 Netlify Deployment

1. Connect your GitHub repository to Netlify.
2. In Netlify Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
3. In Netlify Environment Variables:
   - Set `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and `NEON_AUTH_COOKIE_SECRET`.
4. Deploy the site.

---

## 📄 License

MIT License. Built for makers, not accountants.
