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
    const result = await service.fetchPtxDataVersion('Keelung');
    expect(result).toBeDefined();
    expect(result.VersionID).toBeDefined();
    expect(result.UpdateTime).toBeDefined();
  });

  it('should fetchPtxBusRoutes correctly', async () => {
    const result = await service.fetchPtxBusRoutes('Keelung');
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);

    const busRoute = result[0];
    expect(busRoute.RouteUID).toBeDefined();
    expect(busRoute.RouteName).toBeDefined();
    expect(busRoute.SubRoutes).toBeDefined();
    expect(busRoute.SubRoutes.length).toBeGreaterThan(0);

    const subBusRoute = busRoute.SubRoutes[0];
    expect(subBusRoute.SubRouteUID).toBeDefined();
    expect(subBusRoute.SubRouteName).toBeDefined();
    expect(subBusRoute.Direction).toBeDefined();

    expect(busRoute.DepartureStopNameZh).toBeDefined();
    expect(busRoute.DepartureStopNameEn).toBeDefined();
    expect(busRoute.DestinationStopNameZh).toBeDefined();
    expect(busRoute.DestinationStopNameEn).toBeDefined();
    expect(busRoute.City).toBeDefined();
    expect(busRoute.VersionID).toBeDefined();
  });

  it('should fetchPtxBusStopsOfRoute correctly', async () => {
    const result = await service.fetchPtxBusStopsOfRoute('Keelung');
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);

    const busRoute = result[0];
    expect(busRoute.RouteUID).toBeDefined();
    expect(busRoute.RouteName).toBeDefined();
    expect(busRoute.SubRouteUID).toBeDefined();
    expect(busRoute.SubRouteName).toBeDefined();
    expect(busRoute.Direction).toBeDefined();
    expect(busRoute.City).toBeDefined();
    expect(busRoute.Stops).toBeDefined();
    expect(busRoute.Stops.length).toBeGreaterThan(0);

    const busStop = busRoute.Stops[0];
    expect(busStop.StopUID).toBeDefined();
    expect(busStop.StopName).toBeDefined();
    expect(busStop.StopSequence).toBeDefined();

    expect(busRoute.VersionID).toBeDefined();
  });

  it('should fetchPtxBusEstimatedTimeOfArrival correctly', async () => {
    const result = await service.fetchPtxBusEstimatedTimesOfArrival('Keelung');
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);

    const busStop = result[0];
    expect(busStop.RouteUID).toBeDefined();
    expect(busStop.RouteName).toBeDefined();
    expect(busStop.SubRouteUID).toBeDefined();
    expect(busStop.SubRouteName).toBeDefined();
    expect(busStop.Direction).toBeDefined();
    expect(busStop.StopUID).toBeDefined();
    expect(busStop.StopName).toBeDefined();
    expect(busStop.StopSequence).toBeDefined();
    expect(busStop.StopStatus).toBeDefined();
  });
});
