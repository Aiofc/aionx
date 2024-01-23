import { PrismaService } from '@aionx/prisma-client-kcms';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts() {
    return this.prisma.post.findMany();
  }

  async getPost(id: string) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  async createPost(data: { title: string; content: string }) {
    return this.prisma.post.create({
      data,
    });
  }
}
