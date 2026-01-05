'use client'
import  {CurrencyManager}  from '@/components/currency/CurrencyManager'
import DebugPermissions from '@/components/DebugPermissions/DebugPermissions';
import TokenDebug from '@/components/DebugPermissions/TokenDebug';

export default function CurrencyPage() {
  return (<>
    {/* <div className="p-4 space-y-4 bg-red-50 border border-red-200 mb-6">
      <h2 className="text-lg font-bold text-red-800">🐛 Debug Information (Remove in Production)</h2>
      <DebugPermissions />
      <TokenDebug />
    </div> */}
    <CurrencyManager />
  </>)

}
