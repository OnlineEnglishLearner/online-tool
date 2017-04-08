var AlexDebug = true;

$(document).ready(function () {

    var passageTitle = window.location.hash.substring(1);
    console.log(passageTitle);

    $('#student-text').replaceWith('<div class="loader" id="loader"></div>');
    render(passageTitle);
});

var teacherPassage = '';
var TPjson = {};
var studentPassage = '';
var numTries = 0;

function render(title) {

    if (AlexDebug) {
        setTimeout(function () {
            removeLoader();
            teacherPassage = exampleHTML;
            $('#student-text').html(exampleHTML);
            TPjson = makeJSON($('#student-text'));
            clearAnswers();
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
            teacherPassage = data;
            $('#student-text').html(data);
            TPjson = makeJSON($('#student-text'));
            clearAnswers();
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
    $('.nav-pills>li').unbind();
    $('.nav-pills>li').click(function () {
        $('.nav-pills>li').removeClass();
        $('.nav-pills>li').addClass('col-md-10 col-xs-10');
        $(this).removeClass();
        $(this).addClass('active');

        var clickedPOS = $(this).children('a').attr('data-pos');
        if (clickedPOS == 'all') {
          $('.word').addClass('style');
        } else {
          $('.word').removeClass('style');
          $('.word.' + clickedPOS).addClass('style');
        }
    });

    $('.word').unbind();
    $('.word').click(function () {
        var curActive = $('.nav-pills>li.active').children('a').attr('data-pos');
        if ($(this).hasClass(curActive)) {
            $(this).removeClass();
            $(this).addClass('word unknown');
        } else if (curActive != 'all') {
            $(this).removeClass();
            $(this).addClass('word '+ curActive + ' style');
        }
    });

    $('#studentCheck').unbind();$('#studentRetry').unbind();$('#seeAnswers').unbind();$('#studentRestart').unbind();
    $('#studentCheck').click(function () {
        checkAnswers();
    });
    $('#studentRestart').click(function () {
        clearAnswers();
        $('#seeAnswers').hide();
        $('#studentRestart').hide();
        $('#studentCheck').show();
        $('#studentRetry').show();
        numTries = 0;
        $('.image').hide();
    });
    $('#studentRetry').click(function () {
        $('.word').removeClass('correct incorrect')
        clickFunctionality();
        $('.nav-pills>li .noun').click();
        $('.image').hide();
    });
    $('#seeAnswers').click(function () {
        showAnswers();
    });
};

function clearAnswers() {
  var words = $('.word');
  words.removeClass();
  words.addClass('word unknown');
  clickFunctionality();
  $('.nav-pills>li .noun').click();
}

function checkAnswers() {
  if (++numTries >= 3) {
    $('#seeAnswers').show();
    $('#studentRestart').show();
    $('#studentCheck').hide();
    $('#studentRetry').hide();
  }

  //student answers
  var SAjson = makeJSON($('#student-text'));
  studentPassage = $('#student-text').html();
  $('#student-text').html(studentPassage);
  var correct = true;
  console.log();
  for (var i = 0; i < Object.keys(TPjson).length; i++) {
    if(TPjson[i].POS == SAjson[i].POS){
      $('#'+TPjson[i].ID).addClass("correct");
    } else {
      $('#'+TPjson[i].ID).addClass("incorrect");
      correct = false;
    }
  }
  if (correct){
    $('.image.check').show();
    $('#seeAnswers').show();
    $('#studentRestart').show();
    $('#studentCheck').hide();
    $('#studentRetry').hide();
    numTries = 0;
  } else {
    $('.image.x').show();
  }
  $('.word').click(function(){
      $('#studentRetry').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  });
  $('.nav-pills>li .all').click();
}

function showAnswers() {
  $('#student-text').html(teacherPassage);
  $('.nav-pills>li .all').click();
}

function makeJSON(passage){
    var jsonArr = [];

    passage.children().each(function(){
      jsonArr.push({ID: $(this).attr('id'), POS: $(this).attr("class").split(' ')[1]});
    });

    return jsonArr;
}

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
