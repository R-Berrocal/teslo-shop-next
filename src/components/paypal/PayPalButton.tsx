'use client';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from '@paypal/paypal-js';
import { paypalCheckPayment, setTransactionId } from '@/actions';

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

    const { ok } = await setTransactionId(orderId, transactionId);
    if (!ok) {
      throw new Error('No se pudo actualizar la orden');
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    console.log('onApprove - transaction was approved, but not authorized');
    const details = await actions.order?.capture();
    if (!details || !details.id) return;
    await paypalCheckPayment(details.id);
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
