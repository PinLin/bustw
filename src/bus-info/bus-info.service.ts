import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PtxService } from '../ptx/ptx.service';
import { BusInfo } from './model/bus-info.model';

@Injectable()
export class BusInfoService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly ptxService: PtxService,
  ) { }

  async getCachedBusInfo(city: string) {
    const cachedBusInfo = JSON.parse(await this.cache.get(`BusInfo/${city}`) ?? null) as BusInfo;
    if (cachedBusInfo) {
      return cachedBusInfo;
    } else {
      throw new ServiceUnavailableException();
    }
  }

  async getBusInfo(city: string) {
    const ptxDataVersion = await this.ptxService.fetchDataVersion(city);

    return {
      routesVersion: ptxDataVersion.VersionID,
      routesUpdateTime: new Date(ptxDataVersion.UpdateTime),
    } as BusInfo;
  }
}
