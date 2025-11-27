// ✅ Rename to match your import
export function convertToCleanFormat(rawData: any) {
  if (!rawData.data?.rows || !rawData.data?.cols) return [];

  return rawData.data.rows.map((row: any) => {
    const record: any = {};
    
    rawData.data.cols.forEach((col: any, index: number) => {
      const fieldName = col.display_name || col.name;
      record[fieldName] = row[index];
    });
    
    return record;
  });
}

// ✅ Also export both names for flexibility
export const convertToRawFormat = convertToCleanFormat;
