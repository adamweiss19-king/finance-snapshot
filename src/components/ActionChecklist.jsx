import React, { useState } from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

function ActionChecklist({ contributions, setContributions, debts, setDebts, foundationAssets, foundationDebts }) {
  // Local state to track which specific steps (months/quarters) are checked off
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (itemId, stepName) => {
    const key = `${itemId}-${stepName}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateContribFreq = (id, freq) => {
    setContributions(contributions.map(c => c.id === id ? { ...c, frequency: freq } : c));
  };
  const updateDebtFreq = (id, freq) => {
    setDebts(debts.map(d => d.id === id ? { ...d, frequency: freq } : d));
  };

  // Optional: Function to handle a "Day of Month" selector if you add it to your data model later
  // For now, it's just a visual UI piece.
  
  const renderTask = (item, type, updateFn) => {
    const freq = item.frequency || 'Monthly'; 
    let taskAmount = item.amount || 0;
    
    if (freq === 'Monthly') taskAmount = taskAmount / 12;
    if (freq === 'Quarterly') taskAmount = taskAmount / 4;

    let displayName = item.name || 'Account';
    if (type === 'invest' && foundationAssets) {
      const match = foundationAssets.find(a => String(a.id) === String(item.linkedId));
      if (match && match.name) displayName = match.name;
    }
    if (type === 'debt' && foundationDebts) {
      const match = foundationDebts.find(d => String(d.id) === String(item.linkedId));
      if (match && match.name) displayName = match.name;
    }

    // Determine what array of steps to map over based on frequency
    const trackingSteps = freq === 'Monthly' ? MONTHS : freq === 'Quarterly' ? QUARTERS : [];
    
    // For One-Time tasks, use the main checkbox state
    const isOneTimeCompleted = completedSteps[`${item.id}-onetime`];

    return (
      <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-3 transition-all">
        
        {/* Top Row: Description and Frequency */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Show a main checkbox ONLY if it's a One-Time task */}
            {freq === 'One-Time' && (
              <input 
                type="checkbox" 
                checked={!!isOneTimeCompleted}
                onChange={() => toggleStep(item.id, 'onetime')}
                className="w-5 h-5 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
              />
            )}
            
            <div>
              <p className={`font-bold text-gray-800 ${isOneTimeCompleted ? 'line-through opacity-50' : ''}`}>
                {type === 'invest' ? 'Transfer to ' : 'Payment to '} 
                <span className={type === 'invest' ? 'text-blue-600' : 'text-red-600'}>{displayName}</span>
              </p>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="font-black text-gray-900">{formatter.format(taskAmount)}</span>
                
                {/* Date/Day Selector for recurring items */}
                {freq !== 'One-Time' && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    on the 
                    <select className="bg-slate-50 border border-slate-200 rounded p-0.5 text-xs focus:ring-0 cursor-pointer">
                      <option>1st</option>
                      <option>15th</option>
                      <option>Last Day</option>
                    </select>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <select 
            value={freq} 
            onChange={(e) => updateFn(item.id, e.target.value)}
            className="border-gray-200 rounded-md py-1.5 px-3 border bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer shadow-sm"
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="One-Time">One-Time</option>
          </select>
        </div>

        {/* Bottom Row: The Progress Tracker Mini-Checkboxes */}
        {trackingSteps.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-50">
            <div className="flex flex-wrap gap-2">
              {trackingSteps.map(step => {
                const isChecked = completedSteps[`${item.id}-${step}`];
                return (
                  <button
                    key={step}
                    onClick={() => toggleStep(item.id, step)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors border ${
                      isChecked 
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-inner' 
                        : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                  >
                    {step} {isChecked && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-12 bg-slate-100 p-8 rounded-2xl shadow-inner border border-slate-200">
      <div className="mb-6 border-b border-slate-300 pb-4">
        <h2 className="text-3xl font-extrabold text-slate-800">Section 3: The Execution Plan</h2>
        <p className="text-slate-600 mt-1">Track your progress throughout the year as you execute your plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <p className="text-sm text-gray-400 italic p-4 bg-white rounded-xl border border-dashed border-gray-300">No debt payments planned.</p>
          ) : (
            debts.map(d => renderTask(d, 'debt', updateDebtFreq))
          )}
        </div>
      </div>
    </div>
  );
}

export default ActionChecklist;