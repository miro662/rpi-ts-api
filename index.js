var fs = require("fs");

var cpuTempSensorFile = "/sys/class/thermal/thermal_zone0/temp"
var checkInterval = 2000;

function getCpuTemperature(callback) {
	fs.readFile(cpuTempSensorFile, function(err, data) {
		if (err) {
			callback(err, NaN);
		}
		
		callback(null, Number(data) / 1000);
	});
}

var cpuTemperature = NaN;

setInterval(function() {
	getCpuTemperature(function(err, data) {
		if (err) {
			cpuTemperature = NaN;
			return console.log(err);
		}
		cpuTemperature = data;
		console.log(cpuTemperature);
	});
})