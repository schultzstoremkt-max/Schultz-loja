import { useState } from 'react';
import { ShoppingCart, Heart, Search, MapPin, X, Sparkles, User, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CartItem, ProductCategory, UserAccount, PromoBanner } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlistCount: number;
  onCartToggle: () => void;
  onWishlistToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory?: (category: ProductCategory | null) => void;
  selectedCategory?: ProductCategory | null;
  currentUser: UserAccount | null;
  onAccountToggle: () => void;
  promoBanner: PromoBanner;
  onEditBannerClick: () => void;
  logo?: string;
}

export default function Header({
  cart,
  wishlistCount,
  onCartToggle,
  onWishlistToggle,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  selectedCategory,
  currentUser,
  onAccountToggle,
  promoBanner,
  onEditBannerClick,
  logo,
}: HeaderProps) {
  // Total quantity of items in the cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Total pricing of the cart formatted
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-100" id="store-header">
      {/* 1. CONFIGURATION-CONTROLLED SLIM PROMO BAR (Absolute top of screen like "Mês do Consumidor") */}
      <AnimatePresence>
        {promoBanner.active && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`w-full text-center py-2 px-4 flex items-center justify-center gap-2 border-b border-black/10 transition-all duration-150 relative overflow-hidden ${promoBanner.bgColor} ${promoBanner.textColor}`} 
            id="top-promo-bar"
          >
            <div className="flex items-center justify-center gap-1.5 select-none text-xs text-center w-full max-w-7xl mx-auto font-sans">
              {promoBanner.emoji && !promoBanner.text.trim().startsWith(promoBanner.emoji) && (
                <span className="text-sm select-none">{promoBanner.emoji}</span>
              )}
              <span className="font-extrabold tracking-wide uppercase text-[10px] sm:text-[11px]">
                {promoBanner.text}
              </span>
              
              {/* Inline config button for easy admin shortcut */}
              {currentUser?.role === 'admin' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditBannerClick();
                  }}
                  className="ms-3 bg-white/20 hover:bg-white/30 text-white rounded p-1 sm:px-2 sm:py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all border border-white/20 hover:scale-105 active:scale-95 shrink-0 select-none"
                  id="admin-instant-edit-banner-btn"
                  title="Ajustar Banner"
                >
                  <Settings className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">Ajustar Banner</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN HEADER ROW (Logo + Centered Rounded Pill Search + Minimalist Actions) */}
      <div className="bg-white py-2 sm:py-3.5 px-3 sm:px-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-between w-full md:w-auto gap-2">
            <div 
              className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none"
              onClick={() => onSelectCategory && onSelectCategory(null)}
            >
              {logo ? (
                <img 
                  src={logo} 
                  alt="Schultz Ortopédicos Logo" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200/80 shadow-xs transition-transform hover:scale-105 active:scale-95 bg-slate-50 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-blue flex items-center justify-center text-white font-display font-black text-sm sm:text-lg shadow-xs transition-transform hover:scale-105 active:scale-95 shrink-0">
                  S
                </div>
              )}
              <div className="min-w-0">
                <span className="flex items-center gap-1 text-base sm:text-lg font-display font-black tracking-tight text-brand-blue leading-none">
                  Schultz <span className="text-brand-green">Store</span>
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 text-[7px] min-[360px]:text-[8px] sm:text-[8.5px] text-slate-400 font-mono tracking-normal sm:tracking-wider uppercase font-bold whitespace-nowrap">
                  <span>Conforto</span>
                  <span className="text-brand-green font-bold text-[5px] sm:text-[6px]">•</span>
                  <span>Qualidade</span>
                  <span className="text-brand-blue font-bold text-[5px] sm:text-[6px]">•</span>
                  <span>Bem-Estar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centered e-commerce search pill exactly like the screenshot/Boticário */}
          <div className="flex-1 w-full max-w-2xl mx-auto md:mx-6" id="search-section">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="O que você procura hoje?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/65 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-4 pr-12 py-2.5 rounded-full border border-slate-200/80 focus:border-brand-blue focus:ring-0 focus:outline-none transition-all duration-150"
                id="search-input-field"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  id="clear-search-btn"
                  aria-label="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
              {/* Circular green/blue button on the right inside boundaries of the pill */}
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center cursor-pointer transition-transform duration-100 hover:scale-105 active:scale-95 shadow-xs">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Actions Toolbar (Clean, minimalist icon-above-text like the screenshot) */}
          <div className="hidden md:flex items-center gap-7 shrink-0" id="desktop-actions">
            
            {/* Account / Login */}
            <button
              onClick={onAccountToggle}
              className="flex flex-col items-center justify-center gap-1 select-none text-slate-600 hover:text-brand-blue transition-colors cursor-pointer group relative focus:outline-none focus:ring-0"
              id="desktop-btn-account"
            >
              <div className="relative">
                <User className={`w-[22px] h-[22px] stroke-[1.8px] transition-colors group-hover:text-brand-blue ${currentUser ? 'text-brand-blue fill-brand-blue/10' : 'text-slate-500'}`} />
                {currentUser && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-green w-2 h-2 rounded-full border border-white" />
                )}
              </div>
              <span className="text-[11px] font-bold tracking-tight text-slate-500 group-hover:text-brand-blue">
                {currentUser ? `Olá, ${currentUser.name.split(' ')[0]}` : 'Entrar'}
              </span>
            </button>

            {/* Favoritos */}
            <button
              onClick={onWishlistToggle}
              className="flex flex-col items-center justify-center gap-1 select-none text-slate-600 hover:text-red-500 transition-colors cursor-pointer group relative focus:outline-none focus:ring-0"
              id="desktop-btn-wishlist"
            >
              <div className="relative">
                <Heart className={`w-[22px] h-[22px] stroke-[1.8px] transition-colors group-hover:text-red-500 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold tracking-tight text-slate-500 group-hover:text-red-500">
                Favoritos
              </span>
            </button>

            {/* Sacola (My Shopping Bag / Cart) */}
            <button
              onClick={onCartToggle}
              className="flex flex-col items-center justify-center gap-1 select-none text-slate-600 hover:text-brand-blue transition-colors cursor-pointer group relative focus:outline-none focus:ring-0"
              id="desktop-btn-cart"
            >
              <div className="relative">
                <ShoppingCart className="w-[22px] h-[22px] stroke-[1.8px] text-slate-500 group-hover:text-brand-blue" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-brand-blue text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold tracking-tight text-slate-500 group-hover:text-brand-blue">
                Sacola
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. CENTERED SUBHEADER NAVIGATION SYSTEM (Simple centered horizontal list with active bottom lines like Boticário) */}
      <div className="bg-white border-t border-slate-100 flex items-center justify-center py-2 px-4 shadow-3xs" id="desktop-category-bar">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center">
          <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar py-1 w-full justify-start lg:justify-center text-center whitespace-nowrap px-4 sm:px-0">
            
            <button 
              onClick={() => onSelectCategory && onSelectCategory(null)}
              className={`text-[12px] font-extrabold tracking-wider transition-all px-2.5 sm:px-3 pb-1 cursor-pointer focus:outline-none focus:ring-0 select-none shrink-0 ${
                selectedCategory === null
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-500 hover:text-brand-blue border-b-2 border-transparent'
              }`}
            >
              Todos
            </button>

            <button 
              onClick={() => onSelectCategory && onSelectCategory('beds_mattresses')}
              className={`text-[12px] font-extrabold tracking-wider transition-all px-2.5 sm:px-3 pb-1 cursor-pointer focus:outline-none focus:ring-0 select-none shrink-0 ${
                selectedCategory === 'beds_mattresses'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-500 hover:text-brand-blue border-b-2 border-transparent'
              }`}
            >
              Colchões Ortopédicos
            </button>

            <button 
              onClick={() => onSelectCategory && onSelectCategory('pillows_cushions')}
              className={`text-[12px] font-extrabold tracking-wider transition-all px-2.5 sm:px-3 pb-1 cursor-pointer focus:outline-none focus:ring-0 select-none shrink-0 ${
                selectedCategory === 'pillows_cushions'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-500 hover:text-brand-blue border-b-2 border-transparent'
              }`}
            >
              Travesseiros Clínicos
            </button>

            <button 
              onClick={() => onSelectCategory && onSelectCategory('footwear_shoes')}
              className={`text-[12px] font-extrabold tracking-wider transition-all px-2.5 sm:px-3 pb-1 cursor-pointer focus:outline-none focus:ring-0 select-none shrink-0 ${
                selectedCategory === 'footwear_shoes'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-500 hover:text-brand-blue border-b-2 border-transparent'
              }`}
            >
              Calçados Anatômicos
            </button>

            <button 
              onClick={() => onSelectCategory && onSelectCategory('clothing_accessories')}
              className={`text-[12px] font-extrabold tracking-wider transition-all px-2.5 sm:px-3 pb-1 cursor-pointer focus:outline-none focus:ring-0 select-none shrink-0 ${
                selectedCategory === 'clothing_accessories'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-500 hover:text-brand-blue border-b-2 border-transparent'
              }`}
            >
              Corretores & Compressão
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
}
