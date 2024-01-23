import { Module } from '@nestjs/common';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { DataAccessKcmsModule } from '@aionx/data-access-kcms';
import { ConfigModule } from '@nestjs/config';
import configs from '../common/configs/configs';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DataAccessKcmsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configs] }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(
        process.cwd(),
        'packages/apps/api-server/src/graphql/schema.gql'
      ),
      subscription: true,
      graphiql: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
