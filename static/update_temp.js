$(document).ready(function() {
    function updateTemps() {
        $.get("/temperatures", function(data) {
            var temps = JSON.parse(data);
            $("#cpu .c").text = temps.cpu;
            $("#gpu .c").text = temps.gpu;
        });
    }

    updateTemps();
    setInterval(updateTemps, 5000);
});