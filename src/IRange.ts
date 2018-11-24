export interface IDraftWaypoint {
  text: string | null;
  prevTime: number | null;
}

export interface IRangeWaypoint {
  text: string;
  time: number;
  id: string;
}

export interface IRange {
  draftWaypoint: IDraftWaypoint | null;
  id: string;
  waypoints: IRangeWaypoint[];
}
