// tslint:disable:no-console
const lowerCaseUserAgentString = navigator.userAgent.toLocaleLowerCase();

const userAgentIncludes = (...testStrings) => {
  return testStrings.every(
    testString => lowerCaseUserAgentString.indexOf(testString) > -1
  );
};

export const isAndroidChrome = userAgentIncludes("android", "chrome");

export const isFirefox = userAgentIncludes("firefox");
