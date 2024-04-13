import Link from 'next/link';
import { titleFont } from '@/config/fonts';

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
      <Link href="/">
        <span className={`${titleFont.className} antialiased font-bold`}>
          Teslo
        </span>
        <span> | Shop @ {new Date().getFullYear()}</span>
      </Link>

      <Link href="/" className="mx-3">
        Privacidad y Legal
      </Link>

      <Link href="/" className="mx-3">
        Ubicaciones
      </Link>
    </div>
  );
};
