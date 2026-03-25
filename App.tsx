
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, User, AppView } from './types';
import EcoAssistant from './components/EcoAssistant';
import CarbonDashboard from './components/CarbonDashboard';
import AdminDashboard from './components/AdminDashboard';
import { 
  ShoppingBag, 
  Leaf, 
  User as UserIcon, 
  LogOut, 
  ChevronRight, 
  Star, 
  ArrowLeft, 
  CheckCircle,
  Truck,
  CreditCard,
  X,
  Plus,
  Minus,
  Menu,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowDown
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // Initialize Auth
  useEffect(() => {
    const savedUser = localStorage.getItem('eco_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))], []);

  const filteredProducts = useMemo(() => {
    return activeCategory === 'All' 
      ? MOCK_PRODUCTS 
      : MOCK_PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Smart Recommendations Logic: Find products that are better in the same category
  const recommendations = useMemo(() => {
    if (!selectedProduct) return [];
    
    return MOCK_PRODUCTS.filter(p => 
      p.category === selectedProduct.category && 
      p.id !== selectedProduct.id &&
      (p.ecoScore >= selectedProduct.ecoScore || p.carbonFootprint <= selectedProduct.carbonFootprint)
    )
    .sort((a, b) => b.ecoScore - a.ecoScore)
    .slice(0, 3);
  }, [selectedProduct]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const handleAuth = (type: 'login' | 'register') => {
    if (type === 'register') {
      const newUser: User = { id: Date.now().toString(), name: authForm.name, email: authForm.email, role: 'user' };
      localStorage.setItem('eco_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
    } else {
      const isAdmin = authForm.email.includes('admin');
      const mockUser: User = { 
        id: '1', 
        name: isAdmin ? 'Platform Owner' : 'Green Shopper', 
        email: authForm.email || 'shopper@eco.com',
        role: isAdmin ? 'admin' : 'user'
      };
      setCurrentUser(mockUser);
    }
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('eco_user');
    setCurrentUser(null);
    setView('landing');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- RENDERING VIEWS ---

  const AuthView = (type: 'login' | 'register') => (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl">
        <h2 className="text-3xl font-black text-slate-900 mb-2">{type === 'login' ? 'Welcome Back' : 'Join EcoBazaarX'}</h2>
        <p className="text-slate-500 mb-8">{type === 'login' ? 'Log in to manage your green impact.' : 'Start your journey towards zero-waste shopping.'}</p>
        
        <div className="space-y-4">
          {type === 'register' && (
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                value={authForm.name}
                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="eco@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="••••••••"
            />
          </div>
          <button 
            onClick={() => handleAuth(type)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-emerald-600/20 transition-all mt-4"
          >
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );

  const LandingView = () => (
    <div className="bg-white">
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-[120px]"></div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-8">
            <Star className="w-4 h-4 mr-2 fill-current" /> Certified Sustainable Marketplace
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
            Shop Smart. Shop Green.<br/><span className="text-emerald-600">Save the Planet. 🌱</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            The world's first carbon-aware e-commerce platform. We calculate the environmental footprint of every item so you don't have to.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={() => setView('register')} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2">
              Start Shopping Green <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setAuthForm({ ...authForm, email: 'admin@ecobazaar.com' }); setView('login'); }}
              className="w-full sm:w-auto bg-white border-2 border-slate-100 hover:border-emerald-200 text-slate-600 px-10 py-5 rounded-2xl text-lg font-bold transition-all"
            >
              Owner Login
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: Leaf, title: 'Carbon Tracking', desc: 'Real-time calculation of CO2e emissions for every product.' },
              { icon: CheckCircle, title: 'Verified Eco-Scores', desc: 'Strict auditing of supply chains and material sourcing.' },
              { icon: ShoppingBag, title: 'Sustainable Delivery', desc: 'Carbon-neutral shipping options for every single order.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const ProductGrid = () => (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Discover Green Excellence</h2>
          <p className="text-slate-500 mt-2">Browse our curated collection of {MOCK_PRODUCTS.length} eco-friendly essentials.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => { setSelectedProduct(product); setView('product-detail'); window.scrollTo(0,0); }}>
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black text-emerald-700 rounded-lg shadow-sm border border-emerald-100 flex items-center gap-1">
                   ECO SCORE {product.ecoScore}
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-[10px] font-black text-white rounded-lg shadow-sm flex items-center gap-1">
                   {product.carbonFootprint}kg CO2e
                </div>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{product.category}</span>
                <span className="text-lg font-black text-slate-900">${product.price.toFixed(2)}</span>
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-emerald-700 transition-colors cursor-pointer" onClick={() => { setSelectedProduct(product); setView('product-detail'); }}>{product.name}</h4>
              <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2">{product.description}</p>
              
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                Add to Cart <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProductDetailView = () => {
    if (!selectedProduct) return null;
    return (
      <div className="container mx-auto px-4 py-12">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <div className="space-y-6">
            <div className="rounded-[40px] overflow-hidden shadow-2xl">
              <img src={selectedProduct.image} className="w-full aspect-square object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <h5 className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">Carbon Impact</h5>
                <p className="text-2xl font-black text-emerald-900">{selectedProduct.carbonFootprint} kg</p>
                <p className="text-xs text-emerald-600 mt-1">Direct Emission Value</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h5 className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Eco Rating</h5>
                <p className="text-2xl font-black text-slate-900">{selectedProduct.ecoScore}/100</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${selectedProduct.ecoScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">{selectedProduct.category}</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{selectedProduct.name}</h2>
            <p className="text-2xl font-black text-slate-900 mb-8">${selectedProduct.price.toFixed(2)}</p>
            <div className="prose prose-slate mb-10">
              <p className="text-slate-600 text-lg leading-relaxed mb-6">{selectedProduct.fullDescription}</p>
              
              {/* Shipping Origin Section */}
              <div className="mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-white shadow-sm text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source & Shipping Origin</h6>
                  <p className="text-slate-900 font-bold">
                    {selectedProduct.name.toLowerCase().includes('beeswax') 
                      ? 'Handcrafted in Local Artisan Studio' 
                      : selectedProduct.shippingOrigin}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Ethically sourced and locally produced to minimize supply chain emissions.</p>
                </div>
              </div>

              <h6 className="text-sm font-bold text-slate-900 mb-3">Material Composition:</h6>
              <ul className="flex flex-wrap gap-2">
                {selectedProduct.materials.map(m => (
                  <li key={m} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{m}</li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(selectedProduct)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* --- SMART ECO-RECOMMENDATIONS SECTION --- */}
        {recommendations.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3">
                  Eco-Upgrade Suggestion
                </div>
                <h3 className="text-3xl font-black text-slate-900">Recommended for Earth</h3>
                <p className="text-slate-500 mt-2">Alternatives in <strong className="text-emerald-600">{selectedProduct.category}</strong> with even better environmental stats.</p>
              </div>
              <button className="hidden md:flex items-center gap-2 text-slate-900 font-black hover:text-emerald-600 transition-colors">
                Compare All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendations.map(rec => {
                const carbonDiff = (selectedProduct.carbonFootprint - rec.carbonFootprint).toFixed(1);
                const scoreDiff = rec.ecoScore - selectedProduct.ecoScore;
                const isBetterCarbon = parseFloat(carbonDiff) > 0;
                const isBetterScore = scoreDiff > 0;

                return (
                  <div 
                    key={rec.id} 
                    className="bg-white rounded-[40px] p-2 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                    onClick={() => { setSelectedProduct(rec); window.scrollTo(0,0); }}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[32px]">
                      <img src={rec.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                        {isBetterCarbon && (
                          <div className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black flex items-center gap-1 shadow-lg">
                            <ArrowDown className="w-3 h-3" /> {carbonDiff}kg CO2e
                          </div>
                        )}
                        {isBetterScore && (
                          <div className="px-3 py-1 bg-white text-emerald-700 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-lg border border-emerald-100">
                            <TrendingUp className="w-3 h-3" /> +{scoreDiff} ECO SCORE
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-black text-slate-900 text-lg line-clamp-1">{rec.name}</h5>
                        <span className="font-bold text-emerald-600">${rec.price.toFixed(2)}</span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">{rec.description}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                        Explore Upgrade <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const CartView = () => (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Shopping Cart ({cartItemsCount})</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Your cart is empty.</p>
          <button onClick={() => setView('dashboard')} className="mt-6 text-emerald-600 font-black flex items-center gap-2 mx-auto">
            Browse Products <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <CarbonDashboard items={cart} />
            {cart.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                <img src={item.image} className="w-24 h-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-400">{item.category} • {item.carbonFootprint}kg CO2e</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button onClick={() => updateCartQty(item.id, -1)} className="p-1 text-slate-400 hover:text-emerald-600"><Minus className="w-4 h-4" /></button>
                    <span className="font-black text-slate-900">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="p-1 text-slate-400 hover:text-emerald-600"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => updateCartQty(item.id, -item.quantity)} className="text-xs font-bold text-red-400 mt-2 hover:text-red-600 transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Eco-Packaging</span>
                  <span className="text-emerald-600">FREE</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between">
                  <span className="text-lg font-black text-slate-900">Total</span>
                  <span className="text-lg font-black text-emerald-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => setView('checkout')}
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg transition-all"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CheckoutView = () => (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => setView('cart')} className="p-2 text-slate-400 hover:text-emerald-600"><ArrowLeft /></button>
        <h2 className="text-3xl font-black text-slate-900">Secure Checkout</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-black">1</div>
              <h4 className="font-bold text-slate-900">Shipping Details</h4>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Full Address" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-black">2</div>
              <h4 className="font-bold text-slate-900">Payment</h4>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <CreditCard className="text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">Payment via Secure Link</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl h-fit">
          <h3 className="text-xl font-bold mb-6">Review</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-slate-400">
              <span>Items</span>
              <span className="text-white">{cartItemsCount}</span>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-between text-xl font-black">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => { setCart([]); setView('success'); }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-5 rounded-2xl font-black text-lg transition-all"
          >
            Complete Purchase
          </button>
        </div>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 animate-bounce">
        <CheckCircle className="w-12 h-12" />
      </div>
      <h2 className="text-5xl font-black text-slate-900 mb-4">Great Choice!</h2>
      <p className="text-slate-500 text-xl max-w-lg mx-auto mb-12">
        You've just saved a estimated <strong>{cart.reduce((s,i) => s + (i.carbonFootprint * i.quantity), 0).toFixed(1)}kg</strong> of carbon emissions.
      </p>
      <button onClick={() => setView('dashboard')} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black transition-all">Go Home</button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <nav className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(currentUser ? 'dashboard' : 'landing')}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">EcoBazaar<span className="text-emerald-600">X</span></h1>
          </div>
          {currentUser && (
            <div className="hidden md:flex items-center gap-8">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => { setActiveCategory(cat); setView('dashboard'); }}
                  className={`text-sm font-semibold transition-colors ${activeCategory === cat ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
                >
                  {cat}
                </button>
              ))}
              {currentUser.role === 'admin' && (
                <button onClick={() => setView('admin')} className="flex items-center gap-1.5 text-sm font-black text-indigo-600 hover:text-indigo-800 transition-colors">
                  <ShieldCheck className="w-4 h-4" /> ADMIN
                </button>
              )}
            </div>
          )}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <button onClick={() => setView('cart')} className="relative p-2 text-slate-600 hover:bg-emerald-50 rounded-full transition-all">
                  <ShoppingBag className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
                <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 rounded-full">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => setView('login')} className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Login</button>
                <button onClick={() => setView('register')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md">Join Us</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {view === 'landing' && <LandingView />}
        {view === 'login' && AuthView('login')}
        {view === 'register' && AuthView('register')}
        {view === 'dashboard' && <ProductGrid />}
        {view === 'product-detail' && <ProductDetailView />}
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'success' && <SuccessView />}
        {view === 'admin' && <AdminDashboard />}
      </main>

      <footer className="bg-white border-t border-slate-100 py-16 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="text-emerald-600 w-8 h-8" />
            <span className="text-2xl font-black text-slate-900">EcoBazaarX</span>
          </div>
          <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-8 text-sm">
            Building a future where sustainability is the default choice for every consumer.
          </p>
          <div className="pt-12 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            © 2024 EcoBazaarX Global. All Carbon Calculations Verified.
          </div>
        </div>
      </footer>
      <EcoAssistant products={MOCK_PRODUCTS} cart={cart} />
    </div>
  );
};

export default App;
