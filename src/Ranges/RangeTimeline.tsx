// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";

import getFractionalPositionFromTime from "../lib/getFractionalPositionFromTime";

const RangeTimelineView = styled.div`
  position: absolute;
  width: 7px;
  background: white;
`;

interface IRangeTimeline {
  appWidth: number;
  from: number;
  to: number;
  t_0: number;
}
export default ({ appWidth, from, to, t_0 }: IRangeTimeline) => {
  const fromFractionalPosition = getFractionalPositionFromTime({
    t_0,
    time: from,
  });
  const toFractionalPosition = getFractionalPositionFromTime({
    t_0,
    time: to,
  });
  const topOffset = fromFractionalPosition * document.body.clientHeight;
  const deltaFraction = toFractionalPosition - fromFractionalPosition;
  const height = deltaFraction * document.body.clientHeight;
  const left = `${appWidth + 16}px`;

  return <RangeTimelineView style={{ top: topOffset, height, left }} />;
};
