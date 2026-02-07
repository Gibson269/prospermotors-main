# Flutterwave Payment Integration Guide

## Overview

This guide covers complete Flutterwave integration for Prosperous Motors, including setup, configuration, testing, troubleshooting, and production deployment.

## Current Implementation

### Architecture

```
User clicks "Pay Now" in CarDetail.tsx
         ↓
Payment modal opens with customer info form
         ↓
User enters: Name, Email, Phone, Amount (full price)
         ↓
FlutterWavePayment component initializes Flutterwave modal
         ↓
User completes payment in Flutterwave UI
         ↓
handleFlutterWaveResponse() processes response
         ↓
Creates order and redirects on success
```

### Key Files

- **Payment Config**: `src/services/paymentService.ts`
- **Payment Component**: `src/components/payment/FlutterWavePayment.tsx`
- **Payment Trigger**: `src/pages/CarDetail.tsx` (Pay Now button)

## Getting Started

### Step 1: Create Flutterwave Account

1. Go to: https://dashboard.flutterwave.com/signup
2. Sign up with email
3. Verify email address
4. Complete business information
5. Dashboard access granted

### Step 2: Get Your API Keys

#### Test Keys (Development)

1. Login to: https://dashboard.flutterwave.com
2. Navigate to: Settings → API Keys
3. Copy **Test Public Key** (starts with `FLWPUBK_TEST_...`)
4. Copy **Test Secret Key** (starts with `FLWSK_TEST_...`)

#### Live Keys (Production)

⚠️ **Don't use yet** - switch after testing completely

1. Navigate to: Settings → API Keys
2. Click "Go Live" (requires business verification)
3. Copy **Live Public Key** (starts with `FLWPUBK_...`)
4. Copy **Live Secret Key** (starts with `FLWSK_...`)

### Step 3: Configure Environment Variables

Create or update `.env`:

```env
# Test Keys (Development)
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_xxxxxxxxxxxxxxxxxxxxx

# Backend (server only - for webhook verification)
FLUTTERWAVE_SECRET_KEY=FLWSK_TEST_xxxxxxxxxxxxxxxxxxxxx
```

**❌ NEVER share these keys in:**
- Git commits
- Code comments
- Slack/Email
- Frontend code

**✅ Store in:**
- `.env` file (add to `.gitignore`)
- Server environment variables
- CI/CD secrets (GitHub Actions, Vercel, etc.)

### Step 4: Install Dependencies

```bash
npm install flutterwave-react-v3
npm install -D @types/flutterwave-react-v3
```

## Configuration Details

### Payment Config Structure

```typescript
// src/services/paymentService.ts

export interface PaymentConfig {
  public_key: string;           // Your Flutterwave public key
  tx_ref: string;               // Unique transaction reference
  amount: number;               // Amount in NGN (Nigerian Naira)
  currency: string;             // 'NGN', 'GHS', 'KES', 'UGX', 'ZAR'
  payment_options: string;      // 'card,mobilemoney,ussd,bank_transfer'
  customer: {
    email: string;              // Customer email
    phone_number: string;       // Customer phone with country code
    name: string;               // Customer full name
  };
  customizations: {
    title: string;              // Payment modal title
    description: string;        // Payment description
    logo: string;               // Company logo URL
  };
  meta?: {
    orderId?: string;           // Your internal order ID
    userId?: string;            // Your internal user ID
  };
  redirect_url?: string;        // Post-payment redirect URL
}
```

### Current Payment Config

```typescript
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

  return {
    public_key: publicKey,
    tx_ref: txRef,
    amount: amount,  // Flutterwave handles decimals
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
      logo: 'https://prospermotors.com/assets/logo.png',
    },
    meta: {
      orderId: orderId,
    },
  };
};
```

## Payment Response Handling

### Response Status Values

Flutterwave returns different statuses:

```typescript
response.status can be:
- 'successful' ✅ Payment completed
- 'success'    ✅ Alternative success status
- 'failed'     ❌ Payment declined
- 'cancelled'  ❌ User cancelled
- 'pending'    ⏳ Awaiting processing
```

### Current Response Handler

```typescript
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

  // Check for success (handles both 'successful' and 'success')
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
```

## Testing Payment Flow

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Navigate to Shop

1. Go to http://localhost:5173/shop
2. Click on any vehicle card
3. Click "View Details"

### Step 3: Click "Pay Now"

1. Payment modal opens
2. Enter test details:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Phone**: +234801234567
3. Click "Pay Now (Full Amount)"

### Step 4: Complete Test Payment

Flutterwave modal opens with test card form:

#### Test Cards - Always Use These

**Successful Payment:**
- Card: `4239` `9500` `0123` `4567`
- Expiry: `09/32`
- CVV: `812`
- PIN: `1234`
- OTP: `12345`

**Failed Payment:**
- Card: `5531` `8866` `5515` `2950`
- Expiry: `09/32`
- CVV: `812`
- PIN: `1234`
- OTP: `wrong`

### Step 5: Verify Success

After payment:

1. **Check Console** (F12 → Console):
   ```
   [PaymentService] Handling Flutterwave response: {
     status: 'successful',
     txRef: 'PM-123456789...',
     amount: 5000000
   }
   [PaymentService] Payment successful, transaction ID: 123456789
   ```

2. **Check Flutterwave Dashboard**:
   - Go to Transactions
   - Should see your test transaction
   - Status: Success or Completed

3. **Check Database** (Supabase Dashboard):
   - Go to SQL Editor
   - Run: `SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;`
   - Should see new order record

## Troubleshooting

### Problem: "Flutterwave public key is not configured"

**Cause**: Missing environment variable
**Fix**:
```bash
# 1. Check .env file exists
cat .env | grep VITE_FLUTTERWAVE_PUBLIC_KEY

# 2. Restart dev server
npm run dev

# 3. Verify in browser console
console.log(import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY)
// Should be: FLWPUBK_TEST_...
```

### Problem: Payment Modal Doesn't Open

**Cause 1**: Missing VITE_FLUTTERWAVE_PUBLIC_KEY
**Fix**: Check above

**Cause 2**: Invalid amount (0 or negative)
**Fix**:
```typescript
// In CarDetail.tsx, verify price is valid
console.log('[CarDetail] Payment amount:', car.price);
if (car.price <= 0) {
  toast.error('Invalid vehicle price');
  return;
}
```

**Cause 3**: JavaScript error in payment component
**Fix**: Check browser console for errors

### Problem: "Unknown payment status"

**Cause**: Flutterwave returned unexpected status
**Fix**:
```typescript
// Add logging to identify actual status
console.log('[DEBUG] Response object:', response);
console.log('[DEBUG] Status value:', response?.status);
console.log('[DEBUG] All response keys:', Object.keys(response || {}));
```

### Problem: Payment Shows as Success But Order Not Created

**Cause 1**: Order creation code not implemented
**Current Issue**: CarDetail.tsx redirects without creating order
**Fix** - Add this to CarDetail.tsx:

```typescript
const handlePaymentSuccess = async (result: PaymentResult) => {
  try {
    // 1. Create order in database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        vehicle_id: car.id,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        amount: car.price,
        currency: 'NGN',
        payment_status: 'completed',
        flutterwave_reference: result.reference,
        flutterwave_transaction_id: result.transactionId,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('[CarDetail] Order creation failed:', error);
      toast.error('Payment successful but order creation failed');
      return;
    }

    console.log('[CarDetail] Order created:', order[0].id);
    
    // 2. Send confirmation email
    await sendOrderConfirmationEmail(customerInfo.email, {
      orderId: order[0].id,
      vehicleTitle: car.title,
      amount: car.price,
      reference: result.reference,
    });

    // 3. Redirect to confirmation
    toast.success('Payment successful! Order created.');
    navigate('/order-confirmation', { 
      state: { orderId: order[0].id } 
    });

  } catch (error) {
    console.error('[CarDetail] Payment post-processing failed:', error);
    toast.error('An error occurred. Please contact support.');
  }
};
```

### Problem: Test Card Declined

**Causes**:
- Wrong card number
- Wrong expiry
- Wrong CVV
- Wrong PIN/OTP

**Fix**:
```
Use EXACTLY:
4239 9500 0123 4567  (Success)
09/32
812
1234
12345
```

### Problem: "Invalid currency code"

**Fix**:
```typescript
// Valid Flutterwave currencies:
const VALID_CURRENCIES = [
  'NGN',  // Nigerian Naira (default)
  'GHS',  // Ghanaian Cedi
  'KES',  // Kenyan Shilling
  'UGX',  // Ugandan Shilling
  'ZAR',  // South African Rand
  'USD',  // US Dollar
  'GBP',  // British Pound
  'EUR',  // Euro
];

// In paymentService.ts:
if (!VALID_CURRENCIES.includes(currency)) {
  throw new Error(`Invalid currency: ${currency}`);
}
```

### Problem: CORS Error When Testing

**Cause**: Browser security blocking Flutterwave
**Fix**: Ensure HTTPS in production
```typescript
// Flutterwave requires HTTPS for production
if (import.meta.env.PROD && window.location.protocol !== 'https:') {
  window.location.protocol = 'https:';
}
```

## Advanced Topics

### Webhook Verification

Flutterwave sends webhooks for payment confirmations:

```typescript
// Backend endpoint to verify payments
app.post('/api/webhook/flutterwave', express.json(), async (req, res) => {
  const payload = req.body;
  const hash = req.headers['verifi-hash'];
  
  // Verify webhook authenticity
  const computedHash = hmac('sha256', process.env.FLUTTERWAVE_SECRET_KEY, JSON.stringify(payload));
  
  if (hash !== computedHash) {
    return res.status(401).json({ error: 'Invalid webhook' });
  }
  
  // Process payment confirmation
  if (payload.status === 'successful') {
    // Update order status
    await supabase
      .from('orders')
      .update({ payment_verified: true })
      .eq('flutterwave_reference', payload.tx_ref);
  }
  
  res.json({ status: 'ok' });
});
```

### Refund Processing

```typescript
const refundPayment = async (transactionId: string) => {
  const response = await fetch('https://api.flutterwave.com/v3/transactions/' + transactionId + '/refund', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: refundAmount,
    }),
  });

  return response.json();
};
```

### Transaction History

```typescript
const getTransactionHistory = async () => {
  const response = await fetch('https://api.flutterwave.com/v3/transactions', {
    headers: {
      'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
    },
  });

  const data = await response.json();
  return data.data; // Array of transactions
};
```

## Production Checklist

Before going live:

- [ ] Test all payment flows in test environment
- [ ] Switch to Live API keys (FLWPUBK_... and FLWSK_...)
- [ ] Update `.env` with live keys
- [ ] Enable HTTPS on production domain
- [ ] Set up webhook endpoint for payment verification
- [ ] Configure order creation on payment success
- [ ] Test refund process
- [ ] Monitor transaction logs daily
- [ ] Set up payment failure alerts
- [ ] Document payment troubleshooting for support team
- [ ] Verify order confirmation emails are sending
- [ ] Test with real payment methods (card, mobile money, bank transfer)

## Switching from Test to Live

### Step 1: Get Live Keys

1. Login to Flutterwave Dashboard
2. Settings → API Keys → Go Live
3. Complete business verification
4. Copy **Live Public Key**

### Step 2: Update .env

```env
# Before (test)
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_xxx

# After (live)
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_xxx
```

### Step 3: Rebuild and Deploy

```bash
npm run build
npm run deploy  # or your deployment command
```

### Step 4: Monitor Dashboard

Watch Flutterwave Dashboard for real transactions

## Support & Resources

- **Flutterwave Docs**: https://developer.flutterwave.com
- **API Reference**: https://developer.flutterwave.com/reference
- **Test Cards**: https://developer.flutterwave.com/docs/testing
- **Dashboard**: https://dashboard.flutterwave.com
- **Support Email**: support@flutterwave.com
- **Chat Support**: Available in dashboard

## Key Points Summary

✅ **Setup**:
- Create account and get test keys
- Add VITE_FLUTTERWAVE_PUBLIC_KEY to `.env`
- Install `flutterwave-react-v3` library

✅ **Configuration**:
- Create PaymentConfig with customer info
- Handle response with proper status checking
- Implement order creation on success

✅ **Testing**:
- Use test cards provided by Flutterwave
- Monitor console logs with [PaymentService] prefix
- Check Flutterwave Dashboard for transactions

✅ **Troubleshooting**:
- Check environment variables
- Verify console for errors
- Check database for order records
- Review Flutterwave Dashboard

✅ **Production**:
- Switch to live keys
- Enable HTTPS
- Set up webhook verification
- Monitor transactions daily

---

**Last Updated:** January 2025
**Review Schedule:** Monthly
