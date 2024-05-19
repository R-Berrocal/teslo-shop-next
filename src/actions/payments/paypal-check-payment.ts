'use server';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken();

  console.log({ authToken });

  if (!authToken) {
    return { ok: false, message: 'No se pudo obtener token de verificacion' };
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
    const result = await fetch(ouath2url, requestOptions).then((res) =>
      res.json()
    );

    return result.access_token;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};
