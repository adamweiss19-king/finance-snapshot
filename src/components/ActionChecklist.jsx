import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

// Added foundationAssets and foundationDebts to the props
function ActionChecklist({ contributions, setContributions, debts, setDebts, foundationAssets, foundationDebts }) {
  
  const updateContribFreq = (id, freq) => {
    setContributions(contributions.map(c => c.id === id ? { ...c, frequency: freq } : c));
  };
  const updateDebtFreq = (id, freq) => {
    setDebts(debts.map(d => d.id === id ? { ...d, frequency: freq } : d));
  };

  const renderTask = (item, type, updateFn) => {
    const freq = item.frequency || 'Monthly'; 
    let taskAmount = item.amount || 0;
    if (freq === 'Monthly') taskAmount = taskAmount / 12;
    if (freq === 'Quarterly') taskAmount = taskAmount / 4;

    // --- NEW LOGIC: Look up the real account name using the linkedId ---
    let displayName = item.name || 'Account';
    if (type === 'invest' && foundationAssets) {
      const match = foundationAssets.find(a => String(a.id) === String(item.linkedId));
      if (match && match.name) displayName = match.name;
    }
    if (type === 'debt' && foundationDebts) {
      const match = foundationDebts.find(d => String(d.id) === String(item.linkedId));
      if (match && match.name) displayName = match.name;
    }

    return (
      <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-3">
        <div className="flex items-center gap-4">
          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
          <div>
            <p className="font-bold text-gray-800">
              {type === 'invest' ? 'Automate transfer to ' : 'Automate payment to '} 
              {/* Using our newly matched displayName here! */}
              <span className="text-blue-600">{displayName}</span>
            </p>
            <p className="text-sm text-gray-500">
              {formatter.format(taskAmount)} {freq === 'Monthly' ? 'every month' : freq === 'Quarterly' ? 'every quarter' : 'one-time'}
            </p>
          </div>
        </div>
        
        <select 
          value={freq} 
          onChange={(e) => updateFn(item.id, e.target.value)}
          className="border-gray-300 rounded-md p-2 border bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer"
        >
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="One-Time">One-Time</option>
        </select>
      </div>
    );
  };

  return (
    <div className="mb-12 bg-slate-100 p-8 rounded-2xl shadow-inner border border-slate-200">
      <div className="mb-6 border-b border-slate-300 pb-4">
        <h2 className="text-3xl font-extrabold text-slate-800">Section 3: The Execution Plan</h2>
        <p className="text-slate-600 mt-1">Check off these items as you automate your finances. Frequency determines the per-action amount.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">📈 Investment Actions</h3>
          {contributions.length === 0 ? (
            <p className="text-sm text-gray-400 italic p-4 bg-white rounded-xl border border-dashed border-gray-300">No investments planned.</p>
          ) : (
            contributions.map(c => renderTask(c, 'invest', updateContribFreq))
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">📉 Debt Paydown Actions</h3>
          {debts.length === 0 ? (
            <p className="text-sm text-gray-400 italic p-4 bg-white rounded-xl border border-dashed border-gray-300">No extra debt payments planned.</p>
          ) : (
            debts.map(d => renderTask(d, 'debt', updateDebtFreq))
          )}
        </div>
      </div>
    </div>
  );
}

export default ActionChecklist;