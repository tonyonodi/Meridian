import * as React from "react";
import styled from "styled-components";
import { isFirefox, isChrome } from "../lib/browserInfo";
import Icon, { IconTypes } from "../Icon";
import { HEADER_HEIGHT } from "../config";

const { useRef, useEffect } = React;

const TitleBar = styled.div`
  position: sticky;
  right: 0;
  top: -17px;
  z-index: 20;
`;

const TitleContainer = styled.div`
  width: ${() => {
    if (isChrome) {
      return 34;
    }
    if (isFirefox) {
      return 37;
    }
    return 36;
  }}px;
  position: absolute;
  right: 0;
  top: ${HEADER_HEIGHT}px;
`;

const fontSize = `1.8em`;
const fontFamily = `sans-serif`;
const fontWeight = `bold`;

interface ITitle {
  bgColor: [number, number, number];
}

const Title = styled.h1<ITitle>`
  font-size: ${fontSize};
  font-family: ${fontFamily};
  font-weight: ${fontWeight};
  z-index: 100;
  transform: translate(0, -36px) rotate(90deg);
  transform-origin: left bottom 0;
  width: 100vh;
  display: flex;
  .long-name {
    padding-right: 20px;
  }
  .long-name:after {
    content: "";
    display: inline-block;
    height: 86%;
    width: 20px;
    position: absolute;
    right: 0;
    top: 5px;
    background-image: linear-gradient(
      to right,
      rgba(${({ bgColor }) => bgColor.join(", ")}, 0),
      rgba(${({ bgColor }) => bgColor.join(", ")}, 1)
    );
  }
`;

const titleTextMaxWidth = 230;

const TitleText = styled.span`
  display: inline-block;
  max-width: ${titleTextMaxWidth}px;
  white-space: nowrap;
  overflow-x: hidden;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 0;
  margin-bottom: 4px;
  margin-left: 5px;
  &:focus {
    outline: none;
  }
  &:focus svg {
    filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.3));
  }
`;

interface ITitleComponent {
  color: [number, number, number];
  titleText: string;
  remove: () => void;
}

export default ({ color, titleText, remove }: ITitleComponent) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const spanEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!canvasEl.current) return;
    const ctx = canvasEl.current.getContext("2d");
    if (!ctx) return;
    ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const textSize = ctx.measureText(titleText).width;
    if (textSize > titleTextMaxWidth && spanEl.current) {
      spanEl.current.classList.add("long-name")
    }
  });

  return (
    <TitleBar>
      <TitleContainer>
        <Title bgColor={color}>
          <TitleText innerRef={spanEl} >
            {titleText}
          </TitleText>
          <CloseButton onClick={remove}>
            <Icon
              style={{
                height: 30,
                marginBottom: 2,
              }}
              type={IconTypes.Times}
            />
          </CloseButton>
        </Title>
      </TitleContainer>
      <canvas hidden={true} ref={canvasEl} />
    </TitleBar>
  );
};
