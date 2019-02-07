const lowerCaseUserAgentString = navigator.userAgent.toLocaleLowerCase();

const userAgentIncludes = (...testStrings: Array<string | RegExp>) => {
  return testStrings.every(testString => {
    if (typeof testString === "string") {
      return lowerCaseUserAgentString.indexOf(testString) > -1;
    } else {
      return testString.test(lowerCaseUserAgentString);
    }
  });
};

export const isChrome = userAgentIncludes("chrome");

export const isAndroidChrome = userAgentIncludes("android", "chrome");

export const isFirefox = userAgentIncludes("firefox");

export const isSafari = userAgentIncludes(
  /safari/,
  /^((?!(chrome|android)).)*$/
);

export const isiOS = /iPad|iPhone|iPod/i.test(lowerCaseUserAgentString);

export const isAndroid = userAgentIncludes("android");

export const isCordova = !/^https?:\/\//.exec(document.URL);
