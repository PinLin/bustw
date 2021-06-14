import { BusStop } from './bus-stop.model';

export class BusSubRoute {
  id: string;
  direction: number;
  headsignZhTw?: string;
  headsignEn?: string;
  stops: BusStop[];
}
