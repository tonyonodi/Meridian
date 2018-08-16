// tslint:disable:no-console
import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import AddTimeZone from "./AddTimeZone";
import ModalData from "./ModalData";

const modalRoot = document.getElementById("modal-root");

const ModalView = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
`;

interface IModal {
  modalData: ModalData;
  closeModal: any;
}

export default class Modal extends React.Component<IModal> {
  public el = document.createElement("div");

  public componentDidMount() {
    if (!modalRoot) {
      throw new Error("Modal root element not found.");
    }
    modalRoot.appendChild(this.el);
  }

  public componentWillUnmount() {
    if (!modalRoot) {
      throw new Error("Modal root element not found.");
    }
    modalRoot.removeChild(this.el);
  }

  public render() {
    const { modalData } = this.props;

    switch (modalData.kind) {
      case "addTimeZone":
        return ReactDOM.createPortal(
          <ModalView>
            <AddTimeZone
              addTimezone={modalData.addTimezone}
              close={this.props.closeModal}
              timezones={modalData.timezones}
            />
          </ModalView>,
          this.el
        );

      case "none":
        return null;
    }
  }
}
