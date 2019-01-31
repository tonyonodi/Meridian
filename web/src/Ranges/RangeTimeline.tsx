// tslint:disable:no-console
import * as Luxon from "luxon";
import * as React from "react";
import styled from "styled-components";

import getFractionalPositionFromTime from "../lib/getFractionalPositionFromTime";
import { DARK_TEXT, DURATION_LINE_COLOR } from "src/config";

const { Duration } = Luxon;

const DURATION_TEXT_PADDING_TOP = 25;

const DurationText = styled.div`
  position: absolute;
  font-weight: lighter;
  color: rgb(${DARK_TEXT.join(",")});
  white-space: nowrap;
  & > div {
    position: sticky;
    top: 30px;
    padding-left: 11px;
    padding-bottom: 20px;
    padding-top: ${DURATION_TEXT_PADDING_TOP}px;
  }
`;

const RangeTimelineView = styled.div`
  position: absolute;
  width: 5px;
  background: rgb(${DURATION_LINE_COLOR.join(",")});
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
  const left = appWidth + 16;

  const deltaMs = to - from;
  const duration = Duration.fromMillis(deltaMs)
    .shiftTo("hours", "minutes")
    .toObject();
  const hours = duration.hours;
  const hoursString = hours && hours > 0 ? `${hours} hours` : undefined;
  const minutes = duration.minutes;
  const minutesString =
    minutes && minutes > 0 ? `${Math.round(minutes)} min` : undefined;
  const durationString = [hoursString, minutesString].filter(s => s).join(" ");

  return (
    <React.Fragment>
      <RangeTimelineView style={{ top: topOffset, height, left }} />
      <DurationText
        style={{
          top: topOffset - DURATION_TEXT_PADDING_TOP + 10,
          height: height + DURATION_TEXT_PADDING_TOP,
          left,
        }}
      >
        <div>{durationString}</div>
      </DurationText>
    </React.Fragment>
  );
};
