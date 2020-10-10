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
    const ptxDataVersion = await service.fetchPtxDataVersion('Keelung');
    expect(ptxDataVersion).toBeDefined();
    expect(ptxDataVersion.VersionID).toBeDefined();
    expect(ptxDataVersion.UpdateTime).toBeDefined();
  });

  it('should fetchPtxBusRouteSet correctly', async () => {
    const ptxBusRouteSet = await service.fetchPtxBusRouteSet('Keelung');
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
    const ptxBusStopOfRouteSet = await service.fetchPtxBusStopOfRouteSet('Keelung');
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

  it('should fetchPtxBusEstimatedTimeOfArrival correctly', async () => {
    const ptxBusEstimatedTimeOfArrivalSet = await service.fetchPtxBusEstimatedTimeOfArrivalSet('Keelung');
    expect(ptxBusEstimatedTimeOfArrivalSet).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrivalSet.length).toBeGreaterThan(0);

    const ptxBusEstimatedTimeOfArrival = ptxBusEstimatedTimeOfArrivalSet[0];
    expect(ptxBusEstimatedTimeOfArrival.RouteUID).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrival.SubRouteUID).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrival.Direction).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrival.StopUID).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrival.StopSequence).toBeDefined();
    expect(ptxBusEstimatedTimeOfArrival.StopStatus).toBeDefined();
  });
});
