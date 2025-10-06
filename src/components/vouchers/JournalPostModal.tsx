'use client'
import React, { useState, useEffect } from 'react'

interface JournalPostModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  dispatch: any
}

export function JournalPostModal({ isOpen, onClose, onConfirm, dispatch }: JournalPostModalProps) {
  const [dispatchData, setDispatchData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && dispatch) {
      loadDispatchDetails()
    }
  }, [isOpen, dispatch])

  const loadDispatchDetails = async () => {
    if (!dispatch) return
    
    setLoading(true)
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatch.ID}`)
      const result = await response.json()
      
      if (result.success) {
        setDispatchData(result.data)
      }
    } catch (error) {
      console.error('Error loading dispatch details:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = () => {
    if (!dispatchData) return { netTotal: 0, carriageAmount: 0, customerAmount: 0, batches: 0 }
    
    let netTotal = 0
    const batchTotals: any = {}
    
    dispatchData.details?.forEach((detail: any) => {
      const price = parseFloat(detail.Stock_Price) || 0
      let qty = 0
      
      switch(detail.Sale_Unit) {
        case '1': qty = parseFloat(detail.Stock_out_UOM_Qty) || 0; break
        case '2': qty = parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0; break
        case '3': qty = parseFloat(detail.Stock_out_UOM3_Qty) || 0; break
        default: qty = parseFloat(detail.Stock_out_UOM_Qty) || 0
      }
      
      const gross = price * qty
      const discA = gross * (parseFloat(detail.Discount_A) || 0) / 100
      const afterA = gross - discA
      const discB = afterA * (parseFloat(detail.Discount_B) || 0) / 100
      const afterB = afterA - discB
      const discC = afterB * (parseFloat(detail.Discount_C) || 0) / 100
      const itemNet = afterB - discC
      
      netTotal += itemNet
      
      const batchNo = detail.batchno || 'No Batch'
      if (!batchTotals[batchNo]) batchTotals[batchNo] = 0
      batchTotals[batchNo] += itemNet
    })
    
    const carriageAmount = parseFloat(dispatchData.Carriage_Amount) || 0
    const customerAmount = netTotal - carriageAmount
    
    return {
      netTotal,
      carriageAmount,
      customerAmount,
      batches: Object.keys(batchTotals).length,
      batchTotals
    }
  }

  if (!isOpen) return null

  const totals = calculateTotals()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Post to Journal</h3>
                <p className="text-purple-100 text-sm">Confirm journal entries</p>
              </div>
            </div>
            <button onClick={onClose} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin h-8 w-8 border-3 border-purple-500 border-t-transparent rounded-full mr-3"></div>
              <span>Loading dispatch details...</span>
            </div>
          ) : (
            <>
              {/* Dispatch Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Dispatch Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Dispatch No:</span>
                    <span className="font-bold ml-2">{dispatch?.Number}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="font-bold ml-2">{dispatch?.Date ? new Date(dispatch.Date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-bold ml-2">{dispatchData?.account?.acName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Items:</span>
                    <span className="font-bold ml-2">{dispatchData?.details?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Journal Entries Preview */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Journal Entries to be Created</h4>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Description</th>
                        <th className="px-3 py-2 text-right font-semibold">Debit</th>
                        <th className="px-3 py-2 text-right font-semibold">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {/* Customer Entry */}
                      <tr>
                        <td className="px-3 py-2">Customer - {dispatchData?.account?.acName}</td>
                        <td className="px-3 py-2 text-right font-bold">₨{totals.customerAmount.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">-</td>
                      </tr>
                      
                      {/* Carriage Entry */}
                      {totals.carriageAmount > 0 && (
                        <tr>
                          <td className="px-3 py-2">Carriage Charges</td>
                          <td className="px-3 py-2 text-right font-bold">₨{totals.carriageAmount.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">-</td>
                        </tr>
                      )}
                      
                      {/* Batch Entries */}
                      {totals.batchTotals && Object.entries(totals.batchTotals).map(([batch, amount]: [string, any]) => (
                        <tr key={batch}>
                          <td className="px-3 py-2">Sales - Batch {batch}</td>
                          <td className="px-3 py-2 text-right">-</td>
                          <td className="px-3 py-2 text-right font-bold">₨{amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td className="px-3 py-2 font-bold">TOTALS</td>
                        <td className="px-3 py-2 text-right font-bold">₨{totals.netTotal.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right font-bold">₨{totals.netTotal.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Net Total: <strong>₨{totals.netTotal.toFixed(2)}</strong></div>
                  <div>Carriage: <strong>₨{totals.carriageAmount.toFixed(2)}</strong></div>
                  <div>Customer Amount: <strong>₨{totals.customerAmount.toFixed(2)}</strong></div>
                  <div>Batches: <strong>{totals.batches}</strong></div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800">Confirm Journal Posting</p>
                    <p className="text-yellow-700 mt-1">
                      This will create {2 + totals.batches} journal entries. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Post to Journal
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
