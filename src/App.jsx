import { useState } from 'react'
import IncomeManager from './components/IncomeManager'
import AssetManager from './components/AssetManager'
import DebtManager from './components/DebtManager'
import SpendingManager from './components/SpendingManager'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Finance Snapshot</h1>
          <p className="text-gray-500 mt-2">Design your year. Track your growth.</p>
        </header>
        
 <main>
          {/* This is the magic layout line: 1 col on mobile, 3 cols on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <section className="space-y-4">
              <IncomeManager />
            </section>

            <section className="space-y-4">
              <AssetManager />
            </section>

            <section className="space-y-4">
              <DebtManager />
            </section>

            <section className="space-y-4">
              <SpendingManager />
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

export default App