export default interface ITimezone {
  timezone: string;
  niceName: string;
}

export function isITimezone(obj: any): obj is ITimezone {
  return (
    (obj as ITimezone).niceName !== undefined &&
    (obj as ITimezone).timezone !== undefined
  );
}
