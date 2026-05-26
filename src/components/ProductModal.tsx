import { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart, Plus, Minus, Check, Percent, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: (selectedSize?: string, selectedColor?: string, selectedDensity?: string, quantity?: number) => void;
  isInCart: boolean;
}

export default function ProductModal({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  isInCart,
}: ProductModalProps) {
  
  // Local active variations
  const [size, setSize] = useState<string>('');
  const [density, setDensity] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Synchronize options when product changes
  useEffect(() => {
    if (product) {
      setSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setDensity(product.densities && product.densities.length > 0 ? product.densities[0] : '');
      setColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
      setQuantity(1);
      setAddedSuccess(false);
    }
  }, [product]);

  if (!product) return null;

  const currentPrice = product.price * quantity;
  const oldPrice = product.oldPrice ? product.oldPrice * quantity : undefined;
  const pixPrice = currentPrice * 0.95;
  const numInstallments = product.price > 1000 ? 12 : 10;
  const installmentValue = currentPrice / numInstallments;

  const handleAddToCart = () => {
    onAddToCart(
      size || undefined,
      color || undefined,
      density || undefined,
      quantity
    );
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto" id="product-modal-container">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal content body */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-3xl bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[85vh] md:max-h-[90vh]"
          id={`modal-body-${product.id}`}
        >
          {/* Header Close & Favorite Actions (Sticky top on mobile) */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <span className="bg-brand-blue/10 text-brand-blue-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-brand-green text-brand-green" />
                Catálogo Premium
              </span>
              <span className="text-xs text-slate-400 font-mono font-semibold">SKU: {product.sku}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                className="p-2.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                id="modal-fav-toggle"
                aria-label="Favoritar"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                id="modal-close-trigger"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Main Area */}
          <div className="overflow-y-auto p-6 flex-1 flex flex-col md:flex-row gap-6">
            
            {/* Visuals Left Column */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xs">
                {product.oldPrice && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Percent className="w-3.5 h-3.5" />
                    PROMOÇÃO
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Guarantees Badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Segurança</p>
                  <p className="text-[11px] font-semibold text-slate-700">Garantia Schultz</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Atendimento</p>
                  <p className="text-[11px] font-semibold text-slate-700">Dúvidas por Whats</p>
                </div>
                <div className="bg-brand-green-light rounded-xl p-3 border border-brand-green/20">
                  <p className="text-[10px] text-brand-green-dark uppercase font-bold tracking-wider mb-0.5">Qualidade</p>
                  <p className="text-[11px] font-semibold text-brand-blue">Ortopédico Bio</p>
                </div>
              </div>
            </div>

            {/* Info Right Column */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-brand-green uppercase tracking-wider block mb-1">
                  {product.category === 'beds_mattresses' && 'Camas & Colchões Ortopédicos'}
                  {product.category === 'pillows_cushions' && 'Travesseiros & Almofadas Anatômicas'}
                  {product.category === 'footwear_shoes' && 'Calçados & Tênis para Saúde'}
                  {product.category === 'clothing_accessories' && 'Roupas, Órteses & Suportes'}
                </span>
                
                <h2 className="text-slate-900 font-display font-bold text-xl leading-tight mb-2">
                  {product.name}
                </h2>

                <p className="text-sm text-slate-600 mb-4 whitespace-pre-line leading-relaxed">
                  {product.fullDescription}
                </p>

                {/* Core Benefits Bullets */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                    Benefícios Ortopédicos
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2">
                    {product.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-green font-bold text-sm leading-none mt-0.5">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* VARIATIONS ACCORDION */}
                <div className="space-y-4 mb-6" id="product-variations-panel">
                  {/* SIZES SELECTOR */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Selecione o Tamanho / Dimensão:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSize(sz)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                              size === sz
                                ? 'bg-brand-blue border-brand-blue text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                            id={`size-opt-${sz}`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DENSITIES SELECTOR */}
                  {product.densities && product.densities.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                        Firmeza da Espuma (Densidade):
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.densities.map((dn) => (
                          <button
                            key={dn}
                            onClick={() => setDensity(dn)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                              density === dn
                                ? 'bg-brand-blue border-brand-blue text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                            id={`density-opt-${dn}`}
                          >
                            {dn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COLORS SELECTOR */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                        Escolha a Cor:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((cl) => (
                          <button
                            key={cl}
                            onClick={() => setColor(cl)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                              color === cl
                                ? 'bg-brand-blue border-brand-blue text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                            id={`color-opt-${cl}`}
                          >
                            {cl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Footer with Prices & Final CTA */}
              <div className="border-t border-gray-100 pt-5 mt-auto bg-white">
                <div className="flex items-center justify-between gap-4 mb-4">
                  {/* Price info inside modal */}
                  <div className="flex flex-col">
                    {oldPrice && (
                      <span className="text-gray-400 line-through text-xs font-medium">
                        De R$ {oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-display font-extrabold text-brand-blue">
                        R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {quantity > 1 && (
                        <span className="text-xs text-gray-400 font-medium">({quantity}x R$ {product.price.toLocaleString('pt-BR')})</span>
                      )}
                    </div>
                    {/* Instantly show savings / details */}
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/60 inline-flex items-center gap-1.5 w-fit">
                      <span>PIX (5% off):</span>
                      <strong className="font-bold">R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-2xs">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer active:scale-95 shadow-3xs"
                      aria-label="Diminuir"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-800 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer active:scale-95 shadow-3xs"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Installment calculation */}
                <p className="text-[10px] text-slate-400 text-right font-medium mb-3">
                  Ou parcelado em até {numInstallments}x sem juros de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} no cartão.
                </p>

                {/* Final Button Add */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addedSuccess}
                  className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-99 ${
                    addedSuccess
                      ? 'bg-brand-blue text-white shadow-brand-blue/20'
                      : 'bg-brand-green hover:bg-brand-green-dark text-white shadow-brand-green/20'
                  }`}
                  id="modal-add-to-cart-cta"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4.5 h-4.5 animate-bounce" />
                      Adicionado com Sucesso!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4.5 h-4.5" />
                      Adicionar {quantity} {quantity === 1 ? 'item' : 'itens'} ao Carrinho
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
