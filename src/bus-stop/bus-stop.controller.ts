import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { BusStopService } from './bus-stop.service';

@Controller('bus/city/:city/routes/:routeName/stops')
export class BusStopController {
  constructor(
    private readonly busStopService: BusStopService,
  ) { }

  @Get()
  async getBusStopsByRouteName(@Param('city') city: string, @Param('routeName') routeName: string) {
    if (!city || !routeName) {
      throw new ForbiddenException();
    }

    return {
      stops: await this.busStopService.getCachedBusStopsByRouteName(city, routeName),
    };
  }
}
