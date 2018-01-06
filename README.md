# Soracom's sample resin.io NodeJS x Cellular based Application
This sample Application demonstrates how to use Resin.io based App+Device that runs with a Cellular based connection and leverages a NodeJS based docker image that publishes device data to Soracom's IoT platform.  
This has been tested on Raspberry Pi 3, Raspberry Pi Zero, Raspberry Pi B+ and Nvidia JETSON TX2. It has been designed to work on all current and future devices supported by resin.io  
This application also leverages Soracom's Harvest service which lets you store and visualise data linked to your Soracom SIM cards.   

# Setup  
1. In order to use a 3G Dongle with ResinOS 2.x and Soracom, you will have two choices after creating your Resin.io based App+Device:  
    1. Place the soracom GSM configuration file on your device's SD card in /system-connections/ using the following command: `cp soracom-resin/soracom /Volume/resin-boot/system-connections/`  
  
1. In your resin.io Application, please make sure to set the following Fleet Configuration variables to ensure that your Cellular modem has enough power:  
    1. RESIN_HOST_CONFIG_max_usb_current = 1  
    1. RESIN_HOST_CONGIG_safe_mode_gpio = 4  
  
1.You can also add the following Fleet Configuration variable to save bandwidth when pushing updates to your container:
    1. RESIN_SUPERVISOR_DELTA = 1  
  
Once this is done, connect the Dongle, boot the device and it should come online on your resin.io dashboard  
  
# Resin.io environment variables  
Our sample Raspberry Pi application uses environment variables to enable a couple of useful features which optimise bandwidth usage and leverage Soracom Harvest and Gate services:
* CELLULAR_ONLY: This option disables WiFi and Ethernet to ensure your device is running and communicating using Cellular connection
* CONSOLE_LOGGING: Set to 1 in order to get application logs in Resin.io device console, otherwise logs are written to /data/soracom.log
* DEBUG: Set to 1 to have debug logging, use in combination with CONSOLE_LOGGING to see logs in resin.io device console
* SORACOM_HARVEST_INTERVAL: Set the time interval in milliseconds to publish device data to Soracom Harvest Analytics service, be sure to use together with CELLULAR_ONLY as Harvest identifies devices using their connected Soracom SIM card.  
  
# Notes  
It is important to note that we're using resin/node Docker container in this project, due to potential conflicts with udevd and Modem Manager, we keep udevd off in the container (through supplied `entry.sh`) which ensures highest level of ResinOS compatibility with Cellular modems  
Be sure to use the latest version of ResinOS in order to have full support of your preferred Hardware  
  
We've tested the following Application with Huawei MS2131, MS2372, ME909, MU709 and Quectel EC21  

# Credits
Feel free to visit our [Soracom](https://www.soracom.io) website if you'd like to get your Sim card and Dongle as well as learn more about various IoT topics  
And thank you to the folks at [Resin.io](https://www.resin.io) for making their awesome platform  