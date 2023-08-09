/*
Welcome to JP Learning
*/
const express = require("express");
const mqtt = require("mqtt");
const shortId = require("shortid");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");

const app = express();
const port_client = 8080;
app.use(express.json());

// Enable cors on all requests.
app.use(cors());
app.options("*", cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Import Models
const Users = require("./models/usersModel");
const Events = require("./models/eventsModel");

const topic_mqtt_receive = "JPLearning_SensorData";
const topic_mqtt_send = "JPLearning_CommandRequest";
const topic_ws_receive = "JPLearning_CommandRequest";
const topic_ws_send = "JPLearning_SensorData";

// HTTP POST Method
app.post("/users", async (req, res) => {
  console.log("POST Request");

  // res.send('Got a POST request')

  let user = req.body;
  console.log("body:", user);

  user = new Users(user);
  console.log("user1:", user);

  user = await user.save();
  console.log("user:", user);

  return res.status(201).json(user);
});

// HTTP GET Method
app.get("/users", async (req, res) => {
  console.log("GET Request");

  // res.send('Assalam-o-Alaikum Hello World! Welcome to JP Learning :)')

  let users = await Users.find({});

  console.log("users:", users);

  return res.status(200).json(users);
});

// HTTP GET by ID Method
app.get("/users/:id", async (req, res) => {
  console.log("GET Request");

  // res.send('Assalam-o-Alaikum Hello World! Welcome to JP Learning :)')

  console.log("id:", req.params.id);
  // let user = await Users.findById(req.params.id);
  let user = await Users.findOne({ _id: req.params.id });

  console.log("user:", user);

  return res.status(200).json(user);
});

// HTTP PUT Method
app.put("/users/:id", async (req, res) => {
  console.log("PUT Request");

  // res.send('Got a PUT request at / device')

  console.log("id:", req.params.id);
  console.log("body:", req.body);

  // let user = await Users.findByIdAndUpdate(req.params.id, req.body);
  let user = await Users.findOneAndUpdate({ _id: req.params.id }, req.body);

  user = await Users.findById(req.params.id);

  console.log("user:", user);

  return res.status(200).json(user);
});

// HTTP DELETE Method
app.delete("/users/:id", async (req, res) => {
  console.log("DELETE Request");

  // res.send('Got a DELETE request at /device')

  console.log("id:", req.params.id);

  // let user = await Users.findByIdAndDelete(req.params.id);
  // let user = await Users.findByIdAndRemove(req.params.id);

  // let user = await Users.findOneAndDelete({ _id: req.params.id });
  let user = await Users.findOneAndRemove({ _id: req.params.id });

  console.log("user:", user);

  return res.status(200).json(user);
});

// HTTP GET last events of all devices
app.get("/events", async (req, res) => {
  console.log("GET Request for Events");

  let events = [];

  // let eventTemperature = await Events.findOne({ type: 'Temperature' }).sort({ created: -1 }).limit(1);
  let eventTemperature = await Events.findOne({ type: "Temperature" }).sort({
    created: -1,
  });
  if (eventTemperature) {
    events.push(eventTemperature);
  }

  let eventHumidity = await Events.findOne({ type: "Humidity" }).sort({
    created: -1,
  });
  if (eventHumidity) {
    events.push(eventHumidity);
  }

  let eventLight = await Events.findOne({ type: "Light" }).sort({
    created: -1,
  });
  if (eventLight) {
    events.push(eventLight);
  }

  console.log("events:", events);

  return res.status(200).json(events);
});

app.get("/devicedata", async (req, res) => {
  const devicedata = await Events.find({});
  console.log(`get data`);
  res.json(devicedata);
});

// HTTP GET by DeviceId and Type Method
app.get("/events/deviceId/:deviceId/type/:type", async (req, res) => {
  console.log("GET Request for Events");

  console.log("deviceId:", req.params.deviceId);
  console.log("type:", req.params.type);
  let events = await Events.find({
    device_id: req.params.deviceId,
    type: req.params.type,
  });

  console.log("events:", events);

  return res.status(200).json(events);
});

// HTTP GET last event by DeviceId and Type Method
app.get("/events/last/deviceId/:deviceId/type/:type", async (req, res) => {
  console.log("GET Request for Last Events");

  console.log("deviceId:", req.params.deviceId);
  console.log("type:", req.params.type);
  // let eventTemperature = await Events.findOne({ device_id: req.params.deviceId, type: req.params.type }).sort({ created: -1 }).limit(1);
  let event = await Events.findOne({
    device_id: req.params.deviceId,
    type: req.params.type,
  }).sort({ created: -1 });

  console.log("event:", event);

  return res.status(200).json(event);
});

// MongoDB Connection Success
mongoose.connection.on("connected", async () => {
  console.log("MongoDb connected");
});

// MongoDB Connection Fail
mongoose.connection.on("error", async (err) => {
  console.log("Error connecting MongoDb", err);
});

server.listen(port_client, async () => {
  // Connect MongoDb
  await mongoose.connect(
    "mongodb+srv://joejoe199:joe162540@cluster1.5wsxllu.mongodb.net/test3"
  );

  console.log(`Example app listening on port ${port_client}`);
});
// WebSocket(Socket.IO)

io.on("connection", async (client) => {
  console.log("Client Connected");
  console.log(client.id);

  client.on(topic_ws_receive, async (data) => {
    console.log("[WS Received] Data:", data);
    console.log("[WS Received] Data.device_id:", data.device_id);

    // Send command to device
    await sendToDevice(topic_mqtt_send, data);
  });
});

// setInterval(async () => {
//     await sendToApplicaiton('time', new Date().toTimeString());
// }, 1000);

sendToApplicaiton = async (topic, msg) => {
  console.log("\n[WS Sending] data to Applications message:", msg);
  await io.emit(topic, msg);
};

// MQTT(HiveMQ)

// const client = mqtt.connect(
//   "mqtt://cd098bcd38d74584a8a527be38893f5b.s1.eu.hivemq.cloud.com:8883"
// );

// var options = {
//   host: "ff73b5e35bf449a6af0e5e961b9652d9.s1.eu.hivemq.cloud",
//   port: "8883",
//   protocol: "mqtts",
//   username: "Device0001",
//   password: "Device0001",
// };

// initialize the MQTT client
// const client = mqtt.connect(
//   "tls://ff73b5e35bf449a6af0e5e961b9652d9.s1.eu.hivemq.cloud:8883",
//   {
//     username: "Devioserver555",
//     password: "Devioserver555",
//   }
// );
// const client = mqtt.connect(options);
const client = mqtt.connect("mqtt://13.212.44.97:1883");

client.on("connect", async () => {
  console.log("MQTT Connected");

  await client.subscribe(topic_mqtt_receive);
});

client.on("message", async (topic, message) => {
  // console.log('\n[MQTT Received] Topic:', topic, ', Message:', message.toString());

  // let data = message;
  let data = message.toString();
  console.log(data);

  data = JSON.parse(data);
  // data._id = data['uuid'];
  data.created = moment().utc().add(5, "hours");
  var device = await Events.find({});
  console.log(device);
  if (device.length == 0) {
    await saveData(data);
    console.log('f save');
  } else {
    var devicedata = await Events.find({ uuid: data["uuid"] });
    var id = devicedata._id;
    console.log('data search');
    console.log(devicedata);
    if (devicedata == null||devicedata.length==0) {
      console.log('null save');
    
      await saveData(data);
    } else {
      console.log('have save');
      // await updataData(data, id);

      await saveData(data, id);

      // await updataData(data, id);
    }
  }

  // Save live data into database
});

saveData = async (data) => {
  data = new Events(data);

  data = await data.save();
  console.log("Saved data:", data); 

  // Send live data to applications
  await sendToApplicaiton(topic_ws_send, data);
};

// saveData = async (data, id) => {
updataData = async (data, id) => {
  data = new Events(data);
  console.log(data);
  data = await Events.findOneAndUpdate(
    { uuid: data["uuid"], _id: id },
    {
      $set: data,
    }
  );
  await sendToApplicaiton(topic_ws_send, Date().toLocaleString());
};

sendToDevice = async (topic, message) => {
  console.log("\n[MQTT Sending] data to Device message:", message);

  let data = JSON.stringify(message);
  // data = JSON.parse(data);
  await client.publish(topic, data);
};
