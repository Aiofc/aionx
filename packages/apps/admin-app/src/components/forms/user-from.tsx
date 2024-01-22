'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Heading } from '../heading';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
  useToast,
} from '@aionx/aionx-ui';
import { Trash } from 'lucide-react';
import { createUser, updateUser } from '../../actions/user.action';

const formSchema = z.object({
  username: z.string().min(2, { message: '用户名至少2位' }),
  email: z.string().email({ message: '请输入规范的邮箱地址' }),
  password: z.string().min(8, { message: '密码至少8位' }),
});

type UserFormValue = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData: any | null;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const dataLength = Object.keys(initialData).length;

  const title = dataLength > 0 ? '编辑用户' : '创建用户';
  const description = dataLength > 0 ? '编辑一名用户' : '添加一名用户';
  const action = dataLength > 0 ? '保存更改' : '创建';

  const defaultValues = dataLength > 0 ? initialData : null;

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      setLoading(true);
      if (dataLength > 0) {
        const res = await updateUser(params.userId as string, data);
        console.log(res);
      } else {
        const res = await createUser(data);
        console.log(res);
      }
      router.refresh();
      router.push(`/dashboard/user`);
      toast({
        variant: 'default',
        title: defaultValues? '更新成功': '创建成功',
        description: '用户列表已更新.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="用户名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="电子邮箱"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="密码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
