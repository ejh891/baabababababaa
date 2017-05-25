var $audio;
var $count;
var counter;

document.addEventListener("DOMContentLoaded", function (ev) {
    $audio = document.getElementById("audio");
    $count = document.getElementById("count");
    counter = 0;

    $audio.load();

    getServerSideCount();
    window.setInterval(getServerSideCount, 3000);

    bindAudioFunctions();
});

function bindAudioFunctions() {
    $audio.onplay = function () {
        $(".button").prop("disabled", true);
        $("#logo").addClass("spin");
    }

    $audio.onended = function () {
        $(".button").prop("disabled", false);
        $("#logo").removeClass("spin");
    }
}

function buttonClicked() {
    play();
    incrementCounter();
}

function play() {
    $audio.play();
}

function displayCount() {
    $count.innerHTML = counter;
}

function getServerSideCount() {
    $.ajax({
        url: "/readCounter",
        method: "GET",
        success: function(data) {
            counter = data.count;
            displayCount();
        },
        error: function(xhr, textstatus, error) {
            console.error(xhr, textstatus, error);
        }
    });
}

function incrementCounter() {
    $.ajax({ url: "/incrementCounter", method: "POST" });
    counter++;
    displayCount();
}
