var fs = require("fs");
var child_process = require("child_process");

var cpuTempSensorFile = "/sys/class/thermal/thermal_zone0/temp";
var gpuCheckCmd = "/opt/vc/bin/vcgencmd measure_temp";
var checkInterval = 20000;

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
	gpu: NaN,
	update: function() {
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
	}
}

temperatures.update();
setInterval(temperatures.update, checkInterval);

var port = process.env.PORT || 8814;

var express = require('express');
var app = express();

app.use("/", express.static("static"));

app.get('/temperatures', function(req, res) {
	res.jsonp(temperatures);
});

app.listen(port, function() {
	console.log("Listening on 8814");
})