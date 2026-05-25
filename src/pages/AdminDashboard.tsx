import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/AuthContext';
import { collections, subscribeToProducts, subscribeToMaterials, subscribeToOrders, createDocument, updateDocument, deleteDocument, fetchStoreProfile, saveStoreProfile } from '../services/db';
import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Store, Link as LinkIcon, Copy, Settings, Package, ShoppingBag, PieChart, Sparkles, LogOut, CheckCircle, Calculator, Info, Landmark, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'products' | 'materials' | 'orders' | 'reports'>('profile');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] flex flex-col items-center justify-center p-6 relative font-sans">
        <div className="absolute inset-0 overflow-hidden -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5A5A40] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#c4c4af] rounded-full blur-[100px]"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#e5e5e0] shadow-xl text-center max-w-md w-full space-y-6">
          <div className="bg-[#5A5A40]/10 text-[#5A5A40] p-4 rounded-full inline-block">
            <Store size={36} />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-light text-[#1a1a1a]">Aroma PRO Business</h1>
            <p className="text-sm text-[#666666] font-light">Secure merchant workspace for boutique scent artisans.</p>
          </div>

          <button 
            onClick={login} 
            className="w-full bg-[#5A5A40] text-white py-3.5 rounded-full font-medium shadow-sm hover:bg-[#5A5A40]/90 transition-all cursor-pointer text-sm"
          >
            Authenticate with Google
          </button>
          
          <p className="text-[11px] text-[#666666] leading-relaxed pt-2">
            Admin console restricts entry to registered creators. Safe database standards applied.
          </p>
        </div>
      </div>
    );
  }

  // Calculate the boutique store URL
  const storeUrl = `${window.location.origin}/#/store/${user.uid}`;

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success("Boutique address copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f0] text-[#1a1a1a] font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#e5e5e0] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#5A5A40]/10 text-[#5A5A40] h-9 w-9 rounded-full flex items-center justify-center">
              <Store size={18} />
            </div>
            <div>
              <h2 className="font-serif font-medium text-lg text-[#1a1a1a]">Aroma PRO</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]">VIP Workspace</span>
            </div>
          </div>
          
          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-3 md:pb-0 border-b md:border-b-0 border-[#e5e5e0]">
            {[
              { id: 'profile', label: 'Store Theme', icon: <Settings size={16} /> },
              { id: 'products', label: 'Scent Catalog', icon: <ShoppingBag size={16} /> },
              { id: 'materials', label: 'Ingredients', icon: <Package size={16} /> },
              { id: 'orders', label: 'Active Orders', icon: <Store size={16} /> },
              { id: 'reports', label: 'Revenue Reports', icon: <PieChart size={16} /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs uppercase tracking-wider font-semibold cursor-pointer shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-[#5A5A40] text-white shadow-sm' 
                    : 'hover:bg-[#f5f5f0] text-[#666666] hover:text-[#1a1a1a]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info and catalog shortcuts */}
        <div className="mt-8 pt-6 border-t border-[#e5e5e0] space-y-4">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#666666] mb-2">Boutique Live Link:</p>
            <div 
              onClick={copyLink}
              className="flex items-center gap-2 bg-[#f5f5f0] p-2.5 rounded-xl text-xs hover:bg-[#e5e5e0]/60 cursor-pointer transition-colors border border-[#e5e5e0]/30"
            >
              <LinkIcon size={12} className="shrink-0 text-[#5A5A40]" />
              <span className="truncate flex-1 font-mono text-[10px] text-[#666666]">{storeUrl}</span>
              <Copy size={12} className="shrink-0 text-[#5A5A40]" />
            </div>
          </div>

          <button 
            onClick={logout} 
            className="text-xs uppercase tracking-wider font-bold text-red-500 hover:text-red-600 flex items-center gap-2 pt-2 cursor-pointer transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out Control</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Screen Block */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {activeTab === 'profile' && <ProfileTab storeId={user.uid} />}
        {activeTab === 'products' && <ProductsTab storeId={user.uid} />}
        {activeTab === 'materials' && <MaterialsTab storeId={user.uid} />}
        {activeTab === 'orders' && <OrdersTab storeId={user.uid} />}
        {activeTab === 'reports' && <ReportsTab storeId={user.uid} />}
      </main>
    </div>
  );
}

/* ==========================================
   TAB 1: STORE PROFILE WITH US TRANSFERS
   ========================================== */
function ProfileTab({ storeId }: { storeId: string }) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    storeName: '',
    phone: '',
    description: '',
    venmo: '',
    cashapp: '',
    paypal: ''
  });

  useEffect(() => {
    fetchStoreProfile(storeId).then((data: any) => {
      if (data) {
        setFormData({
          storeName: data.storeName || '',
          phone: data.phone || '',
          description: data.description || '',
          venmo: data.venmo || '',
          cashapp: data.cashapp || '',
          paypal: data.paypal || ''
        });
      }
      setLoading(false);
    });
  }, [storeId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStoreProfile(storeId, formData);
      toast.success("Boutique parameters updated successfully.");
    } catch (e) {
      toast.error("Issue backing up store profile.");
    }
  };

  if (loading) return <div className="text-sm font-serif italic text-[#666666]">Retrieving store profile...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1">
        <h3 className="text-3xl font-serif font-light text-[#1a1a1a]">Shop Brand Parameters</h3>
        <p className="text-sm text-[#666666] font-light">Define aesthetics, public headers, and specify direct US cash nodes for digital purchase confirmations.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#e5e5e0] p-6 md:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General info */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#5A5A40]">General Info</h4>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Artisan Scent/Brand Name</label>
              <input 
                required 
                placeholder="e.g. Sylvan Pines Wax Co." 
                className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/20 text-sm focus:bg-white focus:outline-none"
                value={formData.storeName}
                onChange={e => setFormData({...formData, storeName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Makers Text phone line</label>
              <input 
                required 
                placeholder="e.g. 503-555-0199" 
                className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/20 text-sm font-mono focus:bg-white focus:outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <p className="text-[10px] text-[#666666] mt-1">Direct inquiries and receipts copies will be sent here.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Aromatics Story / Bio (Optional)</label>
              <textarea 
                placeholder="Briefly share your hand-pouring methods or active inspirations..." 
                className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/20 text-sm focus:bg-white focus:outline-none"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Payment info */}
          <div className="space-y-4 bg-[#f5f5f0]/40 p-5 rounded-2xl border border-[#e5e5e0]/30">
            <div className="flex items-center gap-2">
              <Landmark size={16} className="text-[#5A5A40]" />
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#1a1a1a]">Direct US Cash Handles</h4>
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed font-light">
              We leverage direct e-payment confirmations. Inputs below generate clickable handles and exact totals during client checkouts, eliminating expensive card premiums.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Venmo Handle</label>
                <input 
                  placeholder="e.g. @SylvanPines" 
                  className="w-full border border-[#e5e5e0] p-2.5 rounded-xl bg-white text-xs focus:outline-none font-mono text-[#5A5A40]"
                  value={formData.venmo}
                  onChange={e => setFormData({...formData, venmo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Cash App Tag</label>
                <input 
                  placeholder="e.g. $SylvanPines" 
                  className="w-full border border-[#e5e5e0] p-2.5 rounded-xl bg-white text-xs focus:outline-none font-mono text-[#5A5A40]"
                  value={formData.cashapp}
                  onChange={e => setFormData({...formData, cashapp: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">PayPal Email</label>
                <input 
                  placeholder="e.g. billing@sylvanpines.com" 
                  type="email"
                  className="w-full border border-[#e5e5e0] p-2.5 rounded-xl bg-white text-xs focus:outline-none font-mono text-[#5A5A40]"
                  value={formData.paypal}
                  onChange={e => setFormData({...formData, paypal: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-[#5A5A40] text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#5A5A40]/90 transition-all shadow-sm cursor-pointer"
        >
          Save Studio Ambiance
        </button>
      </form>
    </div>
  );
}

/* ===========================================
   TAB 2: SCENT CATALOG WITH GEMINI COPYWRITING
   =========================================== */
function ProductsTab({ storeId }: { storeId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [scentNotes, setScentNotes] = useState(''); // guidelines for poetic generator
  
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '14.00', 
    category: 'sachet', 
    isActive: true, 
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    return subscribeToProducts(storeId, setProducts);
  }, [storeId]);

  // AI Description Generator implementation
  const handleGeneratePoeticDescription = async () => {
    if (!formData.name) {
      toast.error("Please enter the Product Name first to inspire the AI!");
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch('/api/gemini/poetic-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          notes: scentNotes
        })
      });

      if (!response.ok) throw new Error("Copywriter endpoint issue");
      const data = await response.json();
      
      setFormData(prev => ({ ...prev, description: data.description }));
      toast.success("Poetic description successfully composed!");
    } catch (err) {
      console.error(err);
      toast.error("The copywriter was unable to compose at this time. Standard placeholders used.");
      // Fallback
      setFormData(prev => ({
        ...prev,
        description: `Hand-poured artisan ${formData.category} blended with premium plant waxes and botanical essences of ${scentNotes || formData.name}. Elevates any boutique space.`
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDocument(collections.PRODUCTS, 'P-' + Date.now().toString(), {
      ...formData,
      storeId,
      price: parseFloat(formData.price),
    });
    // Reset
    setFormData({ name: '', price: '14.00', category: 'sachet', isActive: true, description: '', imageUrl: '' });
    setScentNotes('');
    setIsAdding(false);
    toast.success("Boutique creation registered!");
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to retire this product from your catalog?')) {
      await deleteDocument(collections.PRODUCTS, id);
      toast.success("Product retired.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-[#e5e5e0] shadow-sm">
        <div>
          <h3 className="text-2xl font-serif text-[#1a1a1a]">Boutique Catalog</h3>
          <p className="text-xs text-[#666666] font-light">List, modify, and manage active sensory products visible in the public studio.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-[#5A5A40] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#5A5A40]/90 transition-all cursor-pointer shadow-sm"
        >
          {isAdding ? 'Cancel' : '+ New Creation'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#e5e5e0] space-y-6 animate-fade-in">
          <div className="flex items-center gap-2.5 border-b border-[#f5f5f0] pb-4">
            <ShoppingBag size={18} className="text-[#5A5A40]" />
            <h4 className="font-serif text-lg">Define New Handcrafted Creation</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Creation Name</label>
                <input 
                  required 
                  placeholder="e.g. Moss & River Wood Sachet" 
                  className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/20 text-sm focus:bg-white focus:outline-none" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Retail Price ($)</label>
                  <input 
                    required 
                    type="number" 
                    step="0.01" 
                    className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/20 text-sm focus:bg-white focus:outline-none" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Vibe Category</label>
                  <select 
                    className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-white text-sm focus:outline-none h-[48px]" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="sachet">Wax Sachet</option>
                    <option value="melt">Wax Melt</option>
                    <option value="squeeze">Squeeze Cream</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Scent Illustration URL (Optional)</label>
                <input 
                  placeholder="e.g. https://images.unsplash.com/photo-scent" 
                  className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-[#f5f5f0]/20 text-sm focus:bg-white focus:outline-none font-mono" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                />
              </div>

              <div className="flex items-center pt-3">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                    className="w-4.5 h-4.5 rounded border-[#e5e5e0] focus:ring-0 accent-[#5A5A40]" 
                  />
                  Publish live to public storefront
                </label>
              </div>
            </div>

            {/* Poetic description setup */}
            <div className="bg-[#5A5A40]/10 border border-[#5A5A40]/20 p-5 rounded-2xl relative space-y-4">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#5A5A40] animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-widest text-[#1a1a1a]">AI Botanical Copywriter</span>
                </div>
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={handleGeneratePoeticDescription}
                  className="bg-[#5A5A40] text-white hover:bg-[#5A5A40]/90 px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {aiLoading ? "Composing..." : "✏️ Auto-compose copy"}
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Inspirations & Aroma Profiles (optional guide)</label>
                <input 
                  placeholder="e.g. lavender fields, honey, soft organic soy base, cedar forest" 
                  className="w-full border border-[#e5e5e0] p-2.5 rounded-xl bg-white text-xs focus:outline-none"
                  value={scentNotes}
                  onChange={e => setScentNotes(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">Poetic Description (Outputs here)</label>
                <textarea 
                  required
                  placeholder="A hand-formulated ambiance product..." 
                  className="w-full border border-[#e5e5e0] p-3 rounded-xl bg-white text-xs focus:outline-none leading-relaxed font-sans"
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#f5f5f0] flex gap-3">
            <button 
              type="submit" 
              className="bg-[#5A5A40] text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#5A5A40]/90 cursor-pointer shadow-sm"
            >
              Confirm & Save Creation
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="bg-[#f5f5f0] text-[#666666] hover:bg-[#e5e5e0] px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Discard
            </button>
          </div>
        </form>
      )}

      {products.length === 0 && !isAdding && (
         <div className="text-center bg-white p-16 rounded-3xl border border-[#e5e5e0] py-24 shadow-sm">
           <p className="text-muted-foreground font-serif text-xl italic mb-4">You haven't added any scent products yet.</p>
           <button onClick={() => setIsAdding(true)} className="text-[#5A5A40] font-semibold underline text-sm">Upload your first craft masterpiece</button>
         </div>
      )}

      {/* Product grid displaying custom descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-3xl border border-[#e5e5e0]/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#5A5A40]/10 px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                  <h4 className="font-serif font-semibold text-lg text-[#1a1a1a] mt-1">{p.name}</h4>
                </div>
                
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ${p.isActive ? 'bg-[#5A5A40]/10 text-[#5A5A40]' : 'bg-gray-100 text-[#666666]'}`}>
                  {p.isActive ? <Eye size={12} /> : <EyeOff size={11} />}
                  {p.isActive ? 'Live' : 'Hidden'}
                </span>
              </div>

              {p.imageUrl && (
                <div className="h-28 rounded-xl overflow-hidden bg-[#f5f5f0]">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}

              <p className="text-xs text-[#666666] font-light leading-relaxed line-clamp-3 italic">
                "{p.description || "No custom aromatic review added yet."}"
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#f5f5f0] flex justify-between items-center bg-white">
              <p className="text-lg font-serif font-semibold text-[#5A5A40]">${p.price.toFixed(2)}</p>
              <button 
                onClick={() => handleDelete(p.id)} 
                className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider cursor-pointer"
              >
                Retire
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===========================================
   TAB 3: INVENTORY WITH BATCH WAX CALCULATOR 
   =========================================== */
function MaterialsTab({ storeId }: { storeId: string }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', quantity: '1000', unit: 'g' });

  // Calculator State
  const [itemsToPour, setItemsToPour] = useState<number>(6);
  const [unitWeight, setUnitWeight] = useState<number>(85); // g
  const [fragranceLoad, setFragranceLoad] = useState<number>(10); // % percentage representation

  useEffect(() => {
    return subscribeToMaterials(storeId, setMaterials);
  }, [storeId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDocument(collections.MATERIALS, 'M-' + Date.now().toString(), {
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      storeId
    });
    setFormData({ name: '', quantity: '1000', unit: 'g' });
    toast.success("Ingredient registered!");
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(collections.MATERIALS, id);
    toast.success("Supply removed from workspace.");
  };

  // Handcrafted calculations for Scent Batch
  const calculationResults = useMemo(() => {
    const totalWeightNeeded = itemsToPour * unitWeight;
    // FO loads are calculated relative to wax weight (Weight of Wax = Total / (1 + Load%))
    const loadPercentage = fragranceLoad / 100;
    const waxWeightNeeded = totalWeightNeeded / (1 + loadPercentage);
    const fragranceOilNeeded = totalWeightNeeded - waxWeightNeeded;

    return {
      total: totalWeightNeeded,
      wax: waxWeightNeeded,
      oil: fragranceOilNeeded
    };
  }, [itemsToPour, unitWeight, fragranceLoad]);

  return (
    <div className="space-y-8">
      {/* Intro block */}
      <div className="bg-white p-5 rounded-3xl border border-[#e5e5e0] shadow-sm">
        <h3 className="text-2xl font-serif text-[#1a1a1a]">Supplies & Raw Stocks</h3>
        <p className="text-xs text-[#666666] font-light">Track organic soy wax bases, natural fragrance oils, packaging boxes, and botanical elements safely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* SUPPLIES LIST AND ENTRANCE */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleCreate} className="bg-white p-5 rounded-3xl border border-[#e5e5e0] shadow-sm space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#5A5A40]">Log Raw Ingredient Base</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Supply Name / Code</label>
                <input required placeholder="e.g. Golden Soy Wax Flakes (Y50)" className="w-full border border-[#e5e5e0] p-2.5 rounded-xl bg-[#f5f5f0]/20 text-xs focus:bg-white focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">On-Hand Quantity</label>
                <input required type="number" step="any" className="w-full border border-[#e5e5e0] p-2.5 rounded-xl bg-[#f5f5f0]/20 text-xs focus:bg-white focus:outline-none" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Unit</label>
                <input required placeholder="g, oz, fl-oz, pcs" className="w-full border border-[#e5e5e0] p-2.5 rounded-xl bg-[#f5f5f0]/20 text-xs focus:bg-white focus:outline-none" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="bg-[#5A5A40] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#5A5A40]/90 transition-all cursor-pointer shadow-sm">
              Register Supply Stock
            </button>
          </form>

          {/* Supplies stock layout */}
          <div className="bg-white rounded-3xl border border-[#e5e5e0] shadow-sm overflow-hidden pb-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#1a1a1a] p-5 pb-2 border-b border-[#f5f5f0]">Workspace Supply Records</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f5f5f0] text-[#666666] text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="p-4 pl-6">Supply Code</th>
                    <th className="p-4">Available Weight/Count</th>
                    <th className="p-4 text-right pr-6">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f0] text-xs font-light">
                  {materials.map(m => (
                    <tr key={m.id} className="hover:bg-[#f5f5f0]/45 transition-colors">
                      <td className="p-4 pl-6 font-semibold">{m.name}</td>
                      <td className="p-4 font-mono font-medium text-[#5A5A40]">{m.quantity} <span className="text-[#666666] font-normal">{m.unit}</span></td>
                      <td className="p-4 text-right pr-6">
                        <button onClick={() => handleDelete(m.id)} className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider cursor-pointer">Discard</button>
                      </td>
                    </tr>
                  ))}
                  {materials.length === 0 && (
                    <tr><td colSpan={3} className="p-10 text-center text-[#666666] italic">No active supplies registered in the current workspace. Copy inventory stocks details here.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========================================================
            VIP UPGRADE: ARTIFACT BATCH CALCULATOR FOR CHANDLERS
            ======================================================== */}
        <div className="bg-white rounded-3xl p-6 border border-[#5A5A40]/20 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#5A5A40]/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex items-center gap-2 border-b border-[#f5f5f0] pb-3">
            <Calculator className="text-[#5A5A40]" size={18} />
            <h4 className="font-serif text-lg font-medium">Aroma Batch Calculator</h4>
          </div>
          
          <p className="text-[11px] text-[#666666] leading-relaxed font-light">
            Wax-melt masters calculate relative ratios of wax and fragrance load strictly. Input pour configurations below:
          </p>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Batch Scent Items to Pour</label>
              <input 
                type="number" 
                className="w-full border border-[#e5e5e0] p-2.5 rounded-xl text-xs focus:outline-none" 
                value={itemsToPour}
                onChange={e => setItemsToPour(Math.max(1, parseInt(e.target.value) || 0))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Weight per Sachet/Melt (g or oz)</label>
              <input 
                type="number" 
                className="w-full border border-[#e5e5e0] p-2.5 rounded-xl text-xs focus:outline-none" 
                value={unitWeight}
                onChange={e => setUnitWeight(Math.max(1, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">Fragrance Percentage Load (e.g. 10%)</label>
              <input 
                type="number" 
                className="w-full border border-[#e5e5e0] p-2.5 rounded-xl text-xs focus:outline-none font-mono" 
                value={fragranceLoad}
                onChange={e => setFragranceLoad(Math.max(1, parseFloat(e.target.value) || 0))}
              />
            </div>
          </div>

          <div className="bg-[#f5f5f0] p-4 rounded-2xl border border-[#e5e5e0]/60 space-y-3.5">
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#5A5A40] border-b border-[#e5e5e0]/80 pb-1.5">Required Pouring Recipes</h5>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#666666] font-light">Total Target Mass:</span>
              <span className="font-mono font-bold text-[#1a1a1a]">{calculationResults.total.toFixed(1)} g</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748b] font-medium flex items-center gap-1">🌱 Clean Soy Wax:</span>
              <span className="font-mono font-bold text-[#5A5A40]">{calculationResults.wax.toFixed(1)} g</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748b] font-medium flex items-center gap-1">🧪 Fragrance Oil:</span>
              <span className="font-mono font-bold text-[#5A5A40]">{calculationResults.oil.toFixed(1)} g <span className="text-[10px] font-normal text-[#666666]">({fragranceLoad}%)</span></span>
            </div>
          </div>

          <div className="text-[10px] text-[#666666] font-light flex items-start gap-1 p-1">
            <Info size={12} className="text-[#5A5A40] shrink-0 mt-0.5" />
            <span>Adding scent oil to soy wax is recommended at precisely 185° Fahrenheit for pristine hot scent throws.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================
   TAB 4: WEB ORDER REGISTRY AND STAT STATUS
   =========================================== */
function OrdersTab({ storeId }: { storeId: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    return subscribeToOrders(storeId, setOrders);
  }, [storeId]);

  const updateStatus = async (id: string, status: string) => {
    await updateDocument(collections.ORDERS, id, { status });
    toast.success(`Order ${id} marked as ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-[#e5e5e0] shadow-sm">
        <h3 className="text-2xl font-serif text-[#1a1a1a]">Customer Bookings & Orders</h3>
        <p className="text-xs text-[#666666] font-light">Confirm incoming bespoke orders placed by storefront visitors. Update processing status instantly.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-3xl border border-[#e5e5e0]/60 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex-1 w-full space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold font-mono text-[#5A5A40] bg-[#5A5A40]/10 px-2.5 py-1 rounded-full">
                    REF: {o.id}
                  </span>
                  <p className="font-serif text-lg font-semibold text-[#1a1a1a] mt-2">
                    {o.customerName} 
                    <span className="font-sans font-normal text-xs text-[#666666] ml-2 block sm:inline font-mono">({o.customerPhone})</span>
                  </p>
                </div>
                
                <span className="text-[10px] text-[#666666] md:hidden font-mono bg-[#f5f5f0] px-2 py-1 rounded">
                  {new Date(o.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="bg-[#f5f5f0]/50 p-4 rounded-2xl border border-[#e5e5e0]/30 text-xs space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-1">Selections:</p>
                {o.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between font-medium">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-[#666666] font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <p className="font-serif text-xl font-semibold text-[#5A5A40]">Total Billing: ${o.total.toFixed(2)}</p>
            </div>
            
            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2.5 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#f5f5f0] shrink-0">
              <span className="text-[11px] text-[#666666] hidden md:block font-mono">
                {new Date(o.createdAt).toLocaleString()}
              </span>
              
              <select 
                className={`border p-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider focus:outline-none w-full md:w-auto text-center cursor-pointer
                  ${o.status === 'pending' ? 'bg-amber-50 text-amber-900 border-amber-200' : 
                    o.status === 'completed' ? 'bg-green-50 text-green-900 border-green-200' : 
                    'bg-slate-50 text-slate-900 border-slate-200'}`}
                value={o.status || 'pending'}
                onChange={e => updateStatus(o.id, e.target.value)}
              >
                <option value="pending">⏳ Pending Transfer</option>
                <option value="completed">✅ Batch Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
           <div className="text-center bg-white p-16 rounded-3xl border border-dashed border-[#e5e5e0] py-24 shadow-xs">
             <p className="text-muted-foreground font-serif italic text-lg mb-2">Workspace waiting for incoming client baskets.</p>
             <p className="text-xs text-[#666666] font-light">Share your direct storefront link to acquire botanical confirmations!</p>
           </div>
        )}
      </div>
    </div>
  );
}

/* ===========================================
   TAB 5: REVENUE INSIGHT REPORTS (D3 RECHARTS)
   =========================================== */
function ReportsTab({ storeId }: { storeId: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    return subscribeToOrders(storeId, setOrders);
  }, [storeId]);

  const chartData = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const monthlyData: Record<string, number> = {};
    
    completedOrders.forEach(o => {
      if (o.createdAt) {
        const month = format(parseISO(o.createdAt), 'MMM yyyy');
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += o.total;
      }
    });

    return Object.keys(monthlyData).map(month => ({
      name: month,
      Sales: monthlyData[month]
    })).reverse(); 
  }, [orders]);

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.Sales, 0);
  const completedCount = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-[#e5e5e0] shadow-sm">
        <h3 className="text-2xl font-serif text-[#1a1a1a]">Boutique Growth Records</h3>
        <p className="text-xs text-[#666666] font-light">Assess growth performance, check average transaction revenue, and trace active completed wax creations.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#e5e5e0] space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A5A40]/5 rounded-full blur-2xl"></div>
          <p className="text-[#666666] text-[10px] uppercase font-bold tracking-widest font-medium">Boutique Net Sales (Completed)</p>
          <p className="text-5xl font-serif text-[#5A5A40] font-semibold">${totalRevenue.toFixed(2)}</p>
          <div className="text-[10px] text-[#666666] font-light pt-2">Direct US transfers, net of transaction fees.</div>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#e5e5e0] space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c4c4af]/10 rounded-full blur-2xl"></div>
          <p className="text-[#666666] text-[10px] uppercase font-bold tracking-widest font-medium">Completed Batches</p>
          <p className="text-5xl font-serif text-[#5A5A40] font-semibold">{completedCount}</p>
          <div className="text-[10px] text-[#666666] font-light pt-2">Total successful wax creation orders finalized.</div>
        </div>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#e5e5e0] space-y-6">
        <div>
          <h4 className="font-serif text-lg font-medium text-[#1a1a1a]">Revenue Stream Timeline</h4>
          <p className="text-[11px] text-[#666666] font-light">Monthly chart tracing customer e-transfers received.</p>
        </div>
        
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#666', fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 10, fill: '#666', fontFamily: 'monospace'}} axisLine={false} tickLine={false} tickFormatter={(val: number) => `$${val}`} />
              <Tooltip cursor={{fill: '#f5f5f0'}} contentStyle={{borderRadius: '16px', border: '1px solid #e5e5e0', fontSize: '12px'}} />
              <Bar dataKey="Sales" fill="#5A5A40" radius={[8, 8, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
