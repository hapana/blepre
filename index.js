/*
  Continously scans for peripherals and prints out message when they enter/exit
    In range criteria:      RSSI < threshold
    Out of range criteria:  lastSeen > grace period
  based on code provided by: Mattias Ask (http://www.dittlof.com)
*/

var fs   = require('fs');
var path = require('path');
var util = require('util');
var noble = require('noble');
var yaml  = require('js-yaml');

var filename = path.join(__dirname, 'config.yml'),
      contents = fs.readFileSync(filename, 'utf8'),
      config   = yaml.load(contents);

console.log(config['rooms'][config.room]['event'])

var IFTTT = require('node-ifttt-maker'),
    ifttt = new IFTTT(config.maker.key);

var RSSI_THRESHOLD    = -90;
var EXIT_GRACE_PERIOD = config['timeout']; // milliseconds

// Setup Array
var inRange = [];

function makereq(event) {
    ifttt.request({
        event: event,
        method: 'GET'
    }, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(event + ' - OK');
        }
    });
}

// If stuff is discovered
noble.on('discover', function(peripheral) {
  // If the peripheral is not within range then exit
  if (peripheral.rssi < config['rooms'][config.room]['signal']) {
    // ignore
    return;
  }

  // Set id of the device
  var id = peripheral.id;
  var entered = !inRange[id];

  // Save the peripheral data as json in the array
  if (entered) {
    inRange[id] = {
      peripheral: peripheral
    };


    for (var i = 0, len = config.whitelist.length; i < len; i++) {
        if (config.debug){ console.log("Device bt is " + peripheral.address); }
        if (peripheral.address == config.whitelist[i]){
            if (config.debug){ console.log("approved"); }
                // Log on discovery
                console.log('"' + peripheral.advertisement.localName + '" with an address of "' + peripheral.address + '" entered (RSSI ' + peripheral.rssi + ') ' + new Date());
            makereq(config['rooms'][config.room]['on-event']);
        }
    }

  }

  // Set last seen attribute on the object in the array
  inRange[id].lastSeen = Date.now();
});

setInterval(function() {
  // Iterate through array
  for (var id in inRange) {
    if (inRange[id].lastSeen < (Date.now() - EXIT_GRACE_PERIOD)) {
      var peripheral = inRange[id].peripheral;
      for (var i = 0, len = config.whitelist.length; i < len; i++) {
          if (peripheral.address == config.whitelist[i]){ 
            console.log('"' + peripheral.advertisement.localName + '" exited (RSSI ' + peripheral.rssi + ') ' + new Date());
            makereq(config['rooms'][config.room]['off-event']);
          }
      }    
    
      delete inRange[id];
    }
  }
}, EXIT_GRACE_PERIOD / 2);

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});
