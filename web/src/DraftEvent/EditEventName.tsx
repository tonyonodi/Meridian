import * as React from "react";
import styled from "styled-components";
import Icon, { IconTypes } from "src/Icon";
import { DARK_TEXT } from "src/config";
import { UpdateTimeContext, updateTimeType } from "../App";

const { useEffect, useRef, useState, useContext } = React;

const ParentView = styled.div`
  position: fixed;
  background: white;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  padding: 70px 30px 30px 30px;
  color: rgb(${DARK_TEXT.join(",")});
`;

const Title = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 10px;
  right: 10px;
  &:focus {
    outline: none;
  }
  &:focus svg {
    filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.3));
    transform: translateY(-4px);
    transition: transform 1s;
  }
`;

const Form = styled.form``;

const TextInput = styled.input`
  background: none;
  border: none;
  width: 100%;
  border-bottom: solid 1px #d2d2d2;
  font-size: 2rem;
  padding: 5px;
  margin-bottom: 2px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-bottom: solid 3px rgb(${DARK_TEXT.join(",")});
    margin-bottom: 0;
  }
`;

interface IEditEventNameProps {
  time: number;
  initialName: string;
  close: () => void;
  updateDraftName: (draftName: string, time: number) => void;
}

let initialTime: number;

export default ({
  time,
  initialName,
  close,
  updateDraftName,
}: IEditEventNameProps) => {
  const inputElement: React.MutableRefObject<HTMLInputElement | null> = useRef(
    null
  );

  const updateTime = useContext<updateTimeType | null>(UpdateTimeContext);

  useEffect(() => {
    if (inputElement.current !== null) {
      (inputElement as React.MutableRefObject<
        HTMLInputElement
      >).current.focus();
    }
    initialTime = time;
  }, [inputElement]);

  const [inputValue, updateInputValue] = useState(initialName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateInputValue(event.target.value);
  };

  const handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    close();
    if (updateTime) {
      setTimeout(() => {
        updateTime({ time: initialTime });
      }, 250);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateDraftName(inputValue, initialTime);
  };

  return (
    <ParentView>
      <CloseButton onClick={handleCloseClick}>
        <Icon type={IconTypes.Times} style={{ width: 30 }} />
      </CloseButton>
      <Title>Event name</Title>
      <Form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          innerRef={inputElement}
          value={inputValue}
          onChange={handleChange}
        />
      </Form>
    </ParentView>
  );
};
