import { WINDOW_HEIGHT_IN_MS } from "../config";

export default ({ time, t_0 }: { time: number; t_0: number }) => {
  const windowBottomMS = t_0 - WINDOW_HEIGHT_IN_MS / 2;
  const timeBottomOffset = time - windowBottomMS;
  const fractionOffset = timeBottomOffset / WINDOW_HEIGHT_IN_MS;

  return fractionOffset;
};
