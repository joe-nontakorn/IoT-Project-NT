# IoT project



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/vansales/iot-project.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/vansales/iot-project/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)





### 🛠 &nbsp;Requirement Setup System
```
    - install Arduino IDE
    - install Brew with command "/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" "
    - install Extension of Brew with command "brew install wget"
    - install language Python with command "brew install python" 
    - Link language path Python with command "brew link python"
    - install Mosquito MQTT Protocal with command "brew install mosquito"
```

### 🛠 &nbsp;Setup URL Server library Arduino
```
    - Additional Board manager URLS : https://espressif.github.io/arduino-esp32/package_esp32_index.json
    - Open board manager to search "ESP32" and Download ESP32 by Espressif Systems version ^2.0.8
```
  
### 🛠 &nbsp;Setup Library
```
    - How to workspec ais library https://magellan.ais.co.th/sdk-document
    - Open Library Manager
    - Install library OneWireHub last version
    - Install library DallasTemperature last version
    - Install library DS10B20Events last version
    - Install library PZEM004Tv30 last version
    - Install library UUID last version
    - Install library Magellan_SIM7020E last version
```

### 📝 Run Code
```
    - Select user Serial Port DEVIO DEVKIT I
    - Select Board ESP32 Dev Modules
    - Push Upload to Board
```
# AIS DEVIO NB-DEVKIT I Library

![Library Version](https://img.shields.io/badge/Version-1.5.1-green)

This library only supports the [DEVIO NB-DEVKIT I](https://aisplayground.ais.co.th/marketplace/products/WqTKYdlwnhl). If you have any questions or concerns, please reach out to us on [DEVIO FB Fanpage](https://www.facebook.com/AISDEVIO).

## AIS SIM7020E API

The AIS SIM7020E API Library is an Arduino IDE library that has been developed to support platforms that use UDP, MQTT, and MQTTs.

### AIS SIM7020E API Example Code

#### Calling the AIS SIM7020E API Library:
```cpp
#include "AIS_SIM7020E_API.h"
AIS_SIM7020E_API nb;
```
### AIS SIM7020E API Example Code

#### Calling the AIS SIM7020E API Library:
```cpp
#include "AIS_SIM7020E_API.h"
AIS_SIM7020E_API nb;
```

### Initializing the AIS SIM7020E API Library:

**UDP**
```cpp
nb.begin(serverIP,serverPort);
```

**MQTT**
```cpp
nb.begin();
setupMQTT();
//nb.connectMQTT(serverIP,serverPort,clientID);
nb.setCallback(callback);
```
#### Sending Data:

**UDP**
```cpp
nb.sendMsgSTR(serverIP,serverPort,payload);  // Send data in String 
// or
nb.sendMsgHEX(serverIP,serverPort,payload);  // Send data in HexString   
```
**MQTT**
```cpp
nb.publish(topic,payload);  
```
## AIS Magellan Library

The AIS Magellan Library is an SDK for use with the Magellan IoT Platform and the Arduino IDE.

### Magellan SDK Example Code
#### Calling the Magellan Library:
```cpp
#include "Magellan_SIM7020E.h"
Magellan_SIM7020E magel;
```
#### Initializing the Magellan Library:
```cpp
magel.begin();           //init Magellan LIB
```
#### Payload Data:
Please ensure that the payload is in JSON format, for example:
```cpp
payload="{\"Temperature\":"+Temperature+",\"Humidity\":"+Humidity+"}";
```

#### Reporting Data:

Please ensure that the payload is in JSON format, for example:
```cpp
magel.report(payload);
```
#### Magellan Payload Format Examples

**Location**
```cpp
payload="{\"Location\":"Latitude,Longitude"}";
```
**Battery Status on Dashboard**\
Battery must be in the range of 0-100 %
```cpp
payload="{\"Battery\":100}"; 
```
**Lamp Status**\
Send status using 0 or 1.
```cpp
payload="{\"Lamp\":0}";
payload="{\"Lamp\":1}";
```
**Note** For more examples, please refer to the example code included in the Arduino IDE.

### 🛠 &nbsp;MQTT WITH BROKER HIVE MQ

**NODE JS FILE**

  - Extract File "mqtt-server.zip"
  - cd ~/mqtt-server to directory
  - command "npm install"
  - Start service with Command "nodemon index.js"

**Setup Valiable**
```cpp
String       host         = "";               // Your IPaddress or mqtt server url
String       port         = "";               // Your server port
String       clientID     = "";               // Your client id < 120 characters
String       topic        = "";               // Your topic     < 128 characters
String       payload      = "HelloWorld!";    // Your payload   < 500 characters
String       username     = "";    // username for mqtt server, username <= 100 characters
String       password     = "";    // password for mqtt server, password <= 100 characters
unsigned int subQoS       = 0;     // QoS = 0, 1, or 2
unsigned int pubQoS       = 0;     // QoS = 0, 1, or 2
unsigned int pubRetained  = 0;     // retained = 0 or 1
unsigned int pubDuplicate = 0;     // duplicate = 0 or 1

const long    interval       = 10000;    // time in millisecond
unsigned long previousMillis = 0;
int           cnt            = 0;
```
**Pin Install**
```cpp
#define ONE_WIRE_BUS 23  //Temperture Sensor
#define flow_sensor 22 //Waterflow Sensor
#if defined(ESP32)
PZEM004Tv30 pzem(Serial2, 21, 19);
#else
PZEM004Tv30 pzem(Serial2);
#endif
}
```

**Setup MQTT Method**
```cpp
void setupMQTT() {
  if (nb.connectMQTT(host, port, clientID, username, password)) {
    nb.subscribe(topic, subQoS);
  }

  //  nb.unsubscribe(topic);
}
```
and Begin Library 
```cpp
#include "AIS_SIM7020E_API.h"
AIS_SIM7020E_API nb;
```
setup method
```cpp
nb.begin();
setupMQTT();
nb.setCallback(callback);
previousMillis = millis();
```

**SetupMQTT Method**
```cpp
void setupMQTT() {
  if (nb.connectMQTT(host, port, clientID, username, password)) {
    nb.subscribe(topic, subQoS);
  }

  //  nb.unsubscribe(topic);
}
```

**Connect Status Method**
```cpp
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
```

**Callback Method**
```cpp
void callback(String &topic, String &QoS, String &retained, int &msgLen,String &payload) {
  Serial.println("-------------------------------");
  Serial.println("# Message from Topic \"" + topic + "\" : " + 
nb.toString(payload));
  Serial.println("# QoS = " + QoS);
  if (retained.indexOf(F("1")) != -1) {
    Serial.println("# Retained = " + retained);
  }
}
```
**PZEM Method**
Power meter Digital method
```cpp
#include <PZEM004Tv30.h>
```
Get Parameter with method ```cpp pzem_get()```
```cpp
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
    Serial.print("Energy: ");
    Serial.print(energy, 3);
    Serial.println("kWh");
    Serial.print("Frequency: ");
    Serial.print(frequency, 1);
    Serial.println("Hz");
    Serial.print("PF: ");
    Serial.println(pf);
  }
}
```
**temp_get Method**
Temperature method
```cpp
#include <DallasTemperature.h>
```
Get Parameter with method ```cpp temp_get()```
```cpp
void temp_get() {
  sensors.requestTemperatures();
  // Display temperature from each sensor
  for (int i = 0; i < deviceCount; i++) {
    Serial.print("Sensor ");
    Serial.print(i + 1);
    Serial.print(" : ");
    tempC = sensors.getTempCByIndex(i);
    Serial.print(tempC);
    Serial.print(" C | ");
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
```

**water_flow Method**
Temperature method
Get Parameter with method ```cpp water_flow()```
```cpp
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
```

**Json Endcode Method**
```cpp
void request_data() {
  String pkt = "{";
  pkt += "\"uuid\": \"" + uniqueID + "\", ";
  pkt += "\"highpressure\": \"" + highpressuretemp + "\", ";
  pkt += "\"lowpressure\": \"" + lowpressuretemp + "\", ";
  pkt += "\"airflow\": \"" + airflowtemp + "\", ";
  pkt += "\"cooler\": \"" + coolertemp + "\", ";
  pkt += "\"currentpower\": \"" + currentpower + "\", ";
  pkt += "\"currentamp\": \"" + currentamp + "\", ";
  pkt += "\"currentvolt\": \"" + currentvolt + "\", ";
  pkt += "\"currentfrequency\": \"" + currentfrequency + "\", ";
  pkt += "\"currentPF\": \"" + currentPF + "\", ";
  pkt += "\"waterflow\": \"" + waterflow + "\", ";
  pkt += "\"waterpressure\": \"" + waterpressure + "\", ";
  pkt += "\"watertemp\": \"" + watertemp + "\"";
  pkt += "}";
  payload = pkt;
}
```


### 🛠 &nbsp;Tools
![VsCode](https://img.shields.io/badge/VisualStudioCode-007ACC.svg?style=for-the-badge&logo=VisualStudioCode&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37.svg?style=for-the-badge&logo=Postman&logoColor=white)
![Arduino](https://img.shields.io/badge/Arduino-00FFFF.svg?style=for-the-badge&logo=Arduino&logoColor=Black) 
![C++](https://img.shields.io/badge/C++-AA97F0.svg?style=for-the-badge&logo=cplusplus&logoColor=0012A5)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Node.js](https://img.shields.io/badge/Node.js-%23323330.svg?style=for-the-badge&logo=Node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-711E1E.svg?style=for-the-badge&logo=Express&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-gray.svg?style=for-the-badge&logo=Mqtt&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-007500.svg?style=for-the-badge&logo=MongoDB&logoColor=white)
![GitLab](https://img.shields.io/badge/GitLab-DE7900.svg?style=for-the-badge&logo=GitLab&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-F05032.svg?style=for-the-badge&logo=Git&logoColor=ffffff)