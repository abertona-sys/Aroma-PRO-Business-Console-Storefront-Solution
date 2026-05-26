import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Wind, Heart, Sparkles, AlertCircle, Key, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Landing() {
  const { user, login, loginWithEmail, registerWithEmail, error, setError } = useAuth();
  const navigate = useNavigate();

  const [showEmailLoginForm, setShowEmailLoginForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Please fill out both email and password.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || String(err);
      if (errMsg.includes("auth/user-not-found") || errMsg.includes("auth/invalid-credential")) {
        errMsg = "Authentication failed. Make sure to toggle 'Create Account' below if you are a new maker registering for the first time!";
      } else if (errMsg.includes("auth/wrong-password")) {
        errMsg = "Incorrect password. Please try again.";
      } else if (errMsg.includes("auth/email-already-in-use")) {
        errMsg = "This email is already registered. Please sign in instead.";
      } else if (errMsg.includes("auth/weak-password")) {
        errMsg = "Password is too weak. Please use at least 6 characters.";
      } else if (errMsg.includes("auth/invalid-email")) {
        errMsg = "Please enter a valid email address.";
      }
      setLocalError(errMsg);
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

        <div className="pt-8 flex flex-col gap-4 justify-center items-center">
          <button 
            onClick={handleStart}
            className="group inline-flex items-center gap-3 bg-[#5A5A40] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#5A5A40]/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            {user ? 'Enter my Business Console' : 'Launch My Boutique Store with Google'}
            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>

          {!user && (
            <div className="w-full max-w-sm">
              <button
                onClick={() => {
                  setShowEmailLoginForm(!showEmailLoginForm);
                  setError(null);
                  setLocalError(null);
                }}
                className="text-[#5A5A40] hover:text-[#5A5A40]/80 text-xs font-semibold tracking-wide border-b border-dashed border-[#5A5A40]/40 pb-0.5 transition-colors mt-2"
                type="button"
              >
                {showEmailLoginForm ? "✕ Clear Form & Options" : "Trouble with Google Auth? Access via Email / Password instead"}
              </button>
              
              {showEmailLoginForm && (
                <form onSubmit={handleEmailAuth} className="mt-6 bg-white border border-[#e5e5e0] p-6 rounded-2xl shadow-xl text-left space-y-4 animate-fade-in relative z-20">
                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-normal text-[#1a1a1a] flex items-center gap-1.5 font-semibold text-[#5A5A40]">
                      <Key size={16} />
                      Artisan Passcode Access
                    </h4>
                    <p className="text-[10px] text-[#666666] leading-relaxed">
                      Create an account or login using email and passcode to access your private studio database cleanly on any domain.
                    </p>
                  </div>

                  {localError && (
                    <div className="text-xs bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 font-light flex gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{localError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#666666] mb-1">Maker Email</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="maker@aroma.co"
                        required
                        className="w-full text-xs px-3 py-2.5 bg-[#f5f5f0] border border-[#e5e5e0] rounded-lg focus:outline-none focus:border-[#5A5A40] text-[#1a1a1a]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#666666] mb-1">Passcode (min 6 chars)</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full text-xs px-3 py-2.5 bg-[#f5f5f0] border border-[#e5e5e0] rounded-lg focus:outline-none focus:border-[#5A5A40] text-[#1a1a1a]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full bg-[#5A5A40] text-white py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#5A5A40]/95 transition-all shadow-sm"
                    >
                      {isRegister ? "Register & Create Custom Database" : "Secure Sign-In"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsRegister(!isRegister)}
                      className="text-center text-[10px] text-[#666666] hover:text-[#1a1a1a] transition-colors pt-1"
                    >
                      {isRegister ? "Already configured? Sign In Instead" : "Need to register first? Toggle 'Create Artisan Account'"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
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

            <div className="bg-[#5A5A40]/5 border border-[#5A5A40]/20 p-5 rounded-xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#5A5A40] font-bold uppercase tracking-wider block">Recommended Bypass: Sign In via Email & Passcode</span>
                <p className="text-xs text-[#444444] font-light">
                  Avoid browser popup restrictions entirely by entering an email and password to log in or register instantly. This works beautifully inside any sandbox, custom tab, frame, or Vercel deployment:
                </p>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3 bg-white p-4 rounded-lg border border-[#e5e5e0]">
                {localError && (
                  <div className="text-[11px] bg-red-50 text-red-600 p-2 rounded border border-red-100 font-light">
                    {localError}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    className="w-full text-xs px-2.5 py-2 bg-[#f5f5f0] border border-[#e5e5e0] rounded focus:outline-none focus:border-[#5A5A40]"
                  />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Passcode / Password (min 6 chars)"
                    required
                    className="w-full text-xs px-2.5 py-2 bg-[#f5f5f0] border border-[#e5e5e0] rounded focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-[#5A5A40] text-white py-2 rounded text-xs uppercase tracking-wider font-semibold hover:bg-[#5A5A40]/90 transition-all font-sans"
                  >
                    {isRegister ? "Confirm Register" : "Sign In Securely"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="border border-[#e5e5e0] text-[#1a1a1a] px-3 rounded text-[10px] hover:bg-[#f5f5f0] transition-colors"
                  >
                    {isRegister ? "Need Sign In" : "Need Register"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-[#f5f5f0] p-4 rounded-xl space-y-2 border border-[#e5e5e0] text-xs">
              <div className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider flex items-center gap-1">
                <span>Domain Whitelisting Configuration Details:</span>
              </div>
              <p className="text-[10px] text-[#666666] font-light leading-relaxed">
                Since <strong>{window.location.hostname}</strong> is not listed as an approved authentication domain in the sandbox's proprietary Google projects, Google Popups will be blocked here. Adding Email Accounts is the standard way to deploy and manage Vercel apps without limits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button 
                onClick={() => {
                  setError(null);
                  setLocalError(null);
                }}
                className="flex-1 bg-white border border-[#e5e5e0] text-[#1a1a1a] p-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#f5f5f0] transition-colors text-center"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
