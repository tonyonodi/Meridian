export default interface ITimezone {
  timezone: string;
  city: string;
  country: string | null;
  niceName?: string;
}
