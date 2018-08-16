interface IAddTimeZone {
  kind: "addTimeZone";
  closeModal: any;
}

interface INone {
  kind: "none";
  closeModal: any;
}

type ModalData = IAddTimeZone | INone;

export default ModalData;
