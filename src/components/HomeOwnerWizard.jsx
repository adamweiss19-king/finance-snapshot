import React, { useState } from 'react';

function HomeownerWizard({ isOpen, onClose, onSave }) {
  const [propertyName, setPropertyName] = useState('');
  const [propertyCategory, setPropertyCategory] = useState('Primary Residence');
  const [homeValue, setHomeValue] = useState('');
  
  // The new toggle
  const [hasMortgage, setHasMortgage] = useState(true);
  
  const [mortgageBalance, setMortgageBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  if (!isOpen) return null;

  const handleNumberChange = (setter) => (e) => {
    const cleanValue = e.target.value.replace(/,/g, '');
    if (!isNaN(cleanValue)) setter(cleanValue);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const finalName = propertyName.trim() === '' ? propertyCategory : propertyName;
    
    onSave({ 
      name: finalName,
      category: propertyCategory, 
      homeValue: parseFloat(homeValue) || 0, 
      // If no mortgage, force these to 0
      mortgageBalance: hasMortgage ? (parseFloat(mortgageBalance) || 0) : 0, 
      interestRate: hasMortgage ? (parseFloat(interestRate) || 0) : 0, 
      monthlyPayment: hasMortgage ? (parseFloat(monthlyPayment) || 0) : 0 
    });
    
    setPropertyName(''); setPropertyCategory('Primary Residence'); setHomeValue('');
    setMortgageBalance(''); setInterestRate(''); setMonthlyPayment(''); setHasMortgage(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
        
        <div className="mb-6">
          <span className="text-4xl mb-2 block">🏡</span>
          <h2 className="text-2xl font-black text-slate-800">Add Real Estate</h2>
          <p className="text-slate-500 text-sm mt-1">Tell us where this property stands today, and we'll link its asset value, debt, and cash flow automatically.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-[2]">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Nickname</label>
              <input type="text" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800" placeholder="e.g. Austin Rental" autoFocus />
            </div>
            <div className="flex-[2]">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
              <select value={propertyCategory} onChange={(e) => setPropertyCategory(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer">
                <option value="Primary Residence">Primary Home</option>
                <option value="Investment Property">Investment</option>
                <option value="Vacation Home">Vacation Home</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Est. Property Value Today</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
              <input type="text" inputMode="decimal" value={homeValue === '' ? '' : Number(homeValue).toLocaleString('en-US')} onChange={handleNumberChange(setHomeValue)} className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-lg" required />
            </div>
          </div>

          {/* THE PAID-OFF TOGGLE */}
          <div className="flex items-center gap-2 py-2">
             <input type="checkbox" id="hasMortgage" checked={hasMortgage} onChange={(e) => setHasMortgage(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
             <label htmlFor="hasMortgage" className="text-sm font-bold text-slate-700 cursor-pointer">This property has a mortgage</label>
          </div>

          {hasMortgage && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Remaining Mortgage Balance</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                  <input type="text" inputMode="decimal" value={mortgageBalance === '' ? '' : Number(mortgageBalance).toLocaleString('en-US')} onChange={handleNumberChange(setMortgageBalance)} className="w-full pl-8 p-3 bg-white border border-slate-200 rounded-xl font-black text-lg" required />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Interest Rate</label>
                  <div className="relative mt-1">
                    <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full pr-8 p-3 bg-white border border-slate-200 rounded-xl font-black text-lg" required />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                  </div>
                </div>

                <div className="flex-[2]">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Monthly Payment</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                    <input type="text" inputMode="decimal" value={monthlyPayment === '' ? '' : Number(monthlyPayment).toLocaleString('en-US')} onChange={handleNumberChange(setMonthlyPayment)} className="w-full pl-8 p-3 bg-white border border-slate-200 rounded-xl font-black text-lg" placeholder="P&I + Escrow" required />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">Cancel</button>
            <button type="submit" className="flex-[2] py-3 rounded-xl font-black bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md">Add to Plan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomeownerWizard;