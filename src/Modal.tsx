// tslint:disable:no-console
// tslint:disable:no-empty-interface
import * as React from "react";
import * as ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");

interface IModalProps {}

export default class Modal extends React.Component<IModalProps> {
  public el = document.createElement("div");

  constructor(props: IModalProps) {
    super(props);
  }

  public componentDidMount() {
    if (modalRoot) {
      modalRoot.appendChild(this.el);
    }
  }

  public componentWillUnmount() {
    if (modalRoot) {
      modalRoot.removeChild(this.el);
    }
  }

  public render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
