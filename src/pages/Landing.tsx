import React from 'react';
import { ShoppingBag, ChevronRight, Wind, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Landing() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (user) {
      navigate('/admin');
    } else {
      await login();
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Elegantly styled background accents */}
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-25 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#5A5A40]/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#c4c4af]/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-2xl text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 bg-[#5A5A40]/10 text-[#5A5A40] px-4 py-2 rounded-full font-medium text-sm mb-4 border border-[#5A5A40]/20 animate-fade-in">
          <ShoppingBag size={16} />
          <span>For Artisan Scent & Wax Makers</span>
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#1a1a1a] leading-tight">
          Your <span className="text-[#5A5A40] italic font-normal">virtual boutique</span> in minutes.
        </h1>
        
        <p className="text-lg md:text-xl text-[#666666] md:px-12 font-light leading-relaxed">
          The ultimate digital companion for premium wax artisans. Share your beautifully formatted catalog, manage your raw wax ingredient stocks, and receive orders directly on Venmo, CashApp, or text with zero commission.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleStart}
            className="group inline-flex items-center gap-3 bg-[#5A5A40] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#5A5A40]/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            {user ? 'Enter my Business Console' : 'Launch My Boutique Store'}
            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-[#e5e5e0] max-w-xl mx-auto">
          <div className="text-center space-y-1">
            <Sparkles className="mx-auto text-[#5A5A40]" size={20} />
            <h3 className="font-serif font-medium text-[#1a1a1a]">AI Copywriting</h3>
            <p className="text-xs text-[#666666] font-light">Generate poetic luxury scent descriptions instantly.</p>
          </div>
          <div className="text-center space-y-1">
            <Wind className="mx-auto text-[#5A5A40]" size={20} />
            <h3 className="font-serif font-medium text-[#1a1a1a]">AI Sommelier</h3>
            <p className="text-xs text-[#666666] font-light">Guiding your clients to their signature custom blends.</p>
          </div>
          <div className="text-center space-y-1">
            <Heart className="mx-auto text-[#5A5A40]" size={20} />
            <h3 className="font-serif font-medium text-[#1a1a1a]">US-Native checkout</h3>
            <p className="text-xs text-[#666666] font-light">Direct payment via Venmo, CashApp, SMS & email.</p>
          </div>
        </div>

        <div className="mt-12 pt-4 text-xs text-[#666666]">
          An exclusive service designed for <span className="font-semibold text-[#5A5A40]">Aroma PRO VIPs</span>.
        </div>
      </div>
    </div>
  );
}
