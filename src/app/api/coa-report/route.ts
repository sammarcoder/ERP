// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     console.log('🚀 API Route Hit - COA Report');
    
//     // Test response first (without Metabase)
//     const testData = {
//       success: true,
//       message: 'API route is working!',
//       chartData: {
//         labels: ['Assets', 'Liabilities', 'Equity'],
//         datasets: [{
//           label: 'Test Data',
//           data: [10, 5, 3],
//           backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
//         }]
//       },
//       tableData: {
//         headers: ['ID', 'Account Name', 'Type'],
//         rows: [
//           [1, 'Cash', 'Assets'],
//           [2, 'Accounts Payable', 'Liabilities'],
//           [3, 'Owner Equity', 'Equity']
//         ]
//       },
//       totalRecords: 3
//     };

//     console.log('✅ Sending test response');
//     return NextResponse.json(testData);

//   } catch (error) {
//     console.error('❌ API Error:', error);
//     return NextResponse.json(
//       { error: 'API Error', message: error.message },
//       { status: 500 }
//     );
//   }
// }



























// import { NextResponse } from 'next/server';

// // Simple Metabase connection (inline for now)
// async function getMetabaseData() {
//   const METABASE_URL = 'http://localhost:2650/api';
//   const API_KEY = 'mb_sEdSLfRXC+EvVLci5mxrEkAMRbJIPtiTA2TRpi+3gHw=';
//   const QUESTION_ID = 70;

//   try {
//     console.log('🔄 Connecting to Metabase...');
//     console.log('URL:', `${METABASE_URL}/card/${QUESTION_ID}/query`);
    
//     const response = await fetch(`${METABASE_URL}/card/${QUESTION_ID}/query`, {
//       method: 'POST',
//       headers: {
//         'X-Metabase-API-Key': API_KEY,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ parameters: [] })
//     });

//     console.log('📡 Metabase Response Status:', response.status);

//     if (!response.ok) {
//       throw new Error(`Metabase API Error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log('🎯 Raw Metabase Data:');
//     console.log('- Total Rows:', data.data?.rows?.length || 0);
//     console.log('- Column Count:', data.data?.cols?.length || 0);
//     console.log('- First 3 Rows:', data.data?.rows?.slice(0, 3));
//     console.log('- Column Names:', data.data?.cols?.map(col => col.name));

//     return {
//       success: true,
//       rows: data.data?.rows || [],
//       columns: data.data?.cols || [],
//       rawData: data
//     };

//   } catch (error) {
//     console.error('❌ Metabase Connection Error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// export async function GET() {
//   try {
//     console.log('🚀 API Route Hit - COA Report (Real Data)');
    
//     // Get real data from Metabase
//     const metabaseResult = await getMetabaseData();
//     console.log('✅ Metabase Result Received', metabaseResult.success ? '' : ` Error: ${metabaseResult.error}`);
//     if (!metabaseResult.success) {
//       // Fallback to test data if Metabase fails
//       console.log('⚠️ Metabase failed, using test data');
//       return NextResponse.json({
//         success: true,
//         message: 'Using test data (Metabase connection failed)',
//         error: metabaseResult.error,
//         chartData: {
//           labels: ['Test: Assets', 'Test: Liabilities', 'Test: Equity'],
//           datasets: [{
//             label: 'Test Data (Metabase Failed)',
//             data: [10, 5, 3],
//             backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
//           }]
//         },
//         tableData: {
//           headers: ['ID', 'Account Name', 'Type'],
//           rows: [
//             [1, 'Cash (Test)', 'Assets'],
//             [2, 'Accounts Payable (Test)', 'Liabilities']
//           ]
//         },
//         totalRecords: 2
//       });
//     }

//     // Transform real Metabase data
//     // console.log('✅ Processing real Metabase data...');
    
//     const chartData = {
//       labels: metabaseResult.rows.slice(0, 10).map((row, index) => 
//         row[1] || `Account ${row[0] || index + 1}`
//       ),
//       datasets: [{
//         label: 'COA Accounts',
//         data: metabaseResult.rows.slice(0, 10).map((_, index) => index + 1),
//         backgroundColor: [
//           '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff',
//           '#ff9f40', '#ff6384', '#c9cbcf', '#4bc0c0', '#ff6384'
//         ]
//       }]
//     };

//     const tableData = {
//       headers: metabaseResult.columns.map(col => col.display_name || col.name),
//       rows: metabaseResult.rows
//     };

//     const response = {
//       success: true,
//       message: 'Real data from Metabase!',
//       chartData,
//       tableData,
//       totalRecords: metabaseResult.rows.length,
//       debug: {
//         metabaseStatus: 'Connected ✅',
//         columnCount: metabaseResult.columns.length,
//         rowCount: metabaseResult.rows.length
//       }
//     };

//     console.log('🎯 Final Response Summary:');
//     console.log('- Success:', response.success);
//     console.log('- Total Records:', response.totalRecords);
//     console.log('- Chart Labels:', chartData.labels.length);
//     console.log('- Table Headers:', tableData.headers);

//     return NextResponse.json(response);

//   } catch (error) {
//     console.error('❌ API Route Error:', error);
//     return NextResponse.json(
//       { 
//         error: 'API failed', 
//         message: error.message,
//         timestamp: new Date().toISOString()
//       },
//       { status: 500 }
//     );
//   }
// }




























// import { NextResponse } from 'next/server';

// async function authenticateWithLogin() {
//   try {
//     console.log('🔐 Authenticating with login...');
    
//     // Replace with YOUR actual Metabase login credentials
//     const loginResponse = await fetch('http://localhost:2650/api/session', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: 'samarabbas114433@gmail.com',  // ← Replace with your email
//         password: 'metabase/metabase12'         // ← Replace with your password
//       })
//     });

//     console.log('📡 Login Status:', loginResponse.status);
    
//     if (!loginResponse.ok) {
//       const errorText = await loginResponse.text();
//       console.error('❌ Login failed:', errorText);
//       throw new Error(`Login failed: ${loginResponse.status}`);
//     }

//     const sessionData = await loginResponse.json();
//     console.log('✅ Login successful! Session ID:', sessionData.id.substring(0, 10) + '...');
    
//     return sessionData.id;
    
//   } catch (error) {
//     console.error('❌ Authentication error:', error);
//     throw error;
//   }
// }

// export async function GET() {
//   try {
//     console.log('🚀 COA Report with Login Authentication');
    
//     // Step 1: Get session token
//     const sessionToken = await authenticateWithLogin();
    
//     // Step 2: List available questions
//     console.log('📋 Listing available questions...');
//     const questionsResponse = await fetch('http://localhost:2650/api/card', {
//       headers: {
//         'X-Metabase-Session': sessionToken,
//         'Content-Type': 'application/json',
//       }
//     });

//     if (!questionsResponse.ok) {
//       throw new Error(`Failed to list questions: ${questionsResponse.status}`);
//     }

//     const questions = await questionsResponse.json();
//     const questionsList = questions.data || questions;
    
//     console.log('✅ Questions retrieved:', questionsList.length);
    
//     // Find COA-related questions
//     const coaQuestions = questionsList.filter(q => 
//       q.name && (
//         q.name.toLowerCase().includes('coa') || 
//         q.name.toLowerCase().includes('account') ||
//         q.name.toLowerCase().includes('chart') ||
//         q.name.toLowerCase().includes('zcoas')
//       )
//     );
    
//     console.log('🔍 COA-related questions found:', coaQuestions.length);
//     coaQuestions.forEach(q => {
//       console.log(`- ID: ${q.id}, Name: "${q.name}"`);
//     });
    
//     // Try to use question 70 first, or fall back to first available question
//     let questionToUse = 70;
//     const question70Exists = questionsList.some(q => q.id === 70);
    
//     if (!question70Exists && questionsList.length > 0) {
//       questionToUse = questionsList[0].id;
//       console.log(`⚠️ Question 70 not found, using question ${questionToUse} instead`);
//     }
    
//     // Step 3: Query the question data
//     console.log(`📊 Querying question ${questionToUse}...`);
//     const dataResponse = await fetch(`http://localhost:2650/api/card/${questionToUse}/query`, {
//       method: 'POST',
//       headers: {
//         'X-Metabase-Session': sessionToken,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ parameters: [] })
//     });

//     if (!dataResponse.ok) {
//       const errorText = await dataResponse.text();
//       console.error(`❌ Query failed for question ${questionToUse}:`, errorText);
//       throw new Error(`Query failed: ${dataResponse.status}`);
//     }

//     const rawData = await dataResponse.json();
//     console.log('🎉 SUCCESS! Data retrieved');
//     console.log('📊 Raw data summary:');
//     console.log('- Status:', rawData.status);
//     console.log('- Row count:', rawData.data?.rows?.length || 0);
//     console.log('- Column count:', rawData.data?.cols?.length || 0);
    
//     // Log actual data structure
//     if (rawData.data?.rows && rawData.data.rows.length > 0) {
//       console.log('🔍 FIRST 3 ROWS OF YOUR ACTUAL DATA:');
//       rawData.data.rows.slice(0, 3).forEach((row, i) => {
//         console.log(`Row ${i + 1}:`, row);
//       });
      
//       console.log('🔍 COLUMN STRUCTURE:');
//       rawData.data.cols?.forEach((col, i) => {
//         console.log(`${i + 1}. "${col.name}" (Display: "${col.display_name}") - Type: ${col.base_type}`);
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Data retrieved successfully with login authentication!',
//       authMethod: 'session_login',
//       questionUsed: questionToUse,
//       availableQuestions: {
//         total: questionsList.length,
//         coaRelated: coaQuestions.length,
//         question70Exists: question70Exists
//       },
//       data: {
//         columns: rawData.data?.cols?.map(col => ({
//           name: col.name,
//           displayName: col.display_name,
//           type: col.base_type
//         })) || [],
//         firstTenRows: rawData.data?.rows?.slice(0, 10) || [],
//         totalRows: rawData.data?.rows?.length || 0
//       }
//     });

//   } catch (error) {
//     console.error('❌ Main error:', error);
//     return NextResponse.json({
//       error: 'Failed to get COA data',
//       message: error.message,
//       suggestion: 'Check your Metabase login credentials in the code'
//     }, { status: 500 });
//   }
// }




























































// import { NextResponse } from 'next/server';

// async function authenticateWithLogin() {
//   try {
//     console.log('🔐 Authenticating with login...');
    
//     const loginResponse = await fetch('http://localhost:2650/api/session', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: 'samarabbas114433@gmail.com',
//         password: 'metabase/metabase12'
//       })
//     });

//     console.log('📡 Login Status:', loginResponse.status);
    
//     if (!loginResponse.ok) {
//       const errorText = await loginResponse.text();
//       console.error('❌ Login failed:', errorText);
//       throw new Error(`Login failed: ${loginResponse.status}`);
//     }

//     const sessionData = await loginResponse.json();
//     console.log('✅ Login successful! Session ID:', sessionData.id.substring(0, 10) + '...');
    
//     return sessionData.id;
    
//   } catch (error) {
//     console.error('❌ Authentication error:', error);
//     throw error;
//   }
// }

// export async function GET() {
//   try {
//     console.log('🚀 COA Report with Login Authentication');
    
//     // Step 1: Get session token
//     const sessionToken = await authenticateWithLogin();
    
//     // Step 2: List available questions
//     console.log('📋 Listing available questions...');
//     const questionsResponse = await fetch('http://localhost:2650/api/card', {
//       headers: {
//         'X-Metabase-Session': sessionToken,
//         'Content-Type': 'application/json',
//       }
//     });

//     if (!questionsResponse.ok) {
//       throw new Error(`Failed to list questions: ${questionsResponse.status}`);
//     }

//     const questions = await questionsResponse.json();
//     const questionsList = questions.data || questions;
    
//     console.log('✅ Questions retrieved:', questionsList.length);
    
//     // Find COA-related questions
//     const coaQuestions = questionsList.filter(q => 
//       q.name && (
//         q.name.toLowerCase().includes('coa') || 
//         q.name.toLowerCase().includes('account') ||
//         q.name.toLowerCase().includes('chart') ||
//         q.name.toLowerCase().includes('zcoas')
//       )
//     );
    
//     console.log('🔍 COA-related questions found:', coaQuestions.length);
//     coaQuestions.forEach(q => {
//       console.log(`- ID: ${q.id}, Name: "${q.name}"`);
//     });
    
//     // Try to use question 70 first, or fall back to first available question
//     let questionToUse = 70;
//     const question70Exists = questionsList.some(q => q.id === 70);
    
//     if (!question70Exists && questionsList.length > 0) {
//       questionToUse = questionsList[0].id;
//       console.log(`⚠️ Question 70 not found, using question ${questionToUse} instead`);
//     }
    
//     // Step 3: Query the question data
//     console.log(`📊 Querying question ${questionToUse}...`);
//     const dataResponse = await fetch(`http://localhost:2650/api/card/${questionToUse}/query`, {
//       method: 'POST',
//       headers: {
//         'X-Metabase-Session': sessionToken,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ parameters: [] })
//     });

//     if (!dataResponse.ok) {
//       const errorText = await dataResponse.text();
//       console.error(`❌ Query failed for question ${questionToUse}:`, errorText);
//       throw new Error(`Query failed: ${dataResponse.status}`);
//     }

//     const rawData = await dataResponse.json();
//     console.log('🎉 SUCCESS! Data retrieved');
//     console.log('📊 Raw data summary:');
//     console.log('- Status:', rawData.status);
//     console.log('- Total rows:', rawData.data?.rows?.length || 0);
//     console.log('- Total columns:', rawData.data?.cols?.length || 0);
    
//     // ✅ DETAILED ANALYSIS OF FIRST 2 RECORDS WITH ALL FIELDS
//     if (rawData.data?.rows && rawData.data.rows.length > 0) {
//       console.log('🔍 ===== COMPLETE FIELD ANALYSIS =====');
      
//       // Show column structure first
//       console.log('📋 ALL COLUMNS:');
//       rawData.data.cols?.forEach((col, i) => {
//         console.log(`${i + 1}. Field: "${col.name}" | Display: "${col.display_name || 'N/A'}" | Type: ${col.base_type}`);
//       });
      
//       console.log('\n🎯 FIRST 2 RECORDS WITH ALL FIELDS:');
      
//       // Show first 2 records with complete field mapping
//       rawData.data.rows.slice(0, 2).forEach((row, rowIndex) => {
//         console.log(`\n📄 RECORD ${rowIndex + 1}:`);
//         console.log('==================');
        
//         // Map each field value to column name
//         rawData.data.cols?.forEach((col, colIndex) => {
//           const value = row[colIndex];
//           const displayValue = value === null ? 'NULL' : 
//                               value === undefined ? 'UNDEFINED' : 
//                               value === '' ? 'EMPTY_STRING' : 
//                               String(value);
          
//           console.log(`${col.name}: ${displayValue} (${col.display_name})`);
//         });
        
//         console.log('Raw array:', row);
//       });
//       console.log('🔍 ===============================');
//     }

//     // Create detailed response with first 2 records
//     const detailedFirstTwoRecords = rawData.data?.rows?.slice(0, 2).map((row, index) => {
//       const recordObj = {};
//       rawData.data.cols?.forEach((col, colIndex) => {
//         recordObj[col.name] = {
//           value: row[colIndex],
//           displayName: col.display_name,
//           type: col.base_type,
//           isNull: row[colIndex] === null,
//           isEmpty: row[colIndex] === '',
//           isUndefined: row[colIndex] === undefined
//         };
//       });
//       return {
//         recordNumber: index + 1,
//         fields: recordObj,
//         rawArray: row
//       };
//     }) || [];

//     return NextResponse.json({
//       success: true,
//       message: 'First 2 COA records with complete field analysis',
//       authMethod: 'session_login',
//       questionUsed: questionToUse,
      
//       summary: {
//         totalRecords: rawData.data?.rows?.length || 0,
//         totalColumns: rawData.data?.cols?.length || 0,
//         question70Exists: question70Exists
//       },
      
//       columnDefinitions: rawData.data?.cols?.map((col, i) => ({
//         index: i,
//         name: col.name,
//         displayName: col.display_name,
//         type: col.base_type,
//         semanticType: col.semantic_type
//       })) || [],
      
//       // ✅ DETAILED FIRST 2 RECORDS
//       firstTwoRecordsDetailed: detailedFirstTwoRecords,
      
//       // Raw data for reference
//       rawFirstTwoRecords: rawData.data?.rows?.slice(0, 2) || []
//     });

//   } catch (error) {
//     console.error('❌ Main error:', error);
//     return NextResponse.json({
//       error: 'Failed to get COA data',
//       message: error.message,
//       suggestion: 'Check your Metabase login credentials in the code'
//     }, { status: 500 });
//   }
// }
















































import { NextResponse } from 'next/server';

export async function authenticateWithLogin() {
  try {
    console.log('🔐 Authenticating with login...');
    
    const loginResponse = await fetch('http://localhost:2650/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'samarabbas114433@gmail.com',
        password: 'metabase/metabase12'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const sessionData = await loginResponse.json();
    return sessionData.id;
    
  } catch (error) {
    throw error;
  }
}

export async function GET() {
  try {
    console.log('🚀 COA Report - Simple Key-Value Format');
    
    // Step 1: Get session token
    const sessionToken = await authenticateWithLogin();
    
    // Step 2: Query question 70
    console.log(`📊 Querying question 70...`);
    const dataResponse = await fetch(`http://localhost:2650/api/card/103/query`, {
      method: 'POST',
      headers: {
        'X-Metabase-Session': sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parameters: [] })
    });

    if (!dataResponse.ok) {
      throw new Error(`Query failed: ${dataResponse.status}`);
    }

    const rawData = await dataResponse.json();
    console.log(`this is raw data ,amsds dsds ${rawData}`);
    
    // ✅ Convert to simple key-value format
    const records = [];
    
    if (rawData.data?.rows && rawData.data.rows.length > 0) {
      // Take first 2 records and convert to simple objects
      rawData.data.rows.slice(0, 2).forEach((row, index) => {
        const record = {};
        
        // Map each column to its value
        rawData.data.cols?.forEach((col, colIndex) => {
          record[col.name] = row[colIndex];
        });
        
        records.push(record);
        
        // Console log each record in simple format
        console.log(`🎯 Record ${index + 1}:`, record);
      });
    }

    console.log('✅ Total records available:', rawData.data?.rows?.length || 0);
    console.log('📊 Columns count:', rawData.data?.cols?.length || 0);

    return NextResponse.json({
      // raw:rawData.data,
      success: true,
      message: "First 2 COA records in simple key-value format",
      // totalRecords: rawData.data?.rows?.length || 0,
      // totalColumns: rawData.data?.cols?.length || 0,
      
      // // ✅ Simple key-value records
      records: records,
      
      // // Column info (just names for reference)
      // columnNames: rawData.data?.cols?.map(col => col.name) || []
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      error: 'Failed to get COA data',
      message: error.message
    }, { status: 500 });
  }
}
