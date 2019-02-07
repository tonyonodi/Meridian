const express = require("express");
const fetch = require("node-fetch");
const { flatten, uniqBy } = require("lodash");

const port = process.env.PORT || 3001;
const app = express();

const BASE_HOSTTIP_URL = "http://api.ipstack.com";
const BING_API_BASE_URL = "https://dev.virtualearth.net/REST/v1";
const BING_MAP_API_KEY = process.env.BING_MAP_API_KEY;
const IPSTACK_API_KEY = process.env.IPSTACK_API_KEY;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const getIPFromReq = req => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  return ip;
};

const ipLocationsCache = {};

const getCoordsFromIP = async ip => {
  const cachedLocation = ipLocationsCache[ip];
  if (cachedLocation) {
    return cachedLocation;
  }

  const url = `${BASE_HOSTTIP_URL}/${ip}?access_key=${IPSTACK_API_KEY}&format=1`;
  const ipstackResponse = await fetch(url);
  const json = await ipstackResponse.json();
  const coords =
    json.latitude && json.longitude ? [json.latitude, json.longitude] : [0, 0];

  ipLocationsCache[ip] = coords;

  return coords;
};

const getLocationFromReq = req => getCoordsFromIP(getIPFromReq(req));

app.get("/autosuggest/:string", async (req, res) => {
  const userCoords = await getLocationFromReq(req);
  const url = `${BING_API_BASE_URL}/Autosuggest?query=${
    req.params.string
  }&userLocation=${userCoords.join(
    ","
  )},5000&maxResults=10&includeEntityTypes=Place&key=${BING_MAP_API_KEY}`;
  const bingResponse = await fetch(url);
  const json = await bingResponse.json();

  if (json.statusCode !== 200) {
    res.sendStatus(json.statusCode);
    return;
  }

  const suggestions = json.resourceSets[0].resources[0].value;
  console.log(suggestions);

  const suggestionsWithTimezones = (await Promise.all(
    suggestions
      .filter(
        suggestion => suggestion.address && suggestion.address.formattedAddress
      )
      .slice(0, 5)
      .map(async suggestion => {
        const { formattedAddress, countryRegion } = suggestion.address;

        const url = `${BING_API_BASE_URL}/TimeZone/?query=${encodeURI(
          formattedAddress + (countryRegion ? ", " + countryRegion : "")
        )}&key=${BING_MAP_API_KEY}`;

        try {
          const bingResponse = await fetch(url);
          const responseJson = await bingResponse.json();

          const location =
            responseJson.resourceSets[0].resources[0].timeZoneAtLocation[0];
          if (!location) return undefined;

          const timezones = location.timeZone;

          return timezones.map((timezone, _index, timezones) => {
            const locationHasSingleTimezone = timezones.length === 1;

            const niceName = locationHasSingleTimezone
              ? formattedAddress
              : `${timezone.genericName}, ${location.placeName}`;
            return {
              placeName: location.placeName,
              formattedAddress,
              timezone: timezone.ianaTimeZoneId,
              genericName: timezone.genericName,
              niceName,
              fullSuggestion: suggestion,
              fullTimezone: responseJson,
            };
          });
        } catch (e) {
          return undefined;
        }
      })
  )).filter(x => x);

  const flattenedSuggestions = flatten(suggestionsWithTimezones);
  const dedupedSuggestions = uniqBy(flattenedSuggestions, "niceName");

  res.json(dedupedSuggestions);
  res.end();
});

app.get("/timezone/:place", async (req, res) => {
  const url = `${BING_API_BASE_URL}/TimeZone/?query=${
    req.params.place
  }&key=${BING_MAP_API_KEY}`;
  const bingResponse = await fetch(url);
  const json = await bingResponse.json();

  res.json(json);
  res.end();
});

app.get("/my-timezone", async (req, res) => {
  const location = await getLocationFromReq(req);
  const url = `${BING_API_BASE_URL}/TimeZone/point=${encodeURI(
    location.join(",")
  )}?key=${BING_MAP_API_KEY}`;

  const bingResponse = await fetch(url);
  const json = await bingResponse.json();

  res.send({ ...json, estimatedLocation: location });
  res.end();
});

app.get("/android-app", (req, res) => {
  res.redirect(
    "https://play.google.com/store/apps/details?id=co.conchiglie.meridian"
  );
});

app.get("/ios-app", (req, res) => {
  res.redirect("https://itunes.apple.com/gb/genre/ios/id36?mt=8");
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready On Server http://localhost:${port}`);
});
