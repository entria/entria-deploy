const config = require('../babel.config');

const transformer = require('babel-jest');

module.exports = transformer.default.createTransformer({
  ...config,
});
