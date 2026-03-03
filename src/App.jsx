import { useState } from 'react'
import IncomeManager from './components/IncomeManager'
import AssetManager from './components/AssetManager'
import DebtManager from './components/DebtManager'
import SpendingManager from './components/SpendingManager'
import AssetContributionManager from './components/AssetContributionManager'
import DebtContributionManager from './components/DebtContributionManager'
import ActionChecklist from './components/ActionChecklist';
import { getDemoProfile } from './utils/demoProfiles';

function App() {
  // STATE 1: THE FOUNDATION 
  const [incomeData, setIncomeData] = useState([
    { id: 1, name: 'Salary', gross: 100000, taxRate: 25 }
  ]);
const [assetData, setAssetData] = useState([
    { id: 1, name: 'Chase Savings', category: 'Bank Account/Savings', balance: 15000, growth: 0 },
    { id: 2, name: 'Fidelity 401k', category: '401k', balance: 50000, growth: 7 }
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

  const loadProfile = (age) => {
    const profile = getDemoProfile(age);
    if (profile) {
      setIncomeData(profile.income);
      setAssetData(profile.assets);
      setDebtData(profile.debts);
      setSpendingData(profile.spending);
      setContributionData(profile.contributions);
      setDebtAllocationData(profile.debtAllocations);
    }
  };

  // MATH HELPERS
  const calcTotal = (data) => data.reduce((acc, item) => acc + (item.amount || 0), 0);
  const calcMandatory = (data) => data.reduce((acc, item) => acc + (item.type === 'Required' ? (item.amount || 0) : 0), 0);
  const calcDiscretionary = (data) => data.reduce((acc, item) => acc + (item.type === 'Discretionary' ? (item.amount || 0) : 0), 0);

  const totalNetIncome = incomeData.reduce((acc, item) => acc + (item.gross * (1 - item.taxRate / 100)), 0);
  const getPct = (amount) => totalNetIncome > 0 ? Math.round((amount / totalNetIncome) * 100) : 0;
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
  const totalMandatory = calcMandatory(spendingData) + calcMandatory(debtContributionData);
  // --- EMERGENCY RUNWAY MATH ---
  const liquidCash = assetData.filter(a => a.category === 'Bank Account/Savings').reduce((acc, a) => acc + (a.balance || 0), 0);
  const monthlyMandatory = totalMandatory / 12;
  const runwayMonths = monthlyMandatory > 0 ? (liquidCash / monthlyMandatory) : 0;
  const isRunwayLow = runwayMonths < 3;
  const totalDiscretionary = calcDiscretionary(spendingData) + calcDiscretionary(debtContributionData);
  const totalInvestments = calcTotal(contributionData);

  // Notice we use 'effectiveDebtPayments' here so overpayments refund to your cash!
  const unallocatedCashFlow = totalNetIncome - totalSpending - totalContributions - effectiveDebtPayments;
  const projectedNetWorth = totalAssetEOY - totalDebtEOY;
  const currentNetWorth = assetData.reduce((acc, a) => acc + (a.balance||0), 0) - debtData.reduce((acc, d) => acc + (d.balance||0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-grow">
        <div className="mb-8 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-indigo-900 font-bold flex items-center gap-2">
              🧪 Test Data Templates
            </h3>
            <p className="text-indigo-700 text-xs">Instantly load realistic financial profiles to see how the math works.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadProfile(25)} className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
              25 Yr Old (Early Career)
            </button>
            <button onClick={() => loadProfile(40)} className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
              40 Yr Old (Mid Career)
            </button>
            <button onClick={() => loadProfile(50)} className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
              50 Yr Old (Peak Earning)
            </button>
          </div>
        </div>
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

       {/* SECTION 2: THE ACTION PLAN (Managers First) */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">Section 2: The Action Plan</h2>
          <p className="text-gray-500 mt-1">Assign your ${totalNetIncome.toLocaleString()} Net Income to expenses, investments, and debt.</p>
        </div>
        
        {/* The Action Managers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          <SpendingManager data={spendingData} setData={setSpendingData} />
          <AssetContributionManager data={contributionData} setData={setContributionData} assets={assetData} />
          <DebtContributionManager data={debtContributionData} setData={setDebtContributionData} debts={debtData} />
        </div>

        {/* SECTION 2 SUMMARY: ACTION SUMMARY (With Percentages) */}
        <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Cash Flow Allocation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Mandatory */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-slate-500">Mandatory</span>
                <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">{getPct(totalMandatory)}%</span>
              </div>
              <span className="text-2xl font-black text-slate-700">${totalMandatory.toLocaleString()}</span>
            </div>
            
            {/* Discretionary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-slate-500">Discretionary</span>
                <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">{getPct(totalDiscretionary)}%</span>
              </div>
              <span className="text-2xl font-black text-slate-700">${totalDiscretionary.toLocaleString()}</span>
            </div>
            
            {/* Investments */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex justify-between items-start mb-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-blue-500">Investments</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">{getPct(totalInvestments)}%</span>
              </div>
              <span className="text-2xl font-black text-blue-700">${totalInvestments.toLocaleString()}</span>
            </div>
            
            {/* Unallocated */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-right shadow-inner">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-800 bg-slate-400 px-2 py-0.5 rounded-full">{getPct(unallocatedCashFlow)}%</span>
                <span className="block text-xs uppercase font-bold tracking-widest text-slate-400">Unallocated</span>
              </div>
              <span className={`text-3xl font-black ${unallocatedCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${unallocatedCashFlow.toLocaleString()}
              </span>
            </div>
          </div>

          {/* EMERGENCY FUND RUNWAY VISUAL */}
          <div className={`mt-6 p-5 rounded-xl border flex justify-between items-center transition-colors duration-500 ${isRunwayLow ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div>
              <span className={`block text-xs uppercase font-bold tracking-widest ${isRunwayLow ? 'text-red-500' : 'text-emerald-600'}`}>
                Emergency Runway
              </span>
              <span className={`text-3xl font-black ${isRunwayLow ? 'text-red-700' : 'text-emerald-700'}`}>
                {runwayMonths.toFixed(1)} Months
              </span>
            </div>
            <div className="text-right">
                <span className={`text-sm font-bold ${isRunwayLow ? 'text-red-600' : 'text-emerald-600'}`}>
                  Liquid Cash: ${liquidCash.toLocaleString()} <br/> 
                  <span className="opacity-70 font-medium">Required Burn: ${(monthlyMandatory).toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</span>
                </span>
                {isRunwayLow && <p className="text-xs text-red-500 mt-2 font-bold animate-pulse">⚠️ Warning: Below 12-week minimum target.</p>}
                {!isRunwayLow && <p className="text-xs text-emerald-600 mt-2 font-bold">✅ Healthy reserves.</p>}
            </div>
          </div>
        </div>

        {/* OVERALL SUMMARY (Before and After Actions) */}
        <div className="mb-12 bg-slate-900 p-8 rounded-2xl text-white shadow-2xl border border-slate-700">
          <div className="mb-6 border-b border-slate-700 pb-4">
            <h2 className="text-2xl font-black text-white">Year-End Net Worth Projection</h2>
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

        {/* SECTION 3: THE EXECUTION PLAN (Checklist) */}
        <ActionChecklist 
          contributions={contributionData} 
          setContributions={setContributionData} 
          debts={debtContributionData} 
          setDebts={setDebtContributionData}
          foundationAssets={assetData}
          foundationDebts={debtData}
        />
      {/* LEGAL DISCLAIMER */}
        <footer className="mt-12 mb-8 text-center text-xs text-slate-400 max-w-3xl mx-auto">
          <p>
            <strong>Disclaimer:</strong> This application is a personal planning tool provided for educational and informational purposes only. I am not a financial advisor, and these projections do not constitute professional financial or tax advice. Please consult with a certified professional before making major financial decisions.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App