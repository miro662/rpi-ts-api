$(document).ready(function() {
    function updateTemps() {
        $.get("/temperatures", function(data) {
            $("#cpu .c").text(data.cpu);
            $("#gpu .c").text(data.gpu);
        });
    }

    updateTemps();
    setInterval(updateTemps, 5000);
});
