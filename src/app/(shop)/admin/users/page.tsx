export const revalidate = 0;

import { redirect } from 'next/navigation';
import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';
import { UsersTable } from './ui/UsersTable';

export default async function OrdersPage() {
  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) {
    redirect('/auth/login');
  }

  return (
    <div className="mx-3">
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
        <Pagination totalPages={1} />
      </div>
    </div>
  );
}
