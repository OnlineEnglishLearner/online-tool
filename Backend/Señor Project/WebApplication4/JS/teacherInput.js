var AlexDebug = true;

$(document).ready(function () {

    $('#submitButton').click(function () {
        var inputText = $('#teacherInput').val();
        var useMS = $('#checkboxFiveInput').is(':checked');

        createCookie('inputText', inputText, 1);
        createCookie('useMS', useMS, 1);
        window.location = "./teacherModify.html";
    });
    $('.checkboxLabel').click(function () {
        var status = $('#checkboxFiveInput').is(':checked');
        $('.checkboxFive input[type=checkbox]').prop("checked", !status);
    });

    if (AlexDebug) {
        $('.footer').click(function () {
            eraseCookie('newUser');
            console.log('Available cookies: ' + document.cookie);
        });
    }

    if (readCookie('newUser') != 'false') {
        createCookie('newUser', false, 7);
        $('#introModal').modal('show');
    }
});

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
