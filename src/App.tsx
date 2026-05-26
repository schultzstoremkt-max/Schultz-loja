import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Heart, ShoppingBag, ArrowRight, MessageCircle, Info, HelpCircle, Phone, Truck, Home, Grid, ShoppingCart, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Database & Types
import { PRODUCTS } from './data/products';
import { CartItem, Product, ProductCategory, UserAccount, PromoBanner, HeroBanner } from './types';

// Components
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AccountDrawer from './components/AccountDrawer';

export default function App() {
  // User Accounts & Authentication States
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('schultz_current_user_v2');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);

  // Dynamic Adjustable Promo Banner Configuration State
  const [promoBanner, setPromoBanner] = useState<PromoBanner>(() => {
    try {
      const stored = localStorage.getItem('schultz_promo_banner_v2');
      return stored ? JSON.parse(stored) : {
        text: "🚚 FRETE GRÁTIS PARA TODO O RIO GRANDE DO SUL",
        bgColor: "bg-radial from-slate-900 via-slate-800 to-slate-950 text-white", // Premium gradient
        textColor: "text-amber-300",
        emoji: "🚚",
        active: true
      };
    } catch {
      return {
        text: "🚚 FRETE GRÁTIS PARA TODO O RIO GRANDE DO SUL",
        bgColor: "bg-radial from-slate-900 via-slate-800 to-slate-950 text-white",
        textColor: "text-amber-300",
        emoji: "🚚",
        active: true
      };
    }
  });

  // Dynamic Big Hero Banner ("Banner Grande") Configuration State
  const [heroBanner, setHeroBanner] = useState<HeroBanner>(() => {
    try {
      const stored = localStorage.getItem('schultz_hero_banner_v2');
      return stored ? JSON.parse(stored) : {
        tagline: "Ofertas de Fábrica • Schultz Saúde",
        titleLine1: "Sua saúde postural em",
        titleHighlighted: "Primeiro Lugar",
        description: "Alivie dores na coluna, esporão de calcâneo e tensões cervicais hoje. Linha certificada de colchões ortopédicos, meias de compressão Sigvaris e travesseiros clínicos NASA fabricados sob rigoroso controle de ergonomia médica.",
        backgroundImage: "/src/assets/images/hero_pos_bg_1779750303824.png",
        badgeTitle1: "Ergonomia Comprovada",
        badgeDesc1: "Todos os equipamentos acompanham laudos e certificados ortopédicos de alinhamento de coluna.",
        badgeTitle2: "Apoio De Medidas",
        badgeDesc2: "Fale com nosso consultor no WhatsApp para guiar a densidade ideal do colchão ou tamanhos de meias."
      };
    } catch {
      return {
        tagline: "Ofertas de Fábrica • Schultz Saúde",
        titleLine1: "Sua saúde postural em",
        titleHighlighted: "Primeiro Lugar",
        description: "Alivie dores na coluna, esporão de calcâneo e tensões cervicais hoje. Linha certificada de colchões ortopédicos, meias de compressão Sigvaris e travesseiros clínicos NASA fabricados sob rigoroso controle de ergonomia médica.",
        backgroundImage: "/src/assets/images/hero_pos_bg_1779750303824.png",
        badgeTitle1: "Ergonomia Comprovada",
        badgeDesc1: "Todos os equipamentos acompanham laudos e certificados ortopédicos de alinhamento de coluna.",
        badgeTitle2: "Apoio De Medidas",
        badgeDesc2: "Fale com nosso consultor no WhatsApp para guiar a densidade ideal do colchão ou tamanhos de meias."
      };
    }
  });

  // Dynamic Logo State
  const [logo, setLogo] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('schultz_store_logo_v3');
      return stored || '/src/assets/images/schultz_logo_1779751637394.png';
    } catch {
      return '/src/assets/images/schultz_logo_1779751637394.png';
    }
  });

  // Dynamic Reactive Products List State (for full Catalog CRUD admin actions)
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('schultz_products_list_v2');
      return stored ? JSON.parse(stored) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Sync states with LocalStorage for flawless reload persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      // First check if current session is logged in, and choose key
      const user = localStorage.getItem('schultz_current_user_v2');
      if (user) {
        const uObj = JSON.parse(user);
        const stored = localStorage.getItem(`schultz_cart_user_${uObj.email}`);
        if (stored) return JSON.parse(stored);
      }
      const stored = localStorage.getItem('schultz_cart_v2_guest');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const user = localStorage.getItem('schultz_current_user_v2');
      if (user) {
        const uObj = JSON.parse(user);
        const stored = localStorage.getItem(`schultz_wishlist_user_${uObj.email}`);
        if (stored) return JSON.parse(stored);
      }
      const stored = localStorage.getItem('schultz_wishlist_v2_guest');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI state management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [sortBy, setSortBy] = useState('none');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  
  // Newsletter / Quick contact message email
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);

  // Sync active cart session to appropriate LocalStorage key on modification
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`schultz_cart_user_${currentUser.email}`, JSON.stringify(cart));
    } else {
      localStorage.setItem('schultz_cart_v2_guest', JSON.stringify(cart));
    }
    // Backward compatibility for components
    localStorage.setItem('schultz_cart_v2', JSON.stringify(cart));
  }, [cart, currentUser]);

  // Sync active wishlist session to appropriate LocalStorage key on modification
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`schultz_wishlist_user_${currentUser.email}`, JSON.stringify(wishlist));
    } else {
      localStorage.setItem('schultz_wishlist_v2_guest', JSON.stringify(wishlist));
    }
    // Backward compatibility for components
    localStorage.setItem('schultz_wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist, currentUser]);

  // Sync banner updates to LocalStorage on modification
  useEffect(() => {
    localStorage.setItem('schultz_promo_banner_v2', JSON.stringify(promoBanner));
  }, [promoBanner]);

  // Sync BIG Hero Banner updates to LocalStorage on modification
  useEffect(() => {
    localStorage.setItem('schultz_hero_banner_v2', JSON.stringify(heroBanner));
  }, [heroBanner]);

  // Sync Products list catalog updates to LocalStorage on modification
  useEffect(() => {
    localStorage.setItem('schultz_products_list_v2', JSON.stringify(productsList));
  }, [productsList]);

  // Sync brand logo updates to LocalStorage on modification
  useEffect(() => {
    localStorage.setItem('schultz_store_logo_v3', logo);
  }, [logo]);

  // Ensure old promo banner gets migrated to show free shipping to RS
  useEffect(() => {
    if (promoBanner.text && (promoBanner.text.includes('CAMPANHA') || !promoBanner.text.toLowerCase().includes('rio grande do sul'))) {
      setPromoBanner({
        text: "🚚 FRETE GRÁTIS PARA TODO O RIO GRANDE DO SUL",
        bgColor: "bg-radial from-slate-900 via-slate-800 to-slate-950 text-white",
        textColor: "text-amber-300",
        emoji: "🚚",
        active: true
      });
    }
  }, []);

  // Sync changes to user session
  // This will dynamically load the specific user's cart and wishlist, or transition to the guest container.
  const handleUserLoginChange = (user: UserAccount | null) => {
    if (user) {
      // 1. Set user state
      setCurrentUser(user);
      localStorage.setItem('schultz_current_user_v2', JSON.stringify(user));
      
      // 2. Load and merge cart items (we can merge guest items or load user's previous draft cart)
      const userCartKey = `schultz_cart_user_${user.email}`;
      const userWishKey = `schultz_wishlist_user_${user.email}`;
      
      const storedUserCart = localStorage.getItem(userCartKey);
      const guestCart = localStorage.getItem('schultz_cart_v2_guest');
      
      let finalCart = storedUserCart ? JSON.parse(storedUserCart) : [];
      if (guestCart) {
        const parsedGuest = JSON.parse(guestCart);
        if (parsedGuest.length > 0) {
          // Merge guest cart with user cart by matching unique IDs
          const merged = [...finalCart];
          parsedGuest.forEach((gItem: CartItem) => {
            const idx = merged.findIndex((m) => m.id === gItem.id);
            if (idx > -1) {
              merged[idx].quantity += gItem.quantity;
            } else {
              merged.push(gItem);
            }
          });
          finalCart = merged;
          // Clear current guest cart draft
          localStorage.setItem('schultz_cart_v2_guest', '[]');
        }
      }
      setCart(finalCart);

      const storedUserWish = localStorage.getItem(userWishKey);
      const guestWish = localStorage.getItem('schultz_wishlist_v2_guest');
      let finalWish = storedUserWish ? JSON.parse(storedUserWish) : [];
      if (guestWish) {
        const parsedGuestWish = JSON.parse(guestWish);
        finalWish = Array.from(new Set([...finalWish, ...parsedGuestWish]));
        localStorage.setItem('schultz_wishlist_v2_guest', '[]');
      }
      setWishlist(finalWish);
    } else {
      // Sign out
      setCurrentUser(null);
      localStorage.removeItem('schultz_current_user_v2');
      
      // Load visitor guest states
      const storedGuestCart = localStorage.getItem('schultz_cart_v2_guest');
      setCart(storedGuestCart ? JSON.parse(storedGuestCart) : []);

      const storedGuestWish = localStorage.getItem('schultz_wishlist_v2_guest');
      setWishlist(storedGuestWish ? JSON.parse(storedGuestWish) : []);
    }
  };

  // Administrative catalog and landing banner handlers
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProductsList((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleCreateProduct = (newProduct: Product) => {
    setProductsList((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
    // Also remove from active cart variations and bookmark wishlist
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    setWishlist((prevWish) => prevWish.filter((id) => id !== productId));
  };

  const handleUpdateHeroBanner = (updatedHero: HeroBanner) => {
    setHeroBanner(updatedHero);
  };

  // Add Item to Shopping Cart with precise variation support
  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    selectedDensity?: string,
    quantity: number = 1
  ) => {
    // Generate a unique ID that groups same variations together
    const variationKey = `${product.id}-${selectedSize || ''}-${selectedColor || ''}-${selectedDensity || ''}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === variationKey);

      if (existingIdx > -1) {
        // Increment quantity of existing variation
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += quantity;
        return newCart;
      } else {
        // Add as a completely new variation item in the cart
        return [
          ...prevCart,
          {
            id: variationKey,
            product,
            quantity,
            selectedSize,
            selectedColor,
            selectedDensity,
          },
        ];
      }
    });
  };

  // Manage Cart item quantities
  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove individual Item from Cart
  const handleRemoveCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Empty Cart completely
  const handleClearCart = () => {
    if (window.confirm('Deseja realmente limpar todos os itens do seu carrinho?')) {
      setCart([]);
    }
  };

  // Wishlist favorite toggler
  const handleToggleFavorite = (productId: string) => {
    setWishlist((prevWish) => {
      if (prevWish.includes(productId)) {
        return prevWish.filter((id) => id !== productId);
      } else {
        return [...prevWish, productId];
      }
    });
  };

  // Filter & Sort Logic for Products
  const filteredProducts = productsList.filter((product) => {
    // Category check
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    // Search check (name, desc, fullDesc, advantages, sku)
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = normalizedQuery
      ? product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.fullDescription.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery) ||
        product.advantages.some((adv) => adv.toLowerCase().includes(normalizedQuery))
      : true;

    return matchesCategory && matchesSearch;
  });

  // Apply visual sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') {
      return a.price - b.price;
    } else if (sortBy === 'price_desc') {
      return b.price - a.price;
    } else if (sortBy === 'discount') {
      const getDiscount = (p: Product) => (p.oldPrice ? p.oldPrice - p.price : 0);
      return getDiscount(b) - getDiscount(a);
    }
    return 0; // standard / none sorted
  });

  // Resolved list of Bookmarked Products
  const resolvedWishlistProducts = productsList.filter((p) => wishlist.includes(p.id));
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setNewsSuccess(true);
      setNewsEmail('');
      setTimeout(() => setNewsSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans antialiased text-gray-800" id="schultz-app-canvas">
      
      {/* HEADER SECTION */}
      <Header
        cart={cart}
        wishlistCount={wishlist.length}
        onCartToggle={() => setCartOpen(true)}
        onWishlistToggle={() => setWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const gridElement = document.getElementById('catalog-products-grid');
          if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        selectedCategory={selectedCategory}
        currentUser={currentUser}
        onAccountToggle={() => setAccountDrawerOpen(true)}
        promoBanner={promoBanner}
        onEditBannerClick={() => setAccountDrawerOpen(true)}
        logo={logo}
      />

      {/* CATEGORY & NAVIGATION SYSTEM */}
      <CategoryTabs
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        totalProductsCount={sortedProducts.length}
      />

      {/* DETAILED HERO / BRAZILIAN E-COMMERCE STYLE PROMOTIONAL BANNER */}
      <section className="bg-slate-50 py-4 sm:py-8 px-3 sm:px-4" id="hero-proposition">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
          
          {/* Main Hero Slider Banner */}
          <div className="bg-[#102244] rounded-2xl p-5 sm:p-10 lg:p-12 text-white shadow-md relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 border-b-4 border-[#72b63c]">
            
            {/* Real Background Image with premium lighting and products */}
            <img 
              src={heroBanner.backgroundImage || "/src/assets/images/hero_pos_bg_1779750303824.png"} 
              alt="Schultz Saúde Postural" 
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-55 xl:opacity-65"
              referrerPolicy="no-referrer"
            />

            {/* Premium medical-clinical blue/green ambient layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1e3d] via-[#102449]/95 to-[#163060]/30 pointer-events-none mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#09152b]/95 via-transparent to-transparent pointer-events-none"></div>

            {/* Ambient glowing circles behind */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-brand-blue-light/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Promo Content Left */}
            <div className="flex-1 flex flex-col items-start gap-3 sm:gap-4 text-left z-10 w-full font-sans">
              <div className="inline-flex items-center gap-1.5 bg-brand-green text-brand-blue-dark text-[10px] sm:text-[11px] font-black px-2.5 sm:px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 y-3 sm:w-3.5 sm:h-3.5 stroke-[2.5px]" />
                <span>{heroBanner.tagline || "Ofertas de Fábrica • Schultz Saúde"}</span>
              </div>
              
              <h1 className="text-xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight leading-tight sm:leading-none text-white max-w-lg">
                {heroBanner.titleLine1 || "Sua saúde postural em"} <br className="hidden sm:inline" />
                <span className="text-[#a1e459] underline decoration-wavy decoration-white/20">{heroBanner.titleHighlighted || "Primeiro Lugar"}</span>.
              </h1>
              
              <p className="text-[11px] sm:text-sm text-slate-200 leading-relaxed max-w-xl font-medium">
                {heroBanner.description || "Alivie dores na coluna, esporão de calcâneo e tensões cervicais hoje. Linha certificada de colchões ortopédicos, meias de compressão Sigvaris e travesseiros clínicos NASA fabricados sob rigoroso controle de ergonomia médica."}
              </p>

              {/* Installment highlights like ML banner */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                <div className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 flex items-center gap-1.5">
                  <span className="text-[#a1e459] text-xs sm:text-sm font-black">12x</span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-slate-100 font-mono">Sem juros</span>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-400/25 rounded-lg px-2 py-1 flex items-center gap-1.5">
                  <span className="text-emerald-300 text-xs sm:text-sm font-black">5% OFF</span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-emerald-100 font-mono">no PIX</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3.5 mt-2 w-full">
                <button
                  onClick={() => {
                    const gridElement = document.getElementById('catalog-products-grid');
                    if (gridElement) {
                      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-[#72b63c] hover:bg-brand-green-dark text-white font-extrabold px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  Ver Catálogo Completo
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                </button>
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold text-center sm:text-left">• Compra Segura via WhatsApp</span>
              </div>
            </div>

            {/* Promo Graphic Display Right (Bento Card Style Visual representing clinical care) - Styled neatly on mobile */}
            <div className="w-full lg:w-95 shrink-0 z-10 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-2.5 sm:gap-3">
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 text-slate-800 shadow-lg border border-white/10 flex items-start gap-3">
                <div className="p-2 sm:p-3 bg-brand-blue-light rounded-xl text-brand-blue shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[10px] sm:text-xs text-[#1d4391] uppercase tracking-wider">{heroBanner.badgeTitle1 || "Ergonomia Comprovada"}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    {heroBanner.badgeDesc1 || "Todos os equipamentos acompanham laudos e certificados ortopédicos de alinhamento de coluna."}
                  </p>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 text-slate-800 shadow-lg border border-white/10 flex items-start gap-3">
                <div className="p-2 sm:p-3 bg-brand-green-light rounded-xl text-brand-green shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green-dark" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[10px] sm:text-xs text-[#1d4391] uppercase tracking-wider">{heroBanner.badgeTitle2 || "Apoio De Medidas"}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    {heroBanner.badgeDesc2 || "Fale com nosso consultor no WhatsApp para guiar a densidade ideal do colchão ou tamanhos de meias."}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Info Grid below slider (Like ML/Boticario Trust Badges) - Beautifully 2x2 on mobile, 4 columns on desktop! */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" id="trust-pillars-row">
            <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-3xs flex items-center gap-2 sm:gap-3.5">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-sm sm:text-base text-brand-blue shrink-0">
                🚚
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Pronta-Entrega Rápida</p>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium text-left">Todo o Rio Grande do Sul</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-3xs flex items-center gap-2 sm:gap-3.5">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-sm sm:text-base text-[#72b63c] shrink-0">
                💬
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Pedir por WhatsApp</p>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium text-left">Com atendimento humano</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-3xs flex items-center gap-2 sm:gap-3.5">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-sm sm:text-base text-[#1d4391] shrink-0">
                🏷️
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Até 12x Sem Juros</p>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium text-left">Nos cartões Visa/Master/Elo</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-3xs flex items-center gap-2 sm:gap-3.5">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-sm sm:text-base text-emerald-600 shrink-0">
                🛡️
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Compra 100% Segura</p>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium text-left">Garantia Schultz de fábrica</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE PRODUCT CATALOG GRID */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12" id="catalog-products-grid">
        
        {/* Dynamic header title based on category */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 leading-tight">
              {!selectedCategory && 'Todos os Equipamentos & Produtos Ortopédicos'}
              {selectedCategory === 'beds_mattresses' && 'Camas & Colchões Ortopédicos Especiais'}
              {selectedCategory === 'pillows_cushions' && 'Travesseiros Clínicos & Almofadas Anatômicas'}
              {selectedCategory === 'footwear_shoes' && 'Tênis, Calçados Confortáveis & Palmilhas'}
              {selectedCategory === 'clothing_accessories' && 'Roupas de Compressão, Orteses & Suportes'}
            </h2>
            <p className="text-[11px] sm:text-sm text-gray-400 mt-1">
              {searchQuery 
                ? `Exibindo resultados da pesquisa por "${searchQuery}"` 
                : 'Selecione e explore itens terapêuticos de alto desempenho postural.'
              }
            </p>
          </div>

          {/* Quick tips label */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span className="w-2.5 h-2.5 bg-brand-green rounded-full"></span>
            <span>Estoque completo regulado para o Rio Grande do Sul</span>
          </div>
        </div>

        {/* Empty Search Results Prompt */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
            <Info className="w-12 h-12 text-brand-blue/30 mx-auto mb-4 stroke-1" />
            <h3 className="font-display font-bold text-lg text-gray-800 leading-tight">Nenhum produto correspondente</h3>
            <p className="text-sm text-gray-500 mt-2">
              Dificuldade em encontrar o colchão, travesseiro cervical ou órtese perfeita? Altere os termos da sua pesquisa ou fale com nosso suporte.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="bg-brand-blue-light hover:bg-brand-blue/15 text-brand-blue font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all active:scale-95"
                id="btn-all-products-fallback"
              >
                Limpar Todos os Filtros
              </button>
              <button
                onClick={() => {
                  const storeNumber = '555499836307';
                  const message = encodeURIComponent(`Olá! Estou buscando um item no catálogo (${searchQuery || 'especial'}) mas não o localizei. Vocês possuem em estoque?`);
                  window.open(`https://wa.me/${storeNumber}?text=${message}`, '_blank');
                }}
                className="bg-brand-green hover:bg-brand-green-dark text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                id="btn-ask-custom-stock"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                Perguntar por WhatsApp
              </button>
            </div>
          </div>
        ) : (
          /* Real Grid of items - Beautiful 2-column layout on mobile, expanding to multiples on larger displays */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {sortedProducts.map((product) => {
                const isItemInCart = cart.some((item) => item.product.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={wishlist.includes(product.id)}
                    onToggleFavorite={() => handleToggleFavorite(product.id)}
                    onSelectProduct={() => setSelectedProductDetails(product)}
                    isInCart={isItemInCart}
                    onAddToCart={(size?: string, color?: string, density?: string) => {
                      handleAddToCart(product, size, color, density, 1);
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </main>

      {/* ACCORDION FAQ / CLINIC ADVISORY INFO CHIP */}
      <section className="bg-brand-blue py-14 px-4 text-white" id="faq-clinical-section">
        <div className="w-full max-w-4xl mx-auto text-center flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              Como funciona nosso <span className="text-brand-green">Sistema de Pedidos via WhatsApp</span>?
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Desenvolvemos um fluxo incrivelmente simples e livre de atritos para garantir segurança no pagamento e certeza do modelo ideal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green text-brand-blue flex items-center justify-center font-bold font-display text-sm">
                1
              </span>
              <h3 className="font-display font-semibold text-sm">Monte seu Carrinho</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Navegue pelas abas, escolha a densidade da espuma, seu tamanho nas órteses ou calçados e clique em Adicionar.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green text-brand-blue flex items-center justify-center font-bold font-display text-sm">
                2
              </span>
              <h3 className="font-display font-semibold text-sm">Forneça seus Dados</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Abra o carrinho clicando no atalho, preencha seu endereço para entrega ou opte por retirada rápida na loja.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green text-brand-blue flex items-center justify-center font-bold font-display text-sm">
                3
              </span>
              <h3 className="font-display font-semibold text-sm">Feche via WhatsApp</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ao finalizar, seu WhatsApp abrirá automaticamente com o texto estruturado do pedido para nosso pronto envio!
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 inline-flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto w-full text-xs">
            <span className="text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex-shrink-0">
              ✓ Seguro e Humanizado
            </span>
            <p className="text-gray-300 leading-relaxed">
              Você não realiza nenhuma transação financeira prévia no site. Todo pagamento, faturamento fiscal e agendamento da entrega é alinhado sob controle humano.
            </p>
          </div>
        </div>
      </section>

      {/* PROMPT FOOTER BRANDING */}
      <footer className="bg-white border-t border-gray-100 font-sans" id="store-footer">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-gray-100">
            
            {/* Branding Column */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {logo ? (
                  <img 
                    src={logo} 
                    alt="Schultz Store Logo" 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200/80 shadow-3xs bg-white shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-white font-display font-bold text-base shadow-sm border-b-2 border-brand-green">
                    S
                  </div>
                )}
                <div>
                  <span className="text-lg font-display font-black text-brand-blue uppercase tracking-tight">
                    Schultz <span className="text-brand-green">Store</span>
                  </span>
                  <p className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold -mt-0.5">Conforto • Qualidade • Bem-Estar</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Fundada para aproximar tecnologia postural, colchões de alto padrão ergométrico e produtos de compressão e órtese. Desenvolvemos este catálogo on-line para que você escolha com calma no conforto de sua casa, comprando com agilidade pelo celular via WhatsApp.
              </p>
              
              <div className="text-[11px] text-gray-400 space-y-1">
                <p>📍 Matriz: Rua Professor Adão Oscar Wenbbleing, nº 3720, Centro, CEP 99140-000</p>
                <p>📧 Atendimento: schultzstoremkt@gmail.com</p>
                <p>📞 WhatsApp: (54) 9983-6307</p>
              </div>
            </div>

            {/* Quick Links Categories columns */}
            <div className="md:col-span-3">
              <h4 className="text-xs uppercase font-bold text-brand-blue tracking-widest mb-4">Nossas Categorias</h4>
              <ul className="text-xs text-gray-500 space-y-2.5">
                <li>
                  <button onClick={() => { setSelectedCategory('beds_mattresses'); }} className="hover:text-brand-green transition-colors cursor-pointer text-left">
                    Camas Articuladas e Colchões D45
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('pillows_cushions'); }} className="hover:text-brand-green transition-colors cursor-pointer text-left">
                    Travesseiros Cervicais NASA e Refluxo
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('footwear_shoes'); }} className="hover:text-brand-green transition-colors cursor-pointer text-left">
                    Tênis Leves e Sandálias Anti-Esporão
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('clothing_accessories'); }} className="hover:text-brand-green transition-colors cursor-pointer text-left">
                    Corretores de Postura e Meias de Compressão
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter form */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <h4 className="text-xs uppercase font-bold text-brand-blue tracking-widest">Informativos & Dicas</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Inscreva-se para receber novidades sobre saúde da coluna, ergonomia corporal ou avisos de descontos promocionais.
              </p>
              
              {newsSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-xs text-emerald-700 font-bold">
                  ✓ E-mail cadastrado com sucesso!
                </div>
              ) : (
                <form onSubmit={handleNewsSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail..."
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-gray-800 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-brand-blue hover:bg-brand-blue-dark text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer"
                  >
                    OK
                  </button>
                </form>
              )}
              <p className="text-[10px] text-gray-400 leading-normal">
                Prometemos não enviar spam. Você poderá cancelar a qualquer momento.
              </p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
            <div>
              <p>© 2026 SCHULTZ COMÉRCIO DE PRODUTOS TERAPÊUTICOS LTDA - ME. CNPJ 52.901.677/0001-02</p>
            </div>
            
            {/* Accepted payment badges */}
            <div className="flex items-center gap-2 text-xs">
              <span>Pagamentos Aceitos:</span>
              <span className="bg-gray-50 py-1 px-2 rounded-md border border-gray-100 font-bold text-gray-600">PIX</span>
              <span className="bg-gray-50 py-1 px-2 rounded-md border border-gray-100 font-bold text-gray-600">Crédito</span>
              <span className="bg-gray-50 py-1 px-2 rounded-md border border-gray-100 font-bold text-gray-600">Débito</span>
              <span className="bg-gray-50 py-1 px-2 rounded-md border border-gray-100 font-bold text-gray-600">Dinheiro</span>
            </div>
          </div>

        </div>
      </footer>

      {/* OVERLAY MODAL DETAILS CONTAINER */}
      <ProductModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        isFavorite={selectedProductDetails ? wishlist.includes(selectedProductDetails.id) : false}
        onToggleFavorite={() => {
          if (selectedProductDetails) {
            handleToggleFavorite(selectedProductDetails.id);
          }
        }}
        isInCart={selectedProductDetails ? cart.some(item => item.product.id === selectedProductDetails.id) : false}
        onAddToCart={(size, color, density, quantity) => {
          if (selectedProductDetails) {
            handleAddToCart(selectedProductDetails, size, color, density, quantity);
          }
        }}
      />

      {/* OVERLAY CART DRAWER CONTAINER */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* OVERLAY WISHLIST FAVORITES CONTAINER */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={resolvedWishlistProducts}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProduct={(product) => setSelectedProductDetails(product)}
      />

      {/* OVERLAY USER ACCOUNT CABINET CONTAINER */}
      <AccountDrawer
        isOpen={accountDrawerOpen}
        onClose={() => setAccountDrawerOpen(false)}
        currentUser={currentUser}
        onLogin={handleUserLoginChange}
        onLogout={() => handleUserLoginChange(null)}
        promoBanner={promoBanner}
        onUpdateBanner={(updated) => setPromoBanner(updated)}
        heroBanner={heroBanner}
        onUpdateHeroBanner={handleUpdateHeroBanner}
        productsList={productsList}
        onUpdateProduct={handleUpdateProduct}
        onCreateProduct={handleCreateProduct}
        onDeleteProduct={handleDeleteProduct}
        logo={logo}
        onUpdateLogo={setLogo}
      />

      {/* MOBILE APP-LIKE BOTTOM MENU BAR */}
      <div className="h-20 md:hidden" /> {/* Navigation spacer to prevent overlay on content */}
      
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100/80 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden px-2 py-2 flex items-center justify-around safe-bottom" 
        id="mobile-app-bottom-navbar"
      >
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center flex-1 gap-1 py-1 px-2 select-none active:scale-95 transition-all text-center focus:outline-none focus:ring-0 ${
            !selectedCategory && !searchQuery
              ? 'text-brand-blue font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="btn-nav-home"
        >
          <Home className="w-5 h-5 stroke-[2.2px]" />
          <span className="text-[10px] tracking-tight font-bold">Início</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('desktop-category-bar');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className={`flex flex-col items-center justify-center flex-1 gap-1 py-1 px-2 select-none active:scale-95 transition-all text-center focus:outline-none focus:ring-0 ${
            selectedCategory !== null
              ? 'text-brand-blue font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="btn-nav-categories"
        >
          <Grid className="w-5 h-5 stroke-[2.2px]" />
          <span className="text-[10px] tracking-tight font-bold">Categorias</span>
        </button>

        <button
          onClick={() => setWishlistOpen(true)}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-1 px-2 select-none active:scale-95 transition-all text-slate-500 hover:text-slate-800 text-center focus:outline-none focus:ring-0 relative"
          id="btn-nav-wishlist"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 stroke-[2.2px] ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-bold">Favoritos</span>
        </button>

        <button
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-1 px-2 select-none active:scale-95 transition-all text-slate-500 hover:text-slate-800 text-center focus:outline-none focus:ring-0 relative"
          id="btn-nav-cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-[2.2px] text-[#1d4391]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#72b63c] text-white text-[9.5px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-bold col-span-1">Carrinho</span>
        </button>

        <button
          onClick={() => setAccountDrawerOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 gap-1 py-1 px-2 select-none active:scale-95 transition-all text-center focus:outline-none focus:ring-0 ${
            accountDrawerOpen ? 'text-brand-blue font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
          id="btn-nav-profile"
        >
          <div className="relative">
            <User className={`w-5 h-5 stroke-[2.2px] ${currentUser ? 'text-brand-blue fill-brand-blue/10' : ''}`} />
            {currentUser?.role === 'admin' ? (
              <span className="absolute -top-1 -right-1 bg-amber-500 w-2.5 h-2.5 rounded-full border border-white" />
            ) : currentUser ? (
              <span className="absolute -top-1 -right-1 bg-emerald-500 w-2.5 h-2.5 rounded-full border border-white" />
            ) : null}
          </div>
          <span className="text-[10px] tracking-tight font-bold">Perfil</span>
        </button>
      </div>

      {/* FLOATING WHATSAPP BUTTON WITH STORE CONTACT */}
      <a
        href="https://api.whatsapp.com/send?phone=555499836307&text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+os+produtos+da+Schultz+Store."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 max-md:bottom-24 max-md:right-5 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:bg-[#20ba59] hover:shadow-[0_8px_24px_rgba(37,211,102,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer"
        title="Fale conosco no WhatsApp"
        id="whatsapp-floating-btn"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

    </div>
  );
}
