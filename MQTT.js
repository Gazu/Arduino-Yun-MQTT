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
