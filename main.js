const { config } = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

config();

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

const FROM_NUMBER = "MEGA";

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
         body: `${c.name} manda-me um print disto`,
         from: FROM_NUMBER,
         to: c.phoneNumber[0] === "+" ? c.phoneNumber : "+351" + c.phoneNumber
       });
  });
  try {
    await Promise.all(promises.map(p => p.catch(error => { 
      console.log("-> failed to send message:");
      console.error(error); 
    })));
    console.log("-> messages sent")
  } catch (err) {
    console.error("-> something failed");
  }
})();