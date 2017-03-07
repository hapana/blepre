# Blepre
This is an IFTTT Maker bluetooth presence sensor. Currently running with the Raspberry Pi Zero W.

The way this works is that you run this code on a PI physically located within the zone you want to automate. You specify config for that room including the signal strength, the on and off events used with IFTT maker and the bluetooth MAC addresses you want to allow to control those events. When your bluetooth device goes into range, it will kick off the on event. When it comes out, it'll fire the off event.

This has been tested with a Pebble Time which does get picked up but it's bluetooth announcements go up and down every second or so which causes the on/off events to flap. Your milage may vary depending on the bluetooth device you use.

## Instructions for RPI0W

Modify config and move to config.yml with maker key, room config and the mac addresses to respond on

Run these commands on the Raspberry PI to set it up:

```wpa_passphrase "wifi-essid" "wpapassword" > /etc/wpa_supplicant/wpa_supplicant.conf<br />
sudo wpa_cli reconfigure<br />
update-rc.d ssh enable<br />
wget https://nodejs.org/dist/v4.0.0/node-v4.0.0-linux-armv6l.tar.gz<br />
tar -xvf node-v4.0.0-linux-armv6l.tar.gz<br />
cd node-v4.0.0-linux-armv6l<br />
sudo cp -R * /usr/local/<br />
sudo ln -s /usr/local/bin/node /usr/local/bin/nodejs<br />
sudo apt-get install -y vim git tmux<br />
sudo apt-get install -y bluetooth bluez libbluetooth-dev libudev-dev<br />
npm install<br />```

Then run the app with `sudo node index.js`

## Coming at some point

- Option for sleeping off events so stuff doesn't flap so much
- Init scripts
- Accept ranges of strength so that one sensor can be used for multiple conditions
