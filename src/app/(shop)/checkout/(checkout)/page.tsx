import Link from 'next/link';
import { Title } from '@/components';
import { ProductsInCartCheckout } from './ui/ProductsInCartCheckout';
import { PlaceOrder } from './ui/PlaceOrder';

export default function CartPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[700px] ">
        <Title title="Verificar Orden" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* carrito */}

          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {/* Items */}
            <ProductsInCartCheckout />
          </div>
          {/* checkout */}
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
}
