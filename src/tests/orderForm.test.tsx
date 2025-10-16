// __tests__/orderForm.test.tsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockOrderData } from '@/utils/testUtils';
import UnifiedOrderForm from '@/components/UnifiedOrderForm';

describe('UnifiedOrderForm', () => {
  it('renders sales order form correctly', () => {
    render(<UnifiedOrderForm orderType="sales" />);
    
    expect(screen.getByText(/Create Sales Order/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Customer/i)).toBeInTheDocument();
  });

  it('renders purchase order form correctly', () => {
    render(<UnifiedOrderForm orderType="purchase" />);
    
    expect(screen.getByText(/Create Purchase Order/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Supplier/i)).toBeInTheDocument();
  });

  it('validates required fields', () => {
    const { store } = render(<UnifiedOrderForm orderType="sales" />);
    
    // Try to submit without required fields
    const submitButton = screen.getByRole('button', { name: /submit order/i });
    
    // Button should be disabled initially
    expect(submitButton).toBeDisabled();
  });

  it('calculates totals correctly', async () => {
    const preloadedState = {
      order: {
        master: mockOrderData.master,
        details: [mockOrderData.detail],
        isEditMode: false,
        editId: null,
        loading: { saving: false, fetching: false },
        error: null,
        expandedRows: new Set([0]),
      },
      calculation: {
        totals: {
          grossTotal: 100,
          netTotal: 100,
          totalDiscount: 0,
          grandTotal: 100,
          itemCount: 1,
        },
        calculations: {},
      },
    };

    const { store } = render(<UnifiedOrderForm orderType="sales" />, {
      preloadedState: preloadedState as any,
    });

    // Check if totals are displayed correctly
    await waitFor(() => {
      expect(screen.getByText(/₨100/)).toBeInTheDocument();
    });
  });
});
