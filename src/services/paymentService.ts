import { FlutterWaveResponse } from 'flutterwave-react-v3';

export interface PaymentConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  meta?: {
    orderId?: string;
    userId?: string;
  };
  redirect_url?: string;
}

export interface PaymentResult {
  status: 'success' | 'failed' | 'cancelled';
  transactionId?: string;
  reference?: string;
  amount?: number;
  currency?: string;
  message?: string;
}

export const createPaymentConfig = (
  amount: number,
  customerEmail: string,
  customerPhone: string,
  customerName: string,
  orderId?: string
): PaymentConfig => {
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
  
  if (!publicKey) {
    throw new Error('Flutterwave public key is not configured');
  }

  // Generate unique transaction reference
  const txRef = `PM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Validate amount
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  console.log('[PaymentService] Creating payment config:', {
    amount,
    currency: 'NGN',
    customerEmail,
    customerName,
    txRef,
  });

  return {
    public_key: publicKey,
    tx_ref: txRef,
    amount: amount, // Flutterwave handles decimal amounts
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd,bank_transfer',
    customer: {
      email: customerEmail,
      phone_number: customerPhone,
      name: customerName,
    },
    customizations: {
      title: 'Prosperous Motors',
      description: 'Premium Luxury Vehicle Purchase',
      logo: 'https://prospermotors.com/assets/logo.png', // Update to your actual domain
    },
    meta: {
      orderId: orderId,
    },
  };
};

export const handleFlutterWaveResponse = (response: FlutterWaveResponse): PaymentResult => {
  console.log('[PaymentService] Handling Flutterwave response:', {
    status: response?.status,
    txRef: response?.tx_ref,
    amount: response?.amount,
  });

  if (!response) {
    return {
      status: 'cancelled',
      message: 'Payment was cancelled',
    };
  }

  // Check for success (Flutterwave uses 'successful')
  if (response.status === 'successful' || response.status === 'success') {
    console.log('[PaymentService] Payment successful, transaction ID:', response.transaction_id);
    return {
      status: 'success',
      transactionId: response.transaction_id?.toString(),
      reference: response.tx_ref,
      amount: response.amount,
      currency: response.currency,
      message: 'Payment successful',
    };
  } else if (response.status === 'failed') {
    console.error('[PaymentService] Payment failed:', response.message);
    return {
      status: 'failed',
      reference: response.tx_ref,
      message: response.message || 'Payment failed',
    };
  } else if (response.status === 'cancelled') {
    console.log('[PaymentService] Payment cancelled by user');
    return {
      status: 'cancelled',
      message: 'Payment was cancelled by user',
    };
  }

  console.warn('[PaymentService] Unknown payment status:', response.status);
  return {
    status: 'failed',
    message: `Unknown payment status: ${response.status}`,
  };
};

/**
 * Verify payment on your backend
 * This should be called after successful payment to confirm
 */
export const verifyPayment = async (transactionId: string): Promise<boolean> => {
  try {
    // This would call your backend API
    // const response = await fetch('/api/verify-payment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ transactionId }),
    // });
    // return response.ok;
    
    // For now, return true - implement backend verification
    console.log('Verifying payment:', transactionId);
    return true;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};
