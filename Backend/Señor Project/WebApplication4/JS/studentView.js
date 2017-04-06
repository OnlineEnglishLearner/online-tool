var AlexDebug = true;

$(document).ready(function () {

    var passageTitle = window.location.hash.substring(1);
    console.log(passageTitle);

    $('#student-text').replaceWith('<div class="loader" id="loader"></div>');
    render(passageTitle);
});

function render(title) {

    if (AlexDebug) {
        setTimeout(function () {
            removeLoader();
            $('#student-text').html(exampleHTML);
            clickFunctionality();
        }, 1000);
    }
    else {
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
    }
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
