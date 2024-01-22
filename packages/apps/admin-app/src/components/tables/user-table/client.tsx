'use client';
import React, { useEffect, useState } from 'react';
import { User } from '../../../types/user';
import { Heading } from '../../heading';
import { Button, Separator } from '@aionx/aionx-ui';
import { Plus } from 'lucide-react';
import { DataTable } from '../../data-table';
import { columns } from './columns';
import { getUsers } from '../../../actions/user.action';
import { useRouter } from 'next/navigation';

export const UserClient: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const router = useRouter();
  useEffect(() => {
    const updateData = async () => {
      const users = await getUsers();
      setData(users);
    };
    updateData();
  }, []);

  return (
    <>
      <div className="flex items-start justify-between">
        {' '}
        <Heading title={`Users (${data.length})`} description="用户管理" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/user/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> 添加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="username" columns={columns} data={data} />
    </>
  );
};
