'use client';
/**
 * 当前组件仅用于测试组件组合、样式与部分函数的功能，不作为正式功能使用
 */

import { Button } from '@aionx/aionx-ui';
import React from 'react'
import { getUsers } from '../actions/user.action';
import { signOut } from 'next-auth/react';

export default function ForTest() {
  return (
    <div>
      <Button className="mx-2" onClick={ async () => {
        const users = await getUsers()
        console.log(users)
      }}>For Test</Button>
      <Button className="mx-2" onClick={ async () => {
        await signOut()
      }}>Logout</Button>
    </div>
  )
}

