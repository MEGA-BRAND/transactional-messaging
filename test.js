const { config } = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

config();

(async () => {
  try {
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    client.messages
    .create({
       body: `This is just a test`,
       from: "MEGA",
       to: "****"
     });
    console.log("-> messages sent")
  } catch (err) {
    console.error("-> failed to send some message", err);
  }
})();