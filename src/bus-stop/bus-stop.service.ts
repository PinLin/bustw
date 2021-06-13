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

  async getCachedBusStopsByRouteName(city: string, routeName: string) {
    const cacheBusStops = JSON.parse(await this.cache.get(`BusStops/${city}`) ?? null) as BusStop[];
    if (cacheBusStops) {
      return cacheBusStops.filter(s => s.routeNameZhTw.includes(routeName));
    } else {
      // 更新快取
      this.getBusStops(city).then((busStops) => {
        this.cache.set(`BusStops/${city}`, JSON.stringify(busStops), { ttl: 60 });
      });

      try {
        return await this.getBusStopsByRouteName(city, routeName);
      } catch (e) {
        throw new ServiceUnavailableException();
      }
    }
  }

  async getBusStops(city: string) {
    const [
      ptxBusEstimatedTimeOfArrivalSet,
      ptxBusRealTimeNearStopSet,
    ] = await Promise.all([
      this.ptxService.fetchBusEstimatedTimeOfArrivalSet(city),
      this.ptxService.fetchBusRealTimeNearStopSet(city),
    ]);

    let busesMap = {} as { [routeId: string]: { [stopId: string]: Bus[] } };
    ptxBusRealTimeNearStopSet.map((ptxBusRealTimeNearStop) => {
      const routeId = ptxBusRealTimeNearStop.RouteUID;
      const stopId = ptxBusRealTimeNearStop.StopUID;

      if (!busesMap[routeId]) {
        busesMap[routeId] = {};
      }
      if (!busesMap[routeId][stopId]) {
        busesMap[routeId][stopId] = [];
      }
      busesMap[routeId][stopId].push({
        plateNumber: ptxBusRealTimeNearStop.PlateNumb,
        status: ptxBusRealTimeNearStop.BusStatus ?? 0,
        approaching: ptxBusRealTimeNearStop.A2EventType,
      } as Bus);
    });

    return ptxBusEstimatedTimeOfArrivalSet.map((ptxBusEstimatedTimeOfArrival) => {
      const stopId = ptxBusEstimatedTimeOfArrival.StopUID;
      const routeId = ptxBusEstimatedTimeOfArrival.RouteUID;
      const routeNameZhTw = ptxBusEstimatedTimeOfArrival.RouteName.Zh_tw;

      return {
        id: stopId, routeId, routeNameZhTw,
        status: ptxBusEstimatedTimeOfArrival.StopStatus,
        estimateTime: ptxBusEstimatedTimeOfArrival.EstimateTime ?? null,
        buses: busesMap?.[routeId]?.[stopId] ?? [],
      } as BusStop;
    });
  }

  async getBusStopsByRouteName(city: string, routeName: string) {
    const [
      ptxBusEstimatedTimeOfArrivalSet,
      ptxBusRealTimeNearStopSet,
    ] = await Promise.all([
      this.ptxService.fetchBusEstimatedTimeOfArrivalSet(city, routeName),
      this.ptxService.fetchBusRealTimeNearStopSet(city, routeName),
    ]);

    let busesMap = {} as { [routeId: string]: { [stopId: string]: Bus[] } };
    ptxBusRealTimeNearStopSet.map((ptxBusRealTimeNearStop) => {
      const routeId = ptxBusRealTimeNearStop.RouteUID;
      const stopId = ptxBusRealTimeNearStop.StopUID;

      if (!busesMap[routeId]) {
        busesMap[routeId] = {};
      }
      if (!busesMap[routeId][stopId]) {
        busesMap[routeId][stopId] = [];
      }
      busesMap[routeId][stopId].push({
        plateNumber: ptxBusRealTimeNearStop.PlateNumb,
        status: ptxBusRealTimeNearStop.BusStatus ?? 0,
        approaching: ptxBusRealTimeNearStop.A2EventType,
      } as Bus);
    });

    return ptxBusEstimatedTimeOfArrivalSet.map((ptxBusEstimatedTimeOfArrival) => {
      const stopId = ptxBusEstimatedTimeOfArrival.StopUID;
      const routeId = ptxBusEstimatedTimeOfArrival.RouteUID;
      const routeNameZhTw = ptxBusEstimatedTimeOfArrival.RouteName.Zh_tw;

      return {
        id: stopId, routeId, routeNameZhTw,
        status: ptxBusEstimatedTimeOfArrival.StopStatus,
        estimateTime: ptxBusEstimatedTimeOfArrival.EstimateTime ?? null,
        buses: busesMap?.[routeId]?.[stopId] ?? [],
      } as BusStop;
    });
  }
}
