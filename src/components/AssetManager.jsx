import React, { useState } from 'react';

// Use the same formatter we set up for Income
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function AssetManager() {
  const [assets, setAssets] = useState([
    { id: 1, name: '401k', balance: 50000, contribution: 10000, growth: 7 }
  ]);

  const addAsset = () => {
    setAssets([...assets, { id: Date.now(), name: '', balance: 0, contribution: 0, growth: 0 }]);
  };

  const updateAsset = (id, field, value) => {
    setAssets(assets.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id) => {
    setAssets(assets.filter(a => a.id !== id));
  };

 // 1. Current Total (What you have today)
const totalCurrent = assets.reduce((acc, asset) => acc + (asset.balance || 0), 0);

// 2. Contributions Total (The "New Money" you are adding)
const totalContributions = assets.reduce((acc, asset) => acc + (asset.contribution || 0), 0);

// 3. Interest/Growth Subtotal (The "Free Money" from the market)
const totalGrowth = assets.reduce((acc, asset) => {
  return acc + ((asset.balance || 0) * ((asset.growth || 0) / 100));
}, 0);

// 4. The Grand Total (Sum of all three)
const totalEOY = totalCurrent + totalContributions + totalGrowth;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Asset Manager</h2>
        <button
          onClick={addAsset}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          + Add Asset
        </button>
      </div>

      <div className="space-y-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4 border-gray-50"
          >
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Asset Name</label>
              <input
                type="text"
                value={asset.name}
                onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                placeholder="e.g. 401k"
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Balance</label>
              <input
                type="number"
                value={asset.balance === 0 ? '' : asset.balance}
                onChange={(e) => updateAsset(asset.id, 'balance', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Annual Contrib.</label>
              <input
                type="number"
                value={asset.contribution === 0 ? '' : asset.contribution}
                onChange={(e) => updateAsset(asset.id, 'contribution', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Growth %</label>
              <input
                type="number"
                value={asset.growth === 0 ? '' : asset.growth}
                onChange={(e) => updateAsset(asset.id, 'growth', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>

            <button
              onClick={() => removeAsset(asset.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium pb-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
        {/* Row 1: Current */}
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <span>Current Total Assets:</span>
          <span className="font-semibold text-gray-800">{formatter.format(totalCurrent)}</span>
        </div>

        {/* Row 2: Contributions */}
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <span>Total Annual Contributions:</span>
          <span className="font-semibold text-blue-600">+ {formatter.format(totalContributions)}</span>
        </div>

        {/* Row 3: Growth */}
        <div className="flex justify-between items-center text-gray-600 text-sm italic">
          <span>Estimated Market Growth:</span>
          <span className="font-semibold text-green-600">+ {formatter.format(totalGrowth)}</span>
        </div>

        {/* Row 4: Grand Total */}
        <div className="flex justify-between items-center text-blue-900 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div>
            <span className="block text-xs uppercase font-bold tracking-wider opacity-70">Projected EOY Balance</span>
            <span className="text-3xl font-black">{formatter.format(totalEOY)}</span>
          </div>

          <div className="text-right">
            <span className="block text-xs font-bold text-blue-600">
              {totalCurrent > 0 ? (((totalEOY - totalCurrent) / totalCurrent) * 100).toFixed(1) : 0}% Total Increase
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetManager;