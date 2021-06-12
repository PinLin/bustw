import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PtxModule } from './ptx/ptx.module';
import { BusInfoModule } from './bus-info/bus-info.module';
import { BusRouteModule } from './bus-route/bus-route.module';
import { BusStopModule } from './bus-stop/bus-stop.module';
import { ConfigModule } from '@nestjs/config';
import { CacheUpdateModule } from './cache-update/cache-update.module';
import { ScheduleModule } from 'nest-schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.register(),
    PtxModule,
    BusInfoModule,
    BusRouteModule,
    BusStopModule,
    CacheUpdateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
