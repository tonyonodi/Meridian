import {
  minuteTimestampFromMs,
  msFromMinuteTimestamp,
} from "./minuteUTCTimestamp";

it("can convert a ms timestamp to a minute timestamp", () => {
  const millisTimestamp = 1542605687323;
  const result = minuteTimestampFromMs(millisTimestamp);
  expect(result).toBe("2018-11-19T05:34");
});

it("can convert a minute timestamp string to a ms timstamp", () => {
  expect(msFromMinuteTimestamp("2018-11-19T07:04")).toBe(1542611040000);
  expect(msFromMinuteTimestamp("2018-11-19T11:42")).toBe(1542627720000);
});
