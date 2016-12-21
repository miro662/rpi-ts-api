var fs = require("fs");
var child_process = require("child_process");

var cpuTempSensorFile = "/sys/class/thermal/thermal_zone0/temp";
var gpuCheckCmd = "/opt/vc/bin/vcgencmd measure_temp";
var checkInterval = 2000;

function getCpuTemperature(callback) {
	fs.readFile(cpuTempSensorFile, function(err, data) {
		if (err) {
			callback(err, NaN);
		}
		
		callback(null, Number(data) / 1000);
	});
}

function getGpuTemperature(callback) {
	child_process.exec(gpuCheckCmd, function(err, stdout, stderr) {
		if (err) {
			callback(err, NaN);
		}
		else if (stderr != "") {
			callback("Command error: " + stderr, NaN);
		}
		else {
			var left = stdout.split("=", 2)[1];
			var tempStr = left.split("'", 2)[0];
			callback(null, Number(tempStr));
		}
	});
}

var temperatures = {
	cpu: NaN,
	gpu: NaN
}

setInterval(function() {
	getCpuTemperature(function(err, data) {
		if (err) {
			temperatures.cpu = NaN;
			return console.log(err);
		}
		temperatures.cpu = data;
	});
	getGpuTemperature(function(err, data) {
		if (err) {
			temperatures.cpu = NaN;
			return console.log(err);
		}
		temperatures.gpu = data;
	});
}, checkInterval);

setTimeout(function() {
	console.log(JSON.stringify(temperatures));
}, 5000);