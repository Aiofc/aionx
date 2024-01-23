import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { DataAccessAdminModule } from '@aionx/data-access-admin';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver],
  controllers: [UsersController],
  imports: [DataAccessAdminModule],
})
export class UsersModule {}
