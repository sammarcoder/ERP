// components/SalesVoucherPrintModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Printer } from 'lucide-react';

interface SalesVoucherPrintModalProps {
  gdn: any;
  voucherNo?: string;
  mode?: 'view' | 'print';  // ✅ Add mode prop
  onClose: () => void;
}

const SalesVoucherPrintModal: React.FC<SalesVoucherPrintModalProps> = ({ gdn, voucherNo, mode = 'print', onClose }) => {

  // PRINT MODE - Handle print immediately and return null
  useEffect(() => {
    if (mode === 'print') {
      executePrint();
    }
  }, []);

  const executePrint = () => {
    const details = gdn.details || [];
    
    let totalCrtSold = 0;
    let totalPayableGross = 0;
    let totalDisAmount = 0;
    let totalDis2Amount = 0;
    let totalSchAmount = 0;
    let totalNetPayable = 0;

    const formatDatePrint = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      return `${day}/${month}/${year}`;
    };

    const getCrtPackagingPrint = (detail: any) => {
      const uom2Qty = parseFloat(detail.item?.uom2_qty) || 0;
      const uom3Qty = parseFloat(detail.item?.uom3_qty) || 0;
      const uom2Name = detail.item?.uomTwo?.uom;
      const uom3Name = detail.item?.uomThree?.uom;
      return `${uom3Qty/uom2Qty} ${uom2Name}/${uom3Name}`;
    };

    const getActualSoldQtyPrint = (detail: any) => {
      const qty = parseFloat(detail.uom2_qty) || 0;
      const uom = detail.item?.uomTwo?.uom || 'Box';
      return `${qty.toLocaleString()} ${uom}`;
    };

    const calculateRowPrint = (detail: any) => {
      const crtSold = parseFloat(detail.uom3_qty) || 0;
      const tradePrice = parseFloat(detail.Stock_Price) || 0;
      const uom2Qty = parseFloat(detail.uom2_qty) || 0;
      const disPercent = parseFloat(detail.Discount_A) || 0;
      const dis2Percent = parseFloat(detail.Discount_B) || 0;
      const schPercent = parseFloat(detail.Discount_C) || 0;
      const payableGross = uom2Qty * tradePrice;
      const disAmount = payableGross * (disPercent / 100);
      const afterDis = payableGross - disAmount;
      const dis2Amount = afterDis * (dis2Percent / 100);
      const afterDis2 = afterDis - dis2Amount;
      const schAmount = afterDis2 * (schPercent / 100);
      const netPayable = afterDis2 - schAmount;
      return { crtSold, tradePrice, payableGross, disPercent, disAmount, dis2Percent, dis2Amount, schPercent, schAmount, netPayable };
    };

    const calculateCarriagePrint = () => {
      if (!gdn.Carriage_ID) return 0;
      const labour = parseFloat(gdn.labour_crt || 0);
      const freight = parseFloat(gdn.freight_crt || 0);
      const bility = parseFloat(gdn.bility_expense || 0);
      const other = parseFloat(gdn.other_expense || 0);
      const booked = parseFloat(gdn.booked_crt || 0);
      return (labour * booked) + (freight * booked) + bility + other;
    };

    details.forEach((detail: any) => {
      const row = calculateRowPrint(detail);
      totalCrtSold += row.crtSold;
      totalPayableGross += row.payableGross;
      totalDisAmount += row.disAmount;
      totalDis2Amount += row.dis2Amount;
      totalSchAmount += row.schAmount;
      totalNetPayable += row.netPayable;
    });

    const carriageAmount = calculateCarriagePrint();
    const grandTotal = totalNetPayable - carriageAmount;

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert('Please allow popups for printing');
      onClose();
      return;
    }

    let tableRows = '';
    details.forEach((detail: any, index: number) => {
      const row = calculateRowPrint(detail);
      const crtPackaging = getCrtPackagingPrint(detail);
      const actualSoldQty = getActualSoldQtyPrint(detail);
      const uom3Name = detail.item?.uomThree?.uom || 'Crt';
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td class="text-left item-name">${detail.item?.itemName || '-'}</td>
          <td class="pkg-col">${crtPackaging}</td>
          <td class="number-col">${row.crtSold} ${uom3Name}</td>
          <td class="number-col">${actualSoldQty}</td>
          <td class="text-right number-col">${row.tradePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          <td class="text-right number-col">${Math.round(row.payableGross).toLocaleString()}</td>
          <td class="number-col">${row.disPercent}</td>
          <td class="text-right discount-col">${Math.round(row.disAmount).toLocaleString()}</td>
          <td class="number-col">${row.dis2Percent}</td>
          <td class="text-right discount-col">${Math.round(row.dis2Amount).toLocaleString()}</td>
          <td class="number-col">${row.schPercent}</td>
          <td class="text-right discount-col">${Math.round(row.schAmount).toLocaleString()}</td>
          <td class="text-right net-col">${Math.round(row.netPayable).toLocaleString()}</td>
        </tr>
      `;
    });

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Sales Voucher - ${gdn.Number}</title>
<style>
@page { size: A4 landscape; margin: 8mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.4; color: #333; }
.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2d5a27; padding-bottom: 10px; margin-bottom: 12px; }
.header-info { display: flex; gap: 25px; font-size: 14px; }
.header-info div { display: flex; gap: 6px; }
.header-info strong { color: #2d5a27; }
.customer-section { display: flex; justify-content: space-between; background: #f5f5f5; padding: 8px 12px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 12px; font-size: 14px; }
.customer-left, .customer-right { display: flex; gap: 30px; }
.customer-item strong { color: #2d5a27; }
.customer-item2 { color: #2d5a27; font-weight: bold; font-size: 16px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { border: 1px solid #888; padding: 8px 5px; text-align: center; }
th { background: #2d5a27; color: white; font-weight: 700; font-size: 11px; text-transform: uppercase; }
.text-left { text-align: left; padding-left: 6px; }
.text-right { text-align: right; padding-right: 6px; }
tr:nth-child(even) { background: #f9f9f9; }
.item-name { font-weight: 600; font-size: 12px; }
.pkg-col { font-size: 11px; color: #444; }
.number-col { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; }
.discount-col { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; color: #c0392b; }
.net-col { font-weight: 700; color: #2d5a27; font-size: 12px; }
.totals-row td { background: #d4edda; font-weight: 700; font-size: 12px; border-top: 3px solid #2d5a27; }
.totals-row .label { text-align: right; padding-right: 10px; font-weight: 700; }
.totals-row .discount-total { color: #c0392b; }
.summary-section { display: flex; justify-content: flex-end; margin-top: 12px; }
.summary-box { width: 320px; border: 2px solid #2d5a27; border-radius: 6px; overflow: hidden; font-size: 14px; }
.summary-row { display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #ddd; }
.summary-row:last-child { border-bottom: none; background: #2d5a27; color: white; font-weight: bold; font-size: 16px; }
.summary-row .value { font-weight: 700; font-family: 'Consolas', 'Courier New', monospace; }
</style>
</head>
<body>
<div class="header">
  <div class="header-info">
    <div><strong>Voucher:</strong> ${voucherNo || 'N/A'}</div>
    <div><strong>Date:</strong> ${formatDatePrint(gdn.Date)}</div>
    <div><strong>GDN:</strong> ${gdn.Number}</div>
    <div><strong>Transporter:</strong> ${gdn.transporter?.name || 'N/A'}</div>
    <div><strong>Bility No:</strong> ${gdn.bility_no || gdn.biltyNo || 'N/A'}</div>
    <div><strong>Booked Crt:</strong> ${gdn.booked_crt || '0'}</div>
  </div>
</div>
<div class="customer-section">
  <div class="customer-left">
    <div class="customer-item2"><strong>Customer:</strong> ${gdn.account?.acName || 'N/A'}</div>
    <div class="customer-item2"><strong>City:</strong> ${gdn.account?.city || 'N/A'}</div>
  </div>
  <div class="customer-right">
    <div class="customer-item2"><strong>Sub Customer:</strong> ${gdn.order?.sub_customer || 'N/A'}</div>
    <div class="customer-item2"><strong>Sub City:</strong> ${gdn.order?.sub_city || 'N/A'}</div>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th style="width:2%">SR</th>
      <th style="width:12%" class="text-left">ITEM NAME</th>
      <th style="width:10%">CRT PKG</th>
      <th style="width:5%">CRT SOLD</th>
      <th style="width:7%">Unit Sold</th>
      <th style="width:7%">PRICE</th>
      <th style="width:8%">PAYABLE GROSS</th>
      <th style="width:4%">W/S%</th>
      <th style="width:5%">W/S</th>
      <th style="width:4%">DIS2%</th>
      <th style="width:5%">DIST2</th>
      <th style="width:4%">SCH%</th>
      <th style="width:5%">SCH</th>
      <th style="width:12%">NET PAYABLE</th>
    </tr>
  </thead>
  <tbody>
    ${tableRows}
    <tr class="totals-row">
      <td colspan="3" class="label">TOTALS:</td>
      <td class="text-right number-col">${totalCrtSold}</td>
      <td></td>
      <td></td>
      <td class="text-right number-col">${Math.round(totalPayableGross).toLocaleString()}</td>
      <td></td>
      <td class="text-right discount-total">${Math.round(totalDisAmount).toLocaleString()}</td>
      <td></td>
      <td class="text-right discount-total">${Math.round(totalDis2Amount).toLocaleString()}</td>
      <td></td>
      <td class="text-right discount-total">${Math.round(totalSchAmount).toLocaleString()}</td>
      <td class="text-right net-col">${Math.round(totalNetPayable).toLocaleString()}</td>
    </tr>
  </tbody>
</table>
<div class="summary-section">
  <div class="summary-box">
    <div class="summary-row"><span>Payable:</span><span class="value">${Math.round(totalNetPayable).toLocaleString()}</span></div>
    <div class="summary-row"><span>Less:</span><span class="value">${Math.round(carriageAmount).toLocaleString()}</span></div>
    <div class="summary-row"><span>TOTAL NET Payable:</span><span class="value">${Math.round(grandTotal).toLocaleString()}</span></div>
  </div>
</div>
</body>
</html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      onClose();
    }, 300);
  };

  // PRINT MODE - Return null immediately, print happens in useEffect
  if (mode === 'print') {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getCrtPackaging = (detail: any) => {
    const uom2Qty = parseFloat(detail.item?.uom2_qty) || 0;
    const uom2Name = detail.item?.uomTwo?.uom;
    const uom3Name = detail.item?.uomThree?.uom;
    const uom3Qty = parseFloat(detail.item?.uom3_qty) || 0;
    // alert('uom2Qty: ' + uom2Qty + ' uom2Name: ' + uom2Name + ' uom3Name: ' + uom3Name);
    // return `${uom2Qty} ${uom2Name}/${uom3Name}`;
    return `${uom3Qty/uom2Qty} ${uom2Name}/${uom3Name}`;
  };

  const getActualSoldQty = (detail: any) => {
    // const saleUnit = parseInt(detail.Sale_Unit) || 1;
    
    // if (saleUnit === 1) {
    //   const qty = parseFloat(detail.uom1_qty) || 0;
    //   const uom = detail.item?.uom1?.uom || 'Pcs';
    //   return `${qty.toLocaleString()} ${uom}`;
    // } 
    // else if (saleUnit === 2) {
      const qty = parseFloat(detail.uom2_qty) || 0;
      const uom = detail.item?.uomTwo?.uom || 'Box';
      return `${qty.toLocaleString()} ${uom}`;
    // } 
    // else if (saleUnit === 3) {
    //   const qty = parseFloat(detail.uom3_qty) || 0;
    //   const uom = detail.item?.uomThree?.uom || 'Crt';
    //   return `${qty.toLocaleString()} ${uom}`;
    // }
    
    // const qty = parseFloat(detail.uom1_qty) || 0;
    // const uom = detail.item?.uom1?.uom || 'Pcs';
    // return `${qty.toLocaleString()} ${uom}`;
  };

  const calculateRow = (detail: any) => {
    const crtSold = parseFloat(detail.uom3_qty) || 0;
    const tradePrice = parseFloat(detail.Stock_Price) || 0;
    const uom2Qty = parseFloat(detail.uom2_qty) || 0;
    
    const disPercent = parseFloat(detail.Discount_A) || 0;
    const dis2Percent = parseFloat(detail.Discount_B) || 0;
    const schPercent = parseFloat(detail.Discount_C) || 0;

    const payableGross = uom2Qty * tradePrice;

    // Dis = Discount amount from Payable Gross
    const disAmount = payableGross * (disPercent / 100);
    const afterDis = payableGross - disAmount;

    // Dis2 = Discount amount from remaining
    const dis2Amount = afterDis * (dis2Percent / 100);
    const afterDis2 = afterDis - dis2Amount;

    // Sch = Discount amount from remaining
    const schAmount = afterDis2 * (schPercent / 100);
    const netPayable = afterDis2 - schAmount;

    return {
      crtSold,
      tradePrice,
      payableGross,
      disPercent,
      disAmount,
      dis2Percent,
      dis2Amount,
      schPercent,
      schAmount,
      netPayable
    };
  };

  const calculateCarriage = () => {
    if (!gdn.Carriage_ID) return 0;

    const labour = parseFloat(gdn.labour_crt || 0);
    const freight = parseFloat(gdn.freight_crt || 0);
    const bility = parseFloat(gdn.bility_expense || 0);
    const other = parseFloat(gdn.other_expense || 0);
    const booked = parseFloat(gdn.booked_crt || 0);

    return (labour * booked) + (freight * booked) + bility + other;
  };

  const details = gdn.details || [];
  
  let totalCrtSold = 0;
  let totalPayableGross = 0;
  let totalDisAmount = 0;
  let totalDis2Amount = 0;
  let totalSchAmount = 0;
  let totalNetPayable = 0;

  details.forEach((detail: any) => {
    const row = calculateRow(detail);
    totalCrtSold += row.crtSold;
    totalPayableGross += row.payableGross;
    totalDisAmount += row.disAmount;
    totalDis2Amount += row.dis2Amount;
    totalSchAmount += row.schAmount;
    totalNetPayable += row.netPayable;
  });

  const carriageAmount = calculateCarriage();
  const grandTotal = totalNetPayable - carriageAmount;

  // VIEW MODE - Render modal with voucher preview
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-emerald-50">
          <h2 className="text-lg font-bold text-emerald-800">Sales Voucher Preview</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={executePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {/* Header Info */}
          <div className="flex justify-between items-center border-b-4 border-emerald-700 pb-3 mb-4">
            <div className="flex gap-6 text-sm">
              <div><span className="font-semibold text-emerald-700">Voucher:</span> {voucherNo || 'N/A'}</div>
              <div><span className="font-semibold text-emerald-700">Date:</span> {formatDate(gdn.Date)}</div>
              <div><span className="font-semibold text-emerald-700">GDN:</span> {gdn.Number}</div>
              <div><span className="font-semibold text-emerald-700">Transporter:</span> {gdn.transporter?.name || 'N/A'}</div>
              <div><span className="font-semibold text-emerald-700">Bility No:</span> {gdn.bility_no || gdn.biltyNo || 'N/A'}</div>
            </div>
          </div>

            {/* Customer Info */}
            <div className="flex justify-between bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4">
              <div className="flex gap-8">
                <div className="font-bold text-emerald-800">
                  <span className="font-semibold">Customer:</span> {gdn.account?.acName || 'N/A'}
                </div>
                <div className="font-bold text-emerald-800">
                  <span className="font-semibold">City:</span> {gdn.account?.city || 'N/A'}
                </div>
              </div>
              <div className="flex gap-8">
                <div className="font-bold text-emerald-800">
                  <span className="font-semibold">Sub Customer:</span> {gdn.order?.sub_customer || 'N/A'}
                </div>
                <div className="font-bold text-emerald-800">
                  <span className="font-semibold">Sub City:</span> {gdn.order?.sub_city || 'N/A'}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-700 text-white">
                    <th className="px-3 py-2 text-center w-[3%]">SR</th>
                    <th className="px-3 py-2 text-left w-[14%]">ITEM NAME</th>
                    <th className="px-3 py-2 text-center w-[8%]">CRT PKG</th>
                    <th className="px-3 py-2 text-center w-[7%]">CRT SOLD</th>
                    <th className="px-3 py-2 text-center w-[8%]">UNIT SOLD</th>
                    <th className="px-3 py-2 text-right w-[7%]">PRICE</th>
                    <th className="px-3 py-2 text-right w-[9%]">PAYABLE GROSS</th>
                    <th className="px-3 py-2 text-center w-[4%]">W/S%</th>
                    <th className="px-3 py-2 text-right w-[6%]">W/S</th>
                    <th className="px-3 py-2 text-center w-[4%]">DIS2%</th>
                    <th className="px-3 py-2 text-right w-[6%]">DIST2</th>
                    <th className="px-3 py-2 text-center w-[4%]">SCH%</th>
                    <th className="px-3 py-2 text-right w-[6%]">SCH</th>
                    <th className="px-3 py-2 text-right w-[10%]">NET PAYABLE</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail: any, index: number) => {
                    const row = calculateRow(detail);
                    const crtPackaging = getCrtPackaging(detail);
                    const actualSoldQty = getActualSoldQty(detail);
                    const uom3Name = detail.item?.uomThree?.uom || 'Crt';

                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center border-b">{index + 1}</td>
                        <td className="px-3 py-2 text-left font-semibold border-b">{detail.item?.itemName || '-'}</td>
                        <td className="px-3 py-2 text-center text-gray-600 border-b">{crtPackaging}</td>
                        <td className="px-3 py-2 text-center font-mono border-b">{row.crtSold} {uom3Name}</td>
                        <td className="px-3 py-2 text-center font-mono border-b">{actualSoldQty}</td>
                        <td className="px-3 py-2 text-right font-mono border-b">{row.tradePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-3 py-2 text-right font-mono border-b">{Math.round(row.payableGross).toLocaleString()}</td>
                        <td className="px-3 py-2 text-center font-mono border-b">{row.disPercent}</td>
                        <td className="px-3 py-2 text-right font-mono text-red-600 border-b">{Math.round(row.disAmount).toLocaleString()}</td>
                        <td className="px-3 py-2 text-center font-mono border-b">{row.dis2Percent}</td>
                        <td className="px-3 py-2 text-right font-mono text-red-600 border-b">{Math.round(row.dis2Amount).toLocaleString()}</td>
                        <td className="px-3 py-2 text-center font-mono border-b">{row.schPercent}</td>
                        <td className="px-3 py-2 text-right font-mono text-red-600 border-b">{Math.round(row.schAmount).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700 border-b">{Math.round(row.netPayable).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {/* Totals Row */}
                  <tr className="bg-green-100 font-bold border-t-4 border-emerald-700">
                    <td colSpan={3} className="px-3 py-3 text-right">TOTALS:</td>
                    <td className="px-3 py-3 text-center font-mono">{totalCrtSold}</td>
                    <td></td>
                    <td></td>
                    <td className="px-3 py-3 text-right font-mono">{Math.round(totalPayableGross).toLocaleString()}</td>
                    <td></td>
                    <td className="px-3 py-3 text-right font-mono text-red-600">{Math.round(totalDisAmount).toLocaleString()}</td>
                    <td></td>
                    <td className="px-3 py-3 text-right font-mono text-red-600">{Math.round(totalDis2Amount).toLocaleString()}</td>
                    <td></td>
                    <td className="px-3 py-3 text-right font-mono text-red-600">{Math.round(totalSchAmount).toLocaleString()}</td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-700">{Math.round(totalNetPayable).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Box */}
            <div className="flex justify-end">
              <div className="w-80 border-2 border-emerald-700 rounded-lg overflow-hidden">
                <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                  <span>Payable:</span>
                  <span className="font-bold font-mono">{Math.round(totalNetPayable).toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                  <span>Less:</span>
                  <span className="font-bold font-mono">{Math.round(carriageAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-emerald-700 text-white font-bold text-lg">
                  <span>TOTAL NET Payable:</span>
                  <span className="font-mono">{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SalesVoucherPrintModal;













































































