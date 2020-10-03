export class PtxBusStopOfRoute {
  RouteUID: string;
  RouteName: {
    Zh_tw: string;
    En: string;
  };
  SubRouteUID: string;
  SubRouteName: {
    Zh_tw: string;
    En: string;
  };
  Direction: number;
  City: string;
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
