FROM resin/raspberrypi3-node:slim

MAINTAINER Alexis Susset <alexis@soraocom.io>

COPY src/package.json /usr/src/app/package.json
COPY motd /etc/motd

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -yq \
	curl dropbear smstools && \
	apt-get clean && \
	JOBS=MAX npm install pm2 -g && \
	JOBS=MAX npm install --production && \
	npm cache clean && rm -rf /tmp/*

# Copy all our source
COPY src /usr/src/app

CMD modprobe i2c-dev

CMD ["bash", "/usr/src/app/start.sh"]
