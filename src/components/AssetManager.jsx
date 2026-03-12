import React from 'react';

const ASSET_BUCKETS = ['Cash', 'Investment (Non-Retirement)', 'Retirement'];
const ASSET_CATEGORIES = [
  'Bank Account/Savings', '401k', 'IRA', 'Roth IRA', 
  'Brokerage Account', 'HSA', 'FSA', 'Crypto', 'Other'
];

function AssetManager({ data, setData }) {
  const addAsset = () => {
    // We now track BOTH the macro bucket and the specific category
    setData([...data, { id: Date.now(), name: '', bucket: 'Cash', category: 'Bank Account/Savings', balance: 0, growth: 0 }]);
  };

  const updateAsset = (id, field, value) => {
    setData(data.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id) => {
    setData(data.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-4 pr-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Asset Manager</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Current Holdings</p>
        </div>
        <button onClick={addAsset} className="text-blue-600 hover:text-blue-800 font-bold text-sm transition flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
          + Add
        </button>
      </div>

      <div className="space-y-4">
        {data.map((asset) => {
          // Fallbacks for older data loading in
          const currentBucket = asset.bucket || 'Investment (Non-Retirement)';
          const currentCategory = asset.category || 'Other';

          return (
            <div key={asset.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
              
              {/* Top Row: Name and Balance */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
                <input 
                  type="text" 
                  value={asset.name} 
                  onChange={(e) => updateAsset(asset.id, 'name', e.target.value)} 
                  placeholder="e.g. Chase Savings" 
                  className="text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300" 
                />
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center text-right">
                    <span className="text-lg font-black text-blue-300 mr-1">$</span>
                    <input 
                      type="text" 
                      value={asset.balance === 0 ? '' : asset.balance.toLocaleString('en-US')} 
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/,/g, '');
                        updateAsset(asset.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                      }} 
                      className="text-xl font-black text-blue-700 border-none p-0 focus:ring-0 text-right w-32 bg-transparent placeholder-gray-200" 
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-blue-400 font-bold mr-1">Balance</span>
                </div>
              </div>

              {/* Bottom Row: Controls & Dropdowns */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* The Dropdown Group */}
                <div className="flex items-center gap-2">
                  {/* 1. Macro Bucket */}
                  <select 
                    value={currentBucket} 
                    onChange={(e) => updateAsset(asset.id, 'bucket', e.target.value)} 
                    className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase text-white focus:ring-0 cursor-pointer max-w-[120px] truncate shadow-sm"
                    title="Asset Macro Bucket"
                  >
                    {ASSET_BUCKETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>

                  {/* 2. Sub-Category */}
                  <select 
                    value={currentCategory} 
                    onChange={(e) => updateAsset(asset.id, 'category', e.target.value)} 
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer max-w-[140px] truncate"
                    title="Specific Account Type"
                  >
                    {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Projected Growth Input */}
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

              <button 
                onClick={() => removeAsset(asset.id)} 
                className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              >✕</button>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default AssetManager;