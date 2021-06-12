import { Controller, Get, Param, ForbiddenException } from '@nestjs/common';
import { BusRouteService } from './bus-route.service';

@Controller('bus/city/:city/routes')
export class BusRouteController {
  constructor(
    private readonly busRouteService: BusRouteService,
  ) { }

  @Get()
  async getBusRoutes(@Param('city') city: string) {
    if (!city) {
      throw new ForbiddenException();
    }

    return {
      routes: await this.busRouteService.getCachedBusRoutes(city),
    };
  }
}
