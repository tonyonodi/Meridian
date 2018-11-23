import * as React from "react";
import { IRange } from "../IRange";
import Range from "./Range";

interface IRangesComponent {
  appWidth: number;
  ranges: IRange[];
  t_0: number;
  timeCursor: number;
}

export default ({ appWidth, ranges, t_0, timeCursor }: IRangesComponent) => {
  return (
    <React.Fragment>
      {ranges.map(range => {
        return (
          <Range
            key={range.id}
            appWidth={appWidth}
            t_0={t_0}
            timeCursor={timeCursor}
            {...range}
          />
        );
      })}
    </React.Fragment>
  );
};
