import React from 'react';

const ASSET_MAPPING = {
  'Cash': ['Bank Account/Savings', 'FSA', 'Other'],
  'Investment (Non-Retirement)': ['Brokerage Account', 'Crypto', 'HSA', 'Other'],
  'Retirement': ['401k', 'IRA', 'Roth IRA', 'HSA', 'Other'],
  'Physical Assets': ['Primary Residence', 'Vehicle', 'Real Estate (Rental)', 'Jewelry/Art', 'Other']
};
const ASSET_BUCKETS = Object.keys(ASSET_MAPPING);

// 1. UPDATED PROPS: We now accept the review mode data
function AssetManager({ data, setData, isClosingOut, contributions, planSnapshot }) {
  
  const addAsset = () => {
    // 2. CLEANUP: Removed the isNew flag
    setData([...data, { id: Date.now(), name: '', bucket: 'Cash', category: 'Bank Account/Savings', balance: 0, growth: 0 }]);
  };

  const updateAsset = (id, field, value) => {
    setData(data.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleBucketChange = (id, newBucket) => {
    const newCategory = ASSET_MAPPING[newBucket][0];
    setData(data.map(a => a.id === id ? { ...a, bucket: newBucket, category: newCategory } : a));
  }
  
  const removeAsset = (id) => {
    setData(data.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-4 pr-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Asset Manager</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            {isClosingOut ? 'End of Year Review' : 'Current Holdings'}
          </p>
        </div>
        {/* Hide Add button during Close Out */}
        {!isClosingOut && (
          <button onClick={addAsset} className="text-blue-600 hover:text-blue-800 font-bold text-sm transition flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
            + Add
          </button>
        )}
      </div>

      <div className="space-y-4">
        {data.map((asset) => {
          const currentBucket = asset.bucket || 'Investment (Non-Retirement)';
          const currentCategory = asset.category || 'Other';

          // --- 3. REVIEW MODE MATH ---
          let initialAmount = 0;
          let plannedTarget = 0;
          
          if (isClosingOut) {
            // Find the original balance from the plan (defaults to 0 if it was created mid-year)
            const originalAsset = planSnapshot?.assetData?.find(a => a.id === asset.id);
            initialAmount = originalAsset ? Number(originalAsset.balance) : 0;
            
            // Calculate the expected growth and contributions
            const growthRate = originalAsset ? Number(originalAsset.growth) : Number(asset.growth);
            const growthAmount = initialAmount * (growthRate / 100);
            const linkedContribs = (contributions || [])
              .filter(c => String(c.linkedId) === String(asset.id))
              .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
              
            plannedTarget = initialAmount + growthAmount + linkedContribs;
          }

          return (
            <div key={asset.id} className={`bg-white p-4 rounded-2xl border ${isClosingOut ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-gray-100 shadow-sm'} transition-all relative group`}>
              
              {isClosingOut ? (
                // ==========================================
                // UI STATE A: THE "CLOSE OUT" REVIEW ROW
                // ==========================================
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-lg font-bold text-gray-900">{asset.name || "Unnamed Asset"}</span>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">Review</span>
                  </div>
                  
                  <div className="flex justify-between items-end gap-2">
                    {/* The Read-Only Data */}
                    <div className="flex gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Start (Jan 1)</span>
                        <span className="text-sm font-semibold text-slate-600">${initialAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Target</span>
                        <span className="text-sm font-bold text-blue-600">${Math.round(plannedTarget).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* The Actionable Input */}
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] uppercase tracking-widest text-blue-500 font-black mb-1">Actual (Dec 31)</span>
                      <div className="flex items-center justify-end text-right bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                        <span className="text-sm font-black text-blue-600 mr-0.5">$</span>
                        <input 
                          type="text" 
                          value={asset.balance === 0 ? '' : asset.balance.toLocaleString('en-US')} 
                          onChange={(e) => {
                            const cleanValue = e.target.value.replace(/,/g, '');
                            updateAsset(asset.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                          }} 
                          placeholder={Math.round(plannedTarget).toString()} // The target acts as ghost text!
                          className="text-lg font-black text-blue-700 border-none p-0 focus:ring-0 text-right bg-transparent placeholder-blue-300/50 w-24" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // ==========================================
                // UI STATE B: THE STANDARD PLANNING ROW
                // ==========================================
                <>
                  {/* Top Row: Name and Balance */}
                  <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
                    
                    {/* LEFT SIDE: Name and NEW Badge */}
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={asset.name} 
                        onChange={(e) => updateAsset(asset.id, 'name', e.target.value)} 
                        placeholder="e.g. Chase Savings" 
                        className="text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300" 
                      />
                      {/* AUTO DETECT NEW ACCOUNTS */}
                      {asset.balance === 0 && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter shrink-0">
                          New
                        </span>
                      )}
                    </div>

                    {/* RIGHT SIDE: Starting Balance Input */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center justify-end text-right">
                        <span className="text-lg font-black text-blue-300 mr-0.5">$</span>
                        <input 
                          type="text" 
                          value={asset.balance === 0 ? '' : asset.balance.toLocaleString('en-US')} 
                          onChange={(e) => {
                            const cleanValue = e.target.value.replace(/,/g, '');
                            updateAsset(asset.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                          }} 
                          placeholder="0"
                          style={{ width: `${asset.balance ? asset.balance.toLocaleString('en-US').length + 0.5 : 2}ch` }}
                          className="text-xl font-black text-blue-700 border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200" 
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-blue-400 font-bold mr-1">Starting Balance</span>
                    </div>
                  </div>

                  {/* Bottom Row: Controls & Dropdowns */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <select 
                        value={currentBucket} 
                        onChange={(e) => handleBucketChange(asset.id, e.target.value)} 
                        className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase text-white focus:ring-0 cursor-pointer max-w-[120px] truncate shadow-sm"
                      >
                        {ASSET_BUCKETS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>

                      <select 
                        value={currentCategory} 
                        onChange={(e) => updateAsset(asset.id, 'category', e.target.value)} 
                        className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer max-w-[140px] truncate"
                      >
                        {ASSET_MAPPING[currentBucket].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-semibold text-gray-400">Proj. Growth:</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={asset.growth === 0 ? '' : asset.growth} 
                          onChange={(e) => updateAsset(asset.id, 'growth', parseFloat(e.target.value) || 0)} 
                          className="w-16 text-right bg-slate-50 border border-slate-200 rounded p-1 text-xs text-slate-700 font-bold focus:ring-0" 
                          placeholder="0"
                        />
                        <span className="font-bold text-slate-400">%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Delete Button (Only visible if NOT closing out) */}
              {!isClosingOut && (
                <button 
                  onClick={() => removeAsset(asset.id)} 
                  className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                >✕</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default AssetManager;