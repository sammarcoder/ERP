'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MachineSearchableInput } from '@/components/common/Machines/MachineSearchableInput'
import { EmployeeSearchableInput } from '@/components/common/Employees/EmployeeSearchableInput'
import { MouldSearchableInput } from '@/components/common/mould/MouldSearchableInput'
import {
  useCreateMouldingMutation,
  useUpdateMouldingMutation,
  MouldingRecord
} from '@/store/slice/mouldingApi'
import { useGetShiftsQuery } from '@/store/slice/shiftApi'
import {
  Calendar, Clock, Settings, Box, Zap, Wrench, Timer,
  ArrowLeft, Save, Package
} from 'lucide-react'

interface FormData {
  date: string;
  machineId: number | null;
  operatorId: number | null;
  shiftId: number | null;
  startTime: string;
  endTime: string;
  shutdownElectricity: string;
  shutdownMachine: string;
  shutdownNamaz: string;
  shutdownMould: string;
  shutdownOther: string;
  counterOne: string;
  counterTwo: string;
  mouldId: number | null;
  selectedOutputMaterialId: number | null;
  inputQty: string;
  outputQty: string;
  qualityCheckerId: number | null;
}

const initialForm: FormData = {
  date: new Date().toISOString().split('T')[0],
  machineId: null,
  operatorId: null,
  shiftId: null,
  startTime: '',
  endTime: '',
  shutdownElectricity: '0',
  shutdownMachine: '0',
  shutdownNamaz: '0',
  shutdownMould: '0',
  shutdownOther: '0',
  counterOne: '0',
  counterTwo: '0',
  mouldId: null,
  selectedOutputMaterialId: null,
  inputQty: '0',
  outputQty: '0',
  qualityCheckerId: null
}

interface MouldingFormProps {
  mode: 'create' | 'edit';
  initialData?: MouldingRecord;
  mouldingId?: number;
}

export function MouldingForm({ mode, initialData, mouldingId }: MouldingFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [selectedMould, setSelectedMould] = useState<any>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: shiftsData } = useGetShiftsQuery({ page: 1, limit: 100 })
  const [createMoulding, { isLoading: creating }] = useCreateMouldingMutation()
  const [updateMoulding, { isLoading: updating }] = useUpdateMouldingMutation()

  const shifts = shiftsData?.data || []
  const isLoading = creating || updating

  // Populate form with initial data in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        date: initialData.date,
        machineId: initialData.machineId,
        operatorId: initialData.operatorId,
        shiftId: initialData.shiftId,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        shutdownElectricity: initialData.shutdownElectricity?.toString() || '0',
        shutdownMachine: initialData.shutdownMachine?.toString() || '0',
        shutdownNamaz: initialData.shutdownNamaz?.toString() || '0',
        shutdownMould: initialData.shutdownMould?.toString() || '0',
        shutdownOther: initialData.shutdownOther?.toString() || '0',
        counterOne: initialData.counterOne?.toString() || '0',
        counterTwo: initialData.counterTwo?.toString() || '0',
        mouldId: initialData.mouldId,
        selectedOutputMaterialId: initialData.selectedOutputMaterialId,
        inputQty: initialData.inputQty?.toString() || '0',
        outputQty: initialData.outputQty?.toString() || '0',
        qualityCheckerId: initialData.qualityCheckerId
      })
      setSelectedMould(initialData.mould || null)
    }
  }, [mode, initialData])

  // Calculate final counter
  const finalCounter = useMemo(() => {
    const c1 = parseInt(formData.counterOne) || 0
    const c2 = parseInt(formData.counterTwo) || 0
    return c2 - c1
  }, [formData.counterOne, formData.counterTwo])

  // Auto-populate times when shift changes
  useEffect(() => {
    if (formData.shiftId && mode === 'create') {
      const shift = shifts.find((s: any) => s.id === formData.shiftId)
      if (shift) {
        setFormData(prev => ({
          ...prev,
          startTime: shift.startTime,
          endTime: shift.endTime
        }))
      }
    }
  }, [formData.shiftId, shifts, mode])

  // Handle mould selection
  const handleMouldChange = (mouldId: number | null, mould?: any) => {
    setFormData(prev => ({
      ...prev,
      mouldId,
      selectedOutputMaterialId: null
    }))
    setSelectedMould(mould || null)
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.date) errors.date = 'Date is required'
    if (!formData.machineId) errors.machineId = 'Machine is required'
    if (!formData.operatorId) errors.operatorId = 'Operator is required'
    if (!formData.shiftId) errors.shiftId = 'Shift is required'
    if (!formData.startTime) errors.startTime = 'Start time is required'
    if (!formData.endTime) errors.endTime = 'End time is required'
    if (!formData.mouldId) errors.mouldId = 'Mould is required'
    if (!formData.selectedOutputMaterialId) errors.selectedOutputMaterialId = 'Output material is required'
    if (!formData.qualityCheckerId) errors.qualityCheckerId = 'Quality checker is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) return

    const payload = {
      date: formData.date,
      machineId: formData.machineId!,
      operatorId: formData.operatorId!,
      shiftId: formData.shiftId!,
      startTime: formData.startTime,
      endTime: formData.endTime,
      shutdownElectricity: parseInt(formData.shutdownElectricity) || 0,
      shutdownMachine: parseInt(formData.shutdownMachine) || 0,
      shutdownNamaz: parseInt(formData.shutdownNamaz) || 0,
      shutdownMould: parseInt(formData.shutdownMould) || 0,
      shutdownOther: parseInt(formData.shutdownOther) || 0,
      counterOne: parseInt(formData.counterOne) || 0,
      counterTwo: parseInt(formData.counterTwo) || 0,
      mouldId: formData.mouldId!,
      selectedOutputMaterialId: formData.selectedOutputMaterialId!,
      inputQty: parseFloat(formData.inputQty) || 0,
      outputQty: parseFloat(formData.outputQty) || 0,
      qualityCheckerId: formData.qualityCheckerId!
    }

    try {
      if (mode === 'edit' && mouldingId) {
        await updateMoulding({ id: mouldingId, data: payload }).unwrap()
      } else {
        await createMoulding(payload).unwrap()
      }
      router.push('/moulding')
    } catch (err: any) {
      console.error('Failed to save moulding:', err)
      setSubmitError(err?.data?.error || 'Failed to save moulding record')
    }
  }

  const handleCancel = () => {
    router.push('/moulding')
  }

  return (
    <div className="min-h-screen bg-gray-50/50 mb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {mode === 'edit' ? 'Edit Moulding Record' : 'Create Moulding Record'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {mode === 'edit' ? 'Update production details' : 'Enter new production details'}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isLoading}
                icon={<Save className="w-4 h-4" />}
              >
                {mode === 'edit' ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Error Alert */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl bg-white shadow-sm">
          
          {/* Section 1: Basic Information */}
          <div className="  overflow-hidden">
            {/* <div className="bg-[#509ee3] px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
            </div> */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  error={formErrors.date}
                />
                <MachineSearchableInput
                  label="Machine"
                  value={formData.machineId}
                  onChange={(id) => setFormData({ ...formData, machineId: id })}
                  required
                  error={formErrors.machineId}
                />
                <EmployeeSearchableInput
                  label="Operator"
                  value={formData.operatorId}
                  onChange={(id) => setFormData({ ...formData, operatorId: id })}
                  required
                  error={formErrors.operatorId}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Shift <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.shiftId || ''}
                    onChange={(e) => setFormData({ ...formData, shiftId: parseInt(e.target.value) || null })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all ${
                      formErrors.shiftId ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <option value="">Select Shift</option>
                    {shifts.map((shift: any) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.name} ({shift.startTime} - {shift.endTime})
                      </option>
                    ))}
                  </select>
                  {formErrors.shiftId && <p className="text-sm text-red-500">{formErrors.shiftId}</p>}
                </div>
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  error={formErrors.startTime}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  error={formErrors.endTime}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shutdown Times */}
          <div className=" overflow-hidden">
            {/* <div className=" px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Timer className="w-5 h-5 mr-2" />
                Shutdown / Downtime (minutes)
              </h2>
            </div> */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-amber-500" />
                    Electricity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.shutdownElectricity}
                    onChange={(e) => setFormData({ ...formData, shutdownElectricity: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Wrench className="w-4 h-4 mr-1 text-amber-500" />
                    Machine
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.shutdownMachine}
                    onChange={(e) => setFormData({ ...formData, shutdownMachine: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Namaz
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.shutdownNamaz}
                    onChange={(e) => setFormData({ ...formData, shutdownNamaz: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Mould
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.shutdownMould}
                    onChange={(e) => setFormData({ ...formData, shutdownMould: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Other
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.shutdownOther}
                    onChange={(e) => setFormData({ ...formData, shutdownOther: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              {/* Total Shutdown Display */}
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-800">Total Shutdown Time:</span>
                  <span className="text-lg font-bold text-amber-700">
                    {(parseInt(formData.shutdownElectricity) || 0) +
                      (parseInt(formData.shutdownMachine) || 0) +
                      (parseInt(formData.shutdownNamaz) || 0) +
                      (parseInt(formData.shutdownMould) || 0) +
                      (parseInt(formData.shutdownOther) || 0)} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Counter Readings */}
          <div className=" overflow-hidden">
           
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Counter 1 (Start)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.counterOne}
                    onChange={(e) => setFormData({ ...formData, counterOne: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Counter 2 (End)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.counterTwo}
                    onChange={(e) => setFormData({ ...formData, counterTwo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Final Counter (Auto-calculated)
                  </label>
                  <div className={`px-4 py-2.5 rounded-xl font-bold text-lg ${
                    finalCounter >= 0 
                      ? 'bg-green-100 border border-green-300 text-green-800' 
                      : 'bg-red-100 border border-red-300 text-red-800'
                  }`}>
                    {finalCounter}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Mould & Production */}
          <div className="">
  
            <div className=" mb-6 px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <MouldSearchableInput
                  label="Mould"
                  value={formData.mouldId}
                  onChange={handleMouldChange}
                  required
                  error={formErrors.mouldId}
                />

                {/* Output Material Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Output Material <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.selectedOutputMaterialId || ''}
                    onChange={(e) => setFormData({ ...formData, selectedOutputMaterialId: parseInt(e.target.value) || null })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all ${
                      formErrors.selectedOutputMaterialId ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    } ${!selectedMould ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!selectedMould}
                  >
                    <option value="">
                      {selectedMould ? 'Select Output Material' : 'Select a mould first'}
                    </option>
                    {selectedMould?.outputMaterials?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.itemName}
                        {/* ({item.uom1?.uom || 'N/A'}) */}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedOutputMaterialId && (
                    <p className="text-sm text-red-500">{formErrors.selectedOutputMaterialId}</p>
                  )}
                </div>
              </div>

              {/* Auto-populated Mould Info */}
              {selectedMould && (
                <div className="mb-5 rounded-xl">
                  {/* <h4 className="text-sm font-semibold text-purple-800 mb-3">Mould Information (Read-only)</h4> */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <span className="text-xs text-gray-500 block">Effective Cavities</span>
                      <span className="text-lg font-bold text-purple-700">
                        {selectedMould.effectiveCavities} / {selectedMould.totalCavities}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <span className="text-xs text-gray-500 block">Cycle Time</span>
                      <span className="text-lg font-bold text-purple-700">
                        {selectedMould.cycleTime} seconds
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <span className="text-xs text-gray-500 block flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        Input Material
                      </span>
                      <span className="text-sm font-semibold text-amber-700">
                        {selectedMould.inputMaterial?.itemName || 'N/A'}
                        {/* {selectedMould.inputMaterial?.uom1?.uom && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({selectedMould.inputMaterial.uom1.uom})
                          </span>
                        )} */}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Input Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.inputQty}
                    onChange={(e) => setFormData({ ...formData, inputQty: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Output Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.outputQty}
                    onChange={(e) => setFormData({ ...formData, outputQty: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <EmployeeSearchableInput
                  label="Quality Checker"
                  value={formData.qualityCheckerId}
                  onChange={(id) => setFormData({ ...formData, qualityCheckerId: id })}
                  required
                  error={formErrors.qualityCheckerId}
                />
              </div>
            </div>
          </div>

          {/* Mobile Form Actions */}
          <div className="sm:hidden flex flex-col gap-3 pb-6">
            <Button
              type="submit"
              loading={isLoading}
              icon={<Save className="w-4 h-4" />}
              className="w-full"
            >
              {mode === 'edit' ? 'Update Record' : 'Create Record'}
            </Button>
            <Button variant="secondary" onClick={handleCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
