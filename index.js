var fs = require("fs");

var cpuTempSensorFile = "/sys/class/thermal/thermal_zone0/temp"

function getCpuTemperature(callback) {
	fs.readFile(cpuTempSensorFile, function(err, data) {
		if (err) {
			callback(err, NaN);
		}
		
		callback(null, Number(data) / 1000);
	});
}

getCpuTemperature(function(err, data) {
	console.log(data);
});
