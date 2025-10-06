'use client'
import { useState, useEffect } from 'react'
import { DispatchRecord, GrnRecord } from '@/lib/types'

export function useDispatches() {
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDispatches = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/dispatch?stockTypeId=12')
      const result = await response.json()
      
      if (result.success) {
        const formattedDispatches = result.data.map((dispatch: any) => ({
          id: dispatch.ID,
          label: dispatch.Number,
          number: dispatch.Number,
          date: new Date(dispatch.Date).toLocaleDateString(),
          customer: dispatch.account?.acName || 'N/A',
          status: dispatch.Status,
          total_items: dispatch.details?.length || 0
        }))
        setDispatches(formattedDispatches)
      } else {
        setError('Failed to load dispatches')
      }
    } catch (err) {
      setError('Error loading dispatches')
      console.error('Error loading dispatches:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDispatches()
  }, [])

  return { dispatches, loading, error, refetch: loadDispatches }
}

export function useGrns() {
  const [grns, setGrns] = useState<GrnRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadGrns = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/grn?stockTypeId=11')
      const result = await response.json()
      
      if (result.success) {
        const formattedGrns = result.data.map((grn: any) => ({
          id: grn.ID,
          label: grn.Number,
          number: grn.Number,
          date: new Date(grn.Date).toLocaleDateString(),
          supplier: grn.account?.acName || 'N/A',
          status: grn.Status,
          total_items: grn.details?.length || 0
        }))
        setGrns(formattedGrns)
      } else {
        setError('Failed to load GRNs')
      }
    } catch (err) {
      setError('Error loading GRNs')
      console.error('Error loading GRNs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGrns()
  }, [])

  return { grns, loading, error, refetch: loadGrns }
}
