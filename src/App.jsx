import { useState } from 'react'
import IncomeManager from './components/IncomeManager'
import AssetManager from './components/AssetManager'
import DebtManager from './components/DebtManager'
import SpendingManager from './components/SpendingManager'

function App() {
  // MASTER DATA STRUCUTURE
  const [incomeData, setIncomeData] = useState([
    { id: 1, name: 'Salary', gross: 100000, taxRate: 25 }
  ]);
  
  const [assetData, setAssetData] = useState([
    { id: 1, name: '401k', balance: 50000, contribution: 10000, growth: 7 }
  ]);

  const [debtData, setDebtData] = useState([
    { id: 1, name: 'Car Loan', balance: 15000, interestRate: 5, annualPayment: 4000 }
  ]);

  const [spending, setSpending] = useState(60000);

  // GLOBAL CALCULATIONS (The "Brain" of the App)
  const totalNetIncome = incomeData.reduce((acc, item) => acc + (item.gross * (1 - item.taxRate / 100)), 0);
  const totalAssetEOY = assetData.reduce((acc, a) => acc + (a.balance + (a.balance * (a.growth/100)) + a.contribution), 0);
  const totalDebtEOY = debtData.reduce((acc, d) => acc + (d.balance + (d.balance * (d.interestRate/100)) - d.annualPayment), 0);
  
  const projectedNetWorth = totalAssetEOY - totalDebtEOY;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900">
      <div className="max-w-[1600px] mx-auto">
        
        {/* NEW SUMMARY HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Net Cash Flow</p>
            <p className="text-2xl font-black text-green-400">${(totalNetIncome - spending).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Current Net Worth</p>
            <p className="text-2xl font-black">${(assetData.reduce((acc, a) => acc + a.balance, 0) - debtData.reduce((acc, d) => acc + d.balance, 0)).toLocaleString()}</p>
          </div>
          <div className="md:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Projected EOY Net Worth</p>
            <p className="text-4xl font-black text-blue-400">${projectedNetWorth.toLocaleString()}</p>
          </div>
        </div>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* We will pass the data and setters as "Props" here next */}
            <section className="space-y-8">
              <IncomeManager data={incomeData} setData={setIncomeData} />
              <SpendingManager value={spending} setValue={setSpending} />
            </section>
            <section>
              <AssetManager data={assetData} setData={setAssetData} />
            </section>
            <section>
              <DebtManager data={debtData} setData={setDebtData} />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App