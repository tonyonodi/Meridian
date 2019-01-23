export default interface ITimezone {
  timezone: string;
  niceName: string;
}

export function isITimezone(obj: any): obj is ITimezone {
  return (
    typeof (obj as ITimezone).niceName === "string" &&
    typeof (obj as ITimezone).timezone === "string"
  );
}
