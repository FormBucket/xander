"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./lib/xander.min.js");
} else {
  module.exports = require("./lib/xander.js");
}
