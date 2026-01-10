'use client'
import React, { useState, useEffect } from 'react'
import { SalesVoucher } from './SalesVoucher'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { JournalPostModal } from './JournalPostModal'

interface DispatchRecord {
  ID: number
  Number: string
  Date: string
  account?: { acName: string }
  Status: string
  is_Voucher_Generated: boolean
  details?: any[]
  // JOURNAL STATUS FIELDS
  hasJournal?: boolean
  journalStatus?: 'Post' | 'UnPost' | null
  journalId?: number | null
}

export function DispatchListWithVoucher() {
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null)
  const [showVoucher, setShowVoucher] = useState(false)
  const [voucherMode, setVoucherMode] = useState<'create' | 'edit'>('create')
  
  // COMMENTED OUT RESET FUNCTIONALITY
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // const [dispatchToResetVoucher, setDispatchToResetVoucher] = useState<DispatchRecord | null>(null)
  // const [deleteLoading, setDeleteLoading] = useState(false)
  
  const [filter, setFilter] = useState<'all' | 'generated' | 'pending' | 'posted'>('all')
  
  // Journal posting states
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [dispatchToToggle, setDispatchToToggle] = useState<DispatchRecord | null>(null)
  const [toggleLoading, setToggleLoading] = useState<number | null>(null)
  const [journalSuccess, setJournalSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadDispatches()
  }, [])

  // AUTO-HIDE SUCCESS MESSAGE
  useEffect(() => {
    if (journalSuccess) {
      const timer = setTimeout(() => setJournalSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [journalSuccess])

  const loadDispatches = async () => {
    setLoading(true)
    try {
      let response
      let result
      
      try {
        response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`)
        result = await response.json()
      } catch (err) {
        console.log('Trying alternative dispatch endpoint...')
        response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
        result = await response.json()
      }
      
      if (result.success && result.data) {
        console.log('✅ Loaded dispatches:', result.data.length)
        
        // CHECK JOURNAL STATUS FOR EACH DISPATCH
        const dispatchesWithJournalStatus = await Promise.all(
          result.data.map(async (dispatch: DispatchRecord) => {
            try {
              const journalResponse = await fetch(
                `http://${window.location.hostname}:4000/api/journal-master/check-status/${dispatch.ID}`
              )
              const journalResult = await journalResponse.json()
              
              return {
                ...dispatch,
                hasJournal: journalResult.success && journalResult.isPosted,
                journalStatus: journalResult.journalStatus, // 'Post' or 'UnPost' or null
                journalId: journalResult.journalId
              }
            } catch (error) {
              console.log(`⚠️ Could not check journal status for dispatch ${dispatch.ID}`)
              return { 
                ...dispatch, 
                hasJournal: false, 
                journalStatus: null,
                journalId: null 
              }
            }
          })
        )
        
        setDispatches(dispatchesWithJournalStatus)
        console.log('📊 Dispatches with journal status loaded')
      } else {
        console.error('❌ No data in response:', result)
      }
    } catch (error) {
      console.error('💥 Error loading dispatches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredDispatches = () => {
    switch (filter) {
      case 'pending': 
        return dispatches.filter(d => !d.is_Voucher_Generated)
      case 'generated': 
        return dispatches.filter(d => d.is_Voucher_Generated && d.journalStatus === 'UnPost')
      case 'posted': 
        return dispatches.filter(d => d.journalStatus === 'Post')
      default: 
        return dispatches
    }
  }

  const getStatusCounts = () => {
    const total = dispatches.length
    const pending = dispatches.filter(d => !d.is_Voucher_Generated).length
    const generated = dispatches.filter(d => d.is_Voucher_Generated && d.journalStatus === 'UnPost').length
    const posted = dispatches.filter(d => d.journalStatus === 'Post').length
    
    return { total, pending, generated, posted }
  }

  const handleCreateVoucher = (dispatch: DispatchRecord) => {
    setSelectedDispatchId(dispatch.ID)
    setVoucherMode('create')
    setShowVoucher(true)
  }

  const handleEditVoucher = (dispatch: DispatchRecord) => {
    setSelectedDispatchId(dispatch.ID)
    setVoucherMode('edit')
    setShowVoucher(true)
  }

  // TOGGLE POST/UNPOST FUNCTIONALITY
  const handleToggleJournalClick = (dispatch: DispatchRecord) => {
    setDispatchToToggle(dispatch)
    setShowJournalModal(true)
  }

  const handleConfirmToggleJournal = async () => {
    if (!dispatchToToggle) return
    
    setShowJournalModal(false)
    setToggleLoading(dispatchToToggle.ID)
    
    try {
      // TOGGLE POST/UNPOST STATUS
      const response = await fetch(`http://${window.location.hostname}:4000/api/journal-master/post-voucher/${dispatchToToggle.ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'post' }) // Backend will toggle automatically
      })
      
      const result = await response.json()
      
      if (result.success) {
        const newStatus = result.data.journalMaster.status
        
        // UPDATE DISPATCH STATUS
        setDispatches(prev => 
          prev.map(d => 
            d.ID === dispatchToToggle.ID 
              ? { ...d, journalStatus: newStatus }
              : d
          )
        )
        
        setJournalSuccess(`✅ Journal ${newStatus === 'Post' ? 'Posted' : 'Unposted'} Successfully: ${result.data.journalMaster.voucherNo}`)
      } else {
        alert(`❌ Failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error toggling journal:', error)
      alert('❌ Error toggling journal status')
    } finally {
      setToggleLoading(null)
      setDispatchToToggle(null)
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600 text-lg">Loading dispatches...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow">
          
          {/* SUCCESS MESSAGE */}
          {journalSuccess && (
            <div className="mx-4 mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 rounded-r-lg flex items-center justify-between animate-slide-down">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {journalSuccess}
              </div>
              <button 
                onClick={() => setJournalSuccess(null)} 
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* ENHANCED HEADER */}
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Sales Voucher & Journal Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">Create vouchers, auto-create journals, and toggle post status</p>
            </div>
            <button
              onClick={loadDispatches}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* ENHANCED FILTER TABS */}
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex space-x-2 flex-wrap">
              {[
                { key: 'all', label: `All (${statusCounts.total})`, color: 'gray', icon: '📊' },
                { key: 'pending', label: `Pending (${statusCounts.pending})`, color: 'red', icon: '⏳' },
                { key: 'generated', label: `Generated (${statusCounts.generated})`, color: 'yellow', icon: '📄' },
                { key: 'posted', label: `Posted (${statusCounts.posted})`, color: 'green', icon: '✅' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center transform hover:scale-105 ${
                    filter === tab.key 
                      ? `bg-${tab.color}-600 text-white shadow-lg scale-105` 
                      : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ENHANCED TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Dispatch No</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Items</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Voucher Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Journal Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredDispatches().map((dispatch) => (
                  <tr key={dispatch.ID} className="hover:bg-blue-50 text-sm transition-colors duration-200">
                    <td className="px-4 py-3 font-bold text-blue-700">{dispatch.Number}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(dispatch.Date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {dispatch.account?.acName || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        dispatch.Status === 'Post' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-orange-100 text-orange-800 border border-orange-300'
                      }`}>
                        {dispatch.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {dispatch.details?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        dispatch.is_Voucher_Generated 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {dispatch.is_Voucher_Generated ? '✅ Generated' : '❌ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        dispatch.journalStatus === 'Post'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                          : dispatch.journalStatus === 'UnPost'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}>
                        {dispatch.journalStatus === 'Post' 
                          ? '✅ Posted' 
                          : dispatch.journalStatus === 'UnPost' 
                          ? '📄 UnPost' 
                          : '❌ No Journal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-1">
                        {!dispatch.is_Voucher_Generated ? (
                          // CREATE VOUCHER BUTTON
                          <button
                            onClick={() => handleCreateVoucher(dispatch)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create
                          </button>
                        ) : (
                          // VOUCHER GENERATED ACTIONS
                          <>
                            {/* EDIT VOUCHER */}
                            <button
                              onClick={() => handleEditVoucher(dispatch)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                              </svg>
                              Edit
                            </button>
                            
                            {/* COMMENTED OUT RESET BUTTON */}
                            {/*
                            <button
                              onClick={() => handleDeleteVoucherClick(dispatch)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Reset
                            </button>
                            */}
                            
                            {/* POST/UNPOST TOGGLE BUTTON */}
                            {(dispatch.journalStatus === 'UnPost' || dispatch.journalStatus === 'Post') && (
                              <button
                                onClick={() => handleToggleJournalClick(dispatch)}
                                disabled={toggleLoading === dispatch.ID}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm disabled:transform-none disabled:cursor-not-allowed ${
                                  dispatch.journalStatus === 'UnPost' 
                                    ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white'
                                    : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white'
                                }`}
                                title={dispatch.journalStatus === 'UnPost' ? 'Post to ledger' : 'Unpost from ledger'}
                              >
                                {toggleLoading === dispatch.ID ? (
                                  <>
                                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                    {dispatch.journalStatus === 'UnPost' ? 'Posting...' : 'Unposting...'}
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                        dispatch.journalStatus === 'UnPost' 
                                          ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                          : "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      } />
                                    </svg>
                                    {dispatch.journalStatus === 'UnPost' ? 'Post' : 'UnPost'}
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SALES VOUCHER MODAL */}
        {showVoucher && selectedDispatchId && (
          <SalesVoucher
            dispatchId={selectedDispatchId}
            mode={voucherMode}
            onClose={() => {
              setShowVoucher(false)
              setSelectedDispatchId(null)
            }}
            onSuccess={loadDispatches}
          />
        )}
      </div>
      {/* POST/UNPOST CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showJournalModal}
        onClose={() => {
          setShowJournalModal(false)
          setDispatchToToggle(null)
        }}
        onConfirm={handleConfirmToggleJournal}
        title={`${dispatchToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'} Journal`}
        message={`${dispatchToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'} journal for dispatch "${dispatchToToggle?.Number}"? This will update the journal status in both master and detail tables.`}
        confirmText={`Yes, ${dispatchToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'}`}
        cancelText="Cancel"
        type="info"
        loading={toggleLoading !== null}
      />
    </>
  )
}
