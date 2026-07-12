import React, { useState } from 'react';
import { Search, ChevronRight, Info, ClipboardList, Shield, Check, ExternalLink, Leaf, Award } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { originalServicesData } from '../constants/wayfindingData.js';

export default function VenueGuidesTab() {
  const { addEcoPoints, userProfile, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(originalServicesData[0]);
  const [simulatedRecycled, setSimulatedRecycled] = useState(false);

  const guideCategories = ['All', 'Stadium Logistics', 'Transit & Shuttle Board', 'Eco-Points Hub', 'Accessibility & Health'];

  const filteredServices = originalServicesData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSimulateRecycle = () => {
    setSimulatedRecycled(true);
    addEcoPoints(50);
    setTimeout(() => {
      setSimulatedRecycled(false);
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
      
      {/* Left Side: Filter and list (col-span-2) */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Search bar & Category filters */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 font-medium"
            />
            <Search className="w-4 h-4 text-zinc-450 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {guideCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-655 dark:text-zinc-455 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat === 'All' ? 'All Guides' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Listings */}
        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-850 mx-auto mb-2" />
              <p className="text-xs text-zinc-450 font-bold">No stadium guides found matching search query.</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  selectedService.id === service.id
                    ? 'bg-emerald-50/50 dark:bg-emerald-955/20 border-emerald-505/60 shadow-sm'
                    : 'bg-white dark:bg-[#0c0c0f] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="space-y-1.5 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                      {service.category}
                    </span>
                    <span className="text-[9px] text-zinc-450 font-semibold">{service.department}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{service.name}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate leading-relaxed">{service.details}</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${
                  selectedService.id === service.id ? 'translate-x-1 text-emerald-500' : ''
                }`} />
              </div>
            ))
          )}
        </div>

      </div>

      {/* Right Side: Detailed View (col-span-1) */}
      <div className="space-y-6">
        
        {/* Detailed Info Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="border-b border-zinc-105 dark:border-zinc-900 pb-3">
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
              {selectedService.category}
            </span>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-150 leading-tight">
              {selectedService.name}
            </h3>
            <p className="text-[10px] text-zinc-555 dark:text-zinc-450 font-bold mt-1.5">
              Operations Dept: <span className="text-zinc-750 dark:text-zinc-300">{selectedService.department}</span>
            </p>
          </div>

          {/* Quick Stat */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-150 dark:border-zinc-850 flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-500">Wait / Schedule:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedService.processingTime}</span>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-zinc-550 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Operational Logistics</span>
            </h4>
            <p className="text-zinc-655 dark:text-zinc-400 leading-relaxed font-medium">
              {selectedService.details}
            </p>
          </div>

          {/* What to Bring / Credentials */}
          {selectedService.requiredDocs.length > 0 && (
            <div className="space-y-2 text-xs border-t border-zinc-100 dark:border-zinc-900 pt-4">
              <h4 className="font-bold text-zinc-550 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-emerald-500" />
                <span>Required Access Tickets / ID</span>
              </h4>
              <ul className="space-y-1.5 mt-2">
                {selectedService.requiredDocs.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-zinc-655 dark:text-zinc-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{doc.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stadium Rules & Regulations */}
          <div className="space-y-2 text-xs border-t border-zinc-100 dark:border-zinc-900 pt-4">
            <h4 className="font-bold text-zinc-555 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Stadium Regulations</span>
            </h4>
            <ul className="space-y-1.5 mt-2">
              {selectedService.eligibility.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-zinc-655 dark:text-zinc-400 font-medium leading-normal">
                  <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions / Links */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-2">
            <a
              href={`https://${selectedService.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors text-center flex items-center justify-center gap-1.5 shadow"
            >
              <span>Open Directions & Portals</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Cup Recycling Simulator */}
        <div className="bg-gradient-to-br from-emerald-650/15 via-emerald-600/5 to-transparent border border-emerald-500/20 dark:border-emerald-900/30 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm flex items-center gap-2 text-emerald-650 dark:text-emerald-455 leading-tight">
            <Leaf className="w-4.5 h-4.5 text-emerald-500" />
            <span>Smart Bin Simulator</span>
          </h3>
          <p className="text-xs text-zinc-555 dark:text-zinc-400 leading-normal">
            Simulate disposing of a reusable cup at a MetLife Stadium Smart Recycling Bin. You will immediately earn points credited to your Eco Balance.
          </p>

          <button
            onClick={handleSimulateRecycle}
            disabled={simulatedRecycled}
            className={`w-full py-2.5 rounded-lg text-xs font-bold shadow transition-all flex items-center justify-center gap-2 ${
              simulatedRecycled 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent'
            }`}
          >
            {simulatedRecycled ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Cup Processed! +50 Eco-Pts</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4 text-amber-300" />
                <span>Recycle Reusable Cup (+50 pts)</span>
              </>
            )}
          </button>
          <div className="flex justify-between items-center text-[9px] text-zinc-450 mt-1">
            <span>Current Balance: <strong>{userProfile.ecoPoints} pts</strong></span>
            <span>1 cup = +50 pts</span>
          </div>
        </div>

      </div>

    </div>
  );
}
