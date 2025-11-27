// --- IGNORE ---  THIS IS NESTED CODE 


// export function transformJournalData(flatData: any[]) {
//   if (!flatData || flatData.length === 0) return [];

//   console.log('🔄 Transforming', flatData.length, 'flat records...');
//   console.log('🔍 Sample record:', flatData[0]);

//   const grouped = new Map();

//   flatData.forEach(record => {
//     const parentId = record.id;
    
//     if (!grouped.has(parentId)) {
//       grouped.set(parentId, {
//         ID: record.id,
//         VoucherNo: record.voucherNo,
//         Date: record.date,
//         Status: record.status,
//         VoucherTypeId: record.voucherTypeId,
//         CreatedAt: record.createdAt,
//         UpdatedAt: record.updatedAt,
//         Journaldetail: [],
//         VoucherType: {
//           ID: record.id_3,
//           VType: record.vType
//         },
//         Currencies: {
//           ID: record.id_4,
//           CurrencyName: record.currencyName
//         }
//       });
//     }

//     const parent = grouped.get(parentId);
    
//     // Add journal detail
//     const detail = {
//       ID: record.id_2,
//       JmId: record.jmId,
//       CoaId: record.coaId,
//       Description: record.description,
//       AmountDb: record.amountDb || 0,
//       AmountCr: record.amountCr || 0,
//       Rate: record.rate,
//       Status: record.status_2,
      
//       Zcoas: {
//         ID: record.id_5,
//         AcName: record.acName,
//         Ch1Id: record.ch1Id,
//         Ch2Id: record.ch2Id,
//         SetupName: record.setupName,
//         PersonName: record.personName,
//         BatchNo: record.batch_no
//       },
      
//       Ztransporter: {
//         ID: record.id_6,
//         Name: record.name,
//         ContactPerson: record.contactPerson,
//         Phone: record.phone,
//         Address: record.address
//       }
//     };

//     // Avoid duplicates
//     const exists = parent.Journaldetail.find((d: any) => d.ID === detail.ID);
//     if (!exists) {
//       parent.Journaldetail.push(detail);
//     }
//   });

//   const result = Array.from(grouped.values());
//   console.log('✅ Transformed to', result.length, 'nested records');
  
//   return result;
// }



































// ✅ Simple flat data operations - everything in one file
export class FlatDataProcessor {
  
  // ✅ Apply filters to flat data
  static filterFlatData(data: any[], filters: any = {}) {
    console.log('🔍 Filtering', data.length, 'flat records');
    
    return data.filter(record => {
      let matches = true;

      if (filters.coaId && record.coaId?.toString() !== filters.coaId.toString()) matches = false;
      if (filters.status !== undefined && record.status !== filters.status) matches = false;
      if (filters.vType && record.vType !== filters.vType) matches = false;
      if (filters.minAmount && parseFloat(record.amountDb || 0) < filters.minAmount) matches = false;
      
      return matches;
    });
  }

  // ✅ Calculate sums with conditions  
  static calculateSums(data: any[], operations: any = {}) {
    console.log('🧮 Calculating sums for', data.length, 'records');

    const results = {
      totalCredit: 0,
      totalDebit: 0,
      conditionalSum: 0,
      netAmount: 0,
      recordCount: data.length,
      groupedResults: {} as any
    };

    data.forEach(record => {
      const credit = parseFloat(record.amountCr || 0);
      const debit = parseFloat(record.amountDb || 0);

      results.totalCredit += credit;
      results.totalDebit += debit;

      // ✅ Conditional sum (sum only if condition matches)
      if (operations.condition && this.checkCondition(record, operations.condition)) {
        if (operations.operation === 'sum_credit') {
          results.conditionalSum += credit;
        } else if (operations.operation === 'sum_debit') {
          results.conditionalSum += debit;
        } else {
          results.conditionalSum += (credit + debit);
        }
      }

      // ✅ Group by operations
      if (operations.groupBy) {
        const groupKey = record[operations.groupBy] || 'unknown';
        if (!results.groupedResults[groupKey]) {
          results.groupedResults[groupKey] = { credit: 0, debit: 0, count: 0 };
        }
        results.groupedResults[groupKey].credit += credit;
        results.groupedResults[groupKey].debit += debit;
        results.groupedResults[groupKey].count += 1;
      }
    });

    results.netAmount = results.totalCredit - results.totalDebit;

    // ✅ Additional calculations
    if (operations.divideBy && operations.divideBy > 0) {
      (results as any).dividedResult = results.conditionalSum / operations.divideBy;
    }

    return results;
  }

  private static checkCondition(record: any, condition: any): boolean {
    const { field, operator, value } = condition;
    const recordValue = record[field];

    switch (operator) {
      case 'equals': return recordValue?.toString() === value.toString();
      case 'greater': return parseFloat(recordValue || 0) > parseFloat(value);
      case 'less': return parseFloat(recordValue || 0) < parseFloat(value);
      case 'not_null': return recordValue !== null && recordValue !== undefined;
      default: return true;
    }
  }

  // ✅ Complete processing function
  static processFlatData(data: any[], filters: any = {}, operations: any = {}) {
    console.log('🚀 Processing flat data...');
    
    const filteredData = this.filterFlatData(data, filters);
    const calculations = this.calculateSums(filteredData, operations);
    
    return {
      success: true,
      data: filteredData,
      calculations,
      summary: {
        originalCount: data.length,
        filteredCount: filteredData.length
      }
    };
  }
}

// ✅ Export the functions you need
export const processFlatData = (data: any[], filters?: any, operations?: any) => {
  return FlatDataProcessor.processFlatData(data, filters, operations);
};

export const filterFlatData = (data: any[], filters?: any) => {
  return FlatDataProcessor.filterFlatData(data, filters);
};

export const calculateSums = (data: any[], operations?: any) => {
  return FlatDataProcessor.calculateSums(data, operations);
};

// ✅ Keep the old exports for compatibility (in case other files use them)
export const transformJournalData = processFlatData;
export const transformToNested = processFlatData; // For backward compatibility
