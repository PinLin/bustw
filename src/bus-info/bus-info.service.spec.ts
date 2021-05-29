import { Test, TestingModule } from '@nestjs/testing';
import { BusInfoService } from './bus-info.service';
import { PtxModule } from '../ptx/ptx.module';

describe('BusInfoService', () => {
  let service: BusInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PtxModule],
      providers: [BusInfoService],
    }).compile();

    service = module.get<BusInfoService>(BusInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getBusInfo correctly', async () => {
    const busInfo = await service.getBusInfo('Keelung');
    expect(busInfo).toBeDefined();
    expect(busInfo.routesVersion).toBeDefined();
    expect(busInfo.routesUpdateTime).toBeDefined();
  });
});
