// utils/OrderAPI.ts - FIXED to match your backend API
export class OrderAPI {
  private static baseUrl = `http://${window.location.hostname}:4000/api`;

  // ✅ FIXED: Create order with correct data format for YOUR backend
  static async createOrder(orderData: any, orderType: string): Promise<{ success: boolean; message: string; data?: any }> {
    const url = `${this.baseUrl}/order`;
    
    try {
      console.log('📡 POST', url);
      
      // ✅ FIXED: Transform data to match your backend expectations
      const backendData = {
        master: {
          Date: orderData.master.Date,
          COA_ID: Number(orderData.master.COA_ID),
          Next_Status: orderData.master.Next_Status || 'Incomplete',
          // ✅ FIXED: Add the required fields your backend expects
          Stock_Type_ID: orderType === 'purchase' ? 11 : 12, // ✅ This was missing!
          sales_type_Id: orderType === 'purchase' ? 11 : 12   // ✅ Your backend needs this
        },
        details: orderData.details.map((detail: any, index: number) => ({
          Line_Id: index + 1,
          Item_ID: Number(detail.Item_ID),
          Price: Number(detail.Price),
          // Stock In fields
          Stock_In_UOM: detail.Stock_In_UOM ? Number(detail.Stock_In_UOM) : null,
          Stock_In_UOM_Qty: Number(detail.Stock_In_UOM_Qty || 0),
          Stock_SKU_Price: Number(detail.Stock_SKU_Price || 0),
          Stock_In_SKU_UOM: detail.Stock_In_SKU_UOM ? Number(detail.Stock_In_SKU_UOM) : null,
          Stock_In_SKU_UOM_Qty: Number(detail.Stock_In_SKU_UOM_Qty || 0),
          Stock_In_UOM3_Qty: Number(detail.Stock_In_UOM3_Qty || 0),
          // Stock Out fields
          Stock_out_UOM: detail.Stock_out_UOM ? Number(detail.Stock_out_UOM) : null,
          Stock_out_UOM_Qty: Number(detail.Stock_out_UOM_Qty || 0),
          Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM ? Number(detail.Stock_out_SKU_UOM) : null,
          Stock_out_SKU_UOM_Qty: Number(detail.Stock_out_SKU_UOM_Qty || 0),
          Stock_out_UOM3_Qty: Number(detail.Stock_out_UOM3_Qty || 0),
          // ✅ CRITICAL: UOM fields that your backend now expects
          uom1_qty: Number(detail.uom1_qty || 0),
          uom2_qty: Number(detail.uom2_qty || 0),
          uom3_qty: Number(detail.uom3_qty || 0),
          sale_unit: detail.sale_unit || 'uomTwo',
          // Discount fields
          Discount_A: Number(detail.Discount_A || 0),
          Discount_B: Number(detail.Discount_B || 0),
          Discount_C: Number(detail.Discount_C || 0),
          // Other fields
          Goods: detail.Goods || '',
          Remarks: detail.Remarks || ''
        }))
      };

      console.log('📝 Sending data to YOUR backend:', {
        masterFields: Object.keys(backendData.master),
        Stock_Type_ID: backendData.master.Stock_Type_ID,
        sales_type_Id: backendData.master.sales_type_Id,
        detailsCount: backendData.details.length,
        sampleDetail: backendData.details[0]
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      console.log(`📡 Response status: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Order created successfully:`, result);
        
        return {
          success: true,
          message: `${orderType} order created successfully!`,
          data: result.data || result
        };
      } else {
        const errorData = await response.json().catch(async () => {
          const text = await response.text();
          return { message: text };
        });
        console.error(`❌ Create failed:`, errorData);
        
        return {
          success: false,
          message: errorData.message || `Failed to create order: ${response.status}`
        };
      }
    } catch (error: any) {
      console.error('❌ Network error:', error);
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  }

  // ✅ FIXED: Update order
  static async updateOrder(orderData: any, orderId: string): Promise<{ success: boolean; message: string; data?: any }> {
    const url = `${this.baseUrl}/order/${orderId}`;
    
    try {
      console.log('📡 PUT', url);
      
      const backendData = {
        master: {
          Date: orderData.master.Date,
          COA_ID: Number(orderData.master.COA_ID),
          Next_Status: orderData.master.Next_Status || 'Incomplete',
          Stock_Type_ID: orderData.master.orderType === 'purchase' ? 11 : 12,
          sales_type_Id: orderData.master.orderType === 'purchase' ? 11 : 12
        },
        details: orderData.details
      };
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: 'Order updated successfully!',
          data: result.data || result
        };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        return {
          success: false,
          message: errorData.message || `Failed to update order: ${response.status}`
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  }

  // ✅ FIXED: Fetch order
  static async fetchOrder(orderId: string): Promise<{ success: boolean; data?: any; message: string }> {
    const url = `${this.baseUrl}/order/${orderId}`;
    
    try {
      console.log('📡 GET', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Order fetched:`, result);
        
        if (result.success && result.data) {
          return {
            success: true,
            data: result.data,
            message: 'Order fetched successfully'
          };
        }
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Order not found' }));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch order'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  }

  // Keep existing fetchAllData and fetchAllCOA methods...
  static async fetchAllData(orderType: string) {
    try {
      const [itemsRes, accountsRes, uomsRes] = await Promise.all([
        fetch(`${this.baseUrl}/z-items/items`),
        fetch(`${this.baseUrl}/z-coa/${orderType === 'purchase' ? 'by-coa-type-supplier' : 'by-coa-type-customer'}`),
        fetch(`${this.baseUrl}/z-uom/get`)
      ]);

      const itemsData = await itemsRes.json();
      const accountsData = await accountsRes.json();
      const uomsData = await uomsRes.json();

      return {
        items: itemsData.success ? itemsData.data : [],
        accounts: accountsData.success ? accountsData.data : [],
        uoms: uomsData.data || []
      };
    } catch (error) {
      console.error('Error fetching master data:', error);
      return { items: [], accounts: [], uoms: [] };
    }
  }

  static async fetchAllCOA() {
    try {
      const response = await fetch(`${this.baseUrl}/z-coa/get`);
      const result = await response.json();
      return result.success ? result.zCoaRecords || [] : [];
    } catch (error) {
      console.error('Error fetching all COA:', error);
      return [];
    }
  }
}
