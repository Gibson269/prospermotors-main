import { useState } from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
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

  let config;
  try {
    config = createPaymentConfig(
      amount,
      customerEmail,
      customerPhone,
      customerName,
      orderId
    );
  } catch (error: any) {
    console.error('[FlutterWavePayment] Config error:', error);
    return (
      <Button disabled className="w-full bg-red-100 text-red-900">
        Config Error
      </Button>
    );
  }

  const fwConfig = {
    ...config,
    text: 'Pay Now',
    callback: (response: any) => {
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
  };

  return (
    <div className="w-full">
      <FlutterWaveButton
        {...fwConfig}
        className={`w-full h-12 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled || isProcessing}
      />
    </div>
  );
};

export default FlutterWavePayment;
