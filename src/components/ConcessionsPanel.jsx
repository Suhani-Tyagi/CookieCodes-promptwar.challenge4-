import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  Utensils, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  Clock, 
  ShoppingBag, 
  Award, 
  Tag, 
  Compass, 
  ChevronRight,
  Sparkles,
  QrCode,
  CheckCircle2,
  RefreshCw,
  Flame,
  Soup,
  Pizza,
  Leaf,
  Coffee,
  Info
} from 'lucide-react';

const mockStands = [
  { id: "stand-n-1", name: "Apex Burgers & Brats", wait: 5, location: "North Sec 104", type: "grill", icon: Flame, color: "from-orange-500/20 to-red-500/20 text-orange-600 dark:text-orange-400" },
  { id: "stand-n-2", name: "Crescent Shawarma & Bites", wait: 8, location: "North Sec 108", type: "halal", icon: Soup, color: "from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400" },
  { id: "stand-n-3", name: "The Green Pitch Greens", wait: 3, location: "North Sec 102", type: "vegan", icon: Leaf, color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400" },
  { id: "stand-e-1", name: "Curva Nord Pizza & Pies", wait: 12, location: "East Sec 112", type: "pizza", icon: Pizza, color: "from-red-500/20 to-rose-500/20 text-red-650 dark:text-red-400" },
  { id: "stand-s-1", name: "Volcano Smokey Grill", wait: 10, location: "South Sec 122", type: "grill", icon: Flame, color: "from-orange-500/20 to-red-500/20 text-orange-600 dark:text-orange-400" },
  { id: "stand-w-1", name: "Golden Boot Brews", wait: 6, location: "West Sec 130", type: "cafe", icon: Coffee, color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400" }
];

const menuData = {
  "stand-n-1": [
    { id: "burg", name: "Classic Arena Burger", price: 14, isVeg: false, isVegan: false, details: "Premium beef patty, cheddar, secret Arena sauce on brioche" },
    { id: "tend", name: "Crispy Chicken Tenders", price: 12, isVeg: false, isVegan: false, details: "Golden crispy tenders served with honey-drizzle mustard" },
    { id: "fries", name: "Loaded Truffle Fries", price: 9, isVeg: true, isVegan: false, details: "Thin-cut fries smothered in warm cheese sauce & fresh chives" },
    { id: "soda", name: "Fountain Soda (Eco Cup)", price: 6, isVeg: true, isVegan: true, details: "Chilled soda in a reusable souvenir Arena cup" }
  ],
  "stand-n-2": [
    { id: "gyro", name: "Flame-Broiled Chicken Gyro", price: 13, isVeg: false, isVegan: false, details: "Spiced halal chicken, crisp lettuce, red onions, house tzatziki wrap" },
    { id: "fal", name: "Golden Falafel Platter", price: 11, isVeg: true, isVegan: true, details: "Crisp falafel balls served with cream tahini, hummus and pita" },
    { id: "hum", name: "Hummus Bowl & Crispy Pita", price: 7, isVeg: true, isVegan: true, details: "Creamy garlic hummus garnished with olives and olive oil" },
    { id: "soda", name: "Fountain Soda (Eco Cup)", price: 6, isVeg: true, isVegan: true, details: "Chilled soda in a reusable souvenir Arena cup" }
  ],
  "stand-n-3": [
    { id: "salad", name: "Avocado Quinoa Energy Salad", price: 12, isVeg: true, isVegan: true, details: "Fluffy quinoa, sliced avocado, organic greens, light vinaigrette" },
    { id: "wrap", name: "Hummus Veggie Crunch Wrap", price: 11, isVeg: true, isVegan: true, details: "Hummus, Persian cucumbers, bell peppers, spinach, tortilla wrap" },
    { id: "chips", name: "Sweet Potato Baked Crisps", price: 6, isVeg: true, isVegan: true, details: "Kettle-cooked sweet potato chips with pink salt" },
    { id: "water", name: "Organic Coconut Water", price: 5, isVeg: true, isVegan: true, details: "Pure organic coconut hydration water" }
  ],
  "stand-e-1": [
    { id: "pep", name: "Pepperoni Artisan Slice", price: 8, isVeg: false, isVegan: false, details: "Stone-baked thin crust pizza with cured beef pepperoni" },
    { id: "chz", name: "MetLife Cheese Slice", price: 7, isVeg: true, isVegan: false, details: "Bubbling double-mozzarella cheese over rich tomato marinara" },
    { id: "garlic", name: "Garlic Butter Knots (4x)", price: 6, isVeg: true, isVegan: false, details: "Baked dough knots brushed with garlic olive oil and parsley" },
    { id: "soda", name: "Fountain Soda (Eco Cup)", price: 6, isVeg: true, isVegan: true, details: "Chilled soda in a reusable souvenir Arena cup" }
  ],
  "stand-s-1": [
    { id: "burg", name: "Classic Arena Burger", price: 14, isVeg: false, isVegan: false, details: "Premium beef patty, cheddar, secret Arena sauce on brioche" },
    { id: "tend", name: "Crispy Chicken Tenders", price: 12, isVeg: false, isVegan: false, details: "Golden crispy tenders served with honey-drizzle mustard" },
    { id: "fries", name: "Loaded Truffle Fries", price: 9, isVeg: true, isVegan: false, details: "Thin-cut fries smothered in warm cheese sauce & fresh chives" },
    { id: "soda", name: "Fountain Soda (Eco Cup)", price: 6, isVeg: true, isVegan: true, details: "Chilled soda in a reusable souvenir Arena cup" }
  ],
  "stand-w-1": [
    { id: "latte", name: "Arena Iced Latte", price: 7, isVeg: true, isVegan: false, details: "Double espresso shot over milk and ice" },
    { id: "pretzel", name: "Giant Warm Pretzel", price: 8, isVeg: true, isVegan: false, details: "Traditional salted Bavarian pretzel served with cheese dip" },
    { id: "cookie", name: "Fudge Chunk Cookie", price: 4, isVeg: true, isVegan: false, details: "Soft-baked chocolate chip cookie served warm" },
    { id: "soda", name: "Fountain Soda (Eco Cup)", price: 6, isVeg: true, isVegan: true, details: "Chilled soda in a reusable souvenir Arena cup" }
  ]
};

export default function ConcessionsPanel() {
  const { addEcoPoints, userProfile } = useApp();

  const [selectedStandId, setSelectedStandId] = useState("stand-n-1");
  const [cart, setCart] = useState([]);
  const [useReusableCup, setUseReusableCup] = useState(false);

  // Active Order state
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderStep, setOrderStep] = useState(0); // 0: Received, 1: Preparing, 2: Ready for Pickup
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const activeStand = mockStands.find(s => s.id === selectedStandId) || mockStands[0];
  const activeMenu = menuData[selectedStandId] || menuData["stand-n-1"];

  // Cart operations
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    triggerFeedback(`Added ${item.name}!`);
  };

  const updateQty = (itemId, amount) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const nextQty = i.qty + amount;
        return nextQty > 0 ? { ...i, qty: nextQty } : i;
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const triggerFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg("");
    }, 2000);
  };

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = useReusableCup && subtotal > 0 ? 1.00 : 0.00;
  const tax = Math.round(subtotal * 0.088 * 100) / 100;
  const total = Math.max(0, subtotal - discount + tax);

  // Order Placement
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const orderId = `AA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      items: [...cart],
      standName: activeStand.name,
      location: activeStand.location,
      subtotal,
      discount,
      tax,
      total,
      reusableUsed: useReusableCup
    };

    setActiveOrder(newOrder);
    setOrderStep(0);
    setCart([]); // Clear cart

    // Automatic progress simulation
    const timer1 = setTimeout(() => setOrderStep(1), 5000);
    const timer2 = setTimeout(() => {
      setOrderStep(2);
      if (newOrder.reusableUsed) {
        addEcoPoints(50);
      }
    }, 11000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleNextStep = () => {
    setOrderStep(prev => {
      const next = prev + 1;
      if (next === 2 && activeOrder?.reusableUsed) {
        addEcoPoints(50);
      }
      return next <= 2 ? next : prev;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Arena Concessions
            <span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-black tracking-widest uppercase">
              Order Ahead
            </span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Dodge the queues — place your snack orders ahead and collect them near your section.
          </p>
        </div>

        {feedbackMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 animate-bounce">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* HORIZONTAL CONCOURSE MAP SELECTOR (Replaces generic dropdown) */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
          Select Concession Stand
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockStands.map((stand) => {
            const StandIcon = stand.icon;
            const isSelected = stand.id === selectedStandId;
            return (
              <button
                key={stand.id}
                onClick={() => {
                  setSelectedStandId(stand.id);
                  setCart([]); // Clear cart
                }}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-28 ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-500/[0.04] shadow-md dark:shadow-emerald-500/5 ring-1 ring-emerald-500' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] hover:border-zinc-350 dark:hover:border-zinc-700'
                }`}
              >
                {/* Visual Category Icon */}
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stand.color} flex items-center justify-center`}>
                  <StandIcon className="w-4 h-4" />
                </div>

                <div className="mt-2.5">
                  <span className="font-extrabold text-[11px] text-zinc-900 dark:text-zinc-150 block truncate leading-tight">
                    {stand.name}
                  </span>
                  <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block font-medium truncate">
                    {stand.location}
                  </span>
                </div>

                {/* Queue Wait Time Pill */}
                <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-1.5 py-0.5 text-[8px] font-black">
                  <Clock className="w-2.5 h-2.5 text-zinc-400" />
                  <span>{stand.wait}m</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left: Food Menu List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900 pb-2">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-450 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-emerald-500" />
              <span>Available Snacks</span>
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              {activeStand.name} Selection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMenu.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-zinc-350 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 gap-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-extrabold text-sm text-zinc-850 dark:text-zinc-150">
                      {item.name}
                    </h4>
                    <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-450 shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {item.details}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    {item.isVeg && (
                      <span className="text-[9px] font-black text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-550/20">
                        Vegetarian
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="text-[9px] font-black text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-550/20">
                        Vegan
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold p-1.5 rounded-lg transition-colors flex items-center justify-center shadow"
                    aria-label={`Add ${item.name} to order`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart Panel or Active Ticket */}
        <div className="space-y-6">
          
          {/* CART VIEW */}
          {!activeOrder && (
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-150 border-b border-zinc-150 dark:border-zinc-900 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                <span>Your Order Stub</span>
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Utensils className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p className="text-xs text-zinc-450 dark:text-zinc-500 font-medium">
                    Order cart is empty. Add hot dog or fries to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items list */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-2 text-xs py-1 border-b border-zinc-50 dark:border-zinc-900/50">
                        <div className="space-y-0.5">
                          <span className="font-bold text-zinc-850 dark:text-zinc-200">{item.name}</span>
                          <span className="text-[10px] text-zinc-400 font-bold block">${item.price.toFixed(2)} each</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 rounded bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-zinc-850 dark:text-zinc-150 w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 rounded bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reusable Cup Sustainability Switch */}
                  <div className="border-t border-zinc-100 dark:border-zinc-900 pt-3 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-850">
                    <label className="flex items-start gap-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={useReusableCup}
                        onChange={(e) => setUseReusableCup(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-emerald-650 focus:ring-emerald-500 mt-0.5"
                      />
                      <div className="space-y-0.5 flex-1">
                        <span className="flex items-center gap-1">
                          Use Reusable Souvenir Cup
                          {useReusableCup && (
                            <Leaf className="w-3.5 h-3.5 text-emerald-500 animate-leaf shrink-0" />
                          )}
                        </span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-450 block font-black uppercase">
                          Save $1.00 & Gain +50 Eco-Points!
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Calculations */}
                  <div className="border-t border-zinc-150 dark:border-zinc-900 pt-3 space-y-2 text-xs font-semibold text-zinc-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">${subtotal.toFixed(2)}</span>
                    </div>

                    {useReusableCup && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-450 font-bold">
                        <span>Eco Discount</span>
                        <span className="font-mono">-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Tax (8.8%)</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-900 pt-2 text-sm font-black text-zinc-905 dark:text-white">
                      <span>Grand Total</span>
                      <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#064e3b] hover:bg-[#075e3d] text-white font-black text-xs uppercase tracking-wider min-h-11 rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Place Concession Order</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE ORDER TICKET VISUALIZER (Perforated receipt edge look!) */}
          {activeOrder && (
            <div className="ticket-perforation bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg space-y-5 animate-fade-in relative pb-8">
              
              <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                    Concessions Pass
                  </span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-150 leading-none font-mono">
                    {activeOrder.id}
                  </h3>
                </div>

                <button 
                  onClick={() => setActiveOrder(null)}
                  className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 text-xs font-bold"
                >
                  Close Ticket
                </button>
              </div>

              {/* Status Visual Tracker Steps */}
              <div className="space-y-4">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-zinc-450">
                  <span>Order Telemetry</span>
                  <span className="text-emerald-500 font-black">
                    {orderStep === 0 ? "Received" : orderStep === 1 ? "Cooking Now" : "Ready for Pickup"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="grid grid-cols-3 gap-1 h-2 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <div className={`h-full ${orderStep >= 0 ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                  <div className={`h-full ${orderStep >= 1 ? 'bg-emerald-500' : 'bg-transparent'} transition-all`}></div>
                  <div className={`h-full ${orderStep >= 2 ? 'bg-emerald-500' : 'bg-transparent'} transition-all`}></div>
                </div>

                {/* Cooking animation helper */}
                {orderStep === 1 && (
                  <div className="flex items-center justify-center gap-2 p-2.5 bg-orange-500/5 border border-orange-500/20 text-orange-600 rounded-xl text-xs font-bold animate-pulse">
                    <Flame className="w-4 h-4 animate-bounce" />
                    <span>Arena Grills cooking your meal...</span>
                    {/* Steam graphics */}
                    <span className="text-[10px] opacity-75 font-mono animate-steam">♨</span>
                  </div>
                )}

                {/* Detailed Status text */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-150 dark:border-zinc-850 flex items-start gap-2 text-xs">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1 font-semibold">
                    {orderStep === 0 && <p className="text-zinc-600 dark:text-zinc-400">Order successfully received by kitchen staff.</p>}
                    {orderStep === 1 && <p className="text-zinc-650 dark:text-zinc-350">Kitchen staff preparing order. Proceed to your section's concourse counter.</p>}
                    {orderStep === 2 && (
                      <div className="text-emerald-800 dark:text-emerald-400 space-y-1">
                        <p className="font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Ready for Pickup!</span>
                        </p>
                        <p className="text-[10px] leading-relaxed font-medium">Show the ticket QR code at the counter for instant scanning.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Barcode / QR Section */}
              <div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center gap-3 bg-zinc-50/50 dark:bg-zinc-900/10 relative">
                {/* SVG QR Code vector */}
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-zinc-900 dark:text-zinc-150" fill="currentColor">
                  <rect x="5" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="11" y="11" width="10" height="10" />

                  <rect x="73" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="79" y="11" width="10" height="10" />

                  <rect x="5" y="73" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="11" y="79" width="10" height="10" />

                  <rect x="38" y="12" width="6" height="6" />
                  <rect x="54" y="18" width="6" height="6" />
                  <rect x="42" y="32" width="6" height="6" />
                  <rect x="8" y="44" width="6" height="6" />
                  <rect x="22" y="44" width="6" height="6" />
                  <rect x="14" y="54" width="6" height="6" />
                  <rect x="32" y="50" width="12" height="6" />
                  <rect x="42" y="66" width="6" height="12" />
                  <rect x="72" y="44" width="12" height="6" />
                  <rect x="82" y="58" width="6" height="6" />
                  <rect x="68" y="78" width="6" height="6" />
                  <rect x="82" y="78" width="6" height="6" />
                </svg>

                <div className="text-center space-y-1">
                  <span className="text-[9px] text-zinc-450 uppercase tracking-widest font-black block">
                    Collection Point
                  </span>
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 block">
                    {activeOrder.standName}
                  </span>
                  <span className="text-[10px] text-zinc-550 dark:text-zinc-400 block font-medium">
                    {activeOrder.location}
                  </span>
                </div>
              </div>

              {/* Receipt Summary list */}
              <div className="space-y-1.5 text-xs border-t border-zinc-100 dark:border-zinc-900 pt-4">
                <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block mb-1">
                  Receipt Summary
                </span>
                {activeOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between font-medium text-zinc-600 dark:text-zinc-400">
                    <span>{item.qty}x {item.name}</span>
                    <span className="font-mono">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}

                <div className="flex justify-between font-extrabold text-zinc-900 dark:text-zinc-100 border-t border-zinc-100 dark:border-zinc-900 pt-2 mt-2">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">${activeOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Simulator Action */}
              {orderStep < 2 && (
                <button
                  onClick={handleNextStep}
                  className="w-full py-2.5 bg-zinc-550 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulate Next Step</span>
                </button>
              )}

              {/* Reusable cup point check */}
              {activeOrder.reusableUsed && (
                <div className="bg-emerald-500/5 dark:bg-emerald-400/5 border border-emerald-500/15 p-3 rounded-xl flex items-start gap-2 text-[10px] text-emerald-800 dark:text-emerald-400 animate-pulse">
                  <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 font-bold">
                    <span>Sustainability Bonus Credited!</span>
                    <p className="text-[9px] font-medium leading-relaxed">
                      You saved **$1.00** and earned **+50 Eco-Points** by using a Reusable Souvenir Cup!
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
