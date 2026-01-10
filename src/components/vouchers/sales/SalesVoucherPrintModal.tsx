// components/SalesVoucherPrintModal.tsx
import React, { useEffect } from 'react';

interface SalesVoucherPrintModalProps {
  gdn: any;
  voucherNo?: string;  // ✅ Add voucher number prop
  onClose: () => void;
}

const SalesVoucherPrintModal: React.FC<SalesVoucherPrintModalProps> = ({ gdn, voucherNo, onClose }) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getCrtPackaging = (detail: any) => {
    const uom2Qty = parseFloat(detail.item?.uom2_qty) || 0;
    const uom2Name = detail.item?.uomTwo?.uom || 'Box';
    const uom3Name = detail.item?.uomThree?.uom || 'Crt';
    return `${uom2Qty} ${uom2Name}/${uom3Name}`;
  };

  const getActualSoldQty = (detail: any) => {
    const saleUnit = parseInt(detail.Sale_Unit) || 1;
    
    if (saleUnit === 1) {
      const qty = parseFloat(detail.uom1_qty) || 0;
      const uom = detail.item?.uom1?.uom || 'Pcs';
      return `${qty.toLocaleString()} ${uom}`;
    } else if (saleUnit === 2) {
      const qty = parseFloat(detail.uom2_qty) || 0;
      const uom = detail.item?.uomTwo?.uom || 'Box';
      return `${qty.toLocaleString()} ${uom}`;
    } else if (saleUnit === 3) {
      const qty = parseFloat(detail.uom3_qty) || 0;
      const uom = detail.item?.uomThree?.uom || 'Crt';
      return `${qty.toLocaleString()} ${uom}`;
    }
    
    const qty = parseFloat(detail.uom1_qty) || 0;
    const uom = detail.item?.uom1?.uom || 'Pcs';
    return `${qty.toLocaleString()} ${uom}`;
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
  
  let totalPayableGross = 0;
  let totalDisAmount = 0;
  let totalDis2Amount = 0;
  let totalSchAmount = 0;
  let totalNetPayable = 0;

  details.forEach((detail: any) => {
    const row = calculateRow(detail);
    totalPayableGross += row.payableGross;
    totalDisAmount += row.disAmount;
    totalDis2Amount += row.dis2Amount;
    totalSchAmount += row.schAmount;
    totalNetPayable += row.netPayable;
  });

  const carriageAmount = calculateCarriage();
  const grandTotal = totalNetPayable - carriageAmount;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1200,height=800');

    if (!printWindow) {
      alert('Please allow popups for printing');
      onClose();
      return;
    }

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Sales Voucher - ${gdn.Number}</title>
<style>
@page { 
  size: A4 landscape; 
  margin: 8mm; 
}

* { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #2d5a27;
  padding-bottom: 10px;
  margin-bottom: 12px;
}

.header-title {
  font-size: 22px;
  font-weight: bold;
  color: #2d5a27;
}

.header-info {
  display: flex;
  gap: 25px;
  font-size: 14px;
}

.header-info div {
  display: flex;
  gap: 6px;
}

.header-info strong {
  color: #2d5a27;
}

.customer-section {
  display: flex;
  justify-content: space-between;
  background: #f5f5f5;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 12px;
  font-size: 14px;
}

.customer-left, .customer-right {
  display: flex;
  gap: 30px;
}

.customer-item strong {
  color: #2d5a27;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th, td {
  border: 1px solid #888;
  padding: 8px 5px;
  text-align: center;
}

th {
  background: #2d5a27;
  color: white;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
}

.text-left { text-align: left; padding-left: 6px; }
.text-right { text-align: right; padding-right: 6px; }

tr:nth-child(even) { background: #f9f9f9; }

.item-name { 
  font-weight: 600; 
  font-size: 12px; 
}

.pkg-col {
  font-size: 11px;
  color: #444;
}

.number-col { 
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
}

.discount-col {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  color: #c0392b;
}

.net-col { 
  font-weight: 700; 
  color: #2d5a27;
  font-size: 12px;
}

.totals-row td {
  background: #d4edda;
  font-weight: 700;
  font-size: 12px;
  border-top: 3px solid #2d5a27;
}

.totals-row .label {
  text-align: right;
  padding-right: 10px;
  font-weight: 700;
}

.totals-row .discount-total {
  color: #c0392b;
}

.summary-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.summary-box {
  width: 320px;
  border: 2px solid #2d5a27;
  border-radius: 6px;
  overflow: hidden;
  font-size: 14px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  border-bottom: 1px solid #ddd;
}

.summary-row:last-child {
  border-bottom: none;
  background: #2d5a27;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.summary-row .value {
  font-weight: 700;
  font-family: 'Consolas', 'Courier New', monospace;
}
</style>
</head>
<body>

<!-- Header -->
<div class="header">

  <div class="header-info">
    <div><strong>Voucher:</strong> ${voucherNo || 'N/A'}</div>
    <div><strong>Date:</strong> ${formatDate(gdn.Date)}</div>
     <div><strong>GDN:</strong> ${gdn.Number}</div>
    <div><strong>Transporter:</strong> ${gdn.transporter?.name || 'N/A'}</div>
    <div><strong>Bility No:</strong> ${gdn.bility_no || gdn.biltyNo || 'N/A'}</div>
  </div>
</div>

<!-- Customer Info -->
<div class="customer-section">
  <div class="customer-left">
    <div class="customer-item"><strong>Customer:</strong> ${gdn.account?.acName || 'N/A'}</div>
    <div class="customer-item"><strong>City:</strong> ${gdn.account?.city || 'N/A'}</div>
  </div>
  <div class="customer-right">
    <div class="customer-item"><strong>Sub Customer:</strong> ${gdn.order?.sub_customer || 'N/A'}</div>
    <div class="customer-item"><strong>Sub City:</strong> ${gdn.order?.sub_city || 'N/A'}</div>
  </div>
</div>

<!-- Items Table -->
<table>
  <thead>
    <tr>
      <th style="width:2%">SR</th>
      <th style="width:14%" class="text-left">ITEM NAME</th>
      <th style="width:13%">CRT PKG</th>
      <th style="width:6%">CRT SOLD</th>
      <th style="width:8%">Unit Sold</th>
      <th style="width:5%">PRICE</th>
      <th style="width:9%">PAYABLE GROSS</th>
      <th style="width:5%">W/S%</th>
      <th style="width:9%">W/S</th>
      <th style="width:5%">DIS2%</th>
      <th style="width:9%">DIST2</th>
      <th style="width:5%">SCH%</th>
      <th style="width:9%">SCH</th>
      <th style="width:10%">NET PAYABLE</th>
    </tr>
  </thead>
  <tbody>
`);

    details.forEach((detail: any, index: number) => {
      const row = calculateRow(detail);
      const crtPackaging = getCrtPackaging(detail);
      const actualSoldQty = getActualSoldQty(detail);
      const uom3Name = detail.item?.uomThree?.uom || 'Crt';

      printWindow.document.write(`
    <tr>
      <td>${index + 1}</td>
      <td class="text-left item-name">${detail.item?.itemName || '-'}</td>
      <td class="pkg-col">${crtPackaging}</td>
      <td class="number-col">${row.crtSold} ${uom3Name}</td>
      <td class="number-col">${actualSoldQty}</td>
      <td class="text-right number-col">${row.tradePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td class="text-right number-col">${Math.round(row.payableGross).toLocaleString()}</td>
      <td class="number-col">${Math.round(row.disPercent)}</td>
      <td class="text-right discount-col">${Math.round(row.disAmount).toLocaleString()}</td>
      <td class="number-col">${Math.round(row.dis2Percent)}</td>
      <td class="text-right discount-col">${Math.round(row.dis2Amount).toLocaleString()}</td>
      <td class="number-col">${Math.round(row.schPercent)}</td>
      <td class="text-right discount-col">${Math.round(row.schAmount).toLocaleString()}</td>
      <td class="text-right net-col">${Math.round(row.netPayable).toLocaleString()}</td>
    </tr>
`);
    });

    printWindow.document.write(`
    <tr class="totals-row">
      <td colspan="6" class="label">TOTALS:</td>
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

<!-- Summary Box -->
<div class="summary-section">
  <div class="summary-box">
    <div class="summary-row">
      <span>Payable:</span>
      <span class="value">${Math.round(totalNetPayable).toLocaleString()}</span>
    </div>
    <div class="summary-row">
      <span>Less:</span>
      <span class="value">${Math.round(carriageAmount).toLocaleString()}</span>
    </div>
    <div class="summary-row">
      <span>TOTAL NET Payable:</span>
      <span class="value">${Math.round(grandTotal).toLocaleString()}</span>
    </div>
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

  useEffect(() => {
    handlePrint();
  }, []);

  return null;
};

export default SalesVoucherPrintModal;













































































