import { Test, TestingModule } from '@nestjs/testing';
import { PtxService } from './ptx.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';

describe('PtxService', () => {
  let service: PtxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        HttpModule,
      ],
      providers: [PtxService],
    }).compile();

    service = module.get<PtxService>(PtxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetchPtxDataVersion correctly', async () => {
    const ptxDataVersion = await service.fetchDataVersion('Keelung');
    expect(ptxDataVersion).toBeDefined();
    expect(ptxDataVersion.VersionID).toBeDefined();
    expect(ptxDataVersion.UpdateTime).toBeDefined();
  });

  it('should fetchPtxBusRouteSet correctly', async () => {
    const ptxBusRouteSet = await service.fetchBusRouteSet('Keelung');
    expect(ptxBusRouteSet).toBeDefined();
    expect(ptxBusRouteSet.length).toBeGreaterThan(0);

    const ptxBusRoute = ptxBusRouteSet[0];
    expect(ptxBusRoute.RouteUID).toBeDefined();
    expect(ptxBusRoute.RouteName).toBeDefined();
    expect(ptxBusRoute.SubRoutes).toBeDefined();
    expect(ptxBusRoute.SubRoutes.length).toBeGreaterThan(0);

    const ptxBusSubRoute = ptxBusRoute.SubRoutes[0];
    expect(ptxBusSubRoute.SubRouteUID).toBeDefined();
    expect(ptxBusSubRoute.SubRouteName).toBeDefined();
    expect(ptxBusSubRoute.Direction).toBeDefined();

    expect(ptxBusRoute.DepartureStopNameZh).toBeDefined();
    expect(ptxBusRoute.DepartureStopNameEn).toBeDefined();
    expect(ptxBusRoute.DestinationStopNameZh).toBeDefined();
    expect(ptxBusRoute.DestinationStopNameEn).toBeDefined();
    expect(ptxBusRoute.City).toBeDefined();
    expect(ptxBusRoute.VersionID).toBeDefined();
  });

  it('should fetchPtxBusStopOfRouteSet correctly', async () => {
    const ptxBusStopOfRouteSet = await service.fetchBusStopOfRouteSet('Keelung');
    expect(ptxBusStopOfRouteSet).toBeDefined();
    expect(ptxBusStopOfRouteSet.length).toBeGreaterThan(0);

    const ptxBusStopOfRoute = ptxBusStopOfRouteSet[0];
    expect(ptxBusStopOfRoute.RouteUID).toBeDefined();
    expect(ptxBusStopOfRoute.SubRouteUID).toBeDefined();
    expect(ptxBusStopOfRoute.Direction).toBeDefined();
    expect(ptxBusStopOfRoute.City).toBeDefined();
    expect(ptxBusStopOfRoute.Stops).toBeDefined();
    expect(ptxBusStopOfRoute.Stops.length).toBeGreaterThan(0);

    const ptxBusStop = ptxBusStopOfRoute.Stops[0];
    expect(ptxBusStop.StopUID).toBeDefined();
    expect(ptxBusStop.StopName).toBeDefined();
    expect(ptxBusStop.StopSequence).toBeDefined();

    expect(ptxBusStopOfRoute.VersionID).toBeDefined();
  });

  it('should fetchPtxBusEstimatedTimeOfArrivalSet correctly', async () => {
    const ptxBusEstimatedTimeOfArrivalSet = await service.fetchBusEstimatedTimeOfArrivalSet('Keelung');
    expect(ptxBusEstimatedTimeOfArrivalSet).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrivalSet.length).toBeGreaterThan(0);

    const ptxBusEstimatedTimeOfArrival = ptxBusEstimatedTimeOfArrivalSet[0];
    expect(ptxBusEstimatedTimeOfArrival.RouteUID).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrival.StopUID).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrival.StopStatus).toBeDefined();
  });

  it('should fetchPtxBusRealTimeNearStopSet correctly', async () => {
    const ptxBusRealTimeNearStopSet = await service.fetchBusRealTimeNearStopSet('Keelung');
    expect(ptxBusRealTimeNearStopSet).toBeDefined();
    expect(ptxBusRealTimeNearStopSet.length).toBeGreaterThan(0);

    const ptxBusRealTimeNearStop = ptxBusRealTimeNearStopSet[0];
    expect(ptxBusRealTimeNearStop.RouteUID).toBeDefined();
    expect(ptxBusRealTimeNearStop.StopUID).toBeDefined();
    expect(ptxBusRealTimeNearStop.BusStatus).toBeDefined();
    expect(ptxBusRealTimeNearStop.A2EventType).toBeDefined();
  });
});
