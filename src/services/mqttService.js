const mqtt = require("mqtt");
const logger = require("../utils/logger");
const Events = require("../models/eventsModel");
const client = mqtt.connect(process.env.MQTT_URI);

client.on("connect", async () => {
  logger.info("MQTT Connected");
  await client.subscribe("device_data");
});

client.on("message", async (topic, message) => {
  let data = message.toString();
  let jsondata = JSON.parse(data);
  console.log(jsondata);
  this.savedata(jsondata);
});

exports.savedata = async (req, res, next) => {
  let response = await Events.create(req);
  console.log(response);

  // await sendToDevice("device_config", Date().toLocaleString());
  await sendToDevice("device_config", "ON");
};

sendToDevice = async (topic, message) => {
  var options = {
    retain: true,
    qos: 1,
  };

  await client.publish(topic, message, options);
};
