'use client';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

export const PayPalButton = () => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="animate-pulse mb-40 bg-red-500">
        <div className="h-8 bg-gray-300 rounded" />
        <div className="h-8 bg-gray-300 rounded mt-2" />
      </div>
    );
  }
  return <PayPalButtons />;
};
