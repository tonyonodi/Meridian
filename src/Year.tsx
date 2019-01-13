import * as React from "react";
import styled from "styled-components";

const ParentView = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding-right: 5px;
  padding-top: 5px;
  font-size: 1.3rem;
  font-weight: 100;
  color: white;
`;

interface IComponentProps {
  timeCursor: number;
}

export default ({ timeCursor }: IComponentProps) => {
  const year = new Date(timeCursor).getFullYear();
  return <ParentView>{year}</ParentView>;
};
