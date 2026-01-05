// // services/orderAPI.ts
// import { OrderMaster, OrderDetail } from '@/store/slice/orderSlice';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

// // Types for API responses
// interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
// }

// // Order API service
// export class OrderAPIService {
  
//   // Create new order
//   static async createOrder(master: OrderMaster, details: OrderDetail[]): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-order/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ master, details }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Create order error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Update existing order
//   static async updateOrder(id: string, master: OrderMaster, details: OrderDetail[]): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-order/update/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ master, details }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Update order error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get order by ID
//   static async getOrderById(id: string): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-order/${id}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get order error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Delete order
//   static async deleteOrder(id: string): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-order/delete/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Delete order error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get all orders with pagination
//   static async getOrders(page: number = 1, limit: number = 10, orderType?: 'sales' | 'purchase'): Promise<ApiResponse> {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         ...(orderType && { orderType }),
//       });

//       const response = await fetch(`${API_BASE_URL}/z-order/list?${params}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get orders error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }
// }

// // Items API service
// export class ItemsAPIService {
  
//   // Get all items
//   static async getItems(): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-items/items`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get items error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get item by ID with UOM data
//   static async getItemById(id: number): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-items/items/${id}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get item by ID error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get UOMs
//   static async getUOMs(): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-uom/get`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get UOMs error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get classification data
//   static async getClassificationData(): Promise<ApiResponse> {
//     try {
//       const [class1Res, class2Res, class3Res, class4Res] = await Promise.all([
//         fetch(`${API_BASE_URL}/z-item-class1/get`),
//         fetch(`${API_BASE_URL}/z-item-class2/get`),
//         fetch(`${API_BASE_URL}/z-item-class3/get`),
//         fetch(`${API_BASE_URL}/z-item-class4/get`),
//       ]);

//       const [class1Data, class2Data, class3Data, class4Data] = await Promise.all([
//         class1Res.json(),
//         class2Res.json(),
//         class3Res.json(),
//         class4Res.json(),
//       ]);

//       return {
//         success: true,
//         data: {
//           class1: class1Data.data || [],
//           class2: class2Data.data || [],
//           class3: class3Data.data || [],
//           class4: class4Data.data || [],
//         },
//       };
//     } catch (error) {
//       console.error('Get classification data error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }
// }

// // Accounts API service
// export class AccountsAPIService {
  
//   // Get accounts by type (customer/supplier specific as requested)
//   static async getAccountsByType(orderType: 'sales' | 'purchase'): Promise<ApiResponse> {
//     try {
//       const endpoint = orderType === 'purchase' 
//         ? 'by-coa-type-supplier'   // Your requested supplier endpoint
//         : 'by-coa-type-customer';  // Your requested customer endpoint
      
//       const response = await fetch(`${API_BASE_URL}/z-coa/${endpoint}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get accounts by type error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get all accounts (for "Show All COA" functionality)
//   static async getAllAccounts(): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-coa/get`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
      
//       return {
//         success: true,
//         data: result.zCoaRecords || [],
//       };
//     } catch (error) {
//       console.error('Get all accounts error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get carriage accounts
//   static async getCarriageAccounts(): Promise<ApiResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/z-coa/by-coa-type-carriage`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get carriage accounts error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }
// }

// // Export a combined API service
// export const APIService = {
//   orders: OrderAPIService,
//   items: ItemsAPIService,
//   accounts: AccountsAPIService,
// };

// export default APIService;
