export const MERIDIAN_API_URL = "https://api.meridianapp.co";

export const VIEWPORT_HEIGHT_IN_HOURS = 12;

export const VIEWPORT_HEIGHT_IN_MS = VIEWPORT_HEIGHT_IN_HOURS * 3600 * 1000;

export const DAY_IN_MS = 24 * 3600 * 1000;

export const WINDOW_HEIGHT_IN_DAYS = 100;

export const WINDOW_HEIGHT_IN_MS = WINDOW_HEIGHT_IN_DAYS * DAY_IN_MS;

export const LOCATION_NAME_WIDTH = 21;

export const TIMELINE_WIDTH = 75;

export const PARENT_VIEW_WIDTH = TIMELINE_WIDTH + LOCATION_NAME_WIDTH;

export const DEFAULT_UI_BUTTON_COLOR = "#0a4254";

export const PALETTE: Array<[number, number, number]> = [
  [109, 211, 206],
  [200, 233, 160],
  [247, 162, 120],
  [161, 61, 99],
  [53, 30, 41],
];

export const SCROLL_BOUNDARY_FRACTION = 0.45;

export const DRAFT_WAYPOINT_ELEMENT_WIDTH = 200;

export const DRAFT_WAYPOINT_ELEMENT_MARGIN_LEFT = 37;

export const DRAFT_WAYPOINT_ELEMENT_TOTAL_WIDTH =
  DRAFT_WAYPOINT_ELEMENT_WIDTH + DRAFT_WAYPOINT_ELEMENT_MARGIN_LEFT;

export const MAIN_BACKGROUND_COLOR = [25, 100, 126];

export const DARK_TEXT = [7, 26, 33];

export const DURATION_LINE_COLOR = [216, 53, 53];

export const HEADER_HEIGHT = 50;

export const BACKGROUND_WHITE = [238, 238, 239];

export const WAYPOINT_RADIUS = 18;
