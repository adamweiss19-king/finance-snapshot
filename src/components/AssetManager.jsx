import React from 'react';
import BaseAccountRow from './ui/BaseAccountRow';

function AssetManager({ data, setData, isClosingOut, contributions, planSnapshot, isLocked, onOpenHomeWizard, projectedAssets }) {
  
  const addAsset = () => {
    setData([...data, { id: Date.now(), name: '', bucket: 'Cash', category: '', balance: 0, growth: 0 }]);
  };

  const updateAsset = (id, field, value) => {
    setData(data.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id) => {
    setData(data.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 pr-1 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Asset Manager</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            {isClosingOut ? 'End of Year Review' : 'Current Resources'}
          </p>
        </div>
        
        {!isClosingOut && !isLocked && (
          <button 
            onClick={onOpenHomeWizard}
            className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span className="text-sm">🏡</span> Add Real Estate
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[40vh] space-y-4 mb-4 pb-2 pr-1">
        {data.map((asset) => {
          // NEW: Find the specific math prediction for this asset
          const projection = (projectedAssets || []).find(p => p.id === asset.id);
          const predictedBalance = projection ? projection.projectedEOY : null;

          return (
            <BaseAccountRow 
              key={asset.id} item={asset} type="asset" isClosingOut={isClosingOut}
              contributions={contributions} planSnapshot={planSnapshot?.assetData} 
              onUpdate={updateAsset} onRemove={removeAsset} isLocked={isLocked}
              predictedBalance={predictedBalance} // NEW: Pass it to the input row
            />
          );
        })}
      </div>

      {!isClosingOut && (
        <div className="mt-auto shrink-0 mb-2">
          <button onClick={addAsset} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
            <span className="text-xl leading-none">+</span> Add Asset
          </button>
        </div>
      )}
    </div>
  );
}

export default AssetManager;