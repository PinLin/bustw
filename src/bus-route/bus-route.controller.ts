import { Controller, Get, Param, ForbiddenException, BadGatewayException, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BusRouteService } from './bus-route.service';
import { BusRoute } from './model/bus-route.model';

@Controller('bus/city/:city/routes')
export class BusRouteController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly busRouteService: BusRouteService,
  ) { }

  @Get()
  async getBusRoutes(@Param('city') city: string) {
    if (!city) {
      throw new ForbiddenException();
    }

    // 確認路線資訊是否存在於快取中
    const cacheBusRoutes = JSON.parse(await this.cache.get(`${city}/BusRoutes`) ?? null) as BusRoute[];
    if (cacheBusRoutes) {
      return {
        routes: cacheBusRoutes,
      };
    }

    // 將路線資訊儲存到快取中
    const busRoutes = await this.busRouteService.getBusRoutes(city);
    if (!busRoutes) {
      throw new BadGatewayException();
    }

    // 將路線資訊儲存到快取中
    this.cache.set(`${city}/BusRoutes`, JSON.stringify(busRoutes), {
      ttl: 3600,
    });

    return {
      routes: busRoutes,
    };
  }
}
