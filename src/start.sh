#!/bin/bash
if [[ -n "${SSH_PASSWD}" ]]; then
	#Set the root password
	echo "root:$SSH_PASSWD" | chpasswd
	#Spawn dropbear
	dropbear -E -F &
fi

if [[ -n "${CELLULAR_ONLY}" ]]; then
	echo "CELLULAR_ONLY enabled, disabling Ethernet and WiFi"
	ifconfig wlan0 down
	ifconfig eth0 down
	sleep 22
	# Make sure we still have a connection
	curl -s --connect-timeout 52 http://ifconfig.io  > /data/soracom.log
	if [[ $? -eq 0 ]]; then
		echo "Ethernet and WiFi successfully disabled"
	else
		echo "Re-enabling Ethernet and WiFi as device didn't have internet without it"
		ifconfig eth0 up
		ifconfig wlan0 up
	fi
fi

# Start pm2 process to run app.js forever
sleep 5
cd /usr/src/app
pm2 -s link
pm2 -s start /usr/src/app/app.js --max-memory-restart 200M &
# Start showing logs
# pm2 logs --out > /dev/null &

# Run connection check script every 15mins
while :
do
	sleep 900;
	bash /usr/src/app/reconnect.sh;
done
