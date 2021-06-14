export class PtxBusRoute {
  RouteUID: string;
  RouteName: {
    Zh_tw: string;
    En: string;
  };
  SubRoutes: {
    SubRouteUID: string;
    SubRouteName: {
      Zh_tw: string;
      En: string;
    };
    Direction: number;
    Headsign: string;
    HeadsignEn: string;
  }[];
  DepartureStopNameZh: string;
  DepartureStopNameEn: string;
  DestinationStopNameZh: string;
  DestinationStopNameEn: string;
  City: string;
  VersionID: number;
}
