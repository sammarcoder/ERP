'use client';

import { useState, useEffect, ChangeEvent } from 'react';

// Date formatting function - same as your vanilla JS but for React
const formatToCustomDate = (date: Date | string) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate().toString().padStart(2, '0');
  const monthIndex = d.getMonth();
  const year = d.getFullYear();
  
  return `${day}/${monthNames[monthIndex]}/${year}`;
};

// Define interfaces
interface Transaction {
  id: number;
  accountId: number;
  accountName: string;
  particulars: string;
  idCard: string;
  bk: string;
  bankDate: string; // Stored as YYYY-MM-DD internally
  chkRct: string;
  cr: string;
  eRate: string;
  own: string;
  debit: string;
  credit: string;
  selected?: boolean;
}

interface SheetData {
  sheetNumber: string;
  sheetDate: string; // Stored as YYYY-MM-DD internally, displayed as dd/Agu/yyyy
  status: 'Un Posted' | 'Posted';
  isOpeningVoucher: boolean;
}

interface VoucherType {
  id: number;
  vType: string;
}

export default function SheetTransactionVoucher() {
  // Form state with properly formatted date
  const [sheetData, setSheetData] = useState<SheetData>({
    sheetNumber: '1',
    sheetDate: new Date().toISOString().split('T')[0], // Store as YYYY-MM-DD
    status: 'Un Posted',
    isOpeningVoucher: false,
  });

  // API data state
  const [accounts, setAccounts] = useState<any[]>([]);
  const [voucherTypes, setVoucherTypes] = useState<VoucherType[]>([]);
  const [selectedVoucherTypeId, setSelectedVoucherTypeId] = useState<number>(0);

  // Transaction rows state - ZERO rows by default
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // UI state
  const [loading, setLoading] = useState({
    accounts: false,
    voucherTypes: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchAccounts();
    fetchVoucherTypes();
  }, []);

  // Fetch voucher types
  const fetchVoucherTypes = async () => {
    try {
      setLoading(prev => ({ ...prev, voucherTypes: true }));

      let response = await fetch(`http://${window.location.hostname}:5000/api/z-control/voucher-type/`);
      console.log(response);

      if (!response.ok) {
        console.log('First voucher type endpoint failed, trying alternative...');
        response = await fetch(`http://${window.location.hostname}:5000/api/z-control/voucher-type/`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch voucher types: ${response.status}`);
      }

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parsing voucher types:', e);
        throw new Error('Invalid JSON response from API');
      }

      let vTypes = [];
      if (Array.isArray(data)) {
        vTypes = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        vTypes = data.data;
      } else {
        console.warn('Unexpected voucher type response format:', data);
        vTypes = [];
      }

      console.log('Loaded voucher types:', vTypes);
      setVoucherTypes(vTypes);

      if (vTypes.length > 0) {
        setSelectedVoucherTypeId(vTypes[0].id);
      }

    } catch (error) {
      console.error('Error fetching voucher types:', error);
      setError('Failed to load voucher types');
    } finally {
      setLoading(prev => ({ ...prev, voucherTypes: false }));
    }
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      setLoading(prev => ({ ...prev, accounts: true }));
      const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/get`);

      if (!response.ok) {
        throw new Error(`Failed to fetch accounts: ${response.status}`);
      }

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parsing accounts:', e);
        throw new Error('Invalid JSON response from API');
      }

      setAccounts(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to load accounts');
    } finally {
      setLoading(prev => ({ ...prev, accounts: false }));
    }
  };

  // Add new row handler
  const addNewRow = () => {
    const newId = transactions.length + 1;
    const newRow: Transaction = {
      id: newId,
      accountId: 0,
      accountName: 'ADV:2%',
      particulars: '',
      idCard: '',
      bk: '',
      bankDate: '', // Initialize empty
      chkRct: '',
      cr: 'Sel...',
      eRate: '',
      own: '',
      debit: '',
      credit: '',
      selected: false
    };
    setTransactions([...transactions, newRow]);
  };

  // Remove row handler
  const removeRow = (id: number) => {
    setTransactions(transactions.filter(row => row.id !== id));
  };

  // Update row field handler
  const updateRowField = (id: number, field: keyof Transaction, value: string) => {
    setTransactions(
      transactions.map(row => {
        if (row.id === id) {
          if (field === 'debit' || field === 'credit') {
            const updatedRow = { ...row, [field]: value };

            if (value && field === 'debit') {
              updatedRow.credit = '';
              // updatedRow.own = value;
            } else if (value && field === 'credit') {
              updatedRow.debit = '';
              // updatedRow.own = value;
            } else {
              updatedRow.own = '';
            }

            return updatedRow;
          }
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  // Handle account selection
  const handleAccountSelect = (id: number, accountId: number) => {
    const selectedAccount = accounts.find(acc => acc.id === accountId);

    setTransactions(
      transactions.map(row =>
        row.id === id ? {
          ...row,
          accountId,
          accountName: selectedAccount?.acName || ''
        } : row
      )
    );
  };

  // Update bank date for specific transaction
  const updateBankDate = (id: number, dateValue: string) => {
    setTransactions(
      transactions.map(row =>
        row.id === id ? { ...row, bankDate: dateValue } : row
      )
    );
  };

  // Calculate totals
  const totals = transactions.reduce(
    (acc, transaction) => {
      const debit = parseFloat(transaction.debit) || 0;
      const credit = parseFloat(transaction.credit) || 0;
      return {
        debit: acc.debit + debit,
        credit: acc.credit + credit
      };
    },
    { debit: 0, credit: 0 }
  );

  // Handle form field changes
  const handleFormChange = <K extends keyof SheetData>(field: K, value: SheetData[K]) => {
    setSheetData({
      ...sheetData,
      [field]: value
    });
  };

  // Validate transactions before saving
  const validateTransactions = () => {
    const invalidTransaction = transactions.find(t => !t.accountId || t.accountId === 0);

    if (invalidTransaction) {
      setError("Please select a valid account for all transaction rows");
      return false;
    }

    if (transactions.length === 0) {
      setError("Please add at least one transaction row");
      return false;
    }

    const emptyAmountTransaction = transactions.find(
      t => (!t.debit || parseFloat(t.debit) === 0) &&
        (!t.credit || parseFloat(t.credit) === 0)
    );

    if (emptyAmountTransaction) {
      setError("All transactions must have either a debit or credit amount");
      return false;
    }

    return true;
  };

  // Validate date format
  const validateDateFormat = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      setError("Invalid date format. Please use YYYY-MM-DD format.");
      return false;
    }
    return true;
  };

  // Save handler
  const handleSave = async () => {
    setError(null);
    setSaving(true);

    if (!validateDateFormat(sheetData.sheetDate)) {
      setSaving(false);
      return;
    }

    if (!selectedVoucherTypeId) {
      setError("Please select a voucher type");
      setSaving(false);
      return;
    }

    if (!validateTransactions()) {
      setSaving(false);
      return;
    }

    try {
      const formattedDate = new Date(sheetData.sheetDate).toISOString().split('T')[0];

      const journalData = {
        master: {
          date: formattedDate,
          voucherNo: sheetData.sheetNumber,
          voucherTypeId: selectedVoucherTypeId,
          status: sheetData.status === 'Posted'
        },
        details: transactions.map((transaction, index) => {
          const debitAmount = parseFloat(transaction.debit) || 0;
          const creditAmount = parseFloat(transaction.credit) || 0;
          const exchangeRate = parseFloat(transaction.eRate) || 1;

          return {
            lineId: index + 1,
            coaId: transaction.accountId,
            description: transaction.particulars || '',
            chqNo: transaction.bk || '',
            recieptNo: transaction.chkRct || '',
            ownDb: debitAmount,
            ownCr: creditAmount,
            rate: exchangeRate,
            amountDb: debitAmount,
            amountCr: creditAmount,
            isCost: false,
            currencyId: 1,
            status: true
          };
        })
      };

      console.log("Sending journal data:", journalData);

      const response = await fetch(`http://${window.location.hostname}:5000/api/journal-master/create-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(journalData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Server error: ${response.status}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      alert('Journal entry saved successfully!');

      setTransactions([]);
      setSheetData({
        sheetNumber: String(parseInt(sheetData.sheetNumber) + 1),
        sheetDate: new Date().toISOString().split('T')[0],
        status: 'Un Posted',
        isOpeningVoucher: false
      });

    } catch (error: any) {
      console.error('Error saving journal:', error);
      setError(error.message || 'Failed to save journal entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-2 flex justify-end items-center border-b">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Hello, <span className="font-medium">Super Admin</span></span>
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="bg-white rounded shadow p-4">
          {/* Sheet Title */}
          <div className="flex items-center mb-6 border-b pb-4">
            <svg className="w-6 h-6 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-lg font-medium text-gray-700">Sheet Transaction Voucher</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Sheet Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sheet #</label>
              <input
                type="text"
                value={sheetData.sheetNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFormChange('sheetNumber', e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sheet Date - UPDATED WITH CUSTOM FORMAT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sheet Date <span className="text-sm text-gray-500">(dd/Agu/yyyy)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={sheetData.sheetDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange('sheetDate', e.target.value)
                  }
                  className="sr-only"
                  id="dateInput"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('dateInput') as HTMLInputElement;
                    input?.showPicker?.() || input?.click();
                  }}
                  className="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <span>{formatToCustomDate(sheetData.sheetDate)}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Status and Voucher Type */}
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-2">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={sheetData.status}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleFormChange('status', e.target.value as 'Un Posted' | 'Posted')
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Un Posted</option>
                    <option>Posted</option>
                  </select>
                </div>

                {/* Voucher Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Voucher Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedVoucherTypeId || ''}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedVoucherTypeId(parseInt(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {voucherTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.vType}
                      </option>
                    ))}
                  </select>
                  {loading.voucherTypes && <p className="text-xs text-gray-500">Loading...</p>}
                </div>
              </div>

              {/* Opening Voucher Checkbox */}
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  checked={sheetData.isOpeningVoucher}
                  onChange={() =>
                    handleFormChange('isOpeningVoucher', !sheetData.isOpeningVoucher)
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Opening Voucher</label>
              </div>
            </div>
          </div>

          {/* Add Row Button */}
          <div className="mb-4">
            <button
              onClick={addNewRow}
              className="flex items-center bg-emerald-500 text-white px-3 py-2 rounded hover:bg-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Row
            </button>
          </div>

          {/* B/F Section */}
          <div className="bg-red-600 text-white p-2 text-right mb-4">
            <span className="font-medium">B/F</span>
            <span className="ml-4">00.00</span>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-10 border p-2"></th>
                  <th className="w-10 border p-2"></th>
                  <th className="border p-2 text-sm font-medium text-gray-700">Account <span className="text-red-500">*</span></th>
                  <th className="border p-2 text-sm font-medium text-gray-700">Particulars</th>
                  <th className="border p-2 text-sm font-medium text-gray-700">Id Card</th>
                  <th className="w-14 border p-2 text-sm font-medium text-gray-700">Bk</th>
                  <th className="border p-2 text-sm font-medium text-gray-700">Bank Date</th>
                  <th className="border p-2 text-sm font-medium text-gray-700">Chk/Rct #</th>
                  <th className="w-16 border p-2 text-sm font-medium text-gray-700">Cr.</th>
                  <th className="border p-2 text-sm font-medium text-gray-700">E. Rate</th>
                  <th className="border p-2 text-sm font-medium text-gray-700">Own</th>
                  <th className="border p-2 text-sm font-medium text-gray-700 text-red-500">Debit <span className="text-red-500">*</span></th>
                  <th className="border p-2 text-sm font-medium text-gray-700 text-green-500">Credit <span className="text-red-500">*</span></th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="border p-4 text-center text-gray-500">
                      No transactions added. Click "Add New Row" to add transactions.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className={!transaction.accountId ? "bg-red-50" : ""}>
                      <td className="border p-2 text-center">
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded bg-red-500 text-white"
                          onClick={() => removeRow(transaction.id)}
                          type="button"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </td>
                      <td className="border p-2">
                        <input
                          type="checkbox"
                          checked={transaction.selected || false}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateRowField(transaction.id, 'selected', e.target.checked ? 'true' : 'false')
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="border p-2">
                        <select
                          className={`w-full p-1 border ${!transaction.accountId ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded`}
                          value={transaction.accountId || ''}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            handleAccountSelect(transaction.id, parseInt(e.target.value))
                          }
                        >
                          <option value="">Select Account</option>
                          {Array.isArray(accounts) && accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.acName}
                            </option>
                          ))}
                        </select>
                        {!transaction.accountId && (
                          <p className="text-red-500 text-xs mt-1">Required</p>
                        )}
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.particulars}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateRowField(transaction.id, 'particulars', e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.idCard}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateRowField(transaction.id, 'idCard', e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.bk}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateRowField(transaction.id, 'bk', e.target.value)
                          }
                        />
                      </td>
                      
                      {/* Bank Date Cell - UPDATED WITH CUSTOM FORMAT */}
                      <td className="border p-2">
                        <div className="relative">
                          <input
                            type="date"
                            value={transaction.bankDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              updateBankDate(transaction.id, e.target.value)
                            }
                            className="sr-only"
                            id={`bankDate-${transaction.id}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`bankDate-${transaction.id}`) as HTMLInputElement;
                              input?.showPicker?.() || input?.click();
                            }}
                            className="w-full p-1 border border-gray-300 rounded bg-white cursor-pointer text-left flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          >
                            <span className={transaction.bankDate ? 'text-gray-900' : 'text-gray-400'}>
                              {transaction.bankDate ? formatToCustomDate(transaction.bankDate) : 'dd/Agu/yyyy'}
                            </span>
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.chkRct}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateRowField(transaction.id, 'chkRct', e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <select
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.cr}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            updateRowField(transaction.id, 'cr', e.target.value)
                          }
                        >
                          <option>Sel...</option>
                          <option>Option 1</option>
                          <option>Option 2</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.eRate}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateRowField(transaction.id, 'eRate', e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.own}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateRowField(transaction.id, 'own', e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.debit}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            updateRowField(transaction.id, 'debit', e.target.value);
                          }}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={transaction.credit}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            updateRowField(transaction.id, 'credit', e.target.value);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                )}
                <tr>
                  <td colSpan={8} className="border p-2 text-right font-medium">Cash:</td>
                  <td colSpan={3} className="border p-2"></td>
                  <td className="border p-2 text-center font-medium text-red-500">
                    {totals.debit === 0 ? '0' : totals.debit.toFixed(2)}
                  </td>
                  <td className="border p-2 text-center font-medium text-green-500">
                    {totals.credit === 0 ? '0' : totals.credit.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Closing Balance */}
          <div className="bg-indigo-800 text-white p-2 text-right mb-6">
            <span className="font-medium mr-16">Closing Balance</span>
            <span>{Math.abs(totals.credit - totals.debit).toFixed(2)}</span>
          </div>

          {/* Save Button */}
          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              type="button"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

