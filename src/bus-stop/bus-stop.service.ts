import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PtxService } from '../ptx/ptx.service';
import { BusStop } from './model/bus-stop.model';
import { Bus } from './model/bus.model';

@Injectable()
export class BusStopService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly ptxService: PtxService,
  ) { }

  async getBusStops(city: string) {
    const [
      ptxBusEstimatedTimeOfArrivalSet,
      ptxBusRealTimeNearStopSet,
    ] = await Promise.all([
      this.ptxService.fetchBusEstimatedTimeOfArrivalSet(city),
      this.ptxService.fetchBusRealTimeNearStopSet(city),
    ]);

    // 把 ptxBusRealTimeNearStopSet 整理成 busDict
    let busDict = {} as { [routeUID: string]: { [stopId: string]: Bus[] } };
    ptxBusRealTimeNearStopSet.map((ptxBusRealTimeNearStop) => {
      const routeId = ptxBusRealTimeNearStop.RouteUID;
      const stopId = ptxBusRealTimeNearStop.StopUID;

      if (!busDict[routeId]) {
        busDict[routeId] = {};
      }
      if (!busDict[routeId][stopId]) {
        busDict[routeId][stopId] = [];
      }

      busDict[routeId][stopId].push({
        plateNumber: ptxBusRealTimeNearStop.PlateNumb,
        status: ptxBusRealTimeNearStop.BusStatus ?? 0,
        approaching: ptxBusRealTimeNearStop.A2EventType,
      } as Bus);
    });

    return ptxBusEstimatedTimeOfArrivalSet.map((ptxBusEstimatedTimeOfArrival) => {
      const routeId = ptxBusEstimatedTimeOfArrival.RouteUID;
      const stopId = ptxBusEstimatedTimeOfArrival.StopUID;

      return {
        id: stopId,
        routeId: ptxBusEstimatedTimeOfArrival.RouteUID,
        status: ptxBusEstimatedTimeOfArrival.StopStatus,
        estimateTime: ptxBusEstimatedTimeOfArrival.EstimateTime ?? null,
        buses: busDict?.[routeId]?.[stopId] ?? [],
      } as BusStop;
    });
  }

  async getCachedBusStops(city: string) {
    const cacheBusStops = JSON.parse(await this.cache.get(`BusStops/${city}`) ?? null) as BusStop[];
    if (cacheBusStops) {
      return cacheBusStops;
    } else {
      try {
        const busStops = await this.getBusStops(city);
        await this.cache.set(`BusStops/${city}`, JSON.stringify(busStops), { ttl: 60 });
        return busStops;
      } catch (e) {
        throw new ServiceUnavailableException();
      }
    }
  }

  async getCachedBusStopsByRoute(city: string, routeId: string) {
    return (await this.getCachedBusStops(city)).filter(s => s.routeId == routeId);
  }
}
