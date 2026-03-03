import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

const ASSET_CATEGORIES = [
  'Bank Account/Savings', '401k', 'IRA', 'Roth IRA', 
  'Brokerage Account', 'HSA', 'FSA', 'Crypto', 'Other'
];

function AssetManager({ data, setData }) {
  const addAsset = () => {
    setData([...data, { id: Date.now(), name: '', category: 'Bank Account/Savings', balance: 0, growth: 0 }]);
  };

  const updateAsset = (id, field, value) => {
    setData(data.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id) => {
    setData(data.filter(a => a.id !== id));
  };

  // The New Bucket Math
  const liquidCash = data.filter(a => a.category === 'Bank Account/Savings').reduce((acc, a) => acc + (a.balance || 0), 0);
  const retirement = data.filter(a => ['401k', 'IRA', 'Roth IRA'].includes(a.category)).reduce((acc, a) => acc + (a.balance || 0), 0);
  const investments = data.filter(a => ['Brokerage Account', 'Crypto'].includes(a.category)).reduce((acc, a) => acc + (a.balance || 0), 0);
  const health = data.filter(a => ['HSA', 'FSA'].includes(a.category)).reduce((acc, a) => acc + (a.balance || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Asset Manager</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Categorized Holdings</p>
        </div>
        <button onClick={addAsset} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
          + Add Asset
        </button>
      </div>

      <div className="space-y-4">
        {data.map((asset) => (
          <div key={asset.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4 border-gray-50">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label>
              <input type="text" value={asset.name} onChange={(e) => updateAsset(asset.id, 'name', e.target.value)} placeholder="e.g. Chase Check" className="w-full border-gray-300 rounded-md p-2 border" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select value={asset.category || 'Other'} onChange={(e) => updateAsset(asset.id, 'category', e.target.value)} className="w-full border-gray-300 rounded-md p-2 border bg-white text-sm">
                {ASSET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Balance</label>
              <input type="number" value={asset.balance === 0 ? '' : asset.balance} onChange={(e) => updateAsset(asset.id, 'balance', parseFloat(e.target.value) || 0)} className="w-full border-gray-300 rounded-md p-2 border" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Growth %</label>
              <input type="number" value={asset.growth === 0 ? '' : asset.growth} onChange={(e) => updateAsset(asset.id, 'growth', parseFloat(e.target.value) || 0)} className="w-full border-gray-300 rounded-md p-2 border" />
            </div>
            <button onClick={() => removeAsset(asset.id)} className="text-red-500 hover:text-red-700 text-sm font-medium pb-2 text-right">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* The New Mini-Dashboard */}
      <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
        <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex justify-between items-center">
          <span className="block text-[10px] font-bold text-green-600 uppercase">Liquid Cash</span>
          <span className="font-bold text-green-800">{formatter.format(liquidCash)}</span>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex justify-between items-center">
          <span className="block text-[10px] font-bold text-purple-600 uppercase">Retirement</span>
          <span className="font-bold text-purple-800">{formatter.format(retirement)}</span>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
          <span className="block text-[10px] font-bold text-blue-600 uppercase">Taxable Inv.</span>
          <span className="font-bold text-blue-800">{formatter.format(investments)}</span>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex justify-between items-center">
          <span className="block text-[10px] font-bold text-orange-600 uppercase">Health / Other</span>
          <span className="font-bold text-orange-800">{formatter.format(health)}</span>
        </div>
      </div>
    </div>
  );
}

export default AssetManager;