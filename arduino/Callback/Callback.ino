#include "AIS_SIM7020E_API.h"
#include "Magellan_SIM7020E.h"

#include <OneWire.h>
#include <DallasTemperature.h>
#include <PZEM004Tv30.h>
#include "UUID.h"
#include <ArduinoJson.h>

AIS_SIM7020E_API nb;

#define ONE_WIRE_BUS 23  //กำหนดขาที่จะเชื่อมต่อ Sensor
#define flow_sensor 22
#if defined(ESP32)
PZEM004Tv30 pzem(Serial2, 21, 19);
#define relayPin 25

#else
PZEM004Tv30 pzem(Serial2);
#endif
// String payload ="hello world";
String payload;
String payload1;
String payload2 = "hell world";
String payload3;
String payload4;
String payload5;


Magellan_SIM7020E magel;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

int deviceCount = 0;
UUID uuid;
String UUID = "";
String uniqueID = "deviotest-001";
float tempC;
DynamicJsonDocument doc(1024);
String waterflow = "0";
String waterpressure = "0";
String highpressuretemp = "0";
String lowpressuretemp = "0";
String watertemp = "0";
String airflowtemp = "0";
String coolertemp = "0";
String currentpower = "0";
String currentamp = "0";
String currentvolt = "0";
String currentfrequency = "0";
String currentenergy = "0";
String currentPF = "0";
String relay = "";
String device_id = "Device0001";

String postback = "device_config/relay1";

const char *mqtt_server = "13.212.44.97";
const char *mqtt_port = "1883";
const char *mqtt_user = "Device0001";
const char *mqtt_password = "Device0001";
const char *mqtt_clientId = "Deivce_Device0001";
const char *topic_publish = "Device_data";
const char *topic_subscribe = "JPLearning_CommandRequest";
unsigned int subQoS       = 2;     // QoS = 0, 1, or 2
unsigned int pubQoS       = 2;     // QoS = 0, 1, or 2
unsigned int pubRetained  = 0;     // retained = 0 or 1
unsigned int pubDuplicate = 0;     // duplicate = 0 or 1

const long    interval       = 10000;    // time in millisecond
unsigned long previousMillis = 0;
int           cnt            = 0;

void setup() {
  Serial.begin(19200);
  nb.begin();
  setupMQTT();
  nb.setCallback(callback);
  // previousMillis = millis();
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);
  sensors.begin();
  Serial.println(uuid);
  pinMode(flow_sensor, INPUT);
  Serial.print("Locating devices...");
  Serial.print("Found ");
  deviceCount = sensors.getDeviceCount();
  Serial.print(deviceCount, DEC);
  Serial.println(" devices.");
  Serial.println("");
}

void loop() {
  nb.MQTTresponse();
  callback;
  // nb.subscribe(postback,payload);
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    cnt++;
    // nb.MQTTresponse();
    connectStatus();
    // nb.subscribe(message, subQoS);
    sensor_data();
    temp_get();
    Serial.println("");
    water_flow();
    pzem_get();
    Serial.println("Relay state: "+ relay);
    Serial.println("");
    // Serial.println("Relay state: "+ relay);
    // Serial.println(relay);

    previousMillis = currentMillis;
    // callback;
  }
}
//=========== MQTT Function ================
void setupMQTT() {
  if (nb.connectMQTT(mqtt_server, mqtt_port, mqtt_clientId, mqtt_user, mqtt_password)) {
    nb.subscribe(postback, subQoS);
  }
}

void connectStatus() {
  if (!nb.MQTTstatus()) {
    if (!nb.checkNetworkConnection()) {
      Serial.println("reconnectNB ");
      nb.begin();
    }
    Serial.println("reconnectMQ ");
    setupMQTT();
  }
}

String hexToString(const String &payload){
  String result = "";
  for (int i = 0; i < payload.length(); i += 2)
  {
    String hexPair = payload.substring(i, i + 2);
    char decValue = strtol(hexPair.c_str(), NULL, 16);
    result += decValue;
  }
  return result;
}

void callback(String &topic, String &QoS, String &retained, int &msgLen,
      String &payload) {
  String message = hexToString(payload);            // Convert hexadecimal payload to ASCII
  // String message = payload;            // Convert hexadecimal payload to ASCII
  // Process the received message
  if (message.equals("ON"))
  {
    // Turn the relay ON
    digitalWrite(relayPin, HIGH);
    relay = "ON";
    Serial.println("Relay turned ON");
  }
  else if (message.equals("OFF"))
  {
    // Turn the relay OFF
    digitalWrite(relayPin, LOW);
    relay = "OFF";
    Serial.println("Relay turned OFF");
  }
  Serial.println("---------------callback----------------");
  Serial.println("# Received message: \"" + postback + "\" : " + nb.toString(payload));
  Serial.println("# QoS = " + QoS);
  if (retained.indexOf(F("1")) != -1) {
    Serial.println("# Retained = " + retained);
  }
}

void temp_get() {
  sensors.requestTemperatures();
  // Display temperature from each sensor
  for (int i = 0; i < deviceCount; i++) {
    Serial.print("Sensor ");
    Serial.print(i + 1);
    Serial.print(" : ");
    tempC = sensors.getTempCByIndex(i);
    Serial.print(tempC);
    Serial.print(" C ํ ");
    if (i == 0) {
      highpressuretemp = tempC;
    } else if (i == 1) {
      lowpressuretemp = String(tempC);
    } else if (i == 2) {
      watertemp = String(tempC);
    } else if (i == 3) {
      airflowtemp = String(tempC);
    } else if (i == 4) {
      coolertemp = String(tempC);
    }
  }
}

void water_flow() {
  uint32_t pulse = pulseIn(flow_sensor, HIGH);
  if (pulse < 1) {
    Serial.println("0.00 L/minute");
    waterflow = "0";
    waterpressure = "0";
  }

  else {
    float Hz = 1 / (2 * pulse * pow(10, -6));
    float flow = 7.2725 * (float)Hz + 3.2094;
    float PSI = 0.5 * (flow / 60 * flow / 60) / 100;
    waterflow = String(flow);
    waterpressure = String(PSI);
    // Serial.print(Hz);
    // Serial.print("Hz\t");
    Serial.print(flow / 60);
    Serial.println(" L/minute");
    Serial.println(" ");
    Serial.print(PSI);
    Serial.println(" PSI");
    // water = String(flow / 60);
  }
}

void pzem_get() {
 // Read the data from the sensor
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  float frequency = pzem.frequency();
  float pf = pzem.pf();

  // Check if the data is valid
  if (isnan(voltage)) {
    Serial.println("Error reading voltage");
  } else if (isnan(current)) {
    Serial.println("Error reading current");
  } else if (isnan(power)) {
    Serial.println("Error reading power");
  } else if (isnan(energy)) {
    Serial.println("Error reading energy");
  } else if (isnan(frequency)) {
    Serial.println("Error reading frequency");
  } else if (isnan(pf)) {
    Serial.println("Error reading power factor");
  } else {
    // Print the values to the Serial console
    currentpower = String(power);
    currentamp = String(current);
    currentvolt = String(voltage);
    currentfrequency = String(frequency);
    currentenergy = String((energy, 3));
    currentPF = String(pf);
    Serial.print("Voltage: ");
    Serial.print(voltage);
    Serial.println("V");
    Serial.print("Current: ");
    Serial.print(current);
    Serial.println("A");
    Serial.print("Power: ");
    Serial.print(power);
    Serial.println("W");
    // Serial.print("Energy: ");
    // Serial.print(energy, 3);
    // Serial.println("kWh");
    // Serial.print("Frequency: ");f
    // Serial.print(frequency, 1);
    // Serial.println("Hz");
    // Serial.print("PF: ");
    // Serial.println(pf);
  }
}

void sensor_data() {
   DynamicJsonDocument doc(1024);
  doc["uuid"] = "3296eea7-767d-4519-a6d2-03595f9d7b7a";
  doc["clienID"] = "DEVICEID001";
  doc["highPressure"] = highpressuretemp;
  doc["lowPressure"] = lowpressuretemp;
  doc["airflow"] = airflowtemp;
  doc["cooler"] = coolertemp;
  doc["watertemp"] = watertemp;
  doc["waterflow"] = waterflow;
  doc["waterpressure"] = waterpressure;
  doc["watt"] = currentpower;
  doc["amp"] = currentamp;
  doc["volt"] = currentvolt;
  doc["relay"] = relay;
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  // Publish the sensor data to the MQTT 
  nb.publish(topic_publish, jsonPayload.c_str(), pubQoS, pubRetained, pubDuplicate);
}

