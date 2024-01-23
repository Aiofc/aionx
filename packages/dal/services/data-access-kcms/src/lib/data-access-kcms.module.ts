import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaClientKcmsModule } from '@aionx/prisma-client-kcms';

@Module({
  controllers: [],
  providers: [PostService],
  exports: [PostService],
  imports: [PrismaClientKcmsModule],
})
export class DataAccessKcmsModule {}
