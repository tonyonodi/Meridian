import * as React from "react";
import styled from "styled-components";
import {
  PALETTE,
  PARENT_VIEW_WIDTH,
  WINDOW_HEIGHT_IN_DAYS,
  WINDOW_HEIGHT_IN_MS,
} from "./config";

const AddTimeZone = styled.div`
  width: ${PARENT_VIEW_WIDTH}px;
  background: rgba(255, 255, 255, 0.2);
  cursor: default;
`;

const Inner = styled.div`
  position: fixed;
  height: 100vh;
  display: flex;
  width: ${PARENT_VIEW_WIDTH}px;
  text-align: center;
  align-items: center;
  color: white;
  font-size: 1.2em;
`;

export default ({ handleClick }) => (
  <AddTimeZone onClick={handleClick}>
    <Inner>Add Timezone</Inner>
  </AddTimeZone>
);