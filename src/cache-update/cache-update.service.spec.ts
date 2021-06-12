import { Test, TestingModule } from '@nestjs/testing';
import { CacheUpdateService } from './cache-update.service';

describe('CacheUpdateService', () => {
  let service: CacheUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheUpdateService],
    }).compile();

    service = module.get<CacheUpdateService>(CacheUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
