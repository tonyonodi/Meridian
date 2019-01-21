const express = require("express");
const fetch = require("node-fetch");

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
  const coords = [json.latitude, json.longitude];

  ipLocationsCache[ip] = coords;

  return coords;
};

const getLocationFromReq = req => getCoordsFromIP(getIPFromReq(req));

app.get("/timezone/:place", async (req, res) => {
  const url = `${BING_API_BASE_URL}/TimeZone/?query=${
    req.params.place
  }&key=${BING_MAP_API_KEY}`;
  const bingResponse = await fetch(url);
  const json = await bingResponse.json();

  res.json(json);
  res.end();
});

app.get("/autosuggest/:string", async (req, res) => {
  const userCoords = await getLocationFromReq(req);
  const url = `${BING_API_BASE_URL}/Autosuggest?query=${
    req.params.string
  }&userLocation=${userCoords.join(
    ","
  )},5000&maxResults=10&includeEntityTypes=Place&key=${BING_MAP_API_KEY}`;
  const bingResponse = await fetch(url);
  const json = await bingResponse.json();

  if (json.statusCode === 200) {
    res.send(json.resourceSets[0].resources[0].value);
    res.end();
  }

  res.json(json);
  res.end();
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready On Server http://localhost:${port}`);
});
