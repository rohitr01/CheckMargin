# CheckMargin

> **Batch Costing & Pricing Operating System for Small-Batch Product Businesses**

CheckMargin is a modern, high-contrast web application built for makers, crafters, artisan brands, and small-batch manufacturers (candles, soaps, resin/Jesmonite decor, bakery/food, cosmetics, apparel, and more). It calculates true cost per saleable unit and eliminates underpricing by factoring in raw materials, production scrap, direct craft labour, packaging, marketplace fees, and GST.

---

## 🚀 Key Features

* **Deterministic Batch Costing Engine**: Computes exact fractional material costs from wholesale pack prices (grams, ml, pieces, metres, packs).
* **Yield & Waste Absorption**: Automatically allocates total batch costs only across *saleable units*, ensuring defect rates don't silently eat profits.
* **Direct Labour & Overhead Tracking**: Log batch prep, production, and cleanup time with hourly rates, plus fixed studio overheads.
* **Marketplace & Platform Fee Calculator**: Configurable percentage and fixed order fees (Amazon, Meesho, Etsy, Shopify, or offline fairs).
* **GST Handling**: Toggle GST-inclusive vs. exclusive pricing, custom HSN rates, and taxable revenue separation.
* **Markup vs. Target Margin Scenarios**: Interactive comparison table showing profit per unit at 30%, 50%, 100% markup and 25%, 40%, 60% gross margin.
* **Ready-to-Order Shopping List**: Automatically calculates bulk procurement needs rounded up to whole supplier pack sizes with expected waste allowances.
* **Pre-loaded Demo Presets**: Instant one-click templates for Soy Candles, Cold Process Soaps, and Artisan Bakery Loaves.

---

## 💻 Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
* **Icons**: [Lucide React](https://lucide.dev)
* **Language**: TypeScript

---

## 🛠️ Getting Started

### Prerequisites

* Node.js 18+ (tested on Node.js 20+ and v26)
* npm, pnpm, or yarn

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

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (marketing)/          # Public marketing pages
│   │   │   ├── page.tsx          # Homepage with interactive visualizer
│   │   │   ├── features/page.tsx # Feature capabilities catalogue
│   │   │   ├── pricing/page.tsx  # Pricing plans & FAQ
│   │   │   └── layout.tsx        # High-contrast Navbar & Footer
│   │   ├── (app)/                # Application studio workspace
│   │   │   ├── dashboard/page.tsx# Dashboard & quick actions
│   │   │   ├── calculator/page.tsx# Flagship Batch Calculator
│   │   │   ├── products/page.tsx # Saved products library
│   │   │   └── layout.tsx        # Studio sidebar layout
│   │   ├── auth/                 # Authentication views
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Clean high-contrast palette
│   └── lib/
│       ├── calculator.ts         # Pure deterministic calculation engine
│       └── calculator.test.ts    # Unit test suite
```

---

## 🧪 Testing

Run the calculation engine test suite:

```bash
node src/lib/calculator.test.ts
```

---

## 📄 License

MIT License. Built for makers, not accountants.
