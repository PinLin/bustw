import { Test, TestingModule } from '@nestjs/testing';
import { PtxModule } from '../ptx/ptx.module';
import { BusInfoController } from './bus-info.controller';
import { BusInfoService } from './bus-info.service';

describe('BusInfo Controller', () => {
  let controller: BusInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PtxModule],
      providers: [BusInfoService],
      controllers: [BusInfoController],
    }).compile();

    controller = module.get<BusInfoController>(BusInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
