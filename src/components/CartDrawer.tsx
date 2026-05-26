import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, Send, MapPin, Truck, Store, CreditCard, ChevronRight, Coins, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, OrderDetails } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  
  // Checkout form configurations
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // Deliver Address Specs
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  
  // Payment Type
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card' | 'cash'>('pix');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  // Total quantity of items in the cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Price Calculations
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const isPixActive = paymentMethod === 'pix';
  
  // 5% discount on PIX
  const discountAmount = isPixActive ? cartSubtotal * 0.05 : 0;
  const deliveryFee = deliveryMethod === 'delivery' ? 15.00 : 0.00; // Sample delivery fee across SP
  const finalPriceVal = cartSubtotal - discountAmount + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Field Verifications
    if (!customerName.trim()) {
      setValidationError('Por favor, informe seu nome completo.');
      return;
    }

    if (deliveryMethod === 'delivery') {
      if (!addressStreet.trim() || !addressNumber.trim() || !addressNeighborhood.trim() || !addressCity.trim()) {
        setValidationError('Por favor, preencha todos os campos do endereço para entrega.');
        return;
      }
    }

    // CREATE BEAUTIFUL WHATSAPP MESSAGE TEMPLATE
    let message = `💚 *SCHULTZ ORTOPÉDICOS - PEDIDO* 💙\n`;
    message += `-------------------------------------------------\n\n`;
    message += `Olá! Gostaria de efetuar o seguinte pedido via catálogo:\n\n`;
    
    message += `📦 *ITENS DO PEDIDO:*\n`;
    cart.forEach((item, index) => {
      const parts: string[] = [];
      if (item.selectedSize) parts.push(`Tam: ${item.selectedSize}`);
      if (item.selectedDensity) parts.push(`Densidade: ${item.selectedDensity}`);
      if (item.selectedColor) parts.push(`Cor: ${item.selectedColor}`);
      const specs = parts.length > 0 ? ` (${parts.join(', ')})` : '';
      
      message += `• *${item.quantity}x* ${item.product.name}${specs}\n`;
      message += `  R$ ${(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (R$ ${item.product.price.toLocaleString('pt-BR')} cada)\n\n`;
    });

    message += `-------------------------------------------------\n`;
    message += `📊 *RESUMO DO PEDIDO:*\n`;
    message += `Subtotal: R$ ${cartSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    
    if (deliveryMethod === 'delivery') {
      message += `Taxa de Entrega: R$ ${deliveryFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    } else {
      message += `Retirada: Grátis na Loja Central\n`;
    }

    if (isPixActive) {
      message += `Desconto Especial PIX (5%): - R$ ${discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    }
    
    message += `*TOTAL ESTIMADO: R$ ${finalPriceVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*\n\n`;

    message += `-------------------------------------------------\n`;
    message += `👤 *DADOS DO CLIENTE:*\n`;
    message += `• *Nome:* ${customerName}\n`;
    if (customerPhone.trim()) {
      message += `• *Contato:* ${customerPhone}\n`;
    }
    
    message += `• *Forma de Entrega:* ${deliveryMethod === 'delivery' ? '🚚 Entrega Residencial' : '🏪 Retirar na Loja'}\n`;
    if (deliveryMethod === 'delivery') {
      message += `• *Endereço:* ${addressStreet}, Nº ${addressNumber} - ${addressNeighborhood}, ${addressCity}\n`;
    }
    
    message += `• *Forma de Pagamento:* `;
    if (paymentMethod === 'pix') message += `PIX (Com Desconto!)\n`;
    if (paymentMethod === 'credit_card') message += `Cartão de Crédito (Na entrega)\n`;
    if (paymentMethod === 'debit_card') message += `Cartão de Débito (Na entrega)\n`;
    if (paymentMethod === 'cash') message += `Dinheiro (Na entrega)\n`;

    if (notes.trim()) {
      message += `\n📝 *OBSERVAÇÕES:*\n${notes}\n`;
    }

    message += `\n_Pedido gerado de forma simples e segura via Catálogo Digital Schultz Ortopédicos._\n`;

    // WhatsApp Direct API Configuration (using actual business WhatsApp layout)
    const storeNumber = '555499836307'; // Real store WhatsApp contact
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${storeNumber}&text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp link in a secure tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" id="cart-drawer-root">
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
            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10"
            id="cart-drawer-panel"
          >
            {/* Header section (Sticky/Fixed) */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-green/10 text-brand-blue rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-gray-900 leading-tight">Seu Carrinho</h2>
                  <p className="text-xs text-gray-400 font-medium">
                    {cartItemsCount} {cartItemsCount === 1 ? 'item selecionado' : 'itens selecionados'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                id="cart-drawer-close"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Container (Dynamic Area) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Product Listing */}
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 text-sm">Seu carrinho está vazio</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                      Navegue pelas categorias e escolha nossos produtos ortopédicos para adicionar itens aqui.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 bg-brand-blue hover:bg-brand-blue-dark text-white px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide transition-all active:scale-95 cursor-pointer shadow-xs"
                    id="cart-drawer-empty-cta"
                  >
                    Ver Catálogo de Produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Produtos Escolhidos</span>
                    <button
                      onClick={onClearCart}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold focus:outline-none flex items-center gap-1 cursor-pointer"
                      id="btn-clear-cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Esvaziar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cart.map((item) => {
                      // Calculate PIX price per unit for presentation
                      const itemPixPrice = item.product.price * 0.95;
                      
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-all shadow-sm"
                          id={`cart-row-${item.id}`}
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-slate-900 text-xs font-bold leading-tight line-clamp-2">
                              {item.product.name}
                            </h4>
                            
                            {/* Variations description list */}
                            {(item.selectedSize || item.selectedDensity || item.selectedColor) && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.selectedSize && (
                                  <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                    Tam: {item.selectedSize}
                                  </span>
                                )}
                                {item.selectedDensity && (
                                  <span className="bg-brand-blue-light text-brand-blue-dark text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                    {item.selectedDensity}
                                  </span>
                                )}
                                {item.selectedColor && (
                                  <span className="bg-brand-green-light text-brand-green-dark text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                    {item.selectedColor}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Prices & Actions */}
                            <div className="flex items-center justify-between mt-3 gap-2">
                              <span className="text-brand-blue text-xs font-bold">
                                R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>

                              {/* Quantity micro adjustments */}
                              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-3xs">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 rounded-md bg-white hover:bg-slate-50 text-slate-500 cursor-pointer active:scale-90"
                                  aria-label="Diminuir"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 rounded-md bg-white hover:bg-slate-50 text-slate-500 cursor-pointer active:scale-95"
                                  aria-label="Aumentar"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                id={`remove-item-${item.id}`}
                                aria-label="Remover item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkout Form (Sticky / Inline) */}
                  <div className="border-t border-slate-100 pt-5 space-y-4" id="checkout-form-container">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block">
                      📝 Dados de Entrega & Pagamento
                    </span>

                    {validationError && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium">
                        ⚠️ {validationError}
                      </div>
                    )}

                    <form onSubmit={handleCheckout} className="space-y-4">
                      {/* Name field */}
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Digite seu nome completo..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all"
                          id="input-name"
                        />
                      </div>

                      {/* Phone field */}
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">
                          Telefone / Celular (Opcional)
                        </label>
                        <input
                          type="tel"
                          placeholder="Ex: (11) 98765-4321..."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all"
                          id="input-phone"
                        />
                      </div>

                      {/* Delivery Mode Choice */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('delivery')}
                          className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            deliveryMethod === 'delivery'
                              ? 'bg-brand-blue-light border-brand-blue text-brand-blue-dark font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                          id="btn-delivery-mode"
                        >
                          <Truck className="w-4 h-4" />
                          Entrega em Casa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            deliveryMethod === 'pickup'
                              ? 'bg-brand-blue-light border-brand-blue text-brand-blue-dark font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                          id="btn-pickup-mode"
                        >
                          <Store className="w-4 h-4" />
                          Retirar na Loja
                        </button>
                      </div>

                      {/* Address area ONLY when delivery is active */}
                       {deliveryMethod === 'delivery' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2.5 overflow-hidden"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-0.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                            <span>Endereço de Entrega (Rio Grande do Sul)</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            <div className="col-span-3">
                              <label className="text-[10px] text-slate-400 block mb-0.5 font-bold uppercase">Rua / Logradouro *</label>
                              <input
                                type="text"
                                placeholder="Rua das Orquídeas..."
                                value={addressStreet}
                                onChange={(e) => setAddressStreet(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5 font-bold uppercase">Nº *</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={addressNumber}
                                onChange={(e) => setAddressNumber(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none text-center"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5 font-bold uppercase">Bairro *</label>
                              <input
                                type="text"
                                placeholder="Centro..."
                                value={addressNeighborhood}
                                onChange={(e) => setAddressNeighborhood(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5 font-bold uppercase">Cidade *</label>
                              <input
                                type="text"
                                placeholder="Porto Alegre..."
                                value={addressCity}
                                onChange={(e) => setAddressCity(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none"
                              />
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 font-medium">
                            * Taxa de entrega fixa para o Rio Grande do Sul: <strong>R$ 15,00</strong>.
                          </p>
                        </motion.div>
                      )}

                      {/* Store Address Note if pickup */}
                      {deliveryMethod === 'pickup' && (
                        <div className="p-3 bg-brand-green-light rounded-xl border border-brand-green/20 text-xs text-slate-700">
                          📍 <strong>Retirada Grátis em:</strong> Rua Professor Adão Oscar Wenbbleing, nº 3720, Centro, CEP 99140-000. Aguarde nossa confirmação de estoque via WhatsApp!
                        </div>
                      )}

                      {/* Payment Options Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Forma de Pagamento
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('pix')}
                            className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              paymentMethod === 'pix'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                            id="payment-pix"
                          >
                            <Coins className="w-3.5 h-3.5 text-emerald-500" />
                            PIX (Ganhe 5% desc.)
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('credit_card')}
                            className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              paymentMethod === 'credit_card'
                                ? 'bg-brand-blue-light border-brand-blue text-brand-blue-dark font-bold'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                            id="payment-credit"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-brand-blue" />
                            C. de Crédito
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('debit_card')}
                            className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              paymentMethod === 'debit_card'
                                ? 'bg-brand-blue-light border-brand-blue text-brand-blue-dark font-bold'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                            id="payment-debit"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-brand-blue/70" />
                            C. de Débito
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cash')}
                            className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              paymentMethod === 'cash'
                                ? 'bg-brand-blue-light border-brand-blue text-brand-blue-dark font-bold'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                            id="payment-cash"
                          >
                            💵 Dinheiro à Vista
                          </button>
                        </div>
                      </div>

                      {/* Observations field */}
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">
                          Observações Adicionais (Instruções de entrega, referências)
                        </label>
                        <textarea
                          placeholder="Digite aqui se precisa de algum detalhe, troco ou horário preferencial..."
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-blue rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none resize-none transition-all"
                          id="input-notes"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky summary & Checkout button */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-white" id="cart-drawer-footer">
                <div className="space-y-2 mb-4 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal de Produtos:</span>
                    <span>R$ {cartSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Taxa de Entrega:</span>
                      <span>R$ {deliveryFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {isPixActive && (
                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3 text-emerald-500" />
                        Desconto 5% PIX ativo:
                      </span>
                      <span>- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <hr className="border-slate-50" />
                  
                  <div className="flex justify-between text-brand-blue font-bold text-sm pt-1">
                    <span>Total Estimado:</span>
                    <span className="text-base font-display font-extrabold text-brand-blue">
                      R$ {finalPriceVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 rounded-2xl tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-green/20 relative cursor-pointer hover:shadow-lg hover:shadow-brand-green/25 active:scale-99"
                  id="cart-drawer-checkout-cta"
                >
                  <Send className="w-4 h-4 fill-white" />
                  Concluir e Enviar via WhatsApp
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2.5">
                  Ao clicar, você será redirecionado para o WhatsApp com seu pedido estruturado para confirmação imediata.
                </p>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
