'use server';
import { db } from '../db';

interface User {
  email: string;
  username: string;
  password: string;
}

export async function getUsers() {
  const users = await db.user.findMany();
  db.$disconnect();
  return users;
}

export async function updateUser(id: string, data: User) {
  const user = await db.user.update({
    where: {
      id,
    },
    data: data,
  });
  db.$disconnect();
  return user;
}

export async function createUser(data: User) {
  const user = await db.user.create({
    data: data,
  });
  db.$disconnect();
  return user;
}
