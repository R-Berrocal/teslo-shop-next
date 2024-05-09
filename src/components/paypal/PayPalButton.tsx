'use client';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CreateOrderData, CreateOrderActions } from '@paypal/paypal-js';

interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse mb-[58px]">
        <div className="h-8 bg-gray-300 rounded" />
        <div className="h-8 bg-gray-300 rounded mt-2" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          //   invoice_id: 'order_id',
          amount: {
            value: `${roundedAmount}`,
            currency_code: `USD`,
          },
        },
      ],
    });

    console.log({ transactionId });

    return transactionId;
  };

  return <PayPalButtons createOrder={createOrder} />;
};
