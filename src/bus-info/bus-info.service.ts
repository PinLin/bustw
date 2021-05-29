import { Injectable } from '@nestjs/common';
import { PtxService } from '../ptx/ptx.service';
import { BusInfo } from './model/bus-info.model';

@Injectable()
export class BusInfoService {
  constructor(
    private readonly ptxService: PtxService,
  ) { }

  async getBusInfo(city: string) {
    const ptxDataVersion = await this.ptxService.fetchPtxDataVersion(city);

    return {
      routesVersion: ptxDataVersion.VersionID,
      routesUpdateTime: new Date(ptxDataVersion.UpdateTime),
    } as BusInfo;
  }
}
