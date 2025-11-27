import { useState, useEffect, useCallback } from 'react'
import { Transaction } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

interface RawJournalRecord {
  id: number
  voucherNo: string
  date: string
  voucherTypeId?: number
  isOpening?: boolean
  'Journaldetail__amountDb': string | number
  'Journaldetail__amountCr': string | number
  'Journaldetail__ownDb': string | number
  'Journaldetail__ownCr': string | number
  'Journaldetail__rate': string | number
  'Zcoas - CoaId__acName': string
  'Journaldetail__description': string
  'Journaldetail__recieptNo': string
  'Zcurrencies - CurrencyId__currencyName': string
}

export const useAgedAccountsData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountNames, setAccountNames] = useState<string[]>([])

  // Convert raw journal data to Transaction format
  const mapJournalDataToTransactions = useCallback((rawData: RawJournalRecord[]): Transaction[] => {
    const transactionList: Transaction[] = []
    
    // Create a map to assign consistent account IDs
    const accountIdMap = new Map<string, number>()
    let nextAccountId = 1

    rawData.forEach((record) => {
      const accountName = record['Zcoas - CoaId__acName'] || 'Unknown Account'
      const debitAmount = parseFloat(String(record['Journaldetail__amountDb'])) || 0
      const creditAmount = parseFloat(String(record['Journaldetail__amountCr'])) || 0
      
      // Get or create account ID
      if (!accountIdMap.has(accountName)) {
        accountIdMap.set(accountName, nextAccountId++)
      }
      const accountId = accountIdMap.get(accountName)!

      // Create debit transaction if amount > 0
      if (debitAmount > 0) {
        transactionList.push({
          account_id: accountId,
          account_name: accountName,
          date: record.date,
          type: 'debit',
          amount: debitAmount,
          sequence: record.id // Use record ID for same-day ordering
        })
      }

      // Create credit transaction if amount > 0
      if (creditAmount > 0) {
        transactionList.push({
          account_id: accountId,
          account_name: accountName,
          date: record.date,
          type: 'credit',
          amount: creditAmount,
          sequence: record.id + 0.5 // Credits slightly after debits on same day
        })
      }
    })

    console.log(`📊 Mapped ${rawData.length} journal records to ${transactionList.length} transactions`)
    console.log(`🏢 Found ${accountIdMap.size} unique accounts`)
    
    return transactionList
  }, [])

  // Fetch real data from API
  const fetchRealData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📥 Fetching real journal data from API...')
      
      const response = await fetch('/api/journalmaster')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch data')
      }
      
      if (result.success && result.data) {
        console.log(`✅ Fetched ${result.data.length} journal records`)
        
        // Map to transaction format
        const mappedTransactions = mapJournalDataToTransactions(result.data)
        
        // Extract unique account names for filtering
        const uniqueAccounts = [...new Set(mappedTransactions.map(tx => tx.account_name))].sort()
        
        setTransactions(mappedTransactions)
        setAccountNames(uniqueAccounts)
        
        console.log('✅ Real data integration complete:', {
          transactions: mappedTransactions.length,
          accounts: uniqueAccounts.length,
          sampleAccounts: uniqueAccounts.slice(0, 5)
        })
      } else {
        throw new Error('Invalid API response format')
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch real data'
      console.error('❌ Real data fetch error:', errorMessage)
      setError(errorMessage)
      setTransactions([])
      setAccountNames([])
    } finally {
      setLoading(false)
    }
  }, [mapJournalDataToTransactions])

  return {
    transactions,
    loading,
    error,
    accountNames,
    fetchRealData
  }
}
