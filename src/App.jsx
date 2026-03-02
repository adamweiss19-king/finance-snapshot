import { useState } from 'react'
import IncomeManager from './components/IncomeManager'
import AssetManager from './components/AssetManager'
import DebtManager from './components/DebtManager'
import SpendingManager from './components/SpendingManager'
import AssetContributionManager from './components/AssetContributionManager'
import DebtContributionManager from './components/DebtContributionManager'

function App() {
  // STATE 1: THE FOUNDATION (Current Balances Only)
  const [incomeData, setIncomeData] = useState([
    { id: 1, name: 'Salary', gross: 100000, taxRate: 25 }
  ]);
  const [assetData, setAssetData] = useState([
    { id: 1, name: '401k', balance: 50000, growth: 7 }
  ]);
  const [debtData, setDebtData] = useState([
    { id: 1, name: 'Car Loan', balance: 15000, interestRate: 5 }
  ]);

  // STATE 2: THE FLOW (The Action Plan)
  const [spendingData, setSpendingData] = useState([
    { id: 1, name: 'Rent', category: 'Housing', amount: 24000, type: 'Required' },
    { id: 2, name: 'Vacation Fund', category: 'Lifestyle & Fun', amount: 5000, type: 'Discretionary' }
  ]);
  const [assetContributionData, setAssetContributionData] = useState([
    { id: 1, name: '401k Match', amount: 10000, type: 'Required' }
  ]);
  const [debtContributionData, setDebtContributionData] = useState([
    { id: 1, name: 'Car Loan Minimum', amount: 4000, type: 'Required' },
    { id: 2, name: 'Extra Principal', amount: 2000, type: 'Discretionary' }
  ]);

  // MATH HELPERS
  const calcTotal = (data) => data.reduce((acc, item) => acc + (item.amount || 0), 0);
  const calcMandatory = (data) => data.reduce((acc, item) => acc + (item.type === 'Mandatory' ? (item.amount || 0) : 0), 0);
  const calcDiscretionary = (data) => data.reduce((acc, item) => acc + (item.type === 'Discretionary' ? (item.amount || 0) : 0), 0);

  // CORE CALCULATIONS
  const totalNetIncome = incomeData.reduce((acc, item) => acc + (item.gross * (1 - item.taxRate / 100)), 0);
  
  const totalSpending = calcTotal(spendingData);
  const totalAssetContributions = calcTotal(assetContributionData);
  const totalDebtContributions = calcTotal(debtContributionData);

  const totalMandatory = calcMandatory(spendingData) + calcMandatory(assetContributionData) + calcMandatory(debtContributionData);
  const totalDiscretionary = calcDiscretionary(spendingData) + calcDiscretionary(assetContributionData) + calcDiscretionary(debtContributionData);
  
  const unallocatedCashFlow = totalNetIncome - totalSpending - totalAssetContributions - totalDebtContributions;

  // NET WORTH PROJECTIONS
  const totalAssetEOY = assetData.reduce((acc, a) => acc + (a.balance + (a.balance * ((a.growth||0)/100))), 0) + totalAssetContributions;
  const totalDebtEOY = debtData.reduce((acc, d) => acc + (d.balance + (d.balance * ((d.interestRate||0)/100))), 0) - totalDebtContributions;
  const projectedNetWorth = totalAssetEOY - totalDebtEOY;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900">
      <div className="max-w-[1600px] mx-auto">
        
        {/* TOP SUMMARY HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Current Net Worth</p>
            <p className="text-2xl font-black">${(assetData.reduce((acc, a) => acc + (a.balance||0), 0) - debtData.reduce((acc, d) => acc + (d.balance||0), 0)).toLocaleString()}</p>
          </div>
          <div className="md:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Projected EOY Net Worth</p>
            <p className="text-4xl font-black text-blue-400">${projectedNetWorth.toLocaleString()}</p>
          </div>
        </div>

        {/* SECTION 1: THE FOUNDATION */}
        <div className="mb-16">
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
          
          {/* NEW ACTION PLAN SUB-SUMMARY */}
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
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-right">
                <span className="block text-xs uppercase font-bold tracking-widest text-slate-400">Unallocated Cash Remaining</span>
                <span className={`text-3xl font-black ${unallocatedCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${unallocatedCashFlow.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <SpendingManager data={spendingData} setData={setSpendingData} />
            <AssetContributionManager data={assetContributionData} setData={setAssetContributionData} />
            <DebtContributionManager data={debtContributionData} setData={setDebtContributionData} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default App