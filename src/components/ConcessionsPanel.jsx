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
  RefreshCw
} from 'lucide-react';

const mockStands = [
  { id: "stand-n-1", name: "North Grill House", wait: 5, location: "Concourse North (near Sec 104)" },
  { id: "stand-n-2", name: "North Halal Kitchen", wait: 8, location: "Concourse North (near Sec 108)" },
  { id: "stand-n-3", name: "North Garden Stand (Vegan)", wait: 3, location: "Concourse North (near Sec 102)" },
  { id: "stand-e-1", name: "East Pizza Corner", wait: 12, location: "Concourse East (near Sec 112)" },
  { id: "stand-s-1", name: "South Grill House", wait: 10, location: "Concourse South (near Sec 122)" },
  { id: "stand-w-1", name: "West Grill House", wait: 6, location: "Concourse West (near Sec 130)" }
];

const menuData = {
  "stand-n-1": [
    { id: "burg", name: "Classic Burger", price: 14, isVeg: false, isVegan: false, details: "Premium beef patty, lettuce, cheese, special sauce" },
    { id: "tend", name: "Chicken Tenders", price: 12, isVeg: false, isVegan: false, details: "Crispy chicken breast tenders with honey mustard" },
    { id: "fries", name: "Loaded Fries", price: 9, isVeg: true, isVegan: false, details: "Crispy fries smothered in cheese sauce & chives" },
    { id: "soda", name: "Soft Drink", price: 6, isVeg: true, isVegan: true, details: "Served in reusable souvenir cup" }
  ],
  "stand-n-2": [
    { id: "gyro", name: "Chicken Gyro Wrap", price: 13, isVeg: false, isVegan: false, details: "Halal flame-broiled chicken, lettuce, tomato, tzatziki" },
    { id: "fal", name: "Falafel Platter", price: 11, isVeg: true, isVegan: true, details: "Crispy house-made falafel with hummus and pita" },
    { id: "hum", name: "Hummus & Pita Chips", price: 7, isVeg: true, isVegan: true, details: "Smooth garlic hummus with baked pita crisps" },
    { id: "soda", name: "Soft Drink", price: 6, isVeg: true, isVegan: true, details: "Served in reusable souvenir cup" }
  ],
  "stand-n-3": [
    { id: "salad", name: "Quinoa Power Salad", price: 12, isVeg: true, isVegan: true, details: "Mixed greens, quinoa, avocado, tomatoes, lemon dressing" },
    { id: "wrap", name: "Vegan Veggie Wrap", price: 11, isVeg: true, isVegan: true, details: "Hummus, cucumber, roasted red pepper, organic spinach" },
    { id: "chips", name: "Sweet Potato Chips", price: 6, isVeg: true, isVegan: true, details: "Baked sweet potato chips with sea salt" },
    { id: "water", name: "Mineral Water", price: 5, isVeg: true, isVegan: true, details: "Chilled pure mineral water" }
  ],
  "stand-e-1": [
    { id: "pep", name: "Pepperoni Slice", price: 8, isVeg: false, isVegan: false, details: "New York style thin crust topped with spicy pepperoni" },
    { id: "chz", name: "Classic Cheese Slice", price: 7, isVeg: true, isVegan: false, details: "Double mozzarella cheese with sweet tomato sauce" },
    { id: "garlic", name: "Garlic Knots (4x)", price: 6, isVeg: true, isVegan: false, details: "Garlic butter, parsley, with marinara dipping sauce" },
    { id: "soda", name: "Soft Drink", price: 6, isVeg: true, isVegan: true, details: "Served in reusable souvenir cup" }
  ],
  "stand-s-1": [
    { id: "burg", name: "Classic Burger", price: 14, isVeg: false, isVegan: false, details: "Premium beef patty, lettuce, cheese, special sauce" },
    { id: "tend", name: "Chicken Tenders", price: 12, isVeg: false, isVegan: false, details: "Crispy chicken breast tenders with honey mustard" },
    { id: "fries", name: "Loaded Fries", price: 9, isVeg: true, isVegan: false, details: "Crispy fries smothered in cheese sauce & chives" },
    { id: "soda", name: "Soft Drink", price: 6, isVeg: true, isVegan: true, details: "Served in reusable souvenir cup" }
  ],
  "stand-w-1": [
    { id: "burg", name: "Classic Burger", price: 14, isVeg: false, isVegan: false, details: "Premium beef patty, lettuce, cheese, special sauce" },
    { id: "tend", name: "Chicken Tenders", price: 12, isVeg: false, isVegan: false, details: "Crispy chicken breast tenders with honey mustard" },
    { id: "fries", name: "Loaded Fries", price: 9, isVeg: true, isVegan: false, details: "Crispy fries smothered in cheese sauce & chives" },
    { id: "soda", name: "Soft Drink", price: 6, isVeg: true, isVegan: true, details: "Served in reusable souvenir cup" }
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
    triggerFeedback(`Added ${item.name} to order!`);
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

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
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

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
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

    // Fast-Forward order steps simulation
    const timer1 = setTimeout(() => setOrderStep(1), 4000);
    const timer2 = setTimeout(() => {
      setOrderStep(2);
      // Credit points if reusable cup was used!
      if (newOrder.reusableUsed) {
        addEcoPoints(50);
      }
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  // Simulation Manual Speed Up
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
      
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Food & drink
            <span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">
              Smart Order
            </span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Order ahead, pick up when it's ready — queue times update live.
          </p>
        </div>

        {feedbackMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Stand Selection Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="stand-select" className="text-xs font-extrabold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider">
          Browse by stand
        </label>
        <select
          id="stand-select"
          value={selectedStandId}
          onChange={(e) => {
            setSelectedStandId(e.target.value);
            setCart([]); // Clear cart when switching stands
          }}
          className="w-full min-h-11 rounded-lg border border-zinc-250 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold px-3 text-zinc-850 dark:text-zinc-200 focus:outline-none"
        >
          {mockStands.map(stand => (
            <option key={stand.id} value={stand.id}>
              {stand.name} — Wait: {stand.wait} mins ({stand.location})
            </option>
          ))}
        </select>
      </div>

      {/* Main Order Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Menu Listings (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900 pb-2">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-450">
              Menu — {activeStand.name}
            </h3>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded font-bold">
              ⚡ Live Queue Wait: {activeStand.wait} mins
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMenu.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-zinc-350 dark:hover:border-zinc-700 transition-all gap-4"
              >
                <div className="space-y-1.5">
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
                    className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold p-1.5 rounded-lg transition-colors flex items-center justify-center"
                    aria-label={`Add ${item.name} to order`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Cart / Active Order Tracker */}
        <div className="space-y-6">
          
          {/* CART VIEW */}
          {!activeOrder && (
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-150 border-b border-zinc-150 dark:border-zinc-900 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-4.5 h-4.5 text-emerald-500" />
                <span>Your order</span>
              </h3>

              {cart.length === 0 ? (
                <p className="text-xs text-zinc-450 dark:text-zinc-500 text-center py-8 font-medium">
                  Your order is empty — add something tasty.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items list */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-2 text-xs py-1 border-b border-zinc-50 dark:border-zinc-900/50">
                        <div className="space-y-0.5">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.name}</span>
                          <span className="text-[10px] text-zinc-400 font-bold block">${item.price.toFixed(2)} each</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 rounded bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-zinc-850 dark:text-zinc-150 w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 rounded bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reusable Cup Sustainability Switch */}
                  <div className="border-t border-zinc-100 dark:border-zinc-900 pt-3">
                    <label className="flex items-start gap-2.5 text-xs font-bold text-zinc-850 dark:text-zinc-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={useReusableCup}
                        onChange={(e) => setUseReusableCup(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-emerald-650 focus:ring-emerald-500 mt-0.5"
                      />
                      <div>
                        <span>Use Reusable Souvenir Cup</span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-450 block font-black uppercase mt-0.5">
                          -$1.00 & +50 Eco-Points Reward!
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
                        <span>Eco Cup Reward Discount</span>
                        <span className="font-mono">-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated Tax (8.8%)</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-900 pt-2 text-sm font-black text-zinc-905 dark:text-white">
                      <span>Total</span>
                      <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#064e3b] hover:bg-[#075e3d] text-white font-black text-xs uppercase tracking-wider min-h-11 rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Place Order</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE ORDER PICKUP TRACKER */}
          {activeOrder && (
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5 animate-fade-in">
              <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                    Active pickup ticket
                  </span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-150 leading-tight font-mono">
                    {activeOrder.id}
                  </h3>
                </div>

                <button 
                  onClick={() => setActiveOrder(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-bold"
                >
                  Close
                </button>
              </div>

              {/* Status Visual Tracker Steps */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-450">
                  <span>Order Progress</span>
                  <span>
                    {orderStep === 0 ? "Received" : orderStep === 1 ? "Preparing" : "Ready for Pickup"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="grid grid-cols-3 gap-1 h-2 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <div className={`h-full ${orderStep >= 0 ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                  <div className={`h-full ${orderStep >= 1 ? 'bg-emerald-500' : 'bg-transparent'} transition-all`}></div>
                  <div className={`h-full ${orderStep >= 2 ? 'bg-emerald-500 animate-pulse' : 'bg-transparent'} transition-all`}></div>
                </div>

                {/* Detailed Status text */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-150 dark:border-zinc-850 flex items-start gap-2 text-xs">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1 font-semibold">
                    {orderStep === 0 && <p className="text-zinc-650 dark:text-zinc-350">We have received your order. Checking ingredient availability...</p>}
                    {orderStep === 1 && <p className="text-zinc-650 dark:text-zinc-350">Kitchen staff is preparing your items. Head to the pickup stand now.</p>}
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
              <div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center gap-3 bg-zinc-50/50 dark:bg-zinc-900/10">
                {/* Simulated SVG QR Code Vector */}
                <svg viewBox="0 0 100 100" className="w-28 h-28 text-zinc-900 dark:text-zinc-150" fill="currentColor">
                  {/* Outer corners */}
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="11" y="11" width="13" height="13" />

                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="76" y="11" width="13" height="13" />

                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="11" y="76" width="13" height="13" />

                  {/* Random QR pixels */}
                  <rect x="40" y="10" width="8" height="8" />
                  <rect x="55" y="15" width="8" height="8" />
                  <rect x="45" y="30" width="8" height="8" />
                  <rect x="5" y="45" width="8" height="8" />
                  <rect x="25" y="45" width="8" height="8" />
                  <rect x="15" y="55" width="8" height="8" />
                  <rect x="35" y="50" width="16" height="8" />
                  <rect x="45" y="65" width="8" height="16" />
                  <rect x="70" y="45" width="16" height="8" />
                  <rect x="80" y="60" width="8" height="8" />
                  <rect x="65" y="80" width="8" height="8" />
                  <rect x="80" y="80" width="8" height="8" />
                </svg>

                <div className="text-center">
                  <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block">
                    Pickup Location
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {activeOrder.standName}
                  </span>
                  <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block leading-tight font-medium">
                    {activeOrder.location}
                  </span>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="space-y-1.5 text-xs border-t border-zinc-100 dark:border-zinc-900 pt-4">
                <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block mb-1">
                  Receipt Summary
                </span>
                {activeOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between font-medium text-zinc-650 dark:text-zinc-400">
                    <span>{item.qty}x {item.name}</span>
                    <span className="font-mono">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}

                <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100 border-t border-zinc-50 dark:border-zinc-900 pt-1.5 mt-2">
                  <span>Grand Total</span>
                  <span className="font-mono">${activeOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Fast Forward Simulator control */}
              {orderStep < 2 && (
                <button
                  onClick={handleNextStep}
                  className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulate Next Step (Kitchen Prep)</span>
                </button>
              )}

              {/* Eco Rewards Badge for Reusable cup */}
              {activeOrder.reusableUsed && (
                <div className="bg-emerald-500/5 dark:bg-emerald-400/5 border border-emerald-500/15 p-3 rounded-xl flex items-start gap-2 text-[10px] text-emerald-800 dark:text-emerald-400">
                  <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 font-bold">
                    <span>Reusable Cup Rewards credited!</span>
                    <p className="text-[9px] font-medium leading-relaxed">
                      You earned **50 Eco-Points** and saved **$1.00** by reusing your MetLife Cup! Balance updated.
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
