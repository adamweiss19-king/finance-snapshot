import { useState } from 'react'
import IncomeManager from './components/IncomeManager'
import AssetManager from './components/AssetManager'
import DebtManager from './components/DebtManager'
import SpendingManager from './components/SpendingManager'
import UnallocatedCashTracker from './components/UnallocatedCashTracker'
import AssetContributionManager from './components/AssetContributionManager'
import DebtContributionManager from './components/DebtContributionManager'
import ActionChecklist from './components/ActionChecklist';
import CashFlowSankey from './components/CashFlowSankey';
import { getDemoProfile } from './utils/demoProfiles';
import { calculateProjections } from './utils/projectionEngine';
import { calculateTaxes } from './utils/taxEngine';
import FoundationSummary from './components/FoundationSummary';
import AllocationSummary from './components/AllocationSummary';
import NetWorthProjection from './components/NetWorthProjection';




function App() {
  // STATE 1: THE FOUNDATION 
  const [age, setAge] = useState(30);
  const [filingStatus, setFilingStatus] = useState('Single');
  const [stateTaxLevel, setStateTaxLevel] = useState('Medium');

  const [incomeData, setIncomeData] = useState([
    { id: 1, name: 'Salary', gross: 100000, taxRate: 25, type: 'W-2 Salary', isTaxable: true }
  ]);
  const [assetData, setAssetData] = useState([
    { id: 1, name: 'Chase Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15000, growth: 0 },
    { id: 2, name: 'Fidelity 401k', bucket: 'Retirement', category: '401k', balance: 50000, growth: 7 }
  ]);
  const [debtData, setDebtData] = useState([
    { id: 1, name: 'Car Loan', balance: 15000, interestRate: 5, linkedAssetId: '' }
  ]);

  // STATE 2: THE FLOW (Fixed Variable Names to match Demo Data)
  const [spendingData, setSpendingData] = useState([
    { id: 1, name: 'Rent', category: 'Housing', amount: 24000, type: 'Mandatory' },
    { id: 2, name: 'e.g. Total Amex Spend', category: 'Card Expenses', amount: 5000, type: 'Discretionary' }
  ]);
  const [assetContributions, setAssetContributions] = useState([
    { id: 1, name: '401k Match', amount: 10000, type: 'Mandatory', linkedId: '2', frequency: 'Monthly' }
  ]);
  const [debtContributions, setDebtContributions] = useState([
    { id: 1, name: 'Car Loan Minimum', amount: 4000, type: 'Mandatory', linkedId: '1', frequency: 'Monthly' }
  ]);

  // DEMO PROFILES LOADER (Fixed to pull the correct profile data keys)
  const loadProfile = (profileName) => {
    const profile = getDemoProfile(profileName);
    if (profile) {
      setAge(profile.age || 30);
      setFilingStatus(profile.filingStatus || 'Single');
      
      // Use 'incomeData', 'assetData', etc. to match the demo file keys
      setIncomeData(profile.incomeData || []);
      setAssetData(profile.assetData || []);
      setDebtData(profile.debtData || []);
      setSpendingData(profile.spendingData || []);
      setAssetContributions(profile.assetContributions || []);
      setDebtContributions(profile.debtContributions || []);
    }
  };

  // MATH HELPERS
  const calcTotal = (data) => data.reduce((acc, item) => acc + (item.amount || 0), 0);
  const calcMandatory = (data) => data.reduce((acc, item) => acc + (item.type === 'Mandatory' ? (item.amount || 0) : 0), 0);
  const calcDiscretionary = (data) => data.reduce((acc, item) => acc + (item.type === 'Discretionary' ? (item.amount || 0) : 0), 0);

  const totalGrossIncome = incomeData.reduce((acc, item) => acc + (Number(item.gross) || 0), 0);
  const taxReceipt = calculateTaxes(incomeData, filingStatus, stateTaxLevel);
  const totalTaxes = taxReceipt.totalTax;
  const totalNetIncome = totalGrossIncome - totalTaxes;

  // Calculate the new buckets
  const totalMandatory = calcMandatory(spendingData) + calcMandatory(debtContributions);
  const totalDiscretionary = calcDiscretionary(spendingData) + calcDiscretionary(debtContributions);
  const totalInvestments = calcTotal(assetContributions); 
  const totalSpending = calcTotal(spendingData);
  const totalContributionsAmount = calcTotal(assetContributions);

  // --- EMERGENCY RUNWAY MATH ---
 // 1. Current Cash
  const liquidCash = assetData
    .filter(a => a.bucket === 'Cash' || a.category === 'Bank Account/Savings')
    .reduce((acc, a) => acc + (a.balance || 0), 0);  

  // 2. Projected Cash (Adding linked contributions)
  const projectedCashContributions = assetContributions.reduce((sum, c) => {
    const linkedAsset = assetData.find(a => String(a.id) === String(c.linkedId));
    if (linkedAsset && (linkedAsset.bucket === 'Cash' || linkedAsset.category === 'Bank Account/Savings')) {
      return sum + (Number(c.amount) || 0);
    }
    return sum;
  }, 0);

  const projectedLiquidCash = liquidCash + projectedCashContributions;
  const monthlyMandatory = totalMandatory / 12;

  // 3. Calculate Runways
  const currentRunwayMonths = monthlyMandatory > 0 ? (liquidCash / monthlyMandatory) : 0;
  const projectedRunwayMonths = monthlyMandatory > 0 ? (projectedLiquidCash / monthlyMandatory) : 0;
  
  // We base the warning on the PROJECTED end-of-year health!
  const isRunwayLow = projectedRunwayMonths < 2.76;

 // --- THE SMART MATH ENGINE ---
  const projections = calculateProjections({
    assetData,
    debtData,
    assetContributions,
    debtContributions,
    totalNetIncome,
    totalSpending,
    totalContributionsAmount
  });

  const {
    totalMarketGrowth,
    totalCashAddedToAssets,
    effectiveDebtPayments,
    unallocatedCashFlow,
    currentNetWorth,
    projectedNetWorth
  } = projections;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-grow">
        
        {/* Header & Demo Buttons */}
        <div className="mb-8 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-indigo-900 font-bold flex items-center gap-2">🧪 Test Data Templates</h3>
            <p className="text-indigo-700 text-xs">Instantly load realistic V2 profiles to see how the math works.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => loadProfile('singleNewHire')} className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition">Single (New Hire)</button>
            <button onClick={() => loadProfile('singleMidCareer')} className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition">Single (Mid-Career)</button>
            <button onClick={() => loadProfile('familyMidCareer')} className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition">Family (Mid-Career)</button>
            <button onClick={() => loadProfile('complex')} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-900 px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition">Complex / Power User</button>
          </div>
        </div>

        {/* Demographic Context Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filing Status</label>
            <select 
              value={filingStatus} 
              onChange={(e) => setFilingStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="Single">Single</option>
              <option value="Married Filing Jointly">Married Filing Jointly</option>
              <option value="Married Filing Separately">Married Filing Separately</option>
              <option value="Head of Household">Head of Household</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State Tax Level</label>
            <select 
              value={stateTaxLevel} 
              onChange={(e) => setStateTaxLevel(e.target.value)} 
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="None">None (0%)</option>
              <option value="Low">Low (Approx)</option>
              <option value="Medium">Medium (Approx)</option>
              <option value="High">High (Approx)</option>
            </select>
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
            <DebtManager data={debtData} setData={setDebtData} assets={assetData} />
          </div>
        </div>
          <FoundationSummary 
            incomeData={incomeData}
            taxReceipt={taxReceipt}
            totalInvestments={totalInvestments}
            debtContributions={debtContributions}
          />
        {/* SECTION 2: THE ACTION PLAN */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">Section 2: The Action Plan</h2>
          <p className="text-gray-500 mt-1">Assign your ${totalNetIncome.toLocaleString()} Net Income to expenses, investments, and debt.</p>
        </div>
        
        {/* FLOATING UNALLOCATED CASH ROW */}
          <UnallocatedCashTracker 
            unallocatedCashFlow={unallocatedCashFlow} 
            totalNetIncome={totalNetIncome} 
          />

        {/* The Action Managers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          <SpendingManager 
          data={spendingData} setData={setSpendingData} 
          />          
          <AssetContributionManager 
            data={assetContributions} 
            setData={setAssetContributions} 
            assets={assetData} 
            age={age} 
            filingStatus={filingStatus} 
          />
          <DebtContributionManager 
            data={debtContributions} 
            setData={setDebtContributions} 
            debts={debtData} 
          />
        </div>

        {/* SECTION 2 SUMMARY: ACTION SUMMARY */}
        <AllocationSummary 
          totalNetIncome={totalNetIncome}
          totalMandatory={totalMandatory}
          totalDiscretionary={totalDiscretionary}
          totalInvestments={totalInvestments}
          currentRunwayMonths={currentRunwayMonths}   
          projectedRunwayMonths={projectedRunwayMonths}
          liquidCash={liquidCash}
          projectedLiquidCash={projectedLiquidCash}
          monthlyMandatory={monthlyMandatory}
          isRunwayLow={isRunwayLow}
        />

        <NetWorthProjection
          currentNetWorth={currentNetWorth}
          projectedNetWorth={projectedNetWorth}
          totalCashAddedToAssets={totalCashAddedToAssets}
          effectiveDebtPayments={effectiveDebtPayments}
          totalMarketGrowth={totalMarketGrowth}
        />

        {/* SECTION 3: THE EXECUTION PLAN */}
        <ActionChecklist 
          contributions={assetContributions} 
          setContributions={setAssetContributions} 
          debts={debtContributions} 
          setDebts={setDebtContributions} 
          foundationAssets={assetData}
          foundationDebts={debtData}
        />
      </div>
        <CashFlowSankey 
          grossIncome={totalGrossIncome}
          netIncome={totalNetIncome}
          mandatory={totalMandatory}
          discretionary={totalDiscretionary}
          investments={totalInvestments}
          unallocated={unallocatedCashFlow}
          incomeData={incomeData}
          taxReceipt={taxReceipt}
          spendingData={spendingData}
          assetContributions={assetContributions}
          debtContributions={debtContributions}
        />
      
      {/* LEGAL DISCLAIMER */}
      <footer className="mt-12 mb-8 text-center text-xs text-slate-400 max-w-3xl mx-auto">
        <p>
          <strong>Disclaimer:</strong> This application is a personal planning tool provided for educational and informational purposes only. I am not a financial advisor, and these projections do not constitute professional financial or tax advice. Please consult with a certified professional before making major financial decisions.
        </p>
      </footer>
    </div>
  )
}

export default App