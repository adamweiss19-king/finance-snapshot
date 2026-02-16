import { useState } from 'react'
import IncomeManager from './components/IncomeManager' // This is the new line!

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Finance Snapshot</h1>
          <p className="text-gray-500 mt-2">Design your year. Track your growth.</p>
        </header>
        
        <main>
          {/* We are "calling" our component here */}
          <IncomeManager />
        </main>

      </div>
    </div>
  )
}

export default App