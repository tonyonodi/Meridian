import * as React from "react";
import styled from "styled-components";

const ParentView = styled.div`
  color: white;
  position: fixed;
  top: 5px;
  right: 5px;
  font-size: 2.1rem;
  line-height: 1.8rem;
  font-weight: bold;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

interface IComponentProps {
  timeCursor: number;
}

export default ({ timeCursor }: IComponentProps) => {
  const year = new Date(timeCursor).getFullYear().toString();

  return <ParentView>{year}</ParentView>;
};
