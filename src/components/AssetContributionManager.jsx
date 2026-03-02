import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

function AssetContributionManager({ data, setData , assets}) {
  const addContribution = () => {
    setData([...data, { id: Date.now(), name: '', amount: 0 }]);
  };

  const updateContribution = (id, field, value) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeContribution = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const totalContributions = data.reduce((acc, item) => acc + (item.amount || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-blue-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Investment Allocations</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">New Cash to Assets</p>
        </div>
        <button onClick={addContribution} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
          + Add Investment
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {data.map((item) => (
          <div key={item.id} className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Destination Account</label>
              <select 
                value={item.linkedId || 'new'} 
                onChange={(e) => updateContribution(item.id, 'linkedId', e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border bg-white"
              >
                <option value="new">✨ New / Unlinked Account</option>
                {assets && assets.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name || 'Unnamed Asset'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Amount to Invest</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input 
                  type="number" value={item.amount === 0 ? '' : item.amount} onChange={(e) => updateContribution(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full border-gray-300 rounded-md p-2 pl-7 border"
                />
              </div>
            </div>
            <button onClick={() => removeContribution(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium pb-2 text-right">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Total New Investments:</span>
        <span className="text-xl font-bold text-blue-600">{formatter.format(totalContributions)}</span>
      </div>
    </div>
  );
}

export default AssetContributionManager;