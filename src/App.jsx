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
import { getSnapshots, saveSnapshot,loadDemoProfileIntoStorage } from './utils/storageEngine';
import HistoryTable from './components/HistoryTable';
import ExecutionScorecard from './components/ExecutionScorecard';




function App() {
  const [snapshots, setSnapshots] = useState(() => getSnapshots());
  const [activeYear, setActiveYear] = useState('Current Workspace'); // 'Current Workspace' or a specific year like '2024', '2025', etc.
  const [currentView, setCurrentView] = useState('Dashboard'); // 'Dashboard' or 'History'  
  // --- NEW V2 STATES ---
  const [isLocked, setIsLocked] = useState(false);
  const [viewingType, setViewingType] = useState('plan'); // 'plan' or 'actuals'
  const [isClosingOut, setIsClosingOut] = useState(false); 

  // --- THE CORE FINANCIAL DATA STATES (Fixed Variable Names to match Demo Data) ---
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
  const profileData = getDemoProfile(profileName);
  if (profileData) {
    // 1. Overwrite localStorage with the 3-year history
    const updatedSnapshots = loadDemoProfileIntoStorage(profileData);
    setSnapshots(updatedSnapshots);
    
    // 2. Find the most recent year (e.g., "2025") and load it
    const years = Object.keys(updatedSnapshots).sort();
    const latestYear = years[years.length - 1];
    handleLoadSnapshot(latestYear);
    
    alert(`✅ Loaded ${profileName} history (2023-${latestYear})`);
  }
};

  // --- V2 SNAPSHOT HANDLERS ---
const handleLoadSnapshot = (selectedYear) => {
    setActiveYear(selectedYear);
    setIsClosingOut(false); // Always reset this when navigating
    
    if (selectedYear === 'Current Workspace') {
      setIsLocked(false);
      setViewingType('plan');
      return;
    }

    if (snapshots[selectedYear]) {
      const snap = snapshots[selectedYear];
      const isClosed = snap.status === 'closed';
      
      const dataToLoad = isClosed && snap.actuals ? snap.actuals : snap.plan;
      
      setIsLocked(isClosed);
      setViewingType(isClosed ? 'actuals' : 'plan');

      setAge(dataToLoad.age || 30);
      setFilingStatus(dataToLoad.filingStatus || 'Single');
      setStateTaxLevel(dataToLoad.stateTaxLevel || 'Medium');
      setIncomeData(dataToLoad.incomeData || []);
      setAssetData(dataToLoad.assetData || []);
      setDebtData(dataToLoad.debtData || []);
      setSpendingData(dataToLoad.spendingData || []);
      setAssetContributions(dataToLoad.assetContributions || []);
      setDebtContributions(dataToLoad.debtContributions || []);
    }
  };

  const handleSmartSave = () => {
    const fullState = { age, filingStatus, stateTaxLevel, incomeData, assetData, debtData, spendingData, assetContributions, debtContributions };
    
    if (activeYear === 'Current Workspace') {
      const currentYear = new Date().getFullYear().toString();
      const targetYear = window.prompt("Enter the year to save this PLAN for (e.g., 2026):", currentYear);
      if (!targetYear) return; 
      
      const updatedSnapshots = saveSnapshot(targetYear, fullState, 'plan', 'open');
      setSnapshots(updatedSnapshots);
      setActiveYear(targetYear);
      alert(`✅ ${targetYear} Plan saved successfully!`);
    } else if (isLocked) {
      const updatedSnapshots = saveSnapshot(activeYear, fullState, 'actuals', 'closed');
      setSnapshots(updatedSnapshots);
      setIsLocked(true); 
      alert(`✅ ${activeYear} Actuals updated and re-locked.`);
    } else {
      const updatedSnapshots = saveSnapshot(activeYear, fullState, 'plan', 'open');
      setSnapshots(updatedSnapshots);
      alert(`✅ ${activeYear} Plan updated!`);
    }
  };

  const confirmCloseOut = () => {
    // 1. Create a version of the data where "isNew" assets are reset to $0 for the Actuals report
    const actualAssetData = assetData.map(asset => 
      asset.isNew ? { ...asset, balance: 0 } : asset
    );
    const actualDebtData = debtData.map(debt => 
      debt.isNew ? { ...debt, balance: 0 } : debt
    );

    const fullState = { 
      age, filingStatus, stateTaxLevel, 
      incomeData, 
      assetData: actualAssetData, // Use the reset assets
      debtData: actualDebtData,   // Use the reset debts
      spendingData, 
      assetContributions, 
      debtContributions 
    };
    
    const updatedSnapshots = saveSnapshot(activeYear, fullState, 'actuals', 'closed');
    setSnapshots(updatedSnapshots);
    
    // UI Updates
    setAssetData(actualAssetData);
    setDebtData(actualDebtData);
    setIsLocked(true);
    setViewingType('actuals');
    setIsClosingOut(false);
    
    alert(`🔒 ${activeYear} closed! New accounts have been reset to $0 for your final reporting.`);
  };

  const startNextYear = () => {
    const nextYear = (parseInt(activeYear) + 1).toString();
    
    // We copy the exact screen (the EOY Actuals) but bump the age by 1!
    const newPlanState = {
      age: age + 1, 
      filingStatus, stateTaxLevel,
      incomeData, assetData, debtData,
      spendingData, assetContributions, debtContributions 
    };

    const updatedSnapshots = saveSnapshot(nextYear, newPlanState, 'plan', 'open');
    setSnapshots(updatedSnapshots);
    setActiveYear(nextYear);
    setIsLocked(false);
    setViewingType('plan');
    alert(`🎉 Welcome to ${nextYear}! Your starting balances have been pulled from ${activeYear}'s final actuals. You can now adjust your Action Plan.`);
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
        
        {/* --- GLOBAL APP TABS --- */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setCurrentView('Dashboard')}
            className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-colors ${currentView === 'Dashboard' ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
          >
            📊 Planning Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('History')}
            className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-colors ${currentView === 'History' ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
          >
            📚 Historical Ledger
          </button>
        </div>

        {/* SNAPSHOT & TIME TRAVEL NAV BAR (Only show if on Dashboard) */}
        {currentView === 'Dashboard' && (
          <div className={`mb-6 px-6 py-4 rounded-b-2xl rounded-tr-2xl flex flex-wrap justify-between items-center shadow-lg border transition-colors duration-500 ${isLocked ? 'bg-slate-900 border-red-500/50' : 'bg-slate-900 border-slate-800'}`}>
            
            {/* Left Side: Time Travel Dropdown */}
            <div className="flex items-center gap-4">
              <span className="font-bold text-xs tracking-widest uppercase text-slate-400 flex items-center gap-2">
                <span>⏱️</span> Time Travel
              </span>
              <select
                value={activeYear}
                onChange={(e) => handleLoadSnapshot(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white focus:ring-emerald-500 cursor-pointer outline-none"
              >
                <option value="Current Workspace">Current Workspace</option>
                {Object.keys(snapshots || {}).sort().reverse().map(year => {
                  const status = snapshots[year].status === 'closed' ? '🔒' : '📝';
                  return <option key={year} value={year}>{status} {year} Snapshot</option>
                })}
              </select>
              
              {/* Status Badge */}
              {activeYear !== 'Current Workspace' && (
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full ${isLocked ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {isLocked ? 'Closed (Actuals)' : 'Open (Plan)'}
                </span>
              )}
            </div>
            
            {/* Right Side: Smart Action Buttons */}
            <div className="flex gap-3">
              {activeYear === 'Current Workspace' && (
                <button onClick={handleSmartSave} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold px-5 py-2 rounded-xl text-sm transition-all shadow-sm">
                  💾 Save as New Plan
                </button>
              )}

              {/* If OPEN and NOT closing out */}
              {activeYear !== 'Current Workspace' && !isLocked && snapshots[activeYear]?.status === 'open' && !isClosingOut && (
                <>
                  <button onClick={handleSmartSave} className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all shadow-sm">
                    Update Plan
                  </button>
                  <button 
                    onClick={() => {
                      // 1. Prep the data: Find 'New' accounts and zero them out immediately
                      const preppedAssets = assetData.map(a => a.isNew ? { ...a, balance: 0 } : a);
                      const preppedDebts = debtData.map(d => d.isNew ? { ...d, balance: 0 } : d);
                      
                      // 2. Update the live state so the user sees $0 on the screen
                      setAssetData(preppedAssets);
                      setDebtData(preppedDebts);
                      
                      // 3. Enter the close-out view
                      setIsClosingOut(true);
                    }} 
                    className="bg-red-500 hover:bg-red-400 text-white font-extrabold px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
                  >
                    🔒 Close Out {activeYear}
                  </button>
                </>
              )}

              {/* If LOCKED, give them the Unlock button AND the Next Year Rollover button! */}
              {isLocked && (
                <>
                  <button onClick={() => setIsLocked(false)} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2">
                    🔓 Unlock to Edit
                  </button>
                  <button onClick={startNextYear} className="bg-blue-500 hover:bg-blue-400 text-white font-black px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 animate-pulse">
                    ➡️ Start {parseInt(activeYear) + 1} Plan
                  </button>
                </>
              )}

              {/* If they unlocked a closed year to edit it */}
              {activeYear !== 'Current Workspace' && !isLocked && snapshots[activeYear]?.status === 'closed' && (
                <button onClick={handleSmartSave} className="bg-orange-500 hover:bg-orange-400 text-slate-900 font-extrabold px-5 py-2 rounded-xl text-sm transition-all shadow-sm">
                  ⚠️ Update & Re-Lock
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT AREA --- */}
        {currentView === 'Dashboard' ? (
          <>
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
            <div className={`mb-16 mt-4 ${isClosingOut ? 'ring-4 ring-red-500/20 p-6 rounded-3xl bg-red-50/10' : ''}`}>
              <div className="mb-6 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {isClosingOut ? `Final ${activeYear} Inventory (Dec 31st)` : `Step 1: Current Inventory`}
                </h2>
                <p className={`${isClosingOut ? 'text-red-500 font-bold' : 'text-gray-500'} mt-1`}>
                  {isClosingOut 
                    ? "Update these balances to exactly match your real-life bank and loan statements today." 
                    : "Take stock of your starting line. Log your income streams, asset balances, and liabilities."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <IncomeManager data={incomeData} setData={setIncomeData} />
                <AssetManager data={assetData} setData={setAssetData} />
                <DebtManager data={debtData} setData={setDebtData} assets={assetData} />
              </div>

              {/* CLOSE OUT CONFIRMATION BOX */}
              {isClosingOut && (
                <div className="mt-8 bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
                  <h3 className="text-red-800 font-bold text-xl mb-2">Ready to lock in {activeYear}?</h3>
                  <p className="text-red-600 text-sm mb-6 max-w-lg">By clicking this, the balances above will be permanently saved as your Year-End Actuals, and the year will be closed.</p>
                  <div className="flex gap-4">
                     <button onClick={() => setIsClosingOut(false)} className="px-6 py-3 text-red-600 font-bold hover:bg-red-100 rounded-xl transition-colors">Cancel</button>
                     <button onClick={confirmCloseOut} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-md transition-all">🔒 Confirm & Close Out</button>
                  </div>
                </div>
              )}
            </div>

            {/* ONLY SHOW THE REST OF THE APP IF WE ARE NOT CLOSING OUT */}
            {!isClosingOut && (
              <>
                <FoundationSummary 
                  incomeData={incomeData}
                  taxReceipt={taxReceipt}
                  totalInvestments={totalInvestments}
                  debtContributions={debtContributions}
                />

                {/* SECTION 2: THE ACTION PLAN */}
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-3xl font-extrabold text-gray-900">Step 2: Cash Flow Allocation</h2>
                  <p className="text-gray-500 mt-1">Give your ${totalNetIncome.toLocaleString()} of net income a job.</p>
                </div>
                
                {/* FLOATING UNALLOCATED CASH ROW */}
                <UnallocatedCashTracker 
                  unallocatedCashFlow={unallocatedCashFlow} 
                  totalNetIncome={totalNetIncome} 
                />

                {/* The Action Managers */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
                  <SpendingManager data={spendingData} setData={setSpendingData} />          
                  <AssetContributionManager data={assetContributions} setData={setAssetContributions} assets={assetData} age={age} filingStatus={filingStatus} />
                  <DebtContributionManager data={debtContributions} setData={setDebtContributions} debts={debtData} />
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

                {/* SECTION 3: NET WORTH PROJECTION */}
                <NetWorthProjection
                  currentNetWorth={currentNetWorth}
                  projectedNetWorth={projectedNetWorth}
                  totalCashAddedToAssets={totalCashAddedToAssets}
                  effectiveDebtPayments={effectiveDebtPayments}
                  totalMarketGrowth={totalMarketGrowth}
                />

                {/* SECTION 4: THE EXECUTION PLAN */}
                <ActionChecklist 
                  contributions={assetContributions} 
                  setContributions={setAssetContributions} 
                  debts={debtContributions} 
                  setDebts={setDebtContributions} 
                  foundationAssets={assetData}
                  foundationDebts={debtData}
                />
                
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
              </>
            )}
          </>
        ) : (
          /* THIS IS THE NEW HISTORY VIEW */
          <div className="animate-fade-in pb-12">
            <ExecutionScorecard snapshots={snapshots} />
            <HistoryTable snapshots={snapshots} />
          </div>
        )}
      </div>

      {/* LEGAL DISCLAIMER */}
      <footer className="mt-12 mb-8 text-center text-xs text-slate-400 max-w-3xl mx-auto">
        <p>
          <strong>Disclaimer:</strong> This application is a personal planning tool provided for educational and informational purposes only. I am not a financial advisor, and these projections do not constitute professional financial or tax advice. Please consult with a certified professional before making major financial decisions.
        </p>
      </footer>
    </div>
  );
}

export default App;