import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { BusInfoService } from './bus-info.service';
import { BusInfoController } from './bus-info.controller';
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
  providers: [BusInfoService],
  controllers: [BusInfoController],
})
export class BusInfoModule { }
