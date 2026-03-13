import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

function AssetContributionManager({ data, setData, assets, age, filingStatus }) {
  const addContribution = () => {
    setData([...data, { id: Date.now(), name: '', amount: 0, linkedId: 'new' }]);
  };

  const updateContribution = (id, field, value) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeContribution = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const totalContributions = data.reduce((acc, item) => acc + (item.amount || 0), 0);

  // --- DYNAMIC IRS LIMITS (2024/2025) ---
  const isCatchupAge = age >= 50;
  const isHsaCatchupAge = age >= 55;
  const isFamily = filingStatus === 'Married Filing Jointly';

  const limits = {
    '401k': 23000 + (isCatchupAge ? 7500 : 0), // $30,500 if 50+
    'IRA': 7000 + (isCatchupAge ? 1000 : 0),   // $8,000 if 50+
    'HSA': (isFamily ? 8300 : 4150) + (isHsaCatchupAge ? 1000 : 0),
    'FSA': 3200 // Usually static per employer
  };

  // Calculate totals per asset category
  const categoryTotals = {};
  data.forEach(contribution => {
    if (contribution.linkedId !== 'new') {
      const linkedAsset = assets.find(a => String(a.id) === String(contribution.linkedId));
      if (linkedAsset && linkedAsset.category) {
        categoryTotals[linkedAsset.category] = (categoryTotals[linkedAsset.category] || 0) + (contribution.amount || 0);
      }
    }
  });

  // Check if any categories exceed the DYNAMIC limits
  const warnings = [];
  Object.keys(categoryTotals).forEach(category => {
    // 401k Check
    if (category === '401k' && categoryTotals[category] > limits['401k']) {
      const catchupText = isCatchupAge ? ' (includes 50+ catch-up)' : '';
      warnings.push(`You have allocated ${formatter.format(categoryTotals[category])} to 401k accounts. Your legal individual limit is ${formatter.format(limits['401k'])}${catchupText}. (Employer matches do not count).`);
    }
    
    // IRA Check (Combined Traditional + Roth)
    const totalIRA = (categoryTotals['IRA'] || 0) + (categoryTotals['Roth IRA'] || 0);
    if ((category === 'IRA' || category === 'Roth IRA') && totalIRA > limits['IRA']) {
      if (!warnings.some(w => w.includes('IRA accounts'))) {
        const catchupText = isCatchupAge ? ' (includes 50+ catch-up)' : '';
        warnings.push(`You have allocated ${formatter.format(totalIRA)} to IRA accounts. Your combined limit for all IRAs is ${formatter.format(limits['IRA'])}${catchupText}.`);
      }
    }

    // HSA Check
    if (category === 'HSA' && categoryTotals[category] > limits['HSA']) {
      const planType = isFamily ? 'Family' : 'Individual';
      const catchupText = isHsaCatchupAge ? ' + 55+ catch-up' : '';
      warnings.push(`You have allocated ${formatter.format(categoryTotals[category])} to an HSA. Your limit based on a ${planType} plan${catchupText} is ${formatter.format(limits['HSA'])}.`);
    }
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-4 pr-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Investment Allocations</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">New Cash to Assets</p>
        </div>
        <button onClick={addContribution} className="text-blue-600 hover:text-blue-800 font-bold text-sm transition flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
          + Add
        </button>
      </div>

      {/* RENDER DYNAMIC WARNINGS IF THEY EXIST */}
      {warnings.length > 0 && (
        <div className="mb-4 space-y-2">
          {warnings.map((warning, idx) => (
            <div key={idx} className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold flex items-start gap-2 shadow-sm animate-pulse">
              <span>⚠️</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
            
            <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
              <input 
                type="text" 
                value={item.name || ''} 
                onChange={(e) => updateContribution(item.id, 'name', e.target.value)} 
                placeholder="e.g. Max 401k, Buy Index Funds" 
                className="text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300" 
              />
              
              <div className="flex flex-col items-end shrink-0">
                <div className=" flex items-center justify-end text-right">
                  <span className="text-lg font-black text-blue-700 mr-0.5">$</span>
                  <input 
                    type="text" 
                    value={item.amount === 0 ? '' : item.amount.toLocaleString('en-US')}
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace(/,/g, '');
                      updateContribution(item.id, 'amount', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                    }}
                    placeholder="0"
                    style={{ width: `${item.amount ? item.amount.toLocaleString('en-US').length + 0.5 : 2}ch` }} 
                    className="text-xl font-black text-blue-700 border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200" 
                  />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-blue-400 font-bold mr-1">Amount</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 w-full">
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Destination:</span>
                <select 
                  value={item.linkedId || 'new'} 
                  onChange={(e) => updateContribution(item.id, 'linkedId', e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer flex-1 truncate"
                >
                  <option value="new">✨ New / Unlinked Account</option>
                  {assets && assets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name || 'Unnamed Asset'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={() => removeContribution(item.id)} 
              className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-between items-center bg-blue-50 p-5 rounded-2xl border-2 border-blue-200 shadow-sm">
        <span className="text-xs uppercase font-black tracking-widest text-blue-800">Total New Investments</span>
        <span className="text-2xl font-black text-blue-600">{formatter.format(totalContributions)}</span>
      </div>
    </div>
  );
}

export default AssetContributionManager;