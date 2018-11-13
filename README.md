# Arduino-Yun-MQTT

Una forma de comunicar Arduino Yun con otros sistemas es a traves de mensajes de colas como MQTT.

MQTT (Message Queue Telemetry Transport) es un protocolo de conectividad enfocado a M2M (machine-to-machine) y al IOT (Internet of Things) ya que se ha diseñado para ser un protocolo de mensajería extremadamente ligero basado en TCP.

Los mensajes se intercambian a través de un servidor de mensajería de MQTT (Broker). El cliente y el servidor de MQTT manejan las complejidades de entregar mensajes de forma fiable para la aplicación móvil y mantener bajo el precio de la gestión de red.

Unas de sus ventajas son:

  - Está especialmente adaptado para utilizar un ancho de banda mínimo
  - Es ideal para utilizar redes inalámbricas
  - Consume muy poca energía
  - Es muy rápido y posibilita un tiempo de respuesta superior al resto de protocolos web actuales
  - Permite una gran fiabilidad si es necesario
  - Requiere pocos recursos procesadores y memorias

# Pre-requisitos:
  - Instalar [Node.js](https://nodejs.org/en/).
  - Instalar [IDE Arduino](https://www.arduino.cc/en/Main/Software).

# Instalación:
  - Instalar [Mosquitto](http://mosquitto.org/download/). 
  - Instalar el [npm mqtt](https://www.npmjs.com/package/mqtt).
  ```sh
  $ npm install mqtt --save
  ```
  - Instalar Libreria Arduino [pubsubclient](https://github.com/knolleary/pubsubclient).

# Desarrollo
  - Crear archivo MQTT.js para el servidor.
    ```sh
    var mqtt = require('mqtt')
    var client  = mqtt.connect('mqtt://localhost:1883')
 
    client.on('connect', function () {
      client.subscribe('outTopic')
      client.publish('inTopic', 'Hello Arduino')
    })
 
    client.on('message', function (topic, message,packet) { 
      console.log(`Mensaje ${message.toString()}`)
      client.end()
    })
    ```
  - Crear codigo Arduino, y cargarlo en la Arduino Yun
    ```sh
    #include <Bridge.h>
    #include <BridgeClient.h>
    #include <PubSubClient.h>

    IPAddress server(192, 168, 1, 88); //Ip de Servidor donde se levanto Mosquitto

    BridgeClient briClient;
    PubSubClient client(briClient);

    void callback(char* topic, byte* payload, unsigned int length) {
      Serial.print("Mensaje recivido [");
      Serial.print(topic);
      Serial.print("] ");
      for (int i=0;i<length;i++) {
        Serial.print((char)payload[i]);
      }
      Serial.println();
      client.publish("outTopic","Hello Node.js");
    }

    void reconnect() {
      while (!client.connected()) {
        Serial.print("MQTT conectando...");
        if(client.connect("")){
          Serial.println("conectado !");
          client.publish("outTopic","Hello Node.js");
          client.subscribe("inTopic");
        }else{
          Serial.print("fallo, rc=");
          Serial.print(client.state());
          Serial.println(" try again in 5 seconds");
          delay(5000);
        }
      }
    }

    void setup(){
      Serial.begin(57600);
      client.setServer(server, 1883);
      client.setCallback(callback);
      Bridge.begin();
      delay(1500);
    }

    void loop(){
      if(!client.connected()) {
        reconnect();
      }
      client.loop();
    }
    ```
# Ejecución
  - Ejecutar mosquitto.
  - Cargar el Código a la Arduino Yun
  - Ejecutar en codigo de Node.js
  
  ![alt text](https://4.bp.blogspot.com/-KPck_fy-BOQ/WBp7i3-awtI/AAAAAAAABNU/LaQaD1KVxucBL5OSwjqy11RXMO4ON6pMgCLcB/s1600/img3.jpg)
