import styled from "styled-components";
import { PARENT_VIEW_WIDTH } from "./config";

export default styled.h1`
  transform: translateY(-50%);
  width: ${PARENT_VIEW_WIDTH}px;
  text-align: center;
  margin: 0;
  background: ${({ color }) => color};
  font-weight: 200;
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
