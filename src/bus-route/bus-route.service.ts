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
        subRoutesMap[routeId].push({ id: `${routeId}${direction}`, direction, stops });
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

    const routes = [] as BusRoute[];
    ptxBusRouteSet.map((ptxBusRoute) => {
      // 判斷是否要拆副線
      if (ptxBusRoute.SubRoutes.filter(sr => sr.Direction == 0).length > 1) {
        const unwrappedRoutesMap = {} as { [routeId: string]: BusRoute };
        ptxBusRoute.SubRoutes.map((ptxBusSubRoute) => {
          const routeId = ptxBusSubRoute.SubRouteUID.slice(0, ptxBusSubRoute.SubRouteUID.length - 1);
          const routeNameZhTw = ptxBusSubRoute.SubRouteName.Zh_tw == ptxBusRoute.RouteName.Zh_tw + '0' ?
            ptxBusRoute.RouteName.Zh_tw : ptxBusSubRoute.SubRouteName.Zh_tw;
          const routeNameEn = ptxBusSubRoute.SubRouteName.En == ptxBusRoute.RouteName.En + '0' ?
            ptxBusRoute.RouteName.En : ptxBusSubRoute.SubRouteName.En;

          if (!unwrappedRoutesMap[routeId]) {
            unwrappedRoutesMap[routeId] = {
              id: routeId,
              nameZhTw: `${routeNameZhTw} ${ptxBusSubRoute.Headsign ?? ''}`,
              nameEn: `${routeNameEn} ${ptxBusSubRoute.HeadsignEn ?? ''}`,
              departureStopNameZhTw: ptxBusRoute.DepartureStopNameZh,
              departureStopNameEn: ptxBusRoute.DepartureStopNameEn,
              destinationStopNameZhTw: ptxBusRoute.DestinationStopNameZh,
              destinationStopNameEn: ptxBusRoute.DestinationStopNameEn,
              city: ptxBusRoute.City ?? 'InterCity',
              subRoutes: [{
                id: ptxBusSubRoute.SubRouteUID,
                direction: ptxBusSubRoute.Direction,
                stops: stopsMap[ptxBusSubRoute.SubRouteUID][ptxBusSubRoute.Direction],
              }],
            };
          } else {
            unwrappedRoutesMap[routeId].subRoutes.push({
              id: ptxBusSubRoute.SubRouteUID,
              direction: ptxBusSubRoute.Direction,
              stops: stopsMap[ptxBusSubRoute.SubRouteUID][ptxBusSubRoute.Direction],
            });
          }

        });

        routes.push(...Object.values(unwrappedRoutesMap));

      } else {
        routes.push({
          id: ptxBusRoute.RouteUID,
          nameZhTw: ptxBusRoute.RouteName.Zh_tw,
          nameEn: ptxBusRoute.RouteName.En,
          departureStopNameZhTw: ptxBusRoute.DepartureStopNameZh,
          departureStopNameEn: ptxBusRoute.DepartureStopNameEn,
          destinationStopNameZhTw: ptxBusRoute.DestinationStopNameZh,
          destinationStopNameEn: ptxBusRoute.DestinationStopNameEn,
          city: ptxBusRoute.City ?? 'InterCity',
          subRoutes: ptxBusRoute.SubRoutes.map((ptxBusSubRoute) => ({
            id: ptxBusSubRoute.SubRouteUID,
            direction: ptxBusSubRoute.Direction,
            stops: stopsMap[ptxBusSubRoute.SubRouteUID][ptxBusSubRoute.Direction],
          })),
        });
      }
    });

    return routes;
  }
}
