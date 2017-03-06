# Blepre
This is an IFTTT Maker bluetooth presence sensor. Currently running with the Raspberry Pi Zero W

## Instructions for RPI0W

Modify config and move to config.yml with maker key, room config and the mac addresses to respond on

Run these commands on the Raspberry PI to set it up:

```wpa_passphrase "wifi-essid" "wpapassword" > /etc/wpa_supplicant/wpa_supplicant.conf
sudo wpa_cli reconfigure
update-rc.d ssh enable
wget https://nodejs.org/dist/v4.0.0/node-v4.0.0-linux-armv6l.tar.gz 
tar -xvf node-v4.0.0-linux-armv6l.tar.gz 
cd node-v4.0.0-linux-armv6l
sudo cp -R * /usr/local/
sudo ln -s /usr/local/bin/node /usr/local/bin/nodejs
sudo apt-get install -y vim git screen
sudo apt-get install -y bluetooth bluez libbluetooth-dev libudev-dev
npm install```

Then run the app with `sudo node index.js`

## Coming at some point

- Option for sleeping off events so stuff doesn't flap so much
- Init scripts 
- Actually get this to work with a Raspberry Pi Zero W :-/
