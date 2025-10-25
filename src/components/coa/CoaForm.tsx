'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import SelectableTable from '@/components/SelectableTable';
import {
  fetchCoaDropdowns,
  fetchCoaById,
  saveCoa,
  deleteCoa,
  updateField,
  updateFilteredCh2,
  setEditMode,
  resetForm,
  clearError,
  type CoaFormData,
} from '@/store/slice/coaSlice';
import { fetchTransporters } from '@/store/slice/transporterSlice';

function CoaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coaId = searchParams.get('id');
  const dispatch = useAppDispatch();

  const { formData, loading, error, dropdownData, isEditMode } = useAppSelector((state) => state.coa);
  const { transporters } = useAppSelector((state) => state.transporter);

  useEffect(() => {
    dispatch(fetchCoaDropdowns());
    dispatch(fetchTransporters());

    if (coaId) {
      dispatch(setEditMode(true));
      dispatch(fetchCoaById(coaId));
    } else {
      dispatch(resetForm());
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, coaId]);

  useEffect(() => {
    dispatch(updateFilteredCh2());
  }, [formData.ch1Id, dispatch]);

  const handleFieldChange = (field: keyof CoaFormData, value: any) => {
    dispatch(updateField({ field, value }));
  };

  const handleSelectableTableChange = (name: string, value: number | null) => {
    handleFieldChange(name as keyof CoaFormData, value);
  };

  // Format mobile number as user types
  const handleMobileChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as: 0000-0000000
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
    }

    handleFieldChange('mobileNo', formatted);
  };

  const calculateTotalExpenses = () => {
    return formData.freight_crt + formData.labour_crt + formData.bility_expense + formData.other_expense;
  };

  // Check if COA Type allows editing remaining fields
  const canEditRemainingFields = () => {
    return [1, 6, 7].includes(formData.coaTypeId);
  };

  // Check if should show foreign currency field
  const shouldShowForeignCurrency = () => {
    return formData.coaTypeId === 7;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.acName.trim()) {
      toast.error('Account Name is required');
      return;
    }

    if (!formData.ch1Id) {
      toast.error('Please select Control Head 1');
      return;
    }

    if (!formData.ch2Id) {
      toast.error('Please select Control Head 2');
      return;
    }

    if (!formData.coaTypeId) {
      toast.error('Please select COA Type');
      return;
    }

    try {
      await dispatch(saveCoa({
        data: formData,
        isEdit: isEditMode
      })).unwrap();

      toast.success(`COA ${isEditMode ? 'updated' : 'created'} successfully!`);

      if (isEditMode) {
        setTimeout(() => router.push('/coa'), 1500);
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !coaId) return;

    if (window.confirm('Are you sure you want to delete this COA?')) {
      try {
        await dispatch(deleteCoa(coaId)).unwrap();
        toast.success('COA deleted successfully!');
        setTimeout(() => router.push('/coa'), 1500);
      } catch (error) {
        toast.error(error as string);
      }
    }
  };

  if (loading.form || loading.dropdowns) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading COA data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Chart of Account' : 'Create Chart of Account'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode ? 'Update account information' : 'Create a new chart of account'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push('/coa/list')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                View All COA
              </button>
              {isEditMode && (
                <button
                  onClick={handleDelete}
                  disabled={loading.submit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => dispatch(clearError())} className="text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">

          {/* ROW 1: Control Head 1, Control Head 2, COA Type, Account Name, JV Balance */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Primary Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Control Head 1 *</label>
                <select
                  value={formData.ch1Id || ''}
                  onChange={(e) => handleFieldChange('ch1Id', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading.submit}
                >
                  <option value="">Select Control Head 1</option>
                  {dropdownData.controlHead1.map(ch1 => (
                    <option key={ch1.id} value={ch1.id}>{ch1.zHead1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Control Head 2 *</label>
                <select
                  value={formData.ch2Id || ''}
                  onChange={(e) => handleFieldChange('ch2Id', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.ch1Id || loading.submit}
                >
                  <option value="">{!formData.ch1Id ? 'Select Control Head 1 first' : 'Select Control Head 2'}</option>
                  {dropdownData.filteredControlHead2.map(ch2 => (
                    <option key={ch2.id} value={ch2.id}>{ch2.zHead2}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">COA Type *</label>
                <select
                  value={formData.coaTypeId || ''}
                  onChange={(e) => handleFieldChange('coaTypeId', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading.submit}
                >
                  <option value="">Select COA Type</option>
                  {dropdownData.coaTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.zType}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                <input
                  type="text"
                  value={formData.acName}
                  onChange={(e) => handleFieldChange('acName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Account name"
                  required
                  disabled={loading.submit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">JV Balance</label>
                <div className="flex space-x-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isJvBalance"
                      checked={formData.isJvBalance === true}
                      onChange={() => handleFieldChange('isJvBalance', true)}
                      className="mr-1"
                      disabled={loading.submit}
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isJvBalance"
                      checked={formData.isJvBalance === false}
                      onChange={() => handleFieldChange('isJvBalance', false)}
                      className="mr-1"
                      disabled={loading.submit}
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Petty Balance</label>
                <div className="flex space-x-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPettyCash"
                      checked={formData.isPettyCash === true}
                      onChange={() => handleFieldChange('isPettyCash', true)}
                      className="mr-1"
                      disabled={loading.submit}
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPettyCash"
                      checked={formData.isPettyCash === false}
                      onChange={() => handleFieldChange('isPettyCash', false)}
                      className="mr-1"
                      disabled={loading.submit}
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* CONDITIONAL: Show remaining fields only if coaType = 1, 6, or 7 */}
          {canEditRemainingFields() && (
            <>
              {/* ROW 2: Setup Name, Address, City, Person Name */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Contact Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Setup Name</label>
                    <input
                      type="text"
                      value={formData.setupName}
                      onChange={(e) => handleFieldChange('setupName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Setup name"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Complete address"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="City name"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
                    <input
                      type="text"
                      value={formData.personName}
                      onChange={(e) => handleFieldChange('personName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contact person"
                      disabled={loading.submit}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub City</label>
                    <input
                      type="text"
                      value={formData.sub_city}
                      onChange={(e) => handleFieldChange('sub_city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sub city"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                    <input
                      type="text"
                      value={formData.mobileNo}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0300-1234567"
                      maxLength={12}
                      disabled={loading.submit}
                    />
                  </div>
                </div>
              </div>

              {/* ROW 3: Sub Customer, Sub City, Mobile, Sales Limit, Credit, Credit Days, Sales Man */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Customer & Financial Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Customer</label>
                    <div className="flex space-x-3 mt-2">
                       {/* <label className="block text-sm font-medium text-gray-700 mb-2">Sub City</label> */}
                    <input
                      type="text"
                      value={formData.sub_customer}
                      onChange={(e) => handleFieldChange('sub_customer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sub customer"
                      disabled={loading.submit}
                    />
                      {/* <label className="flex items-center">
                        <input
                          type="radio"
                          name="sub_customer"
                          checked={formData.sub_customer === true}
                          onChange={() => handleFieldChange('sub_customer', true)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sub_customer"
                          checked={formData.sub_customer === false}
                          onChange={() => handleFieldChange('sub_customer', false)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-sm">No</span> */}
                      {/* </label> */}
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub City</label>
                    <input
                      type="text"
                      value={formData.sub_city}
                      onChange={(e) => handleFieldChange('sub_city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sub city"
                      disabled={loading.submit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile (0000-0000000)</label>
                    <input
                      type="text"
                      value={formData.mobileNo}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0300-1234567"
                      maxLength={12}
                      disabled={loading.submit}
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Limit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salesLimit}
                      onChange={(e) => handleFieldChange('salesLimit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sales limit"
                      disabled={loading.submit}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.credit}
                      onChange={(e) => handleFieldChange('credit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Credit limit"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Days</label>
                    <input
                      type="number"
                      value={formData.creditDays}
                      onChange={(e) => handleFieldChange('creditDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Days"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Man</label>
                    <select
                      value={formData.salesMan}
                      onChange={(e) => handleFieldChange('salesMan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading.submit}
                    >
                      <option value="">Select Sales Man</option>
                      {dropdownData.salesmen.map(man => (
                        <option key={man.id} value={man.id}>{man.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.credit}
                      onChange={(e) => handleFieldChange('credit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Credit limit"
                      disabled={loading.submit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Days</label>
                    <input
                      type="number"
                      value={formData.creditDays}
                      onChange={(e) => handleFieldChange('creditDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Days"
                      disabled={loading.submit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Man</label>
                    <select
                      value={formData.salesMan}
                      onChange={(e) => handleFieldChange('salesMan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading.submit}
                    >
                      <option value="">Select Sales Man</option>
                      {dropdownData.salesmen.map(man => (
                        <option key={man.id} value={man.id}>{man.name}</option>
                      ))}
                    </select>
                  </div> */}
                </div>
              </div>

              {/* ROW 4: Discount A, B, C, Tax Status, NTN, CNIC */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Discounts & Tax Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount A (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discountA}
                      onChange={(e) => handleFieldChange('discountA', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount B (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discountB}
                      onChange={(e) => handleFieldChange('discountB', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount C (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discountC}
                      onChange={(e) => handleFieldChange('discountC', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Status</label>
                    <div className="flex space-x-2 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="taxStatus"
                          checked={formData.taxStatus === true}
                          onChange={() => handleFieldChange('taxStatus', true)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-xs">Registered</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="taxStatus"
                          checked={formData.taxStatus === false}
                          onChange={() => handleFieldChange('taxStatus', false)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-xs">Unregistered</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NTN</label>
                    <input
                      type="text"
                      value={formData.ntn}
                      onChange={(e) => handleFieldChange('ntn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="NTN number"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNIC</label>
                    <input
                      type="text"
                      value={formData.cnic}
                      onChange={(e) => handleFieldChange('cnic', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="CNIC"
                      disabled={loading.submit}
                    />
                  </div>
                </div>
              </div>

              {/* ROW 5: Transporter + Expense Management + Foreign Currency (if coaType = 7) */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200 flex-1">
                    Transporter & Expense Management
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold ml-4">
                    Total: ₨{calculateTotalExpenses().toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                  {/* Transporter Selection */}
                  <div>
                    <SelectableTable
                      label="Transporter"
                      name="Transporter_ID"
                      value={formData.Transporter_ID}
                      onChange={handleSelectableTableChange}
                      options={transporters.map(t => ({
                        id: t.id,
                        label: t.name,
                        contactPerson: t.contactPerson || '-',
                        phone: t.phone || '-',
                      }))}
                      placeholder="Select Transporter"
                      disabled={loading.submit}
                      displayKey="label"
                      valueKey="id"
                      columns={[
                        { key: 'label', label: 'Name', width: '50%' },
                        { key: 'contactPerson', label: 'Contact', width: '25%' },
                        { key: 'phone', label: 'Phone', width: '25%' }
                      ]}
                      pageSize={8}
                    />
                  </div>

                  {/* Freight Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Freight Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.freight_crt}
                        onChange={(e) => handleFieldChange('freight_crt', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  {/* Labour Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Labour Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.labour_crt}
                        onChange={(e) => handleFieldChange('labour_crt', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  {/* Utility Expense */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Utility Expense</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.bility_expense}
                        onChange={(e) => handleFieldChange('bility_expense', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  {/* Other Expense */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Expense</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.other_expense}
                        onChange={(e) => handleFieldChange('other_expense', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">str</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.str}
                        onChange={(e) => handleFieldChange('str', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>
                  {/* Batch Number */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch No</label>
                    <input
                      type="text"
                      value={formData.batch_no}
                      onChange={(e) => handleFieldChange('batch_no', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Batch number"
                      disabled={loading.submit}
                    />
                  </div> */}
                  {shouldShowForeignCurrency() && (
                    <div className="grid grid-cols-1 md:grid-cols-1  rounded-lg">
                      <label className="block text-sm font-medium text-yellow-800 ">
                        Foreign Currency
                      </label>
                      <div>

                        <input
                          type="text"
                          value={formData.foreign_currency || ''}
                          onChange={(e) => handleFieldChange('foreign_currency', e.target.value)}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
                          placeholder="Enter foreign currency"
                          disabled={loading.submit}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CONDITIONAL: Foreign Currency field when coaType = 7 */}
                {/* {shouldShowForeignCurrency() && (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-yellow-800 mb-2">
                        🌍 Foreign Currency (COA Type 7)
                      </label>
                      <input
                        type="text"
                        value={formData.foreign_currency || ''}
                        onChange={(e) => handleFieldChange('foreign_currency', e.target.value)}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
                        placeholder="Enter foreign currency (e.g., USD, EUR, GBP)"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>
                )} */}
              </div>
            </>
          )}

          {/* Message when COA Type doesn't allow editing */}
          {/* {!canEditRemainingFields() && formData.coaTypeId > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                ℹ️ Additional fields are only available for COA Types 1, 6, and 7.
                Please select one of these types to configure detailed information.
              </p>
            </div>
          )} */}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading.submit}
              className="w-40 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading.submit ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditMode ? 'Update COA' : 'Create COA'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CoaForm;  // ← DEFAULT EXPORT
