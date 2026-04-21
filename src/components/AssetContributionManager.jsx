import React from 'react';
import Tooltip from './ui/Tooltip';
import ContributionRow from './ui/ContributionRow';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

function AssetContributionManager({ data, setData, assets, age, filingStatus, onCreateLinkedAsset, isLocked }) {
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
  
  // If married, we assume dual-income household and double the base contribution limits
  const multiplier = isFamily ? 2 : 1; 

  const limits = {
    '401k': (23000 * multiplier) + (isCatchupAge ? (7500 * multiplier) : 0),
    'IRA': (7000 * multiplier) + (isCatchupAge ? (1000 * multiplier) : 0),
    'HSA': (isFamily ? 8300 : 4150) + (isHsaCatchupAge ? (1000 * multiplier) : 0),
    'FSA': 3200 * multiplier 
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
  const entityText = isFamily ? 'combined household' : 'individual';

  Object.keys(categoryTotals).forEach(category => {
    // 401k Check
    if (category === '401k' && categoryTotals[category] > limits['401k']) {
      const catchupText = isCatchupAge ? ' (includes 50+ catch-up)' : '';
      warnings.push(`You have allocated ${formatter.format(categoryTotals[category])} to 401k accounts. Your legal ${entityText} limit is ${formatter.format(limits['401k'])}${catchupText}. (Employer matches do not count).`);
    }
    
    // IRA Check (Combined Traditional + Roth)
    const totalIRA = (categoryTotals['IRA'] || 0) + (categoryTotals['Roth IRA'] || 0);
    if ((category === 'IRA' || category === 'Roth IRA') && totalIRA > limits['IRA']) {
      if (!warnings.some(w => w.includes('IRA accounts'))) {
        const catchupText = isCatchupAge ? ' (includes 50+ catch-up)' : '';
        warnings.push(`You have allocated ${formatter.format(totalIRA)} to IRA accounts. Your ${entityText} limit for all IRAs is ${formatter.format(limits['IRA'])}${catchupText}.`);
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
    <div className="mb-4 pr-1">
      <h2 className="text-xl font-bold text-gray-800">Investment Allocations</h2>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold mb-4">New Cash to Assets</p>
      
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <div key={idx} className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold flex items-start gap-2 shadow-sm animate-pulse">
              <span>⚠️</span><span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[40vh] space-y-4 mb-4 pb-2 pr-1">
      {data.map((item) => (
        <ContributionRow 
          key={item.id} item={item} type="asset" linkOptions={assets}
          onUpdate={updateContribution} onRemove={removeContribution} onCreateLinked={onCreateLinkedAsset}
          isLocked={isLocked}
        />
      ))}
    </div>

    <div className="mb-6 shrink-0">
      <button onClick={addContribution} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
        <span className="text-xl leading-none">+</span> Add Investment
      </button>
    </div>

    <div className="mt-auto flex justify-between items-center bg-blue-50 p-5 rounded-2xl border-2 border-blue-200 shadow-sm shrink-0">
      <span className="text-xs uppercase font-black tracking-widest text-blue-800">Total New Investments</span>
      <span className="text-2xl font-black text-blue-600">{formatter.format(totalContributions)}</span>
    </div>
  </div>
  );
}

export default AssetContributionManager;