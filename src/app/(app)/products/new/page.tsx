'use client';

import CalculatorPage from '@/app/(app)/calculator/page';

export default function NewProductPage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto mb-4">
        <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
          New Product Costing
        </div>
      </div>
      <CalculatorPage />
    </div>
  );
}
