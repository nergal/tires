const extractArguments = (...args) => args;

const enrichObject = (property, value) => (obj) =>
  Object.assign(obj, {
    [property]: value(obj),
  });

module.exports = { extractArguments, enrichObject };
