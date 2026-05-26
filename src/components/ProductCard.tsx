import React from 'react';
import { Heart, Eye, ShoppingCart, Check, Percent, Star, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectProduct: () => void;
  onAddToCart: (selectedSize?: string, selectedColor?: string, selectedDensity?: string) => void;
  isInCart: boolean;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  onAddToCart,
  isInCart,
}: ProductCardProps) {
  
  // Calculate potential discount percentage if oldPrice exists
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Calculate PIX price (5% discount)
  const pixPrice = product.price * 0.95;

  // Calculate installment value
  const numInstallments = product.price > 1000 ? 12 : 10;
  const installmentValue = product.price / numInstallments;

  // Mock highly persuasive clinical/sales ratings based on product ID to simulate real customer feedback
  const mockRatings: Record<string, { stars: number; count: number }> = {
    '1': { stars: 4.9, count: 64 },
    '2': { stars: 4.8, count: 48 },
    '3': { stars: 4.9, count: 112 },
    '4': { stars: 4.7, count: 29 },
    '5': { stars: 4.8, count: 53 },
    '6': { stars: 4.9, count: 87 },
  };

  const rating = mockRatings[product.id] || { stars: 4.8, count: 32 };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If the product requires options (has sizes or densities), open detailed modal instead of quick adding
    if ((product.sizes && product.sizes.length > 0) || (product.densities && product.densities.length > 0)) {
      onSelectProduct();
    } else {
      onAddToCart();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Top badges & Favorite heart */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
            <Percent className="w-2.5 h-2.5" />
            {discountPercent}% OFF
          </span>
        )}
        {!product.inStock && (
          <span className="bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
            Esgotado
          </span>
        )}
        {product.price > 1000 && (
          <span className="bg-[#1d4391] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            Premium
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-[#72b63c] shadow-xs active:scale-90 transition-all cursor-pointer"
        id={`btn-fav-${product.id}`}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart className={`w-[18px] h-[18px] transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
      </button>

      {/* Picture Area */}
      <div 
        onClick={onSelectProduct}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-2"
        id={`product-img-wrapper-${product.id}`}
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
          loading="lazy"
        />
        {/* Overlay Hover Effect: "Ver detalhes" */}
        <div className="absolute inset-0 bg-brand-blue/3 hover:bg-brand-blue/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
          <span className="bg-white/95 text-brand-blue font-bold text-xs py-2 px-3.5 rounded-lg shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4" />
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        {/* Texts */}
        <div className="mb-2.5">
          {/* E-commerce category and review stars line */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[8px] sm:text-[9.5px] font-extrabold text-[#72b63c] uppercase tracking-wider truncate max-w-[65%]">
              {product.category === 'beds_mattresses' && 'Colchões'}
              {product.category === 'pillows_cushions' && 'Travesseiros'}
              {product.category === 'footwear_shoes' && 'Calçados'}
              {product.category === 'clothing_accessories' && 'Órteses & Meias'}
            </span>
            {/* Star ratings */}
            <div className="flex items-center gap-0.5 text-amber-400 text-[9px] sm:text-[10px] font-bold shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
              <span>{rating.stars}</span>
              <span className="text-slate-400 text-[8px] sm:text-[9px] font-medium">({rating.count})</span>
            </div>
          </div>
          
          <h3 
            onClick={onSelectProduct}
            className="text-slate-900 font-sans font-bold text-[11px] sm:text-[13px] leading-tight hover:text-brand-blue transition-colors cursor-pointer mb-1 line-clamp-2 h-8 sm:h-9"
          >
            {product.name}
          </h3>
          
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 mb-2 h-7 sm:h-8 leading-snug">
            {product.description}
          </p>

          {/* Core Advantages Badges (Compact, elegant pills) */}
          <div className="flex flex-wrap gap-1 mb-1">
            {product.advantages.slice(0, 1).map((adj, idx) => (
              <span key={idx} className="bg-brand-blue-light/50 text-[#1d4391] text-[7.5px] sm:text-[9px] px-1 sm:px-2 py-0.5 rounded font-bold truncate max-w-[70px] sm:max-w-[110px]">
                ★ {adj}
              </span>
            ))}
            <span className="bg-emerald-50 text-emerald-800 text-[7.5px] sm:text-[9px] px-1 sm:px-2 py-0.5 rounded font-bold shrink-0">
              Postura 100%
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div>
          {/* Prices Grid styled like Mercado Livre */}
          <div className="flex flex-col gap-0.5 border-t border-slate-100 pt-2 mb-2 sm:mb-3.5">
            {product.oldPrice && (
              <span className="text-slate-400 line-through text-[9.5px] sm:text-[11px] font-medium">
                R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm sm:text-xl font-display font-black text-[#1d4391] tracking-tight">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {discountPercent > 0 && (
                <span className="text-emerald-600 text-[9.5px] sm:text-[11px] font-bold leading-none">{discountPercent}% OFF</span>
              )}
            </div>

            {/* In 10x without Interest tag (Vivid Green in Mercado Livre Style) */}
            <div className="text-[9.5px] sm:text-[11.5px] text-emerald-600 font-bold mt-0.5">
              ou <span className="font-extrabold">{numInstallments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> <span className="bg-emerald-100 text-emerald-800 text-[7.5px] sm:text-[9px] px-0.5 sm:px-1 py-0.2 rounded font-black ml-1 uppercase">Sem juros</span>
            </div>

            {/* Delivery/Shipping details (Mercado Livre trademark detail) */}
            <div className="flex items-center gap-1 text-[9.5px] sm:text-[10.5px] text-emerald-600 font-bold mt-1">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Frete grátis <span className="text-slate-400 font-medium hidden sm:inline">disponível</span></span>
            </div>
            
            <p className="text-[8.5px] sm:text-[10px] text-slate-400 font-medium mt-1 leading-tight">
              No PIX: R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (5%)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 sm:gap-1.5">
            <button
              onClick={onSelectProduct}
              className="px-1.5 w-8 sm:w-10 h-8 sm:h-9 shrink-0 border border-slate-200 hover:border-brand-blue text-brand-blue hover:bg-brand-blue-light rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              id={`btn-details-${product.id}`}
              title="Ver detalhes clíncos"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`flex-1 font-bold h-8 sm:h-9 rounded-lg text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 cursor-pointer border ${
                !product.inStock
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-brand-blue border-brand-blue text-white hover:bg-brand-blue-dark'
                  : 'bg-[#72b63c] border-[#72b63c] text-white hover:bg-brand-green-dark shadow-xs'
              }`}
              id={`btn-add-quick-${product.id}`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">No Carrinho</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">{(product.sizes && product.sizes.length > 0) || (product.densities && product.densities.length > 0) ? 'Escolher' : 'Comprar'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
