var AlexDebug = true;

$(document).ready(function () {

    var passageTitle = window.location.hash.substring(1);
    console.log(passageTitle);

    $('#student-text').replaceWith('<div class="loader" id="loader"></div>');
    render(passageTitle);
});

function render(title) {
    $.ajax({
        url: "api/Project/GetPassage",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json");
        },
        type: "POST",
        // Request body
        data: JSON.stringify(title),
    })
    .done(function (data) {
        console.log(data);
        removeLoader();
        $('#student-text').html(data);
        clickFunctionality();
    })
    .fail(function () {
        alert("error");
    });
};

function removeLoader() {
    $('#loader').replaceWith('<p class="teacher-input no-text-change" id="student-text"></p>');
};

function clickFunctionality() {
    $('.nav-pills>li').click(function () {
        $('.nav-pills>li').removeClass();
        $('.nav-pills>li').addClass('col-md-10 col-xs-10');
        $(this).removeClass();
        $(this).addClass('active');
        $('.word').removeClass('style');
        $('.word.' + $(this).children('a').attr('data-pos')).addClass('style');
    });

    $('.word').click(function () {
        var curActive = $('.nav-pills>li.active').children('a').attr('data-pos');
        if ($(this).hasClass(curActive)) {
            $(this).removeClass();
            $(this).addClass('word');
        } else {
            $(this).removeClass();
            $(this).addClass('word style ' + curActive);
        }
    });
};
