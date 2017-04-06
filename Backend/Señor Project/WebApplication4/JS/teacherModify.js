var AlexDebug = true;

$( document ).ready(function(){

  showLoader();

  setPassageText();
});

var teacherChanges = [];
var returnModel = {};
var teacherPassage = '';
var teacherTitle = '';

function showLoader() {
    teacherPassage = $('#teacher-modify-box').html();
    teacherTitle = $('#teacher-title-box').val();
    $('#teacher-modify-box').replaceWith('<div class="loader" id="loader"></div>');
    $('#teacher-title-box').replaceWith('<div id="title-holder"></div>');
};

function removeLoader() {
    $('#loader').replaceWith('<p class="teacher-input no-text-change" id="teacher-modify-box">' + teacherPassage + '</p>');
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

    if (AlexDebug) {
        setTimeout(function () {
            returnModel = exampleResult();
            console.log(returnModel);
            removeLoader();
            $('#teacher-modify-box').html(returnModel.HTML);
            clickFunctionality();
        });
    }
    else {

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
                $('#teacher-modify-box').html(returnModel.HTML);
                clickFunctionality();
            })
            .fail(function () {
                alert("error");
            });
    }
};

function sendChanges() {

    var title = $('#teacher-title-box').val();
    var subRes = { avail: true, link: '<a href="localhost:52349/studentView.html#' + title + '" target="_blank">localhost:52349/studentView.html#' + title + '</a>' }; // TODO Sahirs specicial sauce. returns link if avialbe, or false if title not availble

    if (title == '') {
        $('#teacher-title-warning').html('Please enter a title for your passage.');
    } else {
        var changeObj = { RModel: returnModel, Changes: teacherChanges, Title: title };
        $('#teacher-title-warning').html('');
        showLoader();

        if (AlexDebug) {
            setTimeout(function () {
                removeLoader();
                $('#teacher-title-warning').html(subRes.link);
                var selected = $('.steps.selected');
                selected.removeClass(); selected.addClass('col-md-10 col-md-offset-1 steps');
                $('.steps').eq(2).addClass('selected');

                // these two lines only occur if the title was available
                $('#teacher-title-box').replaceWith('<p class="teacher-input smaller no-text-change" id="teacher-title-box">' + teacherTitle + '</p>');
                $('#linkButton').attr("disabled","disabled");

                $('#introModal .modal-body').html('<p>Students access link: ' + subRes.link + '</p>');
                $('#introModal').modal('show');
            }, 1000);
        }
        else {

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
                    $('#teacher-title-warning').html(subRes.link);
                    var selected = $('.steps.selected');
                    selected.removeClass(); selected.addClass('col-md-10 col-md-offset-1 steps');
                    $('.steps').eq(2).addClass('selected');

                    $('#teacher-title-box').replaceWith('<p class="teacher-input smaller no-text-change" id="teacher-title-box">' + teacherTitle + '</p>');
                    $('#linkButton').attr("disabled","disabled");
                }
            })
            .fail(function () {
                alert("error");
            });
        }
    }
};

function clickFunctionality() {
    $('.word.noun').addClass('style');

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


// DEBUG Functions
function wordObj(pos, syllabifiedVersion, syllableIndices, value) {
    return { POS: pos, SyllabifiedVersion: syllabifiedVersion, SyllableIndices: syllableIndices, Value: value };
};

function exampleResult() {
    var wordObjs = [];
    wordObjs.push(wordObj('unknown', 'Hel∙lo', 8, 'Hello', 0));
    wordObjs.push(wordObj('noun', '"e∙ver∙y∙one,"', 162, 'everyone,', 1));
    wordObjs.push(wordObj('unknown', 'my', 0, 'my', 2));
    wordObjs.push(wordObj('noun', 'name', 0, 'name', 3));
    wordObjs.push(wordObj('verb', 'is', 0, 'is', 4));
    wordObjs.push(wordObj('noun', 'Al∙ex∙an∙der.', 292, 'Alexander.', 5));

    return { Content: wordObjs, HTML: exampleHTML };
};

// no suggestion
function exampleNSResult() {
    var res = exampleResult();
    res.HTML = exampleNoSuggestionHTML;
    return res;
};

var exampleHTML = '<span id="0" class="word unknown">Hello</span> <span id="1" class="word noun">everyone,</span> <span id="2" class="word unknown">my</span> <span id="3" class="word noun">name</span> <span id="4" class="word verb">is</span> <span id="5" class="word noun">Alexander.</span> ';
var exampleNoSuggestionHTML = '<span id="0" class="word">Hello</span> <span id="1" class="word">everyone,</span> <span id="2" class="word">my</span> <span id="3" class="word">name</span> <span id="4" class="word">is</span> <span id="5" class="word">Alexander.</span>';
