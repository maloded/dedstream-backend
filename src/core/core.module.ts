import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from './prisma/prisma.module';
import { IS_DEV_ENV} from '../shared/utils/is-dev.util';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQLConfig } from './config/graphql.config';
import { RedisModule } from './redis/redis.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getGraphQLConfig,
    }),
    PrismaModule,
    RedisModule
  ],
})
export class CoreModule {}
