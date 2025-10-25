'use client'
import React, { useState } from 'react'
import {
    useGetCurrenciesQuery,
    useCreateCurrencyMutation,
    useUpdateCurrencyMutation,
    useDeleteCurrencyMutation
} from '@/store/slice/currencySlice'
import { Currency } from '@/types/currency'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { Modal } from '../ui/Modal'
import { ConfirmationModal } from '../common/ConfirmationModal'

export const CurrencyManager: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editModal, setEditModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })

    // Form state
    const [currencyName, setCurrencyName] = useState('')
    const [error, setError] = useState('')

    // RTK Query hooks
    const { data: currencies = [], isLoading, error: fetchError } = useGetCurrenciesQuery()
    const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation()
    const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation()
    const [deleteCurrency, { isLoading: isDeleting }] = useDeleteCurrencyMutation()

    // Form validation
    const validateForm = (name: string) => {
        if (!name.trim()) {
            setError('Currency name is required')
            return false
        }
        if (name.length > 10) {
            setError('Currency name must be 10 characters or less')
            return false
        }
        setError('')
        return true
    }

    const resetForm = () => {
        setCurrencyName('')
        setError('')
    }

    // Create currency
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm(currencyName)) return

        try {
            await createCurrency({ currencyName: currencyName.trim() }).unwrap()
            setShowCreateModal(false)
            resetForm()
        } catch (err: any) {
            setError(err?.data?.error || 'Failed to create currency')
        }
    }

    // Edit currency
    const handleEditClick = (currency: Currency) => {
        setCurrencyName(currency.currencyName)
        setEditModal({ isOpen: true, currency })
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editModal.currency || !validateForm(currencyName)) return

        try {
            await updateCurrency({
                id: editModal.currency.id,
                currencyName: currencyName.trim()
            }).unwrap()
            setEditModal({ isOpen: false })
            resetForm()
        } catch (err: any) {
            setError(err?.data?.error || 'Failed to update currency')
        }
    }

    // Delete currency
    const handleDeleteClick = (currency: Currency) => {
        setConfirmModal({ isOpen: true, currency })
    }

    const handleConfirmDelete = async () => {
        if (!confirmModal.currency) return

        try {
            await deleteCurrency(confirmModal.currency.id).unwrap()
            setConfirmModal({ isOpen: false })
        } catch (err) {
            console.error('Failed to delete currency:', err)
        }
    }

    if (isLoading) {
        return <Loading size="lg" text="Loading Currencies..." />
    }

    if (fetchError) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">Failed to load currencies. Please try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Currency Management
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your currencies ({currencies.length} total)
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        Add New Currency
                    </Button>
                </div>

                {/* Currencies Grid */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">
                            Currencies
                        </h2>
                    </div>

                    {currencies.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No currencies found. Create your first currency above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {currencies.map((currency) => (
                                <div key={currency.id} className="bg-gray-50 flex justify-between items-center px-6 p-1 border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 ">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                <span className="text-yellow-600 font-bold text-lg">
                                                    {currency.currencyName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {currency.currencyName}
                                                </h3>
                                                {/* <p className="text-sm text-gray-500">
                                                    ID: {currency.id}
                                                </p>
                                                {currency.createdAt && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Created: {new Date(currency.createdAt).toLocaleDateString()}
                                                    </p>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 mt-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEditClick(currency)}
                                            className="flex-1"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteClick(currency)}
                                            className="flex-1"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false)
                        resetForm()
                    }}
                    title="Add New Currency"
                >
                    <form onSubmit={handleCreate} className="space-y-4">
                        <Input
                            label="Currency Name"
                            value={currencyName}
                            onChange={(e) => setCurrencyName(e.target.value)}
                            placeholder="Enter currency name (e.g., USD, EUR, PKR)"
                            error={error}
                            maxLength={10}
                            helperText="Maximum 10 characters allowed"
                            autoFocus
                        />

                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="submit"
                                loading={isCreating}
                                disabled={!currencyName.trim()}
                                className="flex-1"
                            >
                                Create Currency
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setShowCreateModal(false)
                                    resetForm()
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    isOpen={editModal.isOpen}
                    onClose={() => {
                        setEditModal({ isOpen: false })
                        resetForm()
                    }}
                    title="Edit Currency"
                >
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <Input
                            label="Currency Name"
                            value={currencyName}
                            onChange={(e) => setCurrencyName(e.target.value)}
                            placeholder="Enter currency name"
                            error={error}
                            maxLength={10}
                            helperText="Maximum 10 characters allowed"
                            autoFocus
                        />

                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="submit"
                                loading={isUpdating}
                                disabled={!currencyName.trim()}
                                className="flex-1"
                            >
                                Update Currency
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setEditModal({ isOpen: false })
                                    resetForm()
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ isOpen: false })}
                    onConfirm={handleConfirmDelete}
                    title="Delete Currency"
                    message={`Are you sure you want to delete "${confirmModal.currency?.currencyName}"? This action cannot be undone.`}
                    confirmText="Delete Currency"
                    cancelText="Cancel"
                    type="danger"
                    loading={isDeleting}
                />
            </div>
        </div>
    )
}
