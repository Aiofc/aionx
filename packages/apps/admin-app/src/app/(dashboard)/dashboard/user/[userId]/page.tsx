import { UserForm } from '../../../../../components/forms/user-from';
import BreadCrumb from '../../../../../components/breadcrumb';
import { db } from '../../../../../db';

const breadcrumbItems = [
  { title: 'User', link: '/dashboard/user' },
  { title: 'Create', link: '/dashboard/user/create' },
];
export default async function page({ params }: { params: { userId: string } }) {
  const { userId } = params;

  const user = await db.user.findFirst({ where: { id: userId } });
  db.$disconnect();
  const initialData = {
    username: user?.username,
    email: user?.email,
    password: user?.password,
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <UserForm initialData={initialData} key={null} />
      </div>
    </>
  );
}
