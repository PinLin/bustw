import { Bus } from "./bus.model";

export class BusStop {
  id: string;
  subRouteId: string;
  routeNameZhTw: string;
  status: number;
  estimateTime: number;
  buses: Bus[];
}
