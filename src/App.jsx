import { useState } from 'react'
import IncomeManager from './components/IncomeManager'
import AssetManager from './components/AssetManager'
import DebtManager from './components/DebtManager'
import SpendingManager from './components/SpendingManager'
import AssetContributionManager from './components/AssetContributionManager'
import DebtContributionManager from './components/DebtContributionManager'

function App() {
  // STATE 1: THE FOUNDATION 
  const [incomeData, setIncomeData] = useState([
    { id: 1, name: 'Salary', gross: 100000, taxRate: 25 }
  ]);
  const [assetData, setAssetData] = useState([
    { id: 1, name: '401k', balance: 50000, growth: 7 }
  ]);
  const [debtData, setDebtData] = useState([
    { id: 1, name: 'Car Loan', balance: 15000, interestRate: 5 }
  ]);

  // STATE 2: THE FLOW 
  const [spendingData, setSpendingData] = useState([
    { id: 1, name: 'Rent', category: 'Housing', amount: 24000, type: 'Required' },
    { id: 2, name: 'Vacation Fund', category: 'Lifestyle & Fun', amount: 5000, type: 'Discretionary' }
  ]);
  const [contributionData, setContributionData] = useState([
    { id: 1, name: '401k Match', amount: 10000, type: 'Required', linkedId: '1' }
  ]);
  const [debtContributionData, setDebtContributionData] = useState([
    { id: 1, name: 'Car Loan Minimum', amount: 4000, type: 'Required', linkedId: '1' }
  ]);

  // MATH HELPERS
  const calcTotal = (data) => data.reduce((acc, item) => acc + (item.amount || 0), 0);
  const calcMandatory = (data) => data.reduce((acc, item) => acc + (item.type === 'Required' ? (item.amount || 0) : 0), 0);
  const calcDiscretionary = (data) => data.reduce((acc, item) => acc + (item.type === 'Discretionary' ? (item.amount || 0) : 0), 0);

  const totalNetIncome = incomeData.reduce((acc, item) => acc + (item.gross * (1 - item.taxRate / 100)), 0);
  const totalSpending = calcTotal(spendingData);
  const totalContributions = calcTotal(contributionData);

  // --- THE SMART MATH ENGINE ---

  // 1. Asset EOY Calculation (0% Growth on new contributions)
  let totalAssetEOY = 0;
  assetData.forEach(asset => {
    // Current balance + Growth
    const baseEOY = asset.balance + (asset.balance * ((asset.growth || 0) / 100));
    // Find contributions linked to this exact asset ID (Dropdowns output Strings, Date.now is a Number, so we cast to String)
    const linkedContributions = contributionData
      .filter(c => String(c.linkedId) === String(asset.id))
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    
    totalAssetEOY += baseEOY + linkedContributions;
  });

  // Add the "New / Unlinked" contributions to the EOY total
  const unlinkedContributions = contributionData
    .filter(c => c.linkedId === 'new' || !c.linkedId)
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  totalAssetEOY += unlinkedContributions;

  // 2. Debt EOY Calculation (The Logical Cap)
  let totalDebtEOY = 0;
  let effectiveDebtPayments = 0; // We use this to refund "overpayments" back to cash flow

  debtData.forEach(debt => {
    // Current balance + Interest
    const baseEOY = debt.balance + (debt.balance * ((debt.interestRate || 0) / 100));
    // Find payments linked to this exact debt ID
    const linkedPayments = debtContributionData
      .filter(p => String(p.linkedId) === String(debt.id))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // LOGICAL CAP: You can't pay more than the debt owes
    if (linkedPayments > baseEOY) {
      effectiveDebtPayments += baseEOY; // Only consume what is owed
      totalDebtEOY += 0;                // Debt is wiped out
    } else {
      effectiveDebtPayments += linkedPayments;
      totalDebtEOY += (baseEOY - linkedPayments);
    }
  });

  // 3. Final Cash Flow & Net Worth
  const totalMandatory = calcMandatory(spendingData) + calcMandatory(contributionData) + calcMandatory(debtContributionData);
  const totalDiscretionary = calcDiscretionary(spendingData) + calcDiscretionary(contributionData) + calcDiscretionary(debtContributionData);
  
  // Notice we use 'effectiveDebtPayments' here so overpayments refund to your cash!
  const unallocatedCashFlow = totalNetIncome - totalSpending - totalContributions - effectiveDebtPayments;
  const projectedNetWorth = totalAssetEOY - totalDebtEOY;
  const currentNetWorth = assetData.reduce((acc, a) => acc + (a.balance||0), 0) - debtData.reduce((acc, d) => acc + (d.balance||0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-grow">
        
        {/* SECTION 1: THE FOUNDATION */}
        <div className="mb-16 mt-4">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-extrabold text-gray-900">Section 1: The Foundation</h2>
            <p className="text-gray-500 mt-1">Enter your income, current asset balances, and existing debts.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <IncomeManager data={incomeData} setData={setIncomeData} />
            <AssetManager data={assetData} setData={setAssetData} />
            <DebtManager data={debtData} setData={setDebtData} />
          </div>
        </div>

        {/* SECTION 2: THE ACTION PLAN */}
        <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="mb-8 border-b border-gray-200 pb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Section 2: The Action Plan</h2>
              <p className="text-gray-500 mt-1 mb-6">How are you allocating your ${totalNetIncome.toLocaleString()} Net Income?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="block text-xs uppercase font-bold tracking-widest text-slate-500">Mandatory / Required</span>
                <span className="text-2xl font-black text-slate-700">${totalMandatory.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="block text-xs uppercase font-bold tracking-widest text-slate-500">Discretionary Spending/Saving</span>
                <span className="text-2xl font-black text-slate-700">${totalDiscretionary.toLocaleString()}</span>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-right shadow-inner">
                <span className="block text-xs uppercase font-bold tracking-widest text-slate-400">Unallocated Cash Remaining</span>
                <span className={`text-3xl font-black ${unallocatedCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${unallocatedCashFlow.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <SpendingManager data={spendingData} setData={setSpendingData} />
            {/* Note: We pass the Foundation Data (assets/debts) down as props here! */}
            <AssetContributionManager data={contributionData} setData={setContributionData} assets={assetData} />
            <DebtContributionManager data={debtContributionData} setData={setDebtContributionData} debts={debtData} />
          </div>
        </div>

        {/* FINAL SUMMARY (Moved to the bottom!) */}
        <div className="mt-8 mb-12 bg-slate-900 p-8 rounded-2xl text-white shadow-2xl border border-slate-700">
          <div className="mb-6 border-b border-slate-700 pb-4">
            <h2 className="text-2xl font-black text-white">Year-End Projection</h2>
            <p className="text-slate-400 text-sm mt-1">
              *Contributions assume 0% growth in Year 1. Debt payments are mathematically capped at the total payoff amount.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Current Net Worth (Jan 1)</p>
              <p className="text-4xl font-black mt-2">${currentNetWorth.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-slate-800 p-6 rounded-xl border border-blue-800 shadow-inner">
              <p className="text-blue-300 text-xs uppercase font-bold tracking-widest">Projected Net Worth (Dec 31)</p>
              <p className="text-5xl font-black text-white mt-2">${projectedNetWorth.toLocaleString()}</p>
              <p className="text-sm font-semibold mt-2 text-green-400">
                 {projectedNetWorth >= currentNetWorth ? '+' : ''}${(projectedNetWorth - currentNetWorth).toLocaleString()} Growth
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App