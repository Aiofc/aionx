import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaClientAdminModule } from '@aionx/prisma-client-admin';

@Module({
  controllers: [],
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaClientAdminModule],
})
export class DataAccessAdminModule {}
