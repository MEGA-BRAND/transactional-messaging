const { config } = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

config();

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

const FROM_NUMBER = "+1(659)257-6822";

(async () => {

  const { data, error } = await supabase
  .from('contacts')
  .select("*");

  if (!!error) {
    console.error("-> failed to fetch contacts", error);
    return;
  }
  const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  const promises = data.map((c) => {
    client.messages
      .create({
         body: `This is a test message ${c.name} https://google.com`,
         from: FROM_NUMBER,
         to: "+351" + c.phoneNumber
       });
  });
  try {
    await Promise.all(promises);
    console.log("-> messages sent")
  } catch (err) {
    console.error("-> failed to send some message", err);
  }
})();