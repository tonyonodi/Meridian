import * as React from "react";
import styled from "styled-components";

const View = styled.h1`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
  margin: 0;
`;

export default () => {
  return <View />;
};
