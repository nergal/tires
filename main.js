/* npm i -S request lodash dotenv-flow */

require("dotenv-flow").config();

const request = require("request");
const {
  map,
  get,
  mapValues,
  compose,
  cond,
  matches,
  last,
  stubTrue,
  isNull,
  first,
  mean,
  stubFalse,
  constant,
  lt,
  gte,
  at,
  zipObject,
  flatMap,
  some,
} = require("lodash/fp");
const { enrichObject, extractArguments } = require("./helpers");

const { URL, TOKEN, TRASHOLD, MONTH_TRASHOLD } = process.env;

request(
  {
    method: "GET",
    url: URL,
    headers: {
      Token: TOKEN,
    },
    json: true,
  },
  compose(
    console.log,
    some(Boolean),
    flatMap("timeToChange"),
    map(
      enrichObject(
        "timeToChange",
        compose(
          cond([
            [constant(new Date().getMonth() > MONTH_TRASHOLD), gte(TRASHOLD)],
            [stubTrue, lt(TRASHOLD)],
          ]),
          get("temp")
        )
      )
    ),
    map.convert({ cap: false })(
      compose(zipObject(["temp", "date"]), extractArguments)
    ),
    mapValues(
      compose(
        mean,
        map(compose(mean, at(["temperature.low", "temperature.high"]))),
        get("forecast")
      )
    ),
    cond([
      [matches({ state: "success" }), get("data.weather")],
      [stubTrue, compose(stubFalse, console.error, get("message"))],
    ]),
    cond([
      [compose(isNull, first), last],
      [stubTrue, compose(stubFalse, console.error, first)],
    ]),
    extractArguments
  )
);
