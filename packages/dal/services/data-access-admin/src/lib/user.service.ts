import { PrismaService } from '@aionx/prisma-client-admin';
import { Injectable } from '@nestjs/common';


interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }
}
