import { SlidersHorizontal } from 'lucide-react';

interface CategoryTabsProps {
  sortBy: string;
  onChangeSortBy: (sort: string) => void;
  totalProductsCount: number;
}

export default function CategoryTabs({
  sortBy,
  onChangeSortBy,
  totalProductsCount,
}: CategoryTabsProps) {
  return (
    <div className="w-full bg-slate-50/55 py-4 border-b border-slate-200/40" id="category-selector-section">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Filter & Sort controllers */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-blue" />
            <span>Exibindo {totalProductsCount} {totalProductsCount === 1 ? 'produto' : 'produtos'}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto" id="sorting-controllers">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value)}
              className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-700 font-black focus:ring-4 focus:ring-brand-blue-light focus:border-brand-blue transition-all outline-none cursor-pointer"
              id="sort-select-dropdown"
              aria-label="Ordenar produtos"
            >
              <option value="none">✨ Destaques</option>
              <option value="price_asc">💵 Menor Preço</option>
              <option value="price_desc">📈 Maior Preço</option>
              <option value="discount">🔥 Melhores Promoções %</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

