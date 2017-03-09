#!/bin/bash
if [[ -n "${SSH_PASSWD}" ]]; then
	#Set the root password
	echo "root:$SSH_PASSWD" | chpasswd
	#Spawn dropbear
	dropbear -E -F &
fi

if [[ -n "${CELLULAR_ONLY}" ]]; then
	echo "CELLULAR_ONLY enabled, disabling Ethernet and WiFi"
	/sbin/modprobe -r brcmfmac
	/sbin/modprobe -r brcmutil
	echo 0x0 > /sys/devices/platform/soc/3f980000.usb/buspower
	# Make sure we still have a connection
	curl -s --connect-timeout 52 http://www.google.com  > /dev/null
	if [[ $? -eq 0 ]]; then
		echo "Ethernet and WiFi successfully disabled"
	else
		echo "Re-enabling Ethernet and WiFi as device didn't have internet without it"
		/sbin/modprobe brcmfmac
		/sbin/modprobe brcmutil
		echo 0x1 > /sys/devices/platform/soc/3f980000.usb/buspower
	fi
fi

# Start pm2 process to run app.js forever
sleep 5
cd /usr/src/app
pm2 -s link
pm2 -s start /usr/src/app/app.js --max-memory-restart 200M &
# Start showing logs
pm2 logs --out &

# Run connection check script every 15mins
while :
do
	sleep 900;
	bash /usr/src/app/reconnect.sh;
done
