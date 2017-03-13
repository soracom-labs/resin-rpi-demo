/*jshint esversion: 6 */
/*
 * Soracom Demonstration NodeJS App
 *
 */
var moment = require('moment-timezone'),
	figlet = require('figlet'),
	winston = require('winston'),
	RPI = require('rpi-info'),
	rpi = new RPI(),
	spawn = require('child_process').spawn,
	request = require('requestretry'),
	os = require('os-utils');

// Setup base variables
var console_logging = process.env.CONSOLE_LOGGING,						// Set to 1 to see logs in console
	debug = process.env.DEBUG,											// Set to 1 to get debug messages
	soracom_harvest_interval = process.env.SORACOM_HARVEST_INTERVAL,	// Time in miliseconds
	cellular_only = process.env.CELLULAR_ONLY;							// Checking for cellular setting as it's needed for Harvest

// Setup logging
if (console_logging) {
	var logger = new winston.Logger({
		transports: [
		new(winston.transports.Console)(), new(winston.transports.File)({
			filename: '/data/soracom.log',
			maxsize: 209715200,
			maxFiles: 3
		})]
	});
} else {
	var logger = new winston.Logger({
		transports: [
		new(winston.transports.File)({
			filename: '/data/soracom.log',
			maxsize: 209715200,
			maxFiles: 3
		})]
	});
}

// Logging with debug level when DEVELOPMENT is set
if (debug) {
	winston.transports.File = 'verbose';
	if (console_logging) {
		logger.transports.console.level = 'verbose';
	}
}

// Display startup message
console.log();
console.log('              ..;;ttLLCCCCCCLLtt;;..              ');
console.log('          ..11CCCCCCCCCCCCCCCCCCCCCC11..          ');
console.log('        ::LLCCCCCCttii::,,::iittCCCCCCLL::        ');
console.log('      ::CCCCCC11..              ..11CCCCCC::      ');
console.log('    ::CCCCCCCCttii::..              ::LLCCCC::    ');
console.log('  ..LLCCCCCCCCCCCCCCCCffii::..        ,,LLCCLL..  ');
console.log('  11CCCC::,,;;ttLLCCCCCCCCCCCCff11::..  ::CCCC11  ');
console.log('..CCCC11          ,,;;11LLCCCCCCCCCCCC..  11CCCC..');
console.log('iiCCCC,,                  ..::11LLCCCC..  ,,CCCCii');
console.log('ttCCff                          ;;CCCC..    ffCCff');
console.log('LLCCii                          ;;CCCC..    iiCCLL');
console.log('CCCC;;                        ,,11CCCC..    ;;CCCC');
console.log('CCCC::                ,,iittLLCCCCCCCC..    ::CCCC');
console.log('CCCC;;      ..::iittCCCCCCCCCCCCCCffii      ;;CCCC');
console.log('LLCCii    ;;CCCCCCCCCCCCLLttii,,            iiCCLL');
console.log('ttCCff    ..LLCCCCtt;;,,          ::        ffCCff');
console.log('iiCCCC,,    iiCCCC,,          ,,::tt,,..  ,,CCCCii');
console.log('..CCCC11    ..LLCCtt          ;;LLCCtt..  11CCCC..');
console.log('  11CCCC::    iiCCCC,,          LLff;;  ::CCCC11  ');
console.log('  ..LLCCLL,,  ..LLCCtt  ..tt11..,,  ::,,LLCCLL..  ');
console.log('    ::CCCCLL::  iiCCCC::ffCCCC;;    ::LLCCCC::    ');
console.log('      ::CCCCCC11,,LLCCCCCCCC11  ..11CCCCCC::      ');
console.log('        ,,LLCCCCCCLLCCCCCCffiittCCCCCCLL::        ');
console.log('          ..11LLCCCCCCCCCCCCCCCCCCLL11..          ');
console.log('              ..;;ttLLCCCCCCLLtt;;..              ');
console.log(figlet.textSync('soracom', {
	horizontalLayout: 'default',
	verticalLayout: 'default'
}));
if (!console_logging) {
	console.log('CONSOLE_LOGGING variable not set, running in quite mode');
}

// Setup Harvest data logging interval
if (cellular_only && soracom_harvest_interval) {
	setInterval(rpi_stats, soracom_harvest_interval);
} else if(soracom_harvest_interval){
	console.log('[ERROR] Both SORACOM_HARVEST_INTERVAL and CELLULAR_ONLY are required in order to use Soracom Harvest');
} else {
	setInterval(rpi_stats, 220000);
}

// App functions
function rpi_stats() {
	// Gather device data
	var single_read_pi_temperature = spawn('/bin/cat', ['/sys/class/thermal/thermal_zone0/temp']);
	single_read_pi_temperature.stdout.on('data', function(data_temperature) {
		var rpi_stats_data = {
			pi_temperature: parseFloat(data_temperature) / 1000,
			pi_load: parseFloat(os.loadavg(5) * 100),
			pi_memory: parseFloat(os.freememPercentage() * 100),
		};
		// if soracom_harvest_interval is set, post Pi stats to Soracom Harvest service
		if (soracom_harvest_interval) {
			logger.verbose('[DEV] posting Soracom Harvest JSON message: ' + JSON.stringify(rpi_stats_data));
			logger.info('Current pi stats:' + JSON.stringify(rpi_stats_data));
			request({
				url: 'http://harvest.soracom.io',
				method: 'POST',
				json: rpi_stats_data
			}, function(error, response) {
				if (error) {
					logger.verbose('[DEV] couldnt make Soracom Harvest request with error: ' + error);
				} else if (response.hasOwnProperty('statusCode') && response.statusCode !== 201) {
					logger.verbose('[DEV] couldnt make Soracom Harvest request with error: ' + error + ' and status code: ' + response.statusCode);
				} else {
					logger.verbose('[DEV] successfully sent data to Soracom Harvest');
				}
			});
			// Otherwise, log the data
		} else {
			logger.info('Current pi stats:' + JSON.stringify(rpi_stats_data));
		}
	});
}

// Real artists ship - Steve Jobs - http://c2.com/cgi/wiki?RealArtistsShip