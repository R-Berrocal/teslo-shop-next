'use server';

import { PayPalOrderStatusResponse } from '@/interfaces';
import prisma from '@/lib/prisma';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken();

  console.log({ authToken });

  if (!authToken) {
    return { ok: false, message: 'No se pudo obtener token de verificacion' };
  }

  const resp = await verifyPayPalPayment(paypalTransactionId, authToken);
  if (!resp) {
    return { ok: false, message: 'No se pudo verificar el pago' };
  }

  const { status, purchase_units } = resp;
  //   const {  } = purchase_units[0];
  if (status !== 'COMPLETED') {
    return { ok: false, message: 'Aún no se ha pagado en PayPal' };
  }
  try {
    await prisma.order.update({
      where: {
        transactionId: paypalTransactionId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '500 - El pago no se pudo realizar',
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_SECRET;
  const ouath2url = process.env.PAYPAL_OAUTH_URL ?? '';
  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
    'utf-8'
  ).toString('base64');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Authorization', `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(ouath2url, {
      ...requestOptions,
      cache: 'no-store',
    }).then((res) => res.json());

    return result.access_token;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    const result = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: 'no-store',
    }).then((response) => response.json());

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
