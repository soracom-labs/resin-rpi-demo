# Soracom's sample resin.io Raspberry Pi Application

Our sample Raspberry Pi application uses environment variables to enable a couple of useful features to optimize bandwidth usage and leverage Soracom Harvest and Gate services:
* SSH_PASSWD: when set, this will start sshd and set root password to SSH_PASSWD
* CELLULAR_ONLY: This option disables WiFi
* CONSOLE_LOGGING: Set to 1 in order to get application logs in Resin.io device console, otherwise logs are written to /data/soracom.log
* DEBUG: Set to 1 to have debug logging, use in combination with CONSOLE_LOGGING to see logs in resin.io device console
* SORACOM_HARVEST_INTERVAL: Set the time internaval in miliseconds to publish device data to Soracom Harvest Analytics service