import React, { useState } from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});
function SpendingManager({ value, setValue }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Spending Manager</h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
          Annual Living Expenses
        </p>
      </div>

      {/* The Main Input Row */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm mb-4">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          Total Yearly "Burn"
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-400 font-bold">$</span>
          <input 
            type="number" 
            value={annualSpend === 0 ? '' : annualSpend}
            onChange={(e) => setAnnualSpend(parseFloat(e.target.value) || 0)}
            className="w-full border-gray-300 rounded-md p-3 pl-8 border text-xl font-bold focus:ring-gray-500 focus:border-gray-500"
            placeholder="0"
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
          Includes rent/mortgage, groceries, insurance, subscriptions, and fun.
        </p>
      </div>

      {/* Breakdown Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-gray-600 bg-gray-50 p-4 rounded-lg">
          <span className="text-sm font-medium">Monthly Average:</span>
          <span className="text-xl font-bold text-gray-900">
            {formatter.format(annualSpend / 12)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SpendingManager;