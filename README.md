# Soracom's sample resin.io Raspberry Pi Application

In order to use a 3G Dongle with ResinOS 2.x and Soracom, you will have to place the sora-mobile GSM configuration file on your device's SD card in /system-connections/
Once this is done, connect the Dongle, boot the device and it should come online on your resin.io dashboard

Our sample Raspberry Pi application uses environment variables to enable a couple of useful features which optimise bandwidth usage and leverage Soracom Harvest and Gate services:
* SSH_PASSWD: when set, this will start sshd and set root password to SSH_PASSWD
* CELLULAR_ONLY: This option disables WiFi
* CONSOLE_LOGGING: Set to 1 in order to get application logs in Resin.io device console, otherwise logs are written to /data/soracom.log
* DEBUG: Set to 1 to have debug logging, use in combination with CONSOLE_LOGGING to see logs in resin.io device console
* SORACOM_HARVEST_INTERVAL: Set the time interval in mili-seconds to publish device data to Soracom Harvest Analytics service, be sure to use together with CELLULAR_ONLY as Harvest identifies devices using their connected Soracom SIM card.