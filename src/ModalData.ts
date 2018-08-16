interface IAddTimeZone {
  addTimezone: (timezone: string) => void;
  kind: "addTimeZone";
}

interface INone {
  kind: "none";
}

type ModalData = IAddTimeZone | INone;

export default ModalData;
