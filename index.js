"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./lib/hrx.min.js");
} else {
  module.exports = require("./lib/hrx.js");
}
