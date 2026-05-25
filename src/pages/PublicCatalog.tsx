import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles, Wind, MessageSquare, Copy, Check, Info, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { fetchActiveProducts, createDocument, collections, fetchStoreProfile } from '../services/db';
import { Link, useParams } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { toast } from 'sonner';

export default function PublicCatalog() {
  const { storeId } = useParams<{ storeId: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [storeProfile, setStoreProfile] = useState<any>(null);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Sommelier State
  const [sommelierPrompt, setSommelierPrompt] = useState('');
  const [sommelierIntensity, setSommelierIntensity] = useState('Medium');
  const [sommelierData, setSommelierData] = useState<any>(null);
  const [sommelierLoading, setSommelierLoading] = useState(false);
  const [activeSommelierTab, setActiveSommelierTab] = useState<'match' | 'custom'>('match');

  const cart = useCartStore();

  useEffect(() => {
    if (storeId) {
      Promise.all([
        fetchActiveProducts(storeId),
        fetchStoreProfile(storeId)
      ]).then(([prods, profile]) => {
        setProducts(prods);
        setStoreProfile(profile);
        setLoading(false);
      });
    }
  }, [storeId]);

  const handleSommelierConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sommelierPrompt) return;
    setSommelierLoading(true);
    setSommelierData(null);

    try {
      // Exclude any custom items in our catalog before sending it to Gemini
      const standardCatalog = products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description || ''
      }));

      const res = await fetch('/api/gemini/aroma-sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: sommelierPrompt,
          intensity: sommelierIntensity,
          catalog: standardCatalog
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await res.json();
      setSommelierData(data);
      toast.success("Consultation complete! See your custom recommendations below.");
    } catch (err: any) {
      console.error(err);
      toast.error("The Sommelier is temporarily resting her senses. Please try again or construct standard blends.");
    } finally {
      setSommelierLoading(false);
    }
  };

  const handleAddSignatureScent = () => {
    if (!sommelierData?.customBlend) return;
    const blend = sommelierData.customBlend;
    
    cart.addItem({
      id: `custom-scent-${Date.now()}`,
      name: `Signature Blend: ${blend.name}`,
      price: 18.00,
      imageUrl: "" // Can be highlighted uniquely in Cart
    });

    toast.success(`"${blend.name}" added to basket! Hand-blended at a premium flat rate of $18.00.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center">
        <Wind className="animate-spin text-[#5A5A40] mb-4" size={32} />
        <p className="text-[#64748b] font-serif italic animate-pulse">Gathering essence of the catalogue...</p>
      </div>
    );
  }

  if (!storeProfile) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-serif text-[#1a1a1a] mb-2 font-light">Artisan Shop Not Found</h2>
        <p className="text-[#666666] mb-6 max-w-sm">The digital boutique code is invalid, or the owner is updating their space.</p>
        <Link to="/" className="text-[#5A5A40] underline font-medium hover:text-[#5A5A40]/80">Return directly to Aroma PRO</Link>
      </div>
    );
  }

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-sans pb-28">
      {/* Header Banner */}
      <header className="pt-20 pb-12 px-6 text-center space-y-4 relative max-w-4xl mx-auto">
        <Link to="/admin" className="absolute top-6 right-6 text-xs text-[#666666] hover:text-[#1a1a1a] bg-white border border-[#e5e5e0] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm">
          <span>Seller Admin console</span>
          <ChevronRight size={12} />
        </Link>
        
        <div className="text-xs uppercase tracking-widest font-semibold text-[#5A5A40] bg-[#5A5A40]/10 px-4 py-1.5 rounded-full inline-block">
          Handcrafted Scent Boutique
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl font-light text-[#1a1a1a] tracking-tight pt-2">
          {storeProfile.storeName || 'Artisan Scent Studio'}
        </h1>
        <p className="text-[#666666] font-serif text-lg md:text-xl italic max-w-2xl mx-auto font-light leading-relaxed">
          {storeProfile.description || 'Hand-pouring organic soy wax formulas and clean botanicals. Elevate your space.'}
        </p>

        {/* Contact details flag */}
        <div className="flex justify-center items-center gap-3 pt-2 text-xs text-[#666666]">
          <span className="bg-white/80 border border-[#e5e5e0] px-3 py-1.5 rounded-md flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#5A5A40]" /> Verified US Maker
          </span>
          {storeProfile.phone && (
            <span className="bg-white/80 border border-[#e5e5e0] px-3 py-1.5 rounded-md flex items-center gap-1">
              📞 Direct text: {storeProfile.phone}
            </span>
          )}
        </div>
      </header>

      {/* =======================================================
          VIP HIGH VALUE FEATURE: L'AROMA EXPERT AI SOMMELIER
         ======================================================= */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-3xl border border-[#5A5A40]/20 shadow-sm p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#c4c4af]/10 rounded-full blur-[80px] -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#f5f5f0] pb-6 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#5A5A40] animate-pulse" />
                <h2 className="font-serif text-2xl font-light text-[#1a1a1a]">L'Aroma Sommelier</h2>
              </div>
              <p className="text-sm text-[#666666] max-w-xl font-light">
                Describe a memory, a feeling, or the exact ambiance you wish to call into your room. Our AI scent stylist will construct your dynamic routine and custom scent recipes.
              </p>
            </div>
            
            <div className="bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-semibold px-3 py-1 text-center rounded-full uppercase tracking-wider shrink-0">
              AI Scent Butler
            </div>
          </div>

          <form onSubmit={handleSommelierConsult} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider mb-2">My Ambiance Goal</label>
                <input 
                  required
                  placeholder="e.g. Reading a vintage leather book in a rain-soaked cedar forest room..."
                  className="w-full text-sm border border-[#e5e5e0] p-3.5 rounded-xl bg-[#f5f5f0]/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] transition-colors"
                  value={sommelierPrompt}
                  onChange={e => setSommelierPrompt(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider mb-2">Ideal Scent Intensity</label>
                <select 
                  className="w-full text-sm border border-[#e5e5e0] p-3.5 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] h-[48px]"
                  value={sommelierIntensity}
                  onChange={e => setSommelierIntensity(e.target.value)}
                >
                  <option value="Mild & Airy">Mild & Subtle (Airy Rooms)</option>
                  <option value="Medium">Medium & Balanced (Bedrooms)</option>
                  <option value="Rich & Immersive">Rich & Bold (Open Spaces)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={sommelierLoading}
                className="w-full md:w-auto bg-[#5A5A40] text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#5A5A40]/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
              >
                {sommelierLoading ? (
                  <>
                    <Wind className="animate-spin" size={16} />
                    <span>Styling your luxury bouquet...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Analyze Mood & Create Blend</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {sommelierData && (
            <div className="mt-8 border-t border-[#f5f5f0] pt-6 space-y-6 animate-fade-in">
              <div className="bg-[#f5f5f0]/50 p-5 rounded-2xl border border-[#e5e5e0]/35">
                <h4 className="font-serif italic text-lg text-[#5A5A40] mb-2">Sommelier Ambiance Guidance</h4>
                <p className="text-sm text-[#1a1a1a] font-light leading-relaxed whitespace-pre-line">
                  "{sommelierData.explanation}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tab buttons */}
                <div className="space-y-4">
                  <div className="flex border-b border-[#e5e5e0] gap-4">
                    <button 
                      type="button"
                      onClick={() => setActiveSommelierTab('match')}
                      className={`pb-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${activeSommelierTab === 'match' ? 'border-[#5A5A40] text-[#5A5A40]' : 'border-transparent text-[#666666] hover:text-[#1a1a1a]'}`}
                    >
                      🎁 Boutique Recommendations
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveSommelierTab('custom')}
                      className={`pb-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${activeSommelierTab === 'custom' ? 'border-[#5A5A40] text-[#5A5A40]' : 'border-transparent text-[#666666] hover:text-[#1a1a1a]'}`}
                    >
                      ✨ Signature AI Scent Recipe
                    </button>
                  </div>

                  {activeSommelierTab === 'match' ? (
                    <div className="space-y-3">
                      {sommelierData.recommendations && sommelierData.recommendations.length > 0 ? (
                        sommelierData.recommendations.map((rec: any, idx: number) => {
                          // Try to match the matched product in our store products
                          const matchingProd = products.find(p => p.id === rec.id || p.name.toLowerCase().includes(rec.name.toLowerCase()));
                          return (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-[#e5e5e0] flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <h5 className="font-serif font-medium text-sm text-[#1a1a1a]">{rec.name}</h5>
                                <p className="text-xs text-[#666666] font-light leading-relaxed">{rec.fitReason}</p>
                              </div>
                              {matchingProd && (
                                <button
                                  onClick={() => {
                                    cart.addItem(matchingProd);
                                    toast.success(`Added "${matchingProd.name}" to cart!`);
                                  }}
                                  className="text-xs bg-[#5A5A40]/10 text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white px-3 py-1.5 rounded-full font-medium transition-all shrink-0"
                                >
                                  + Basket
                                </button>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-[#666666] italic">No exact catalog catalog products match this dream theme, but check out our signature bespoke blending below!</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#5A5A40]/5 p-5 rounded-2xl border border-[#5A5A40]/25 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]">Custom Sensory Formula</span>
                        <h4 className="font-serif text-xl font-medium text-[#1a1a1a]">{sommelierData.customBlend.name}</h4>
                        <p className="text-xs text-[#666666] font-light">Notes: <span className="font-semibold text-[#1a1a1a]">{sommelierData.customBlend.notes}</span></p>
                      </div>
                      <p className="text-xs text-[#666666] leading-relaxed font-light font-sans italic">
                        "{sommelierData.customBlend.explanation}"
                      </p>
                      <button 
                        onClick={handleAddSignatureScent}
                        className="w-full bg-[#5A5A40] text-white py-2.5 rounded-xl text-xs font-medium hover:bg-[#5A5A40]/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm font-sans"
                      >
                        <Sparkles size={14} /> Add Signature Custom Scent Sachet/Melt ($18.00)
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-[#f5f5f0]/40 p-5 rounded-2xl border border-[#e5e5e0]/30 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h5 className="text-xs uppercase font-bold tracking-widest text-[#1a1a1a] flex items-center gap-1.5">
                      <Wind size={14} className="text-[#5A5A40]" /> Sommelier layer Tip
                    </h5>
                    <p className="text-xs text-[#666666] leading-relaxed font-light">
                      {sommelierData.synergyTip}
                    </p>
                  </div>
                  
                  <div className="text-[11px] text-[#666666] pt-4 mt-4 border-t border-[#e5e5e0]/50 flex items-center gap-2 font-serif italic">
                    <Info size={12} className="text-[#5A5A40] shrink-0" />
                    Custom premium blends use exclusive organic soy waxes and highly saturated French botanical scent oils.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category Selection Filter */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <h3 className="text-xs uppercase font-bold tracking-widest text-[#666666] mb-4 text-center">Browse Our Collections</h3>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {[
            { id: 'all', label: 'All Scent Creations' },
            { id: 'sachet', label: 'Artisan Wax Sachets' },
            { id: 'melt', label: 'Therapeutic Wax Melts' },
            { id: 'squeeze', label: 'Direct Squeeze Creams' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border cursor-pointer ${
                category === cat.id 
                  ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-sm' 
                  : 'bg-white border-[#e5e5e0] text-[#666666] hover:bg-[#e5e5e0]/40 hover:text-[#1a1a1a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main product gallery */}
      {filteredProducts.length === 0 ? (
        <div className="max-w-xl mx-auto px-6 text-center py-16">
          <p className="font-serif italic text-lg text-[#666666] mb-2">No creations available in this collection.</p>
          <p className="text-xs text-[#666666] font-light">Check another tab or contact us dynamically to check incoming batch updates!</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-3xl overflow-hidden border border-[#e5e5e0]/40 shadow-sm flex flex-col justify-between p-5 hover:shadow-md transition-shadow group relative"
            >
              <div className="flex flex-col items-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 bg-[#f5f5f0] relative">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#c4c4af] p-4 text-center">
                      <Wind size={40} strokeWidth={1} className="mb-2" />
                      <span className="font-serif italic text-xs">Aromatic Creation</span>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider bg-white/95 text-[#5A5A40] px-2.5 py-1.5 rounded-full shadow-sm border border-[#e5e5e0]/20">
                    {product.category === 'sachet' ? 'Wax Sachet' : product.category === 'melt' ? 'Wax Melt' : 'Squeeze Cream'}
                  </span>
                </div>

                <div className="w-full text-center space-y-1">
                  <h3 className="font-serif text-xl font-medium text-[#1a1a1a] tracking-tight">{product.name}</h3>
                  <p className="text-xs text-[#666666] font-light line-clamp-2 italic px-2">
                    {product.description || "Indulge in our exquisite slow-released aromatic fusion."}
                  </p>
                </div>
              </div>

              <div className="mt-5 w-full pt-4 border-t border-[#f5f5f0] flex flex-col items-center gap-3">
                <p className="text-lg font-serif font-semibold text-[#5A5A40]">${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => {
                    cart.addItem(product);
                    toast.success(`"${product.name}" added to basket.`);
                  }}
                  className="w-full py-3 rounded-full border border-[#5A5A40] text-[#5A5A40] font-medium text-xs uppercase tracking-wider hover:bg-[#5A5A40] hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Add to Basket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.items.length > 0 && <CartFab storeProfile={storeProfile} storeId={storeId!} />}
    </div>
  );
}

// Basket popup card and Native US payment flow
function CartFab({ storeProfile, storeId }: { storeProfile: any, storeId: string }) {
  const cart = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSentSuccessfully, setOrderSentSuccessfully] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const currentTotal = cart.total();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    
    setIsCheckingOut(true);
    const orderId = 'AP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const cleanPhone = storeProfile.phone ? storeProfile.phone.replace(/\D/g,'') : '';
    const destinationPhone = cleanPhone || "1234567890"; 
    
    const orderData = {
      storeId,
      customerName,
      customerPhone,
      items: cart.items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, id: i.id })),
      total: currentTotal,
      status: 'pending',
    };

    try {
      await createDocument(collections.ORDERS, orderId, orderData);
      setCreatedOrderId(orderId);
      setOrderSentSuccessfully(true);
      toast.success("Order recorded successfully in the merchant batch list!");

      // Dispatch optional message notification
      let msg = `Hello! I would like to lock in my aromatic artisan order (Ref: ${orderId}):\n\n`;
      msg += `Name: ${customerName}\n`;
      msg += `Phone: ${customerPhone}\n\n`;
      cart.items.forEach(item => {
        msg += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
      });
      msg += `\nSubtotal: $${currentTotal.toFixed(2)}\n\nPlease confirm availability and details! Thanks.`;

      // Copy to clipboard is handy for desktop users or copy-pasting to standard SMS
      navigator.clipboard.writeText(msg);

    } catch(e) {
      console.error(e);
      toast.error("Issue recording the order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleFinishCheckout = () => {
    cart.clearCart();
    setIsOpen(false);
    setOrderSentSuccessfully(false);
    setCustomerName('');
    setCustomerPhone('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-[#5A5A40] text-white p-4.5 rounded-full shadow-xl flex items-center gap-2.5 z-50 hover:bg-[#5A5A40]/90 transition-all cursor-pointer active:scale-95 group animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <ShoppingBag size={22} className="group-hover:rotate-6 transition-transform" />
        <span className="font-serif font-bold text-sm h-5 w-5 bg-white text-[#5A5A40] rounded-full flex items-center justify-center p-0.5 shadow-sm">
          {cart.items.reduce((acc, i) => acc + i.quantity, 0)}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1a1a1a]/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl max-h-[85vh] overflow-y-auto border border-[#e5e5e0] relative">
        
        {/* Close Button top-right */}
        <button 
          onClick={handleFinishCheckout} 
          className="absolute top-5 right-5 text-[#666666] hover:text-[#1a1a1a] bg-[#f5f5f0] p-1.5 rounded-full"
        >
          &times;
        </button>

        {!orderSentSuccessfully ? (
          <>
            <div className="mb-6 space-y-1">
              <h2 className="font-serif text-3xl font-light text-[#1a1a1a]">Your Basket</h2>
              <p className="text-xs text-[#666666] font-light">Confirm your hand-selected items and checkout dynamically.</p>
            </div>

            {/* Cart item elements */}
            <div className="space-y-3 mb-6 max-h-[30vh] overflow-y-auto pr-1">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-[#f5f5f0]/40 p-4 rounded-2xl border border-[#e5e5e0]/30 gap-4">
                  <div className="space-y-1">
                    <p className="font-serif font-medium text-sm text-[#1a1a1a]">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <button 
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} 
                        className="text-[#666666] hover:text-[#1a1a1a] w-6 h-6 rounded-md bg-white border border-[#e5e5e0] flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold text-[#1a1a1a] w-5 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} 
                        className="text-[#666666] hover:text-[#1a1a1a] w-6 h-6 rounded-md bg-white border border-[#e5e5e0] flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif font-semibold text-[#5A5A40] text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => cart.removeItem(item.id)}
                      className="text-[10px] uppercase font-bold tracking-wider text-red-500 hover:underline mt-1.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center font-serif text-2xl mb-6 border-t border-[#e5e5e0] pt-4">
              <span className="font-light text-sm text-[#666666] uppercase tracking-wider">Estimated Subtotal</span>
              <span className="text-[#5A5A40] font-semibold">${currentTotal.toFixed(2)}</span>
            </div>

            {/* US Native payment details preview if loaded */}
            {(storeProfile.venmo || storeProfile.cashapp || storeProfile.paypal) && (
              <div className="bg-[#5A5A40]/10 border border-[#5A5A40]/20 rounded-2xl p-4.5 mb-6 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={16} className="text-[#5A5A40]" />
                  <span className="text-xs uppercase font-bold tracking-widest text-[#1a1a1a]">Seller Payment Handles</span>
                </div>
                <p className="text-[11px] text-[#666666] leading-relaxed font-light">
                  Once orders are confirmed, direct payment is typically made via cash handles below. Simply copy yours at completion screen!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {storeProfile.venmo && (
                    <div className="bg-white px-3 py-2 rounded-xl border border-[#e5e5e0] text-center">
                      <p className="text-[10px] text-[#666666] uppercase tracking-widest font-semibold">Venmo</p>
                      <p className="font-serif font-medium text-xs text-[#5A5A40] truncate mt-0.5">{storeProfile.venmo}</p>
                    </div>
                  )}
                  {storeProfile.cashapp && (
                    <div className="bg-white px-3 py-2 rounded-xl border border-[#e5e5e0] text-center">
                      <p className="text-[10px] text-[#666666] uppercase tracking-widest font-semibold">Cash App</p>
                      <p className="font-serif font-medium text-xs text-[#5A5A40] truncate mt-0.5">{storeProfile.cashapp}</p>
                    </div>
                  )}
                  {storeProfile.paypal && (
                    <div className="bg-white px-3 py-2 rounded-xl border border-[#e5e5e0] text-center">
                      <p className="text-[10px] text-[#666666] uppercase tracking-widest font-semibold">PayPal</p>
                      <p className="font-serif font-medium text-xs text-[#5A5A40] truncate mt-0.5">{storeProfile.paypal}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1.5">My Full Name</label>
                  <input 
                    required 
                    placeholder="e.g. Eleanor Vance" 
                    className="w-full text-sm border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/30 focus:bg-white focus:outline-none" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1.5">My Phone Number</label>
                  <input 
                    required 
                    placeholder="e.g. 503-555-0199" 
                    className="w-full text-sm border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/30 focus:bg-white focus:outline-none" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)} 
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isCheckingOut}
                className="w-full bg-[#5A5A40] text-white py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#5A5A40]/90 transition-colors disabled:opacity-50 mt-4 cursor-pointer"
              >
                {isCheckingOut ? 'Recording order...' : 'Place Order & Request Invoice'}
              </button>
            </form>
          </>
        ) : (
          /* =======================================================
              VIP SUCCESS AND DIRECT US PAYMENT COPY AND TEXT FLOW
             ======================================================= */
          <div className="text-center p-2 space-y-6 animate-fade-in">
            <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-200">
              <Check size={32} />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-[#5A5A40] uppercase">Reference ID: {createdOrderId}</span>
              <h2 className="font-serif text-3xl font-light text-[#1a1a1a]">Order Logged!</h2>
              <p className="text-sm text-[#666666] max-w-sm mx-auto font-light leading-relaxed">
                Thank you, <span className="font-semibold">{customerName}</span>! Your artisan order has been saved directly to the maker's batch list.
              </p>
            </div>

            {/* Step instruction card */}
            <div className="bg-[#f5f5f0]/50 border border-[#e5e5e0] rounded-2xl p-6 text-left space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#1a1a1a] border-b border-[#e5e5e0] pb-2">
                Suggested Next Steps:
              </h4>

              <div className="space-y-4">
                {/* Check handles */}
                {(storeProfile.venmo || storeProfile.cashapp || storeProfile.paypal) && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#1a1a1a] font-semibold">1. Send payment of <span className="text-[#5A5A40] font-bold text-base">${currentTotal.toFixed(2)}</span> to lock in batch:</p>
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {storeProfile.venmo && (
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#e5e5e0]">
                          <span className="text-xs font-medium">Venmo:</span>
                          <span className="font-serif text-xs font-semibold text-[#5A5A40] selection:bg-[#e5e5e0]">{storeProfile.venmo}</span>
                        </div>
                      )}
                      {storeProfile.cashapp && (
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#e5e5e0]">
                          <span className="text-xs font-medium">Cash App:</span>
                          <span className="font-serif text-xs font-semibold text-[#5A5A40] selection:bg-[#e5e5e0]">{storeProfile.cashapp}</span>
                        </div>
                      )}
                      {storeProfile.paypal && (
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#e5e5e0]">
                          <span className="text-xs font-medium">PayPal email:</span>
                          <span className="font-serif text-xs font-semibold text-[#5A5A40] selection:bg-[#e5e5e0]">{storeProfile.paypal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-[#1a1a1a] font-semibold">2. Notify the Maker:</p>
                  <p className="text-xs text-[#666666] font-light leading-relaxed">
                    Simply copy your order summary below and text or email it to the maker at <span className="font-semibold text-[#1a1a1a]">{storeProfile.phone}</span>.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button 
                  onClick={() => {
                    let msg = `Hello! I placed order ${createdOrderId} ($${currentTotal.toFixed(2)}) for aroma creations! Name: ${customerName}`;
                    navigator.clipboard.writeText(msg);
                    toast.success("Order text copied to clipboard!");
                  }}
                  className="flex-1 bg-white border border-[#e5e5e0] hover:bg-[#f5f5f0] text-[#1a1a1a] py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy size={14} /> Copy Quick Ambiance Note
                </button>
                {storeProfile.phone && (
                  <a 
                    href={`sms:${storeProfile.phone}?body=${encodeURIComponent(`Hi! Just submitted artisan order ${createdOrderId} via Aroma PRO ($${currentTotal.toFixed(2)})`)}`}
                    className="flex-1 bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} /> Text the Maker
                  </a>
                )}
              </div>
            </div>

            <button 
              onClick={handleFinishCheckout}
              className="w-full bg-[#1a1a1a] hover:bg-[#1a1a1a]/90 text-white py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Finish & Return to Boutique
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
