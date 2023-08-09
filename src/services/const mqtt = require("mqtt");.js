const mqtt = require("mqtt");
const logger = require("../utils/logger");
const Events = require("../models/eventsModel");
const client = mqtt.connect(process.env.MQTT_URI);

client.on("connect", async () => {
  logger.info("MQTT Connected");
  await client.subscribe("device_data");
});

client.on("message", function (topic, message, packet) {
  console.log("message is " + message);
  console.log(JSON.parse(message));
  console.log("topic is " + topic);
  // console.log("packet =" +JSON.stringify(packet));
  // console.log("packet retain =" +packet.retain);

  var options = {
    retain: true,
    qos: 1,
  };

  client.publish("device_config", Date().toLocaleString(), options);
});

exports.savedata = async (req, res, next) => {
  let response = await Events.create(req);
  // console.log(response);

  // await sendToApplicaiton(topic_ws_send, Date().toLocaleString());
};

sendToApplicaiton = async (topic, msg) => {
  console.log("[WS Sending] data to Applications message:", msg);
  await client.publish("postback", msg);
};
