export interface IRangeEndpoint {
  text: string;
  time: number;
}

export interface IRange {
  id: string;
  endpoints: IRangeEndpoint[];
}
