import React, { useState, useEffect } from 'react';
import { X, User, ShieldCheck, LogIn, UserPlus, LogOut, Info, Settings, Save, CheckCircle2, AlertCircle, Eye, EyeOff, Plus, Trash2, Edit, Image, FileText, ShoppingBag, Tag, Sparkles, ChevronLeft, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount, PromoBanner, HeroBanner, Product, ProductCategory } from '../types';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  promoBanner: PromoBanner;
  onUpdateBanner: (banner: PromoBanner) => void;
  heroBanner: HeroBanner;
  onUpdateHeroBanner: (banner: HeroBanner) => void;
  productsList: Product[];
  onUpdateProduct: (product: Product) => void;
  onCreateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  logo: string;
  onUpdateLogo: (newLogo: string) => void;
}

export default function AccountDrawer({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  promoBanner,
  onUpdateBanner,
  heroBanner,
  onUpdateHeroBanner,
  productsList,
  onUpdateProduct,
  onCreateProduct,
  onDeleteProduct,
  logo,
  onUpdateLogo,
}: AccountDrawerProps) {
  // Tab states for guests: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Administrative navigation tabs: 'catalog' | 'heroBanner' | 'topBanner'
  const [adminSubTab, setAdminSubTab] = useState<'catalog' | 'heroBanner' | 'topBanner'>('catalog');
  
  // Catalog manager subviews state: 'list' | 'add' | 'edit'
  const [catalogView, setCatalogView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedEditProduct, setSelectedEditProduct] = useState<Product | null>(null);

  // Form input states (Auth)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states (Product Catalog CRUD)
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('beds_mattresses');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFullDescription, setProdFullDescription] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOldPrice, setProdOldPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodAdvantages, setProdAdvantages] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodDensities, setProdDensities] = useState('');
  const [prodColors, setProdColors] = useState('');
  const [prodInStock, setProdInStock] = useState(true);

  // Catalog search/category filter inside drawer
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      showFeedback('Por favor, envie apenas arquivos de imagem!', 'error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 3.5 * 1024 * 1024) {
      showFeedback('A imagem excede 3.5MB. Escolha uma imagem menor para armazenamento local rápido.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProdImage(event.target.result as string);
        showFeedback('Imagem local carregada com sucesso!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Upload handlers for store Brand Logo
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const handleLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = () => {
    setIsDraggingLogo(false);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processLogoFile(file);
    } else {
      showFeedback('Por favor, envie apenas arquivos de imagem!', 'error');
    }
  };

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const processLogoFile = (file: File) => {
    if (file.size > 3.5 * 1024 * 1024) {
      showFeedback('A imagem excede 3.5MB. Escolha uma menor.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpdateLogo(event.target.result as string);
        showFeedback('Logo da Schultz Ortopédicos atualizada com sucesso!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Admin Top Banner settings state
  const [bannerText, setBannerText] = useState(promoBanner.text);
  const [bannerBg, setBannerBg] = useState(promoBanner.bgColor);
  const [bannerEmoji, setBannerEmoji] = useState(promoBanner.emoji);
  const [bannerActive, setBannerActive] = useState(promoBanner.active);

  // Admin BIG Hero Banner settings state
  const [heroTagline, setHeroTagline] = useState(heroBanner?.tagline || '');
  const [heroTitleLine1, setHeroTitleLine1] = useState(heroBanner?.titleLine1 || '');
  const [heroTitleHighlighted, setHeroTitleHighlighted] = useState(heroBanner?.titleHighlighted || '');
  const [heroDescription, setHeroDescription] = useState(heroBanner?.description || '');
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(heroBanner?.backgroundImage || '');
  const [heroBadgeTitle1, setHeroBadgeTitle1] = useState(heroBanner?.badgeTitle1 || '');
  const [heroBadgeDesc1, setHeroBadgeDesc1] = useState(heroBanner?.badgeDesc1 || '');
  const [heroBadgeTitle2, setHeroBadgeTitle2] = useState(heroBanner?.badgeTitle2 || '');
  const [heroBadgeDesc2, setHeroBadgeDesc2] = useState(heroBanner?.badgeDesc2 || '');

  // Sync banner edit states when promoBanner prop changes
  useEffect(() => {
    setBannerText(promoBanner.text);
    setBannerBg(promoBanner.bgColor);
    setBannerEmoji(promoBanner.emoji);
    setBannerActive(promoBanner.active);
  }, [promoBanner]);

  // Sync hero edit states when heroBanner prop changes
  useEffect(() => {
    if (heroBanner) {
      setHeroTagline(heroBanner.tagline);
      setHeroTitleLine1(heroBanner.titleLine1);
      setHeroTitleHighlighted(heroBanner.titleHighlighted);
      setHeroDescription(heroBanner.description);
      setHeroBackgroundImage(heroBanner.backgroundImage);
      setHeroBadgeTitle1(heroBanner.badgeTitle1);
      setHeroBadgeDesc1(heroBanner.badgeDesc1);
      setHeroBadgeTitle2(heroBanner.badgeTitle2);
      setHeroBadgeDesc2(heroBanner.badgeDesc2);
    }
  }, [heroBanner]);

  // Handle local user database
  const getStoredAccounts = (): UserAccount[] => {
    try {
      const stored = localStorage.getItem('schultz_accounts_v3');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default seed accounts
    const seed: UserAccount[] = [
      { name: 'Administrador Schultz', email: 'schultzstoremkt@gmail.com', password: 'Mudar@senha', role: 'admin' },
      { name: 'João da Silva', email: 'joao@gmail.com', password: '123', role: 'user' }
    ];
    localStorage.setItem('schultz_accounts_v3', JSON.stringify(seed));
    return seed;
  };

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showFeedback('Preencha todos os campos!', 'error');
      return;
    }

    const accounts = getStoredAccounts();
    const match = accounts.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase().trim() && acc.password === password
    );

    if (match) {
      onLogin(match);
      showFeedback(`Bem vindo de volta, ${match.name}!`, 'success');
      setTimeout(() => {
        onClose();
        setPassword('');
      }, 1000);
    } else {
      showFeedback('E-mail ou senha incorretos!', 'error');
    }
  };

  const handleFormRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const accounts = getStoredAccounts();
    const exists = accounts.some((acc) => acc.email.toLowerCase() === email.toLowerCase().trim());

    if (exists) {
      showFeedback('Este e-mail já está cadastrado!', 'error');
      return;
    }

    const newAccount: UserAccount = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: isAdminRole ? 'admin' : 'user',
    };

    const updated = [...accounts, newAccount];
    localStorage.setItem('schultz_accounts_v2', JSON.stringify(updated));

    onLogin(newAccount);
    showFeedback('Conta criada com sucesso! Aproveite seus benefícios de carrinho salvo.', 'success');
    
    // Clear inputs
    setName('');
    setEmail('');
    setPassword('');
    setIsAdminRole(false);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Quick login helper removed by request

  // Submit top banner modifications
  const handleBannerSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerText.trim()) {
      showFeedback('O texto da faixa topo não pode ser vazio!', 'error');
      return;
    }

    onUpdateBanner({
      text: bannerText.trim(),
      bgColor: bannerBg,
      textColor: 'text-white',
      emoji: bannerEmoji.trim() || '💡',
      active: bannerActive,
    });

    showFeedback('Faixa de aviso do topo publicada com sucesso!', 'success');
  };

  // Submit Big Hero Banner modifications
  const handleHeroSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroTitleLine1.trim() || !heroTitleHighlighted.trim() || !heroDescription.trim()) {
      showFeedback('Por favor preencha todos os campos estruturais do Banner Grande!', 'error');
      return;
    }

    onUpdateHeroBanner({
      tagline: heroTagline.trim(),
      titleLine1: heroTitleLine1.trim(),
      titleHighlighted: heroTitleHighlighted.trim(),
      description: heroDescription.trim(),
      backgroundImage: heroBackgroundImage.trim() || '/src/assets/images/hero_pos_bg_1779750303824.png',
      badgeTitle1: heroBadgeTitle1.trim() || 'Ergonomia Comprovada',
      badgeDesc1: heroBadgeDesc1.trim() || 'Laudos clínicos e certificados ortopédicos inclusos.',
      badgeTitle2: heroBadgeTitle2.trim() || 'Apoio De Medidas',
      badgeDesc2: heroBadgeDesc2.trim() || 'Fale com nosso consultor no WhatsApp e confira tamanhos.',
    });

    showFeedback('Banner Grande Principal atualizado com sucesso!', 'success');
  };

  // Switch to Create product mode
  const initCreateProduct = () => {
    setProdName('');
    setProdSku(`SCH-${Math.floor(1000 + Math.random() * 9000)}`);
    setProdCategory('beds_mattresses');
    setProdDescription('');
    setProdFullDescription('');
    setProdPrice('');
    setProdOldPrice('');
    setProdImage('https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop');
    setProdAdvantages('Certificado Clínico, Alinha Coluna');
    setProdSizes('Casal, Solteiro, Queen, King');
    setProdDensities('D33, D45');
    setProdColors('Branco, Cinza');
    setProdInStock(true);
    setCatalogView('add');
  };

  // Switch to Edit product mode
  const initEditProduct = (product: Product) => {
    setSelectedEditProduct(product);
    setProdName(product.name);
    setProdSku(product.sku);
    setProdCategory(product.category);
    setProdDescription(product.description || '');
    setProdFullDescription(product.fullDescription || '');
    setProdPrice(product.price.toString());
    setProdOldPrice(product.oldPrice ? product.oldPrice.toString() : '');
    setProdImage(product.image);
    setProdAdvantages(product.advantages ? product.advantages.join(', ') : '');
    setProdSizes(product.sizes ? product.sizes.join(', ') : '');
    setProdDensities(product.densities ? product.densities.join(', ') : '');
    setProdColors(product.colors ? product.colors.join(', ') : '');
    setProdInStock(product.inStock);
    setCatalogView('edit');
  };

  // Submit Create or Edit Product
  const handleProductFormSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice.trim()) {
      showFeedback('Nome do Equipamento e Preço são obrigatórios!', 'error');
      return;
    }

    const priceNum = parseFloat(prodPrice.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      showFeedback('Preço inválido! Insira um valor maior que zero.', 'error');
      return;
    }

    const oldPriceNum = prodOldPrice ? parseFloat(prodOldPrice.replace(',', '.')) : undefined;

    const parsedAdvantages = prodAdvantages.split(',').map(s => s.trim()).filter(Boolean);
    const parsedSizes = prodSizes.split(',').map(s => s.trim()).filter(Boolean);
    const parsedDensities = prodDensities.split(',').map(s => s.trim()).filter(Boolean);
    const parsedColors = prodColors.split(',').map(s => s.trim()).filter(Boolean);

    if (catalogView === 'add') {
      const generatedId = `new-prod-${Date.now()}`;
      const newProduct: Product = {
        id: generatedId,
        name: prodName.trim(),
        sku: prodSku.trim() || `SCH-${Math.floor(1000 + Math.random() * 9000)}`,
        category: prodCategory,
        description: prodDescription.trim() || 'Equipamento terapêutico premium para reabilitação postural.',
        fullDescription: prodFullDescription.trim() || 'Equipamento desenvolvido sob rigoroso acompanhamento ergonômico e fisioterápico de alta densidade.',
        price: priceNum,
        oldPrice: oldPriceNum,
        image: prodImage.trim() || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600',
        advantages: parsedAdvantages.length > 0 ? parsedAdvantages : ['Ergonomia Schultz', 'Recomendado'],
        sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
        densities: parsedDensities.length > 0 ? parsedDensities : undefined,
        colors: parsedColors.length > 0 ? parsedColors : undefined,
        inStock: prodInStock,
      };

      onCreateProduct(newProduct);
      showFeedback(`Equipamento "${newProduct.name}" cadastrado e publicado com sucesso!`, 'success');
      setCatalogView('list');
    } else if (catalogView === 'edit' && selectedEditProduct) {
      const updatedProduct: Product = {
        ...selectedEditProduct,
        name: prodName.trim(),
        sku: prodSku.trim(),
        category: prodCategory,
        description: prodDescription.trim(),
        fullDescription: prodFullDescription.trim(),
        price: priceNum,
        oldPrice: oldPriceNum,
        image: prodImage.trim(),
        advantages: parsedAdvantages,
        sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
        densities: parsedDensities.length > 0 ? parsedDensities : undefined,
        colors: parsedColors.length > 0 ? parsedColors : undefined,
        inStock: prodInStock,
      };

      onUpdateProduct(updatedProduct);
      showFeedback(`Equipamento "${updatedProduct.name}" atualizado e publicado de imediato!`, 'success');
      setCatalogView('list');
    }
  };

  const executeDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Atenção: deseja EXCLUIR permanentemente o produto "${productName}" do catálogo?`)) {
      onDeleteProduct(productId);
      showFeedback('Equipamento removido do catálogo com sucesso!', 'success');
    }
  };

  const bannerColorOptions = [
    { name: 'Militar Profissional', value: 'bg-radial from-slate-900 via-slate-800 to-slate-950 text-white' },
    { name: 'Azul Schultz', value: 'bg-[#1d4391] text-white' },
    { name: 'Verde Ortopédico', value: 'bg-[#72b63c] text-white' },
    { name: 'Vermelho Cuidados', value: 'bg-red-600 text-white' },
    { name: 'Alerta Especial', value: 'bg-amber-500 text-slate-950' },
  ];

  const emojiOptions = ['🩺', '🔥', '🚨', '🛌', '👟', '🚚', '📦', '🛡️', '⚠️', '🎉', '💡', '🌟'];

  const filteredProducts = productsList.filter(p => {
    if (!catalogSearch) return true;
    return p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
           p.sku.toLowerCase().includes(catalogSearch.toLowerCase());
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" id="account-drawer-root">
          {/* Backdrop screen lock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Slide-In Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10"
            id="account-drawer-panel"
          >
            {/* Upper Drawer Navigation Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl">
                  {currentUser?.role === 'admin' ? (
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  ) : (
                    <User className="w-5 h-5 text-brand-blue" />
                  )}
                </div>
                <div>
                  <h2 className="font-sans font-black text-sm sm:text-base text-slate-950 leading-tight">
                    {currentUser ? 'Painel do Usuário' : 'Identificação do Cliente'}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                    {currentUser ? `${currentUser.role === 'admin' ? 'Painel de Gestão Schultz' : 'Área do Cliente Schultz'}` : 'Acesse ou Registre-se'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                id="account-drawer-close"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Interactive Forms Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Feedback Alert Row */}
              <AnimatePresence>
                {feedbackMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3.5 rounded-xl border flex items-start gap-2 text-xs font-semibold ${
                      feedbackMsg.type === 'success'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                        : 'bg-rose-50 border-rose-100 text-rose-800'
                    }`}
                  >
                    {feedbackMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>{feedbackMsg.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* VIEW 1: USER IS NOT LOGGED IN */}
              {!currentUser ? (
                <div className="flex flex-col gap-5">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600">
                    <p className="font-bold text-slate-800 mb-1 leading-normal">
                      🛒 Guardar seu carrinho e wishlist?
                    </p>
                    <p className="font-medium leading-relaxed">
                      Crie uma conta na Schultz Ortopédicos para sincronizar automaticamente os produtos selecionados e acessá-los em qualquer dispositivo.
                    </p>
                  </div>

                  {/* Tab Selector Buttons */}
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center justify-between gap-1">
                    <button
                      onClick={() => { setActiveTab('login'); setFeedbackMsg(null); }}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'login'
                          ? 'bg-white text-[#1d4391] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Entrar
                    </button>
                    <button
                      onClick={() => { setActiveTab('register'); setFeedbackMsg(null); }}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'register'
                          ? 'bg-white text-[#1d4391] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Criar nova conta
                    </button>
                  </div>

                  {/* LOGIN FORM VIEW */}
                  {activeTab === 'login' && (
                    <motion.form 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      onSubmit={handleFormLogin} 
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">E-mail Cadastrado *</label>
                        <input
                          type="email"
                          placeholder="exemplo@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Senha de Acesso *</label>
                        <div className="relative w-full">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Sua senha de acesso"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-black py-3 rounded-xl transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider"
                      >
                        Acessar Conta
                      </button>
                    </motion.form>
                  )}

                  {/* SIGNUP FORM VIEW */}
                  {activeTab === 'register' && (
                    <motion.form 
                      initial={{ opacity: 0, x: 10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      onSubmit={handleFormRegister} 
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Nome Completo *</label>
                        <input
                          type="text"
                          placeholder="Como quer ser chamado(a)?"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">E-mail principal *</label>
                        <input
                          type="email"
                          placeholder="seuemail@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Defina uma senha *</label>
                        <input
                          type="password"
                          placeholder="Mínimo 3 caracteres"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                        />
                      </div>

                      {/* Explicit request to toggle Admin account */}
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/50 flex items-center justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Settings className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-black text-amber-900 leading-tight uppercase">Registrar como Administrador</p>
                            <p className="text-[10px] text-amber-700 leading-normal font-medium mt-0.5">Deseja autorização administrativa para gerenciar produtos e banners?</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isAdminRole}
                          onChange={(e) => setIsAdminRole(e.target.checked)}
                          className="w-4 h-4 text-brand-blue rounded border-amber-300 focus:ring-amber-500 accent-amber-600 shrink-0 cursor-pointer"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#72b63c] hover:bg-brand-green-dark text-white font-black py-3 rounded-xl transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider"
                      >
                        Registrar e Acessar
                      </button>
                    </motion.form>
                  )}

                </div>
              ) : (
                
                /* VIEW 2: LOGGED IN SECTION */
                <div className="space-y-6">
                  
                  {/* Premium user identity banner card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1d4391] to-brand-blue-dark text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -mr-5 -mt-5 blur-xl pointer-events-none" />
                    
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-lg font-bold font-sans border border-white/20">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-sans font-black text-sm sm:text-base text-white">{currentUser.name}</h3>
                        <p className="text-xs text-white/70">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1 text-emerald-300 text-[11px] sm:text-xs">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500/10" />
                        <span>Sessão de Painel de Produção</span>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-slate-950" />
                        {currentUser.role === 'admin' ? 'Administrador' : 'Cliente Vip'}
                      </span>
                    </div>
                  </div>

                  {/* ADMIN CONTROLS ENGINE */}
                  {currentUser.role === 'admin' ? (
                    <div className="space-y-4">
                      
                      {/* Nav System Switch for Admin Modules: Products Model, Banner Model, Little Banner Model */}
                      <div className="flex border-b border-slate-200 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => { setAdminSubTab('catalog'); setCatalogView('list'); }}
                          className={`flex-1 py-1.5 text-[9.5px] uppercase tracking-wider font-black rounded-lg text-center transition-all cursor-pointer ${
                            adminSubTab === 'catalog' ? 'bg-white text-[#1d4391] shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          📦 Catálogo
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminSubTab('heroBanner')}
                          className={`flex-1 py-1.5 text-[9.5px] uppercase tracking-wider font-black rounded-lg text-center transition-all cursor-pointer ${
                            adminSubTab === 'heroBanner' ? 'bg-white text-[#1d4391] shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          🖼️ Banner Grande
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminSubTab('topBanner')}
                          className={`flex-1 py-1.5 text-[9.5px] uppercase tracking-wider font-black rounded-lg text-center transition-all cursor-pointer ${
                            adminSubTab === 'topBanner' ? 'bg-white text-[#1d4391] shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          📢 Logo & Faixa Topo
                        </button>
                      </div>

                      {/* CONTENT OF TAB A: DYNAMIC CATALOG CRUD MANAGER */}
                      {adminSubTab === 'catalog' && (
                        <div className="space-y-4">
                          
                          {/* SUBLAYOUT A1: PRODUCT LIST WITH SEARCH & ADD TRIGGER */}
                          {catalogView === 'list' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Produtos do Catálogo</h4>
                                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">Atualmente {productsList.length} itens no ar.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={initCreateProduct}
                                  className="bg-[#72b63c] hover:bg-brand-green-dark text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                                  Novo Equipamento
                                </button>
                              </div>

                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Buscar no Catálogo (Nome ou SKU)"
                                  value={catalogSearch}
                                  onChange={(e) => setCatalogSearch(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                                />
                              </div>

                              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                                {filteredProducts.length === 0 ? (
                                  <div className="p-6 bg-slate-50 text-slate-400 text-center text-xs rounded-xl font-medium border border-dashed">
                                    Nenhum produto encontrado na pesquisa.
                                  </div>
                                ) : (
                                  filteredProducts.map((p) => (
                                    <div key={p.id} className="p-2 sm:p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-3 shadow-3xs">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <img
                                          src={p.image}
                                          alt={p.name}
                                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0 select-none"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="min-w-0">
                                          <p className="text-xs font-extrabold text-slate-900 truncate leading-snug">{p.name}</p>
                                          <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">
                                            {p.sku} • {p.category === 'beds_mattresses' ? 'Cama/Colchão' : p.category === 'pillows_cushions' ? 'Travesseiro' : p.category === 'footwear_shoes' ? 'Calçado' : 'Roupas'}
                                          </p>
                                          <p className="text-[11px] text-brand-blue font-extrabold mt-0.5">
                                            R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            {p.oldPrice && <span className="text-slate-400 font-medium line-through ml-1.5">R$ {p.oldPrice.toLocaleString('pt-BR')}</span>}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => initEditProduct(p)}
                                          className="p-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-500 rounded-lg transition-all cursor-pointer"
                                          title="Editar Detalhes"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => executeDeleteProduct(p.id, p.name)}
                                          className="p-1.5 bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-500 rounded-lg transition-all cursor-pointer"
                                          title="Deletar Produto"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}

                          {/* SUBLAYOUT A2: DYNAMIC ADD & EDIT PRODUCT FORM INTERFACE */}
                          {(catalogView === 'add' || catalogView === 'edit') && (
                            <motion.form
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              onSubmit={handleProductFormSave}
                              className="p-4 bg-slate-50/70 border border-slate-200/50 rounded-2xl space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => setCatalogView('list')}
                                  className="text-[10.5px] uppercase font-black text-brand-blue flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                  Voltar para Lista
                                </button>
                                <span className="text-[10px] uppercase font-black text-slate-400 font-mono">
                                  {catalogView === 'add' ? 'Adicionar Produto' : 'Editando Produto'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nome do Equipamento *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ex: Novo Colchão Ortopédico"
                                    value={prodName}
                                    onChange={(e) => setProdName(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Código Sku (Estoque) *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ex: SCH-4570"
                                    value={prodSku}
                                    onChange={(e) => setProdSku(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800 font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Preço de Venda (R$ PIX) *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ex: 2490.00"
                                    value={prodPrice}
                                    onChange={(e) => setProdPrice(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800 font-mono"
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Preço de Tabela (Sem Desconto)</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: 2990.00 (Opcional)"
                                    value={prodOldPrice}
                                    onChange={(e) => setProdOldPrice(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800 font-mono"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Categoria do Equipamento</label>
                                <select
                                  value={prodCategory}
                                  onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                                  className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                >
                                  <option value="beds_mattresses">Camas & Colchões Ortopédicos</option>
                                  <option value="pillows_cushions">Travesseiros & Almofadas NASA</option>
                                  <option value="footwear_shoes">Calçados Ortopédicos Conforto</option>
                                  <option value="clothing_accessories">Meias Sigvaris & Suportes</option>
                                </select>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Descrição Curta (Vitrine) *</label>
                                <input
                                  type="text"
                                  placeholder="Destaque de 2 linhas exibido nos cards da vitrine..."
                                  value={prodDescription}
                                  onChange={(e) => setProdDescription(e.target.value)}
                                  className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Dossiê Clínico do Equipamento (Texto de Detalhes)</label>
                                <textarea
                                  rows={3}
                                  placeholder="Descrição técnica completa exibida no modal de detalhes clínicos..."
                                  value={prodFullDescription}
                                  onChange={(e) => setProdFullDescription(e.target.value)}
                                  className="bg-white border text-xs p-2.5 rounded-lg text-slate-800"
                                />
                              </div>

                              <div className="flex flex-col gap-2.5 p-3.5 bg-slate-100/60 rounded-xl border border-slate-200/40">
                                <div>
                                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block mb-1">Imagem do Equipamento</label>
                                  <p className="text-[10px] text-slate-400 font-medium leading-none mb-2">Edite colando o link de internet ou enviando o arquivo do seu dispositivo.</p>
                                </div>

                                {/* Option A: Link URL */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">🔗 Link URL de Imagem (Web):</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: https://images.unsplash.com/... ou cole aqui"
                                    value={prodImage.startsWith('data:') ? '' : prodImage}
                                    onChange={(e) => setProdImage(e.target.value)}
                                    className="bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg text-slate-800 text-[10.5px] outline-none focus:border-[#1d4391] min-w-0"
                                  />
                                  {prodImage.startsWith('data:') && (
                                    <p className="text-[9.5px] text-brand-blue font-bold">💡 Atualmente usando uma imagem carregada por upload direto.</p>
                                  )}
                                </div>

                                {/* Option B: Direct File Upload Dropzone */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">📤 Enviar Arquivo Direto:</label>
                                  <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('drawer-product-file-upload')?.click()}
                                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 select-none ${
                                      isDragging 
                                        ? 'border-brand-blue bg-brand-blue/5 scale-[0.99]' 
                                        : 'border-slate-300 hover:border-brand-blue bg-white hover:bg-slate-50/50'
                                    }`}
                                  >
                                    <input
                                      type="file"
                                      id="drawer-product-file-upload"
                                      accept="image/*"
                                      onChange={handleFileSelect}
                                      className="hidden"
                                    />
                                    <Upload className={`w-6 h-6 ${isDragging ? 'text-brand-blue animate-bounce' : 'text-slate-400'}`} />
                                    <div>
                                      <p className="text-[11px] font-extrabold text-[#1d4391]">
                                        Clique para selecionar ou arraste o arquivo aqui
                                      </p>
                                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                        Suporta PNG, JPG, WEBP de até 3.5MB
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Image Preview & Quick Reset */}
                                {prodImage && (
                                  <div className="p-2 sm:p-2.5 bg-white border border-slate-200/60 rounded-lg flex items-center justify-between gap-3 shadow-3xs">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <img
                                        src={prodImage}
                                        alt="Preview"
                                        className="w-12 h-12 object-cover rounded-md border border-slate-100 shrink-0 select-none bg-slate-50"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Previsualização</p>
                                        <p className="text-[9px] text-slate-400 font-semibold truncate max-w-[200px] mt-1">
                                          {prodImage.startsWith('data:') ? 'Imagem Local por Upload' : prodImage}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProdImage('');
                                        showFeedback('Imagem limpa!', 'success');
                                      }}
                                      className="text-[9.5px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/75 px-2 py-1 rounded transition-all cursor-pointer"
                                    >
                                      Limpar
                                    </button>
                                  </div>
                                )}

                                {/* Quick Assist Presets */}
                                <div className="border-t border-slate-200/50 pt-2">
                                  <p className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">💡 Presets da Schultz</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProdImage('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600');
                                        showFeedback('Aplicado preset de Colchão Ortopédico!', 'success');
                                      }}
                                      className="bg-white border border-slate-200 text-[9px] font-bold px-2 py-1 rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                                    >
                                      🛏️ Colchão Presét 1
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProdImage('https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600');
                                        showFeedback('Aplicado preset de Suíte Schultz!', 'success');
                                      }}
                                      className="bg-white border border-slate-200 text-[9px] font-bold px-2 py-1 rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                                    >
                                      🛏️ Quarto Casal Presét
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProdImage('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600');
                                        showFeedback('Aplicado preset de Travesseiro Clínico!', 'success');
                                      }}
                                      className="bg-white border border-slate-200 text-[9px] font-bold px-2 py-1 rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                                    >
                                      🛌 Travesseiro Presét
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProdImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600');
                                        showFeedback('Aplicado preset de Calçado Ortopédico!', 'success');
                                      }}
                                      className="bg-white border border-slate-200 text-[9px] font-bold px-2 py-1 rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                                    >
                                      👟 Calçado Presét
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Destaques (Tags, Separe por vírgulas)</label>
                                  <input
                                    type="text"
                                    placeholder="Garantia 10 anos, Certificado Nasa"
                                    value={prodAdvantages}
                                    onChange={(e) => setProdAdvantages(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tamanhos (Opcional, Separe por vírgulas)</label>
                                  <input
                                    type="text"
                                    placeholder="P, M, G ou Solteiro, Casal, King"
                                    value={prodSizes}
                                    onChange={(e) => setProdSizes(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Densidades (Separe por vírgulas)</label>
                                  <input
                                    type="text"
                                    placeholder="D28, D33, D45 ou Macio, Firme"
                                    value={prodDensities}
                                    onChange={(e) => setProdDensities(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Cores (Separe por vírgulas)</label>
                                  <input
                                    type="text"
                                    placeholder="Branco, Cinza, Azul"
                                    value={prodColors}
                                    onChange={(e) => setProdColors(e.target.value)}
                                    className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                  />
                                </div>
                              </div>

                              <div className="p-2 ml-1 bg-white rounded-lg border flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-500">Disponível em Estoque?</span>
                                <input
                                  type="checkbox"
                                  checked={prodInStock}
                                  onChange={(e) => setProdInStock(e.target.checked)}
                                  className="w-4 h-4 text-brand-blue cursor-pointer"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full bg-[#72b63c] hover:bg-brand-green-dark text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                              >
                                {catalogView === 'add' ? 'Cadastrar e Publicar' : 'Salvar Alterações'}
                              </button>
                            </motion.form>
                          )}

                        </div>
                      )}

                      {/* CONTENT OF TAB B: WORKSHOP FOR BANNER GRANDE (BIG HERO BANNER) */}
                      {adminSubTab === 'heroBanner' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/70 to-amber-100/30 rounded-2xl border border-amber-200/50 space-y-4">
                          <div className="flex items-center gap-2">
                            <Image className="w-5 h-5 text-amber-700" />
                            <h4 className="font-sans font-black text-xs sm:text-sm text-amber-900 leading-tight">
                              Banner Grande Principal (Hero Central)
                            </h4>
                          </div>

                          <p className="text-[11px] font-medium leading-relaxed text-amber-800">
                            Configure o banner principal que aparece na página inicial do site! Você pode mudar os textos, o título em destaque, a imagem de fundo e as pequenas caixas/bento de informações klinicas.
                          </p>

                          <form onSubmit={handleHeroSave} className="space-y-3.5">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Selo de Chamada (Superior)</label>
                              <input
                                type="text"
                                value={heroTagline}
                                onChange={(e) => setHeroTagline(e.target.value)}
                                className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                placeholder="Ofertas de Fábrica • Schultz Saúde"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Título (Linha 1)</label>
                                <input
                                  type="text"
                                  value={heroTitleLine1}
                                  onChange={(e) => setHeroTitleLine1(e.target.value)}
                                  className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-slate-800"
                                  placeholder="Sua saúde postural em"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Título Destacado (Verde)</label>
                                <input
                                  type="text"
                                  value={heroTitleHighlighted}
                                  onChange={(e) => setHeroTitleHighlighted(e.target.value)}
                                  className="bg-white border text-xs px-2.5 py-1.5 rounded-lg text-[#72b63c] font-black"
                                  placeholder="Primeiro Lugar"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Subtítulo / Descrição Completa</label>
                              <textarea
                                rows={2}
                                value={heroDescription}
                                onChange={(e) => setHeroDescription(e.target.value)}
                                className="bg-white border text-xs p-2.5 rounded-lg text-slate-800"
                                placeholder="Descrição detalhada de apoio postural..."
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Imagem de Fundo (URL) ou Presets</label>
                              <input
                                type="text"
                                value={heroBackgroundImage}
                                onChange={(e) => setHeroBackgroundImage(e.target.value)}
                                className="bg-white border text-[11px] px-2.5 py-1.5 rounded-lg text-slate-800"
                                placeholder="Caminho do asset ou link livre"
                              />
                              
                              <div className="flex flex-wrap gap-1 mt-1">
                                <button
                                  type="button"
                                  onClick={() => setHeroBackgroundImage('/src/assets/images/hero_pos_bg_1779750303824.png')}
                                  className="bg-white border border-slate-200 text-[9px] font-bold px-2 py-1 rounded hover:bg-slate-100"
                                >
                                  🔋 Layout Padrão Schultz (Original)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setHeroBackgroundImage('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200')}
                                  className="bg-white border border-slate-200 text-[9px] font-bold px-2 py-1 rounded hover:bg-slate-100"
                                >
                                  🏠 Quarto Conforto Premium (Unsplash)
                                </button>
                              </div>
                            </div>

                            <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-3">
                              <p className="text-[10px] font-extrabold uppercase text-[#1d4391]">Caixa Informativa 1 (Ergonomia)</p>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={heroBadgeTitle1}
                                  onChange={(e) => setHeroBadgeTitle1(e.target.value)}
                                  className="bg-slate-50 border text-xs px-2 py-1 rounded font-bold"
                                  placeholder="Título 1"
                                />
                                <input
                                  type="text"
                                  value={heroBadgeDesc1}
                                  onChange={(e) => setHeroBadgeDesc1(e.target.value)}
                                  className="bg-slate-50 border text-xs px-2 py-1 rounded"
                                  placeholder="Descrição 1"
                                />
                              </div>
                            </div>

                            <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-3">
                              <p className="text-[10px] font-extrabold uppercase text-[#1d4391]">Caixa Informativa 2 (Medidas)</p>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={heroBadgeTitle2}
                                  onChange={(e) => setHeroBadgeTitle2(e.target.value)}
                                  className="bg-slate-50 border text-xs px-2 py-1 rounded font-bold"
                                  placeholder="Título 2"
                                />
                                <input
                                  type="text"
                                  value={heroBadgeDesc2}
                                  onChange={(e) => setHeroBadgeDesc2(e.target.value)}
                                  className="bg-slate-50 border text-xs px-2 py-1 rounded"
                                  placeholder="Descrição 2"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#1s4391] bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold py-2.5 rounded-xl text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Salvar Banner Grande
                            </button>
                          </form>
                        </motion.div>
                      )}

                      {/* CONTENT OF TAB C: THE POWERFUL DYNAMIC UPPER BANNER STRIP & BRAND LOGO */}
                      {adminSubTab === 'topBanner' && (
                        <div className="space-y-4">
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-5 bg-gradient-to-r from-amber-50 to-amber-100/30 rounded-2xl border border-amber-200/50 space-y-4"
                          >
                            <div className="flex items-center gap-2">
                              <Settings className="w-5 h-5 text-amber-600" />
                              <h4 className="font-sans font-black text-sm text-amber-900 leading-tight">
                                Faixa Superior do Topo (Promo Strip)
                              </h4>
                            </div>

                            <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                              Abaixo, você como administrador pode alterar as informações da faixa promocional do site, logo no topo do cabeçalho da loja:
                            </p>

                            <form onSubmit={handleBannerSave} className="space-y-4 pt-1">
                              {/* Dynamic Live Preview Box inside the panel */}
                              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-2 font-mono">Pré-visualização da Faixa:</p>
                                <div className={`p-2 rounded border-s-4 border-emerald-400 text-[11px] leading-relaxed flex items-center gap-1.5 ${bannerBg} text-white font-bold`}>
                                  <span>{bannerEmoji}</span>
                                  <span>{bannerText || "Digite o texto..."}</span>
                                </div>
                              </div>

                              {/* Text Field Textarea component */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Texto Promocional Curto *</label>
                                <textarea
                                  rows={3}
                                  placeholder="Exemplo: Fim de Semana Schultz! Colchões com frete grátis..."
                                  value={bannerText}
                                  onChange={(e) => setBannerText(e.target.value)}
                                  maxLength={160}
                                  className="bg-white border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-800 outline-none w-full font-medium"
                                />
                                <span className="text-[10px] text-slate-400 text-right font-mono font-bold">
                                  {bannerText.length}/160 caracteres
                                </span>
                              </div>

                              {/* Pick Style background configuration */}
                              <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estilo e Cor de Fundo</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {bannerColorOptions.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => setBannerBg(opt.value)}
                                      className={`text-[11px] font-bold px-3 py-2 rounded-lg text-center cursor-pointer border hover:opacity-90 active:scale-95 transition-all truncate ${opt.value} ${
                                        bannerBg === opt.value ? 'ring-2 ring-slate-900 border-transparent shadow' : 'border-slate-200'
                                      }`}
                                    >
                                      {opt.name}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Pick emoji selector */}
                              <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Icone / Emoji em Destaque</label>
                                <div className="flex flex-wrap gap-2">
                                  {emojiOptions.map((emo) => (
                                    <button
                                      key={emo}
                                      type="button"
                                      onClick={() => setBannerEmoji(emo)}
                                      className={`w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-sm cursor-pointer hover:bg-slate-50 active:scale-90 transition-all ${
                                        bannerEmoji === emo ? 'ring-2 ring-amber-500 border-transparent font-bold bg-amber-50' : 'border-slate-200'
                                      }`}
                                    >
                                      {emo}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Toggle active state */}
                              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
                                <div>
                                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block">Exibir para Clientes?</span>
                                  <span className="text-[10px] text-slate-400 font-medium font-sans">Ativar ou desativar banner no topo</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setBannerActive(!bannerActive)}
                                  className={`w-14 h-7 rounded-full p-1 transition-all ${bannerActive ? 'bg-[#72b63c]' : 'bg-slate-300'}`}
                                >
                                  <div className={`bg-white w-5 h-5 rounded-full transition-all shadow-xs ${bannerActive ? 'translate-x-7' : 'translate-x-0'}`} />
                                </button>
                              </div>

                              {/* Save Trigger Button */}
                              <button
                                type="submit"
                                className="w-full bg-[#1d4391] hover:bg-brand-blue-dark text-white font-black py-3 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-1 shadow cursor-pointer"
                              >
                                <Save className="w-4 h-4" />
                                Publicar Faixa Topo
                              </button>
                            </form>
                          </motion.div>

                          {/* BRAND LOGO EDITOR */}
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-4"
                          >
                            <div className="flex items-center gap-2">
                              <Image className="w-5 h-5 text-[#1d4391]" />
                              <h4 className="font-sans font-black text-sm text-[#1d4391] leading-tight">
                                Logomarca da Loja (Cabeçalho)
                              </h4>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                              Substitua o logotipo circular "S" exibido no cabeçalho por uma imagem customizada da sua marca.
                            </p>

                            <div className="flex flex-col gap-3.5 p-3.5 bg-white rounded-xl border border-slate-200/50">
                              {/* Option A: Link URL */}
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">🔗 Link URL de Imagem (Web):</label>
                                <input
                                  type="text"
                                  placeholder="Cole o endereço da imagem aqui..."
                                  value={logo.startsWith('data:') ? '' : logo}
                                  onChange={(e) => onUpdateLogo(e.target.value)}
                                  className="bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg text-slate-800 text-[10.5px] outline-none focus:border-[#1d4391] min-w-0"
                                />
                                {logo.startsWith('data:') && (
                                  <p className="text-[9.5px] text-brand-blue font-bold">💡 Usando logotipo enviado via upload direto.</p>
                                )}
                              </div>

                              {/* Option B: Direct File Upload */}
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">📤 Enviar Arquivo Direto:</label>
                                <div
                                  onDragOver={handleLogoDragOver}
                                  onDragLeave={handleLogoDragLeave}
                                  onDrop={handleLogoDrop}
                                  onClick={() => document.getElementById('drawer-logo-file-upload')?.click()}
                                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 select-none ${
                                    isDraggingLogo 
                                      ? 'border-brand-blue bg-brand-blue/5 scale-[0.99]' 
                                      : 'border-slate-300 hover:border-brand-blue bg-slate-50/50 hover:bg-slate-50'
                                  }`}
                                >
                                  <input
                                    type="file"
                                    id="drawer-logo-file-upload"
                                    accept="image/*"
                                    onChange={handleLogoFileSelect}
                                    className="hidden"
                                  />
                                  <Upload className={`w-5 h-5 ${isDraggingLogo ? 'text-brand-blue animate-bounce' : 'text-slate-400'}`} />
                                  <div>
                                    <p className="text-[10.5px] font-extrabold text-[#1d4391]">
                                      Clique para selecionar ou arraste o logotipo aqui
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                      Suporta PNG, JPG, WEBP de até 3.5MB (Formato quadrado/redondo recomendado)
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Active Logo Visualizer and Clear */}
                              {logo && (
                                <div className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg flex items-center justify-between gap-3 shadow-3xs">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                      src={logo}
                                      alt="Logo Ativa"
                                      className="w-10 h-10 object-cover rounded-full border border-slate-200 bg-white shrink-0 shadow-3xs"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Logomarca Atual Ativa</p>
                                      <p className="text-[9.5px] text-slate-400 font-semibold truncate max-w-[180px] mt-1">
                                        {logo.startsWith('data:') ? 'Imagem Local por Upload' : logo}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateLogo('');
                                      showFeedback('Logomarca limpa! Voltando para o padrão "S".', 'success');
                                    }}
                                    className="text-[9.5px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/75 px-2 py-1 rounded transition-all cursor-pointer shadow-3xs"
                                  >
                                    Redefinir
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      )}

                    </div>
                  ) : (
                    
                    /* VIEW 2.2: STANDARD USER DETAILS */
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-slate-600">
                        <p className="font-bold text-emerald-800 leading-normal mb-1">🌱 Benefício Schultz VIP Ativo</p>
                        <p className="font-medium leading-relaxed">
                          Sua área do cliente está ativa! Suas escolhas de carrinho e favoritos serão mantidas salvas sob seu perfil para quando você quiser concluir sua compra.
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">Sua Atividade Schultz</p>
                        <div className="space-y-2 font-medium">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Sessão Iniciada em</span>
                            <span className="font-mono text-slate-400 font-bold">Hoje às {(new Date()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Localização Estimada</span>
                            <span className="text-brand-blue font-bold">Rio Grande do Sul, BR</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Garantia de Navegação Segura</span>
                            <span className="text-[#72b63c] font-black uppercase text-[10px]">Ativa</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard Sign out action button */}
                  <button
                    onClick={() => {
                      onLogout();
                      showFeedback('Você saiu da sua conta.', 'success');
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-250 text-slate-700 font-extrabold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer"
                    id="btn-account-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da minha Conta
                  </button>

                </div>
              )}

            </div>

            {/* Bottom Footer Info Branding */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 uppercase tracking-wider text-[9px] text-slate-400 font-mono font-bold text-center shrink-0">
              © Schultz Saúde Postural RS • 2026
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
