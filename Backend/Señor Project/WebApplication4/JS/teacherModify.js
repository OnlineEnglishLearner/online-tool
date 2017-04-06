var AlexDebug = true;

$( document ).ready(function(){

  showLoader();

  setPassageText();
});

var teacherChanges = [];
var returnModel = {};

function showLoader() {
    $('#teacher-modify-box').replaceWith('<div class="loader" id="loader"></div>');
    $('#teacher-title-box').replaceWith('<div id="title-holder"></div>');
};

function removeLoader() {
    $('#loader').replaceWith('<p class="teacher-input" id="teacher-modify-box"></p>');
    $('#title-holder').replaceWith('<input type="text" placeholder="Assignment Title" class="hover teacher-input smaller" id="teacher-title-box">');
};

function setPassageText() {
    if (readCookie('useMS') == 'true') {
        getMSSuggestions(readCookie('inputText'), true);
    } else {
        getMSSuggestions(readCookie('inputText'), false);
    }
};

function getMSSuggestions(inputText, useSuggestions) {
    console.log(inputText);

    var targetUrl = useSuggestions ? "Suggestions" : "NoSuggestions";

    $.ajax({
        url: "api/Project/" + targetUrl,
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json");
        },
        type: "POST",
        // Request body
        data: JSON.stringify(inputText),
    })
        .done(function (data) {
            returnModel = data;
            console.log(returnModel);
            removeLoader();
            $('#teacher-modify-box').html(data.HTML);
            clickFunctionality();
        })
        .fail(function () {
            alert("error");
        });
};

function sendChanges() {

    var title = $('#teacher-title-box').val();
    var subRes = { avail: true, link: '<a href="localhost:52349/studentView.html#' + title + '" target="_blank">localhost:52349/studentView.html#' + title + '</a>' }; // TODO Sahirs specicial sauce. returns link if avialbe, or false if title not availble

    if (title == '') {
        $('#teacher-title-warning').html('Please enter a title for your passage.');
    } else {
        var changeObj = { RModel: returnModel, Changes: teacherChanges, Title: title };

        showLoader();

        $.ajax({
            url: "api/Project/ProcessChanges",
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
            },
            type: "POST",
            // Request body
            data: JSON.stringify(changeObj),
        })
        .done(function (data) {
            console.log(data);
            subRes.avail = data;
            removeLoader();
            if (!subRes.avail) {
                $('#teacher-title-warning').html('This title has been taken, please try another.');
            } else {
                $('#teacher-title-warning').html('');
                $('#introModal .modal-body').html('<p>Students access link: ' + subRes.link + '</p>');
                $('#introModal').modal('show');
            }
        })
        .fail(function () {
            alert("error");
        });
    }
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
            teacherChanges.push({ id: $(this).attr('id'), action: 'remove', pos: curActive });
        } else {
            $(this).removeClass();
            $(this).addClass('word style ' + curActive);
            teacherChanges.push({ id: $(this).attr('id'), action: 'add', pos: curActive });
        }
    });

    $('#linkButton').click(function () {
        console.log(teacherChanges);
        sendChanges();
    });
};

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
};

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

function eraseCookie(name) {
    createCookie(name, "", -1);
};
