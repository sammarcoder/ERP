export class DataFilter {
  
  // ✅ Filter by Account Name (AcName)
  static filterByAcName(data: any[], selectedAcNames: string[]) {
    if (!selectedAcNames || selectedAcNames.length === 0) return data;
    
    return data.filter(record => {
      const acName = record["Zcoas - CoaId → AcName"];
      return selectedAcNames.includes(acName);
    });
  }
  
  // ✅ Filter by Date Range
  static filterByDateRange(data: any[], dateFrom?: string, dateTo?: string) {
    if (!dateFrom && !dateTo) return data;
    
    return data.filter(record => {
      const recordDate = new Date(record["Date"]);
      
      if (dateFrom && recordDate < new Date(dateFrom)) return false;
      if (dateTo && recordDate > new Date(dateTo)) return false;
      
      return true;
    });
  }
  
  // ✅ Filter by Description
  static filterByDescription(data: any[], searchText: string) {
    if (!searchText || searchText.trim() === '') return data;
    
    return data.filter(record => {
      const description = record["Journaldetail → Description"] || '';
      return description.toLowerCase().includes(searchText.toLowerCase());
    });
  }
  
  // ✅ Filter by Voucher Type
  static filterByVoucherType(data: any[], selectedTypes: string[]) {
    if (!selectedTypes || selectedTypes.length === 0) return data;
    
    return data.filter(record => {
      const voucherType = record["Zvouchertype - VoucherTypeId → VType"];
      return selectedTypes.includes(voucherType);
    });
  }
  
  // ✅ Filter by Status
  static filterByStatus(data: any[], status?: boolean) {
    if (status === undefined || status === null) return data;
    
    return data.filter(record => {
      return record["Status"] === status;
    });
  }
  
  // ✅ Get unique values for filter dropdowns
  static getFilterOptions(data: any[]) {
    const uniqueAcNames = [...new Set(data.map(record => record["Zcoas - CoaId → AcName"]))].filter(Boolean);
    const uniqueVoucherTypes = [...new Set(data.map(record => record["Zvouchertype - VoucherTypeId → VType"]))].filter(Boolean);
    const uniqueDescriptions = [...new Set(data.map(record => record["Journaldetail → Description"]))].filter(Boolean);
    
    const dateRange = {
      min: data.reduce((min, record) => {
        const date = new Date(record["Date"]);
        return date < min ? date : min;
      }, new Date(data[0]?.["Date"] || new Date())),
      max: data.reduce((max, record) => {
        const date = new Date(record["Date"]);
        return date > max ? date : max;
      }, new Date(data[0]?.["Date"] || new Date()))
    };
    
    return {
      acNames: uniqueAcNames.sort(),
      voucherTypes: uniqueVoucherTypes.sort(),
      descriptions: uniqueDescriptions.sort(),
      dateRange: {
        min: dateRange.min.toISOString().split('T')[0],
        max: dateRange.max.toISOString().split('T')[0]
      }
    };
  }
  
  // ✅ Apply all filters in sequence
  static applyAllFilters(data: any[], filters: any = {}) {
    let filteredData = [...data];
    
    console.log('🔍 Starting filters with', filteredData.length, 'records');
    
    // Apply each filter
    if (filters.acNames && filters.acNames.length > 0) {
      filteredData = this.filterByAcName(filteredData, filters.acNames);
      console.log('📊 After AcName filter:', filteredData.length, 'records');
    }
    
    if (filters.dateFrom || filters.dateTo) {
      filteredData = this.filterByDateRange(filteredData, filters.dateFrom, filters.dateTo);
      console.log('📊 After date filter:', filteredData.length, 'records');
    }
    
    if (filters.description) {
      filteredData = this.filterByDescription(filteredData, filters.description);
      console.log('📊 After description filter:', filteredData.length, 'records');
    }
    
    if (filters.voucherTypes && filters.voucherTypes.length > 0) {
      filteredData = this.filterByVoucherType(filteredData, filters.voucherTypes);
      console.log('📊 After voucher type filter:', filteredData.length, 'records');
    }
    
    if (filters.status !== undefined) {
      filteredData = this.filterByStatus(filteredData, filters.status);
      console.log('📊 After status filter:', filteredData.length, 'records');
    }
    
    console.log('✅ Final filtered data:', filteredData.length, 'records');
    
    return filteredData;
  }
}

export default DataFilter;
