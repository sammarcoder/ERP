// components/zlcv/ZlcvForm.tsx

'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    useCreateZlcvMutation,
    useUpdateZlcvMutation,
    useGetZlcvByIdQuery
} from '@/store/slice/zlcvSlice'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { Save, X, RefreshCw, AlertCircle } from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface ZlcvFormProps {
    mode: 'create' | 'edit'
    id?: number
}

// =============================================
// COMPONENT
// =============================================

const ZlcvForm: React.FC<ZlcvFormProps> = ({ mode, id }) => {
    const router = useRouter()

    // =============================================
    // STATE
    // =============================================

    const [formData, setFormData] = useState({
        isDb: true,
        coaId: null as number | null,
        description: '',
        order: '' as string | number,  // ✅ Changed - empty by default
        isCost: true,
        status: true
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [apiError, setApiError] = useState<string | null>(null)
    const [confirmModal, setConfirmModal] = useState(false)

    // =============================================
    // RTK QUERY
    // =============================================

    const { data: zlcvData, isLoading: isLoadingData } = useGetZlcvByIdQuery(id!, {
        skip: mode !== 'edit' || !id
    })

    const [createZlcv, { isLoading: isCreating }] = useCreateZlcvMutation()
    const [updateZlcv, { isLoading: isUpdating }] = useUpdateZlcvMutation()

    // =============================================
    // LOAD EDIT DATA
    // =============================================

    useEffect(() => {
        if (mode === 'edit' && zlcvData?.data) {
            const data = zlcvData.data
            setFormData({
                isDb: data.isDb,
                coaId: data.coaId,
                description: data.description || '',
                order: data.order ?? '',  // ✅ Changed
                isCost: data.isCost,
                status: data.status
            })
        }
    }, [mode, zlcvData])

    // =============================================
    // HANDLERS
    // =============================================

    const handleTypeChange = useCallback((isDebit: boolean) => {
        setFormData(prev => ({
            ...prev,
            isDb: isDebit,
            coaId: isDebit ? null : prev.coaId,
            isCost: isDebit ? true : false
        }))
        setErrors({})
    }, [])

    const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
        setFormData(prev => ({
            ...prev,
            coaId: selectedId ? Number(selectedId) : null
        }))
        if (errors.coaId) {
            setErrors(prev => ({ ...prev, coaId: '' }))
        }
    }, [errors.coaId])

    const handleInputChange = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }, [errors])

    // =============================================
    // VALIDATION
    // =============================================

    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }

        if (!formData.isDb && !formData.coaId) {
            newErrors.coaId = 'Account is required for Credit entries'
        }

        if (formData.order === '' || formData.order === null || formData.order === undefined) {
            newErrors.order = 'Order is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData])

    // =============================================
    // SUBMIT
    // =============================================

    const handleSaveClick = useCallback(() => {
        if (!validateForm()) return
        setConfirmModal(true)
    }, [validateForm])

    const handleConfirmSave = useCallback(async () => {
        setConfirmModal(false)
        setApiError(null)

        const payload = {
            isDb: formData.isDb,
            coaId: formData.isDb ? null : formData.coaId,
            description: formData.description.trim(),
            order: Number(formData.order) || 0,  // ✅ Changed
            isCost: formData.isDb ? formData.isCost : false,
            status: formData.status
        }

        try {
            if (mode === 'create') {
                await createZlcv(payload).unwrap()
            } else {
                await updateZlcv({ id: id!, ...payload }).unwrap()
            }
            router.push('/vouchers/lcv')
        } catch (error: any) {
            console.error('Save error:', error)
            setApiError(error?.data?.message || 'Failed to save record')
        }
    }, [formData, mode, id, createZlcv, updateZlcv, router])

    const handleCancel = useCallback(() => {
        router.push('/vouchers/lcv')
    }, [router])

    // =============================================
    // LOADING
    // =============================================

    if (mode === 'edit' && isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3]" />
            </div>
        )
    }

    // =============================================
    // RENDER
    // =============================================

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {mode === 'create' ? 'Create ZLCV' : 'Edit ZLCV'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {mode === 'create' ? 'Add a new ZLCV record' : 'Update ZLCV record'}
                </p>
            </div>

            {/* API Error */}
            {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{apiError}</p>
                </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Step 1: Debit/Credit Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${formData.isDb
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="type"
                                checked={formData.isDb}
                                onChange={() => handleTypeChange(true)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500"
                            />
                            <span className="font-medium">Debit</span>
                        </label>

                        <label className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${!formData.isDb
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="type"
                                checked={!formData.isDb}
                                onChange={() => handleTypeChange(false)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                            />
                            <span className="font-medium">Credit</span>
                        </label>
                    </div>
                </div>

                {/* COA - Only for Credit */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account (COA) {!formData.isDb && <span className="text-red-500">*</span>}
                    </label>
                    <CoaSearchableInput
                        value={formData.coaId || ''}
                        onChange={handleCoaChange}
                        placeholder={formData.isDb ? 'Not required for Debit' : 'Select account...'}
                        disabled={formData.isDb}
                        error={errors.coaId}
                        clearable
                    />
                    {formData.isDb && (
                        <p className="mt-1 text-sm text-gray-500">COA is not required for Debit entries</p>
                    )}
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter description..."
                        error={errors.description}
                    />
                </div>

                {/* Order */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="number"
                        value={formData.order}  // ✅ Changed
                        onChange={(e) => handleInputChange('order', e.target.value)}  // ✅ Changed
                        placeholder="Enter order number..."
                        error={errors.order}  // ✅ Changed
                    />
                </div>

                {/* Is Cost - Only editable for Debit */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Is Costing</label>
                            <p className="text-sm text-gray-500">
                                {formData.isDb
                                    ? 'Editable for Debit entries'
                                    : 'Always false for Credit entries'
                                }
                            </p>
                        </div>
                        <label className={`relative inline-flex items-center ${formData.isDb ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}>
                            <input
                                type="checkbox"
                                checked={formData.isCost}
                                onChange={(e) => handleInputChange('isCost', e.target.checked)}
                                disabled={!formData.isDb}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <p className="text-sm text-gray-500">Active or Inactive</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        icon={<X className="w-4 h-4" />}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveClick}
                        disabled={isCreating || isUpdating}
                        icon={isCreating || isUpdating
                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                            : <Save className="w-4 h-4" />
                        }
                    >
                        {isCreating || isUpdating ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                    </Button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleConfirmSave}
                title={mode === 'create' ? 'Create Record' : 'Update Record'}
                message={
                    mode === 'create'
                        ? 'Are you sure you want to create this ZLCV record?'
                        : 'Are you sure you want to update this ZLCV record?'
                }
                confirmText={mode === 'create' ? 'Create' : 'Update'}
                confirmVariant="primary"
                isLoading={isCreating || isUpdating}
            />
        </div>
    )
}

export default ZlcvForm
