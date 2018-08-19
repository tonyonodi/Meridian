import ITimezone from "./ITimezone";

interface IAddTimeZone {
  addTimezone: (timezone: ITimezone) => void;
  kind: "addTimeZone";
  timezones: ITimezone[];
}

interface INone {
  kind: "none";
}

type ModalData = IAddTimeZone | INone;

export default ModalData;
