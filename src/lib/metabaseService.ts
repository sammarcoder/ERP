// export class MetabaseService {
//   private baseURL = 'http://localhost:2650/api';
//   private apiKey = 'mb_3g8oJAg4G3nsLJQuOqnKPmwTflkug+wqKHP/lNBIJ8c=';

//   async getCoaData(filters = {}) {
//     try {
//       const response = await fetch(`${this.baseURL}/card/70/query`, {
//         method: 'POST',
//         headers: {
//           'X-Metabase-API-Key': this.apiKey,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ parameters: [] })
//       });

//       const data = await response.json();
//       console.log('✅ Metabase data:', data);
      
//       return {
//         success: true,
//         rows: data.data.rows,
//         columns: data.data.cols
//       };
//     } catch (error) {
//       console.error('❌ Metabase error:', error);
//       return { success: false, error: error.message };
//     }
//   }
// }

// export const metabase = new MetabaseService();








































// // this is nested data 


// class MetabaseService {
//   private baseURL = 'http://localhost:2650/api';
//   private sessionToken: string | null = null;

//   async authenticate() {
//     try {
//       const response = await fetch(`${this.baseURL}/session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: 'samarabbas114433@gmail.com',
//           password: 'metabase/metabase12'
//         })
//       });

//       if (!response.ok) throw new Error(`Login failed: ${response.status}`);
      
//       const data = await response.json();
//       this.sessionToken = data.id;
//       console.log('✅ Metabase authenticated');
//       return this.sessionToken;
//     } catch (error) {
//       console.error('❌ Auth failed:', error);
//       throw error;
//     }
//   }

//   async getQuestionData(questionId: number) {
//     if (!this.sessionToken) await this.authenticate();

//     try {
//       console.log(`🔄 Fetching question ${questionId}...`);
      
//       const response = await fetch(`${this.baseURL}/card/${questionId}/query`, {
//         method: 'POST',
//         headers: {
//           'X-Metabase-Session': this.sessionToken,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ parameters: [] })
//       });

//       if (!response.ok) {
//         throw new Error(`Query failed: ${response.status}`);
//       }

//       const rawData = await response.json();
//       console.log('✅ Data received:', rawData.data?.rows?.length, 'rows');
      
//       // Convert to simple key-value format
//       const flatRecords: any[] = [];
//       if (rawData.data?.rows) {
//         rawData.data.rows.forEach((row: any) => {
//           const record: any = {};
//           rawData.data.cols?.forEach((col: any, index: number) => {
//             record[col.name] = row[index];
//           });
//           flatRecords.push(record);
//         });
//       }

//       return { success: true, data: flatRecords };
      
//     } catch (error: any) {
//       console.error('❌ Query failed:', error);
//       return { success: false, error: error.message };
//     }
//   }
// }

// export const metabaseService = new MetabaseService();
// export default metabaseService;









































class MetabaseService {
  private baseURL = 'http://localhost:2650/api';
  private sessionToken: string | null = null;

  async authenticate() {
    const response = await fetch(`${this.baseURL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'samarabbas114433@gmail.com',
        password: 'metabase/metabase12'
      })
    });

    if (!response.ok) throw new Error('Login failed');
    
    const { id } = await response.json();
    this.sessionToken = id;
    return id;
  }

  async getQuestionData(questionId: number) {
    if (!this.sessionToken) await this.authenticate();

    const response = await fetch(`${this.baseURL}/card/${questionId}/query`, {
      method: 'POST',
      headers: {
        'X-Metabase-Session': this.sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parameters: [] })
    });

    if (!response.ok) throw new Error(`Query failed: ${response.status}`);
    
    return await response.json();
  }
}

export default new MetabaseService();
