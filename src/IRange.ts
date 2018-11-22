export interface IRangeWaypoint {
  text: string;
  time: number;
}

export interface IRange {
  id: string;
  waypoints: IRangeWaypoint[];
}
