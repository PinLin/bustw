export class PtxBusDisplayStopOfRoute {
  RouteUID: string;
  Direction: number;
  Stops: {
    StopUID: string;
    StopName: {
      Zh_tw: string;
      En: string;
    };
    StopSequence: number;
  }[];
  VersionID: number;
}
