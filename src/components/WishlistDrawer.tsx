import { X, Trash2, Heart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFavorite: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFavorite,
  onSelectProduct,
}: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" id="wishlist-drawer-root">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10"
            id="wishlist-drawer-panel"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-slate-900 leading-tight font-display">Meus Favoritos</h2>
                  <p className="text-xs text-slate-400 font-medium">Produtos salvos para depois</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                id="wishlist-drawer-close"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
                  <Heart className="w-12 h-12 text-slate-200 stroke-1" />
                  <div>
                    <h3 className="font-semibold text-slate-700 text-sm">Nenhum favorito ainda</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Clique no coração nos produtos para organizar uma lista personalizada daqueles de sua preferência!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 text-xs font-semibold text-brand-blue hover:text-brand-blue-dark flex items-center gap-1 cursor-pointer bg-brand-blue-light px-4 py-2 rounded-full"
                    id="wishlist-empty-cta"
                  >
                    Navegar pelo Catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white shadow-sm transition-all"
                      id={`fav-row-${product.id}`}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-900 text-xs font-bold leading-tight line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-brand-blue text-xs font-bold mt-1">
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-brand-blue-light text-slate-600 hover:text-brand-blue-dark transition-colors cursor-pointer"
                          aria-label="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveFavorite(product.id)}
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-rose-50 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="Remover favorito"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              <p className="text-xs text-center text-slate-500 leading-normal">
                Deseja fazer perguntas clínicas ou tirar dúvidas sobre estes favoritos? Adicione-os ao carrinho e nos mande um WhatsApp direto!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
