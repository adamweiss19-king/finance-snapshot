import React from 'react';
import { Chart } from 'react-google-charts';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function CashFlowSankey({ 
  grossIncome, 
  netIncome, 
  mandatory, 
  discretionary, 
  investments, 
  unallocated 
}) {
  
  // 1. Math Rounding
  const totalGross = Math.round(grossIncome);
  const totalNet = Math.round(netIncome);
  const totalMandatory = Math.round(mandatory);
  const totalDiscretionary = Math.round(discretionary);
  const totalInvestments = Math.round(investments);
  const netUnallocated = Math.round(unallocated);
  const totalTaxes = totalGross - totalNet;

  // 2. Descriptive Label Generator
  const getLabel = (name, value) => {
    const pct = totalGross > 0 ? Math.round((value / totalGross) * 100) : 0;
    return `${name}: ${formatter.format(value)} (${pct}%)`;
  };

  const lblGross = `Gross Income: ${formatter.format(totalGross)}`;
  const lblTaxes = getLabel('Taxes', totalTaxes);
  const lblNet = getLabel('Net Income', totalNet);
  const lblMandatory = getLabel('Mandatory', totalMandatory);
  const lblDiscretionary = getLabel('Discretionary', totalDiscretionary);
  const lblInvestments = getLabel('Investments', totalInvestments);
  const lblUnallocated = getLabel('Unallocated', netUnallocated > 0 ? netUnallocated : 0);
  const lblDeficit = getLabel('Deficit (Debt)', Math.abs(netUnallocated));

  // 3. Custom Tooltip String Generator (Exactly your requested format)
  const tip = (from, to) => `${from} -> ${to}`;

  // 4. Build Data Array with a "Role: Tooltip" column
  // This is the ONLY way to remove the "Weight" text in Google Charts
  const data = [
    ['From', 'To', 'Weight', { role: 'tooltip' }],
    ...(totalTaxes > 0 ? [[lblGross, lblTaxes, totalTaxes, tip(lblGross, lblTaxes)]] : []),
    ...(totalNet > 0 ? [[lblGross, lblNet, totalNet, tip(lblGross, lblNet)]] : []),
    ...(totalMandatory > 0 ? [[lblNet, lblMandatory, totalMandatory, tip(lblNet, lblMandatory)]] : []),
    ...(totalDiscretionary > 0 ? [[lblNet, lblDiscretionary, totalDiscretionary, tip(lblNet, lblDiscretionary)]] : []),
    ...(totalInvestments > 0 ? [[lblNet, lblInvestments, totalInvestments, tip(lblNet, lblInvestments)]] : []),
    ...(netUnallocated > 0 ? [[lblNet, lblUnallocated, netUnallocated, tip(lblNet, lblUnallocated)]] : []),
    ...(netUnallocated < 0 ? [[lblDeficit, lblNet, Math.abs(netUnallocated), tip(lblDeficit, lblNet)]] : []),
  ];

  const options = {
    sankey: {
      node: {
        colors: ['#1e293b', '#ef4444', '#0ea5e9', '#f59e0b', '#fbbf24', '#10b981', '#94a3b8'],
        label: { fontName: 'Inter, system-ui, sans-serif', fontSize: 12, bold: true },
        nodePadding: 45,
        width: 20,
      },
      link: { 
        colorMode: 'target', // Makes the link color solid based on the destination
        fillOpacity: 0.3 
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8 mb-12">
      <div className="mb-8 border-b border-gray-50 pb-4">
        <h3 className="text-xl font-black text-slate-800 tracking-tight italic">Financial Architecture</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flow Breakdown</p>
      </div>

      {totalGross > 0 ? (
        <div className="w-full h-[500px]">
          <Chart
            chartType="Sankey"
            width="100%"
            height="100%"
            data={data}
            options={options}
          />
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-sm">Add income sources to see your flow.</p>
        </div>
      )}
    </div>
  );
}

export default CashFlowSankey;