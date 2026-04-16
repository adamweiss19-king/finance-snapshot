import React from 'react';
import Tooltip from './ui/Tooltip';
import SummaryCard from './ui/SummaryCard';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function FoundationSummary({ 
  incomeData = [], 
  taxReceipt = {}, 
  totalInvestments = 0, 
  debtContributions = [] 
}) {
  // 1. Calculate Foundation Math
  const totalIncome = incomeData.reduce((acc, item) => acc + (Number(item.gross) || 0), 0);
  const taxableIncome = incomeData
    .filter(item => item.isTaxable !== false)
    .reduce((acc, item) => acc + (Number(item.gross) || 0), 0);
  const untaxableIncome = totalIncome - taxableIncome;
  
  const totalDebt = debtContributions.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 mt-4">
      <div className="mb-6 border-b border-gray-50 pb-4">
        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Financial Foundation</h3>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Annual Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Income" 
          amount={totalIncome} 
          subtextLabel="Breakdown"
          subtextValue={`Taxed: $${taxableIncome.toLocaleString()}${untaxableIncome > 0 ? ` | Untaxed: $${untaxableIncome.toLocaleString()}` : ''}`}
          themeColor="emerald" 
        />
        <SummaryCard 
          title="Total Taxes" 
          amount={taxReceipt.totalTax || 0} 
          subtextLabel="Effective Rate" 
          subtextValue={`${taxReceipt.effectiveRate || 0}%`} 
          themeColor="orange" 
          tooltip="Estimated using the standard deduction and progressive IRS tax brackets. This is a planning tool, not professional tax advice."
        />
        <SummaryCard 
          title="Investments" 
          amount={totalInvestments} 
          subtextLabel="Savings Rate" 
          subtextValue={`${totalIncome > 0 ? Math.round((totalInvestments / totalIncome) * 100) : 0}%`} 
          themeColor="sky" 
        />
        <SummaryCard 
          title="Debt Service" 
          amount={totalDebt} 
          subtextLabel="Debt-to-Income" 
          subtextValue={`${totalIncome > 0 ? Math.round((totalDebt / totalIncome) * 100) : 0}%`} 
          themeColor="rose" 
        />
      </div>
    </div>
  );
}

export default FoundationSummary;