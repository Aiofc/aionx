'use client';
/**
 * 当前组件仅用于测试组件组合、样式与部分函数的功能，不作为正式功能使用
 */

import { Button } from '@aionx/aionx-ui';
import React from 'react';
import { getUsers } from '../actions/user.action';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './layout/ThemeToggle/theme-toggle';

export default function ForTest() {
  const [users, setUsers] = React.useState<string>('');
  const router = useRouter();
  return (
    <div>
      <h2 className=' mx-2 mb-3'>
        明暗模式：<ThemeToggle/>
      </h2>

      <Button
        className="mx-2"
        onClick={async () => {
          const users = await getUsers();
          setUsers(JSON.stringify(users));
        }}
      >
        获取用户
      </Button>
      <Button
        className="mx-2"
        onClick={async () => {
          router.push('/dashboard/user');
        }}
      >
        访问用户页面
      </Button>
      <Button
        className="mx-2"
        onClick={async () => {
          await signOut();
        }}
      >
        Logout
      </Button>
      <div>{users}</div>
    </div>
  );
}
