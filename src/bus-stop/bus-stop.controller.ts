import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { BusStopService } from './bus-stop.service';

@Controller('bus/city/:city/routes/:routeId/stops')
export class BusStopController {
  constructor(
    private readonly busStopService: BusStopService,
  ) { }

  @Get()
  async getBusStops(@Param('city') city: string, @Param('routeId') routeId: string) {
    if (!city || !routeId) {
      throw new ForbiddenException();
    }

    return {
      stops: await this.busStopService.getCachedBusStopsByRoute(city, routeId),
    };
  }
}
