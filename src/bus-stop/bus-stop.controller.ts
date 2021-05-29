import { BadGatewayException, CACHE_MANAGER, Controller, ForbiddenException, Get, Inject, Param } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BusStopService } from './bus-stop.service';
import { BusStop } from './model/bus-stop.model';

@Controller('bus/city/:city/routes/:routeId/stops')
export class BusStopController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly busStopService: BusStopService,
  ) { }

  @Get()
  async getBusStops(@Param('city') city: string, @Param('routeId') routeId: string) {
    if (!city || !routeId) {
      throw new ForbiddenException();
    }

    // 確認站牌資訊是否存在於快取中
    const cacheBusStops = JSON.parse(await this.cache.get(`${city}/BusStops`) ?? null) as BusStop[];
    if (cacheBusStops) {
      return {
        stops: cacheBusStops,
      };
    }

    // 將站牌資訊儲存到快取中
    const busStops = await this.busStopService.getBusStopsByRoute(city, routeId);
    if (!busStops) {
      throw new BadGatewayException();
    }

    // 將站牌資訊儲存到快取中
    this.cache.set(`${city}/BusStops`, JSON.stringify(busStops), {
      ttl: 10,
    });

    return {
      stops: busStops,
    };
  }
}
