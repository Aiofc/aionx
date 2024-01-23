import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [PrismaClientAdminModule],
})
export class PrismaClientAdminModule {}
