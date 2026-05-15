import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Composant de pagination réutilisable.
 * Props :
 *   - page       : page courante (1-indexed)
 *   - totalPages : nombre total de pages
 *   - onPage     : callback(newPage)
 *   - total      : nombre total d'éléments (optionnel, pour afficher "X résultats")
 *   - perPage    : éléments par page (optionnel)
 */
const Pagination = ({ page, totalPages, onPage, total, perPage }) => {
  if (totalPages <= 1) return null;

  // Génère les numéros à afficher (max 5 boutons + ellipses)
  const pages = [];
  const delta = 1;
  const left  = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      {/* Info résultats */}
      {total !== undefined && perPage !== undefined ? (
        <p className="text-xs text-gray-400">
          {from}–{to} sur <span className="font-medium text-gray-600">{total}</span> résultats
        </p>
      ) : (
        <span />
      )}

      {/* Boutons */}
      <div className="flex items-center gap-1">
        {/* Précédent */}
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Suivant */}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
