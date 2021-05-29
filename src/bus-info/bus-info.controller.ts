import { Controller, Get, Param, ForbiddenException, BadGatewayException, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BusInfoService } from './bus-info.service';
import { BusInfo } from './model/bus-info.model';

@Controller('bus/city/:city')
export class BusInfoController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly busInfoService: BusInfoService,
  ) { }

  @Get()
  async getBusInfo(@Param('city') city: string) {
    if (!city) {
      throw new ForbiddenException();
    }

    // 確認資料是否存在於快取中
    const cacheBusInfo = JSON.parse(await this.cache.get(`${city}/BusInfo`) ?? null) as BusInfo;
    if (cacheBusInfo) {
      return cacheBusInfo;
    } else {
      // TODO: 在這裡刪除 BusRoutes 的快取是下下策
      await this.cache.del(`${city}/BusRoutes`);
    }

    const busInfo = await this.busInfoService.getBusInfo(city);
    if (!busInfo) {
      throw new BadGatewayException();
    }

    // 儲存到快取中
    this.cache.set(`${city}/BusInfo`, JSON.stringify(busInfo), {
      ttl: 3600,
    });

    return busInfo;
  }
}
