const lowerCaseUserAgentString = navigator.userAgent.toLocaleLowerCase();

const userAgentIncludes = (...testStrings: string[]) => {
  return testStrings.every(
    testString => lowerCaseUserAgentString.indexOf(testString) > -1
  );
};

export const isChrome = userAgentIncludes("chrome");

export const isAndroidChrome = userAgentIncludes("android", "chrome");

export const isFirefox = userAgentIncludes("firefox");

export const isiOS = /iPad|iPhone|iPod/i.test(lowerCaseUserAgentString);

export const isAndroid = userAgentIncludes("android");

export const isCordova = !/^https?:\/\//.exec(document.URL);
