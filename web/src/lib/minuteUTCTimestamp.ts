const ISOStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export const minuteTimestampFromMs =(millisTimestamp: number) => {
  const date = new Date(millisTimestamp);
  const ISOString = date.toISOString();
  const truncatedISOSMatch = ISOStringRegex.exec(ISOString);
  if (truncatedISOSMatch === null) {
    throw new Error("Expected string to be in ISO format.");
  }
  const truncatedISOString = truncatedISOSMatch[0];

  return truncatedISOString;
};

export const msFromMinuteTimestamp = (minuteTimeStamp: string) => {
  const date = new Date(`${minuteTimeStamp}:00.000Z`)
  
  return date.getTime();
} 