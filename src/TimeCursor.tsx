import styled from "styled-components";
import { PARENT_VIEW_WIDTH } from "./config";

export default styled.div`
  text-align: left;
  padding-left: 10px;
  width: ${PARENT_VIEW_WIDTH}px;
  margin: 0;
  background: ${({ color }) => color};
  font-weight: bold;
  &:before {
    content: "";
    top: -50px;
    background: linear-gradient(
      rgba(255, 255, 255, 0),
      ${({ color }) => color}
    );
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    background: linear-gradient(
      ${({ color }) => color},
      rgba(255, 255, 255, 0)
    );
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;
