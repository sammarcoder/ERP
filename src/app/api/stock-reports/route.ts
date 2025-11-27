



import { NextRequest, NextResponse } from 'next/server';
import metabaseService from '@/lib/metabaseService';
import { convertToCleanFormat } from '@/lib/dataConverter';
import DataFilter from '@/lib/filters/dataProcessor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get raw data from Metabase
    const rawData = await metabaseService.getQuestionData(134);
    const cleanData = convertToCleanFormat(rawData);
    
    console.log('📊 Total records from Metabase:', cleanData.length);
    
    // ✅ Parse filter parameters from URL
    const filters = {
      acNames: searchParams.get('ac_names')?.split(',') || [],
      dateFrom: searchParams.get('date_from'),
      dateTo: searchParams.get('date_to'),
      description: searchParams.get('description'),
      voucherTypes: searchParams.get('voucher_types')?.split(',') || [],
      status: searchParams.get('status') === 'true' ? true : searchParams.get('status') === 'false' ? false : undefined
    };
    
    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key]) && filters[key].length === 0) {
        delete filters[key];
      }
      if (!filters[key] && filters[key] !== false) {
        delete filters[key];
      }
    });
    
    console.log('🎯 Applied filters:', filters);
    
    // ✅ Apply filters
    const filteredData = DataFilter.applyAllFilters(cleanData, filters);
    
    // ✅ Get filter options for frontend dropdowns
    const filterOptions = DataFilter.getFilterOptions(cleanData);
    
    return NextResponse.json({
      success: true,
      message: "Data retrieved and filtered successfully",
      data: filteredData,
    //   meta: {
    //     totalRecords: cleanData.length,
    //     filteredRecords: filteredData.length,
    //     filtersApplied: filters,
    //     filterOptions: filterOptions
    //   }
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
