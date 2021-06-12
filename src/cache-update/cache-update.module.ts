import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { PtxModule } from 'src/ptx/ptx.module';
import { BusInfoModule } from '../bus-info/bus-info.module';
import { BusRouteModule } from '../bus-route/bus-route.module';
import { CacheUpdateService } from './cache-update.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST') ?? 'localhost',
        port: config.get('REDIS_PORT') ?? 6379,
      }),
      inject: [ConfigService],
    }),
    PtxModule,
    BusInfoModule,
    BusRouteModule,
  ],
  providers: [CacheUpdateService]
})
export class CacheUpdateModule {}
