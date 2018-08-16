interface IAddTimeZone {
  addTimezone: (timezone: string) => void;
  kind: "addTimeZone";
  timezones: string[];
}

interface INone {
  kind: "none";
}

type ModalData = IAddTimeZone | INone;

export default ModalData;
