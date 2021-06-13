import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PtxService } from '../ptx/ptx.service';
import { BusRoute } from './model/bus-route.model';
import { BusStop } from './model/bus-stop.model';
import { BusSubRoute } from './model/bus-sub-route.model';

@Injectable()
export class BusRouteService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly ptxService: PtxService,
  ) { }

  async getCachedBusRoutes(city: string) {
    const cachedBusRoutes = JSON.parse(await this.cache.get(`BusRoutes/${city}`) ?? null) as BusRoute[];
    if (cachedBusRoutes) {
      return cachedBusRoutes;
    } else {
      throw new ServiceUnavailableException();
    }
  }

  async getBusRoutes(city: string) {
    // 判斷是否支援 PtxBusDisplayStopOfRoute API
    if (this.ptxService.getBusDisplayStopOfRouteAvailableCities().includes(city)) {
      const [ptxBusRouteSet, ptxBusDisplayStopOfRouteSet] = await Promise.all([
        this.ptxService.fetchBusRouteSet(city),
        this.ptxService.fetchBusDisplayStopOfRouteSet(city),
      ]);

      const subRoutesMap = {} as { [routeId: string]: BusSubRoute[] };
      ptxBusDisplayStopOfRouteSet.map((ptxBusDisplayStopOfRoute) => {
        const routeId = ptxBusDisplayStopOfRoute.RouteUID;
        const direction = ptxBusDisplayStopOfRoute.Direction;
        const stops = ptxBusDisplayStopOfRoute.Stops.map((ptxBusStop) => ({
          id: ptxBusStop.StopUID,
          sequence: ptxBusStop.StopSequence,
          nameZhTw: ptxBusStop.StopName.Zh_tw,
          nameEn: ptxBusStop.StopName.En,
        } as BusStop));

        if (!subRoutesMap[routeId]) {
          subRoutesMap[routeId] = [];
        }
        subRoutesMap[routeId].push({ direction, stops });
      });

      return ptxBusRouteSet.map((ptxBusRoute) => ({
        id: ptxBusRoute.RouteUID,
        nameZhTw: ptxBusRoute.RouteName.Zh_tw,
        nameEn: ptxBusRoute.RouteName.En,
        departureStopNameZhTw: ptxBusRoute.DepartureStopNameZh,
        departureStopNameEn: ptxBusRoute.DepartureStopNameEn,
        destinationStopNameZhTw: ptxBusRoute.DestinationStopNameZh,
        destinationStopNameEn: ptxBusRoute.DestinationStopNameEn,
        city: ptxBusRoute.City ?? 'InterCity',
        subRoutes: subRoutesMap[ptxBusRoute.RouteUID],
      } as BusRoute));
    }

    const [ptxBusRouteSet, ptxBusStopOfRouteSet] = await Promise.all([
      this.ptxService.fetchBusRouteSet(city),
      this.ptxService.fetchBusStopOfRouteSet(city),
    ]);

    const stopsMap = {} as { [subRouteId: string]: { [direction: string]: BusStop[] } };
    ptxBusStopOfRouteSet.map((ptxBusStopOfRoute) => {
      const subRouteId = ptxBusStopOfRoute.SubRouteUID;
      const direction = ptxBusStopOfRoute.Direction;
      const stops = ptxBusStopOfRoute.Stops.map((ptxBusStop) => ({
        id: ptxBusStop.StopUID,
        sequence: ptxBusStop.StopSequence,
        nameZhTw: ptxBusStop.StopName.Zh_tw,
        nameEn: ptxBusStop.StopName.En,
      } as BusStop));

      if (!stopsMap[subRouteId]) {
        stopsMap[subRouteId] = {};
      }
      if (!stopsMap[subRouteId][direction]) {
        stopsMap[subRouteId][direction] = [];
      }
      stopsMap[subRouteId][direction].push(...stops);
    });

    return ptxBusRouteSet.map((ptxBusRoute) => ({
      id: ptxBusRoute.RouteUID,
      nameZhTw: ptxBusRoute.RouteName.Zh_tw,
      nameEn: ptxBusRoute.RouteName.En,
      departureStopNameZhTw: ptxBusRoute.DepartureStopNameZh,
      departureStopNameEn: ptxBusRoute.DepartureStopNameEn,
      destinationStopNameZhTw: ptxBusRoute.DestinationStopNameZh,
      destinationStopNameEn: ptxBusRoute.DestinationStopNameEn,
      city: ptxBusRoute.City ?? 'InterCity',
      subRoutes: ptxBusRoute.SubRoutes.map((ptxBusSubRoute) => ({
        direction: ptxBusSubRoute.Direction,
        stops: stopsMap[ptxBusSubRoute.SubRouteUID][ptxBusSubRoute.Direction],
      })),
    }) as BusRoute);
  }
}
