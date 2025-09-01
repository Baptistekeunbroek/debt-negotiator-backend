const { VapiClient } = require("@vapi-ai/server-sdk");
require("dotenv").config();

const vapi = new VapiClient({
  token: process.env.PRIVATE_VAPI,
});

module.exports = vapi;
