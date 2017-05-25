var audioElem;
var $button;
var $count;
var counter;
var $logo;

document.addEventListener("DOMContentLoaded", function (ev) {
    audioElem = document.getElementById("audio");
    $button = $("#button");
    $count = $("#count");
    counter = 0;
    $logo = $("#logo");

    audioElem.load();

    getServerSideCount();
    window.setInterval(getServerSideCount, 3000);

    bindAudioFunctions();
});

function bindAudioFunctions() {
    audioElem.onplay = function () {
        $button.prop("disabled", true);
        $logo.addClass("spin");
    }

    audioElem.onended = function () {
        $button.prop("disabled", false);
        $logo.removeClass("spin");
    }
}

function buttonClicked() {
    play();
    incrementCounter();
}

function play() {
    audioElem.play();
}

function displayCount() {
    $count.text(counter);
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
