import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { BusStopService } from './bus-stop.service';
import { BusStopController } from './bus-stop.controller';
import { PtxModule } from '../ptx/ptx.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  ],
  providers: [BusStopService],
  controllers: [BusStopController],
  exports: [BusStopService],
})
export class BusStopModule { }
