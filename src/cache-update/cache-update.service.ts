import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Cron, NestSchedule, Timeout } from 'nest-schedule';
import { BusRouteService } from '../bus-route/bus-route.service';
import { BusInfoService } from '../bus-info/bus-info.service';
import { PtxService } from 'src/ptx/ptx.service';

@Injectable()
export class CacheUpdateService extends NestSchedule {
  private readonly logger = new Logger(CacheUpdateService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly ptxService: PtxService,
    private readonly busInfoService: BusInfoService,
    private readonly busRouteService: BusRouteService,
  ) {
    super();
  }

  @Timeout(0)
  async executeWhenStarted() {
    if (!(await this.cache.get('BusInfo'))) {
      this.updateBusInfoCache();
    }
    if (!(await this.cache.get('BusRoutes'))) {
      this.updateBusRoutesCache();
    }
  }

  @Cron('0 0 */12 * * *')
  async updateBusInfoCache() {
    try {
      await Promise.all(this.ptxService.getAvailableCities().map(async (city) => {
        const busInfo = await this.busInfoService.getBusInfo(city);
        return this.cache.set(`BusInfo/${city}`, JSON.stringify(busInfo), { ttl: 99999 });
      }));
      await this.cache.set('BusInfo', "ok", { ttl: 60 * 60 * 12 });
      this.logger.log("Updated BusInfo Caches");
    } catch (e) {
      this.logger.error("Failed to update BusInfo Caches");
    }
  }

  @Cron('0 0 */12 * * *')
  async updateBusRoutesCache() {
    try {
      await Promise.all(this.ptxService.getAvailableCities().map(async (city) => {
        const busRoutes = await this.busRouteService.getBusRoutes(city);
        return this.cache.set(`BusRoutes/${city}`, JSON.stringify(busRoutes), { ttl: 99999 });
      }));
      await this.cache.set('BusRoutes', "ok", { ttl: 60 * 60 * 12 });
      this.logger.log("Updated BusRoutes Caches");
    } catch (e) {
      this.logger.error("Failed to update BusRoutes Caches");
    }
  }
}
