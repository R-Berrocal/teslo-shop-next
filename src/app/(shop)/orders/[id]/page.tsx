import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import { IoCardOutline } from 'react-icons/io5';
import { getOrderById } from '@/actions';
import { Title } from '@/components';
import { currencyFormat } from '@/utils';

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok || !order) {
    redirect('/');
  }

  // TODO: llamar el server action
  // TODO: Verificar
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[700px] ">
        <Title title={`Orden #${id.split('-').at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* carrito */}

          <div className="flex flex-col mt-5">
            {/* Items */}
            {order.OrderItem.map((orderItem) => (
              <div key={orderItem.id} className="flex mb-5">
                <Image
                  src={`/products/${orderItem.product.ProductImage[0].url}`}
                  alt={orderItem.product.title}
                  width={120}
                  height={120}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{orderItem.product.title}</p>
                  <p>
                    ${orderItem.price} x {orderItem.quantity}
                  </p>
                  <p className="font-bold">
                    Sub total:
                    {currencyFormat(orderItem.price * orderItem.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>

            <div className="mb-10">
              <p className="text-xl">
                {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
              </p>
              <p>
                {order.OrderAddress?.address} {order.OrderAddress?.address2}
              </p>

              <p>
                {order.OrderAddress?.country.name} - {order.OrderAddress?.city}{' '}
              </p>
              <p>CP {order.OrderAddress?.postalCode}</p>
              <p>CEL. {order.OrderAddress?.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-300 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order.itemsInOrder}{' '}
                {order.itemsInOrder > 1 ? 'articulos' : 'articulo'}
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order.subTotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order.tax)}</span>

              <span className="text-2xl mt-5">Total: </span>
              <span className="text-2xl mt-5 text-right">
                {currencyFormat(order.total)}
              </span>
            </div>
            <div
              className={clsx(
                'flex items-center ronded-lg py-2 px-3.5 text-xs font-bold text-white my-5',
                {
                  'bg-red-500': !order.isPaid,
                  'bg-green-700': order.isPaid,
                }
              )}
            >
              <IoCardOutline size={30} />
              <span>{order.isPaid ? 'Pagada' : 'Pendiente de pago'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
