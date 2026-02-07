import { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { CreditCard, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createPaymentConfig, handleFlutterWaveResponse, verifyPayment } from '@/services/paymentService';

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
  disabled = false,
}: FlutterWavePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const config = createPaymentConfig(
    amount,
    customerEmail,
    customerPhone,
    customerName,
    orderId
  );

  const handleFlutterwave = useFlutterwave(config);

  const handlePaymentClick = async () => {
    if (!customerEmail || !customerPhone || !customerName) {
      toast.error('Please fill in all customer information');
      onError('Missing customer information');
      return;
    }

    if (amount <= 0) {
      toast.error('Invalid amount');
      onError('Invalid payment amount');
      return;
    }

    setIsProcessing(true);

    try {
      const handleSuccess = async (response: any) => {
        try {
          setIsProcessing(false);
          const result = handleFlutterWaveResponse(response);

          if (result.status === 'success') {
            // Verify payment on backend
            const verified = await verifyPayment(result.transactionId || '');
            
            if (verified) {
              toast.success('Payment successful! Transaction ID: ' + result.transactionId);
              onSuccess(result.transactionId || '', result.reference || '');
            } else {
              toast.error('Payment verification failed');
              onError('Payment verification failed');
            }
          } else if (result.status === 'cancelled') {
            toast.info('Payment cancelled');
            onError('Payment cancelled by user');
          } else {
            toast.error(result.message || 'Payment failed');
            onError(result.message || 'Payment failed');
          }

          closePaymentModal();
        } catch (error) {
          console.error('Payment processing error:', error);
          toast.error('Error processing payment');
          onError('Error processing payment response');
          setIsProcessing(false);
        }
      };

      handleFlutterwave({
        onSuccess: handleSuccess,
        onClose() {
          setIsProcessing(false);
          toast.info('Payment modal closed');
        },
      } as any);
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Error initiating payment');
      onError('Error initiating payment');
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePaymentClick}
      disabled={disabled || isProcessing || amount <= 0}
      className="btn-gold w-full"
      size="lg"
    >
      {isProcessing ? (
        <>
          <Loader className="mr-2 h-5 w-5 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Pay with Flutterwave
        </>
      )}
    </Button>
  );
};

export default FlutterWavePayment;
