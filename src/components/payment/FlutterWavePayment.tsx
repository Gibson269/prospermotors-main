import { useState, useMemo } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { createPaymentConfig, handleFlutterWaveResponse } from '@/services/paymentService';
import { toast } from 'sonner';

interface FlutterWavePaymentProps {
  amount: number;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  orderId?: string;
  onSuccess: (transactionId: string, reference: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const FlutterWavePayment = ({
  amount,
  customerEmail,
  customerPhone,
  customerName,
  orderId,
  onSuccess,
  onError,
  disabled,
}: FlutterWavePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate config based on input, memoized to prevent constant re-generation
  const paymentConfig = useMemo(() => {
    try {
      if (amount && customerEmail && customerPhone && customerName) {
        return {
          config: createPaymentConfig(
            amount,
            customerEmail,
            customerPhone,
            customerName,
            orderId
          ),
          error: null
        };
      }
    } catch (error: any) {
      console.error('Config gen error:', error);
      return { config: null, error: error.message };
    }
    return { config: null, error: null };
  }, [amount, customerEmail, customerPhone, customerName, orderId]);

  const { config, error: configError } = paymentConfig;

  // Hook must be called unconditionally with a config object.
  const fallbackConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-SANDBOX',
    tx_ref: `PM-UNKNOWN-${Date.now()}`,
    amount: 0,
    currency: 'NGN',
    payment_options: 'card',
    customer: { email: 'placeholder@example.com', phone_number: '0000000000', name: 'Placeholder' },
    customizations: { title: '', description: '', logo: '' }
  };

  const handleFlutterPayment = useFlutterwave(config || fallbackConfig);

  const onPayClick = () => {
    if (configError) {
      toast.error('Payment Config Error: ' + configError);
      return;
    }
    if (!config) {
      toast.error('Please complete all fields first.');
      return;
    }

    setIsProcessing(true);
    console.log('[FlutterWavePayment] Initiating payment with config:', {
      amount: config.amount,
      email: config.customer.email,
      tx_ref: config.tx_ref,
      publicKeyPrefix: config.public_key?.substring(0, 8),
    });

    handleFlutterPayment({
      callback: (response) => {
        console.log('[FlutterWavePayment] Callback received:', response);
        const result = handleFlutterWaveResponse(response);

        closePaymentModal(); // Ensure modal closes
        setIsProcessing(false);

        if (result.status === 'success' && result.transactionId && result.reference) {
          onSuccess(result.transactionId, result.reference);
        } else if (result.status === 'cancelled') {
          toast.info('Payment cancelled');
        } else {
          onError(result.message || 'Payment failed');
          toast.error(result.message || 'Payment failed');
        }
      },
      onClose: () => {
        console.log('[FlutterWavePayment] Modal closed');
        setIsProcessing(false);
      },
    });
  };

  if (configError) {
    return (
      <Button disabled className="w-full bg-red-100 text-red-900 border border-red-200">
        Config Error: {configError}
      </Button>
    );
  }

  return (
    <div className="w-full">
      <Button
        onClick={onPayClick}
        disabled={disabled || isProcessing || !config}
        className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>
    </div>
  );
};

export default FlutterWavePayment;
