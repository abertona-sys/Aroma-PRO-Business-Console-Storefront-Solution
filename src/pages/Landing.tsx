import React from 'react';
import { ShoppingBag, ChevronRight, Wind, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Landing() {
  const { user, login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (user) {
      navigate('/admin');
    } else {
      try {
        await login();
        navigate('/admin');
      } catch (err) {
        console.error("Authentication failed inside landing trigger:", err);
      }
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

      {/* Modern Botanical Auth Troubleshooting Modal */}
      {error && (
        <div className="fixed inset-0 bg-[#000000]/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5e0] rounded-2xl max-w-lg w-full p-8 shadow-2xl relative space-y-6 animate-fade-in text-left">
            <button 
              onClick={() => setError(null)}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#1a1a1a] transition-colors p-2 text-lg font-medium"
              aria-label="Close dialog"
            >
              ✕
            </button>
            
            <div className="space-y-2">
              <span className="text-[10px] text-[#5A5A40] uppercase tracking-widest font-bold bg-[#5A5A40]/10 px-2.5 py-1 rounded-full">
                Preview Sandbox Alert
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#1a1a1a] leading-tight pt-1">
                Resolving Sign-In Inside Previews
              </h2>
            </div>

            <div className="text-sm text-[#444444] space-y-4 leading-relaxed">
              <p>
                Browsers enforce high security criteria that can block the Google Authentication dialogue window. What is happening:
              </p>

              <div className="space-y-4 pl-3 border-l-2 border-[#5A5A40]/30 py-1">
                <div>
                  <strong className="text-[#1a1a1a] font-semibold block text-xs uppercase tracking-wider text-[#5A5A40]">
                    1. Security Frame Protection (Most Likely)
                  </strong>
                  <span className="text-xs text-[#666666] mt-0.5 block font-light">
                    The app is running inside an <strong>iframe</strong> in your AI Studio preview. Browsers block third-party cookies and window-cross-talk here. <strong>Opening the app in a new browser tab resolves this immediately.</strong>
                  </span>
                </div>
                <div>
                  <strong className="text-[#1a1a1a] font-semibold block text-xs uppercase tracking-wider text-[#5A5A40]">
                    2. Firebase Redirect Domain Validation
                  </strong>
                  <span className="text-xs text-[#666666] mt-0.5 block font-light">
                    If this is a newly set-up backend, ensure the domain has been added to the approved authentication list under <strong>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains</strong>.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#f5f5f0] p-4 rounded-xl space-y-2 border border-[#e5e5e0]">
              <div className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider">
                This Environment's Approved Hostname:
              </div>
              <div className="font-mono text-xs text-[#5A5A40] select-all break-all bg-white p-2 rounded border border-[#e5e5e0]">
                {window.location.hostname}
              </div>
              <div className="text-[10px] text-[#888888] font-light italic">
                (Add this exact hostname in your Firebase Console setting to whitelist it)
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href={window.location.origin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-[#5A5A40] text-white px-5 py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#5A5A40]/95 transition-all shadow-md hover:-translate-y-0.5"
              >
                Launch In New Tab ↗
              </a>
              <button 
                onClick={() => setError(null)}
                className="flex-1 bg-white border border-[#e5e5e0] text-[#1a1a1a] px-5 py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#f5f5f0] transition-colors"
              >
                Close & Re-test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
