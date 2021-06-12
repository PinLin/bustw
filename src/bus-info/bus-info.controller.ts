import { Controller, Get, Param, ForbiddenException } from '@nestjs/common';
import { BusInfoService } from './bus-info.service';

@Controller('bus/city/:city')
export class BusInfoController {
  constructor(
    private readonly busInfoService: BusInfoService,
  ) { }

  @Get()
  getBusInfo(@Param('city') city: string) {
    if (!city) {
      throw new ForbiddenException();
    }

    return this.busInfoService.getCachedBusInfo(city);
  }
}
