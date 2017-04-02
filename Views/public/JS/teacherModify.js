// TODO create an array that will hold all the changes a teacher makes.
// Every change will be pushed to the end of the array with the index of the
// word and what the change was (ie, removed verb. ie, added noun)

$( document ).ready(function(){

  $('#teacher-modify-box').replaceWith('<div class="loader" id="loader"></div>');
  $('#teacher-title-box').replaceWith('<div id="title-holder"></div>');

  setPassageText();
});

var passageTitle = '';
var teacherChanges = [];

function removeLoader() {
    $('#loader').replaceWith('<p class="teacher-input" id="teacher-modify-box"></p>');
    $('#title-holder').replaceWith('<input type="text" placeholder="Assignment Title" class="hover teacher-input smaller" id="teacher-title-box">');
};

function setPassageText(){
    if (readCookie('useMS') == 'true') {
        setTimeout(function () {
            removeLoader();
            var MSSug = getMSSuggestions(readCookie('inputText'));
            $('#teacher-modify-box').html(MSSug.HTML);

            clickFunctionality();
        }, 2000);
  } else {
    removeLoader();
    $('#teacher-modify-box').html(getMSNOSuggestions(readCookie('inputText')).HTML);

    clickFunctionality();
  }
}

function getMSSuggestions(inputText){
  // TODO actually make a call to the server with the input text to get the MS Suggestions
  return exampleResult();
};

function getMSNOSuggestions(inputText){
  return exampleNSResult();
};

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
};

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
};

function eraseCookie(name) {
	createCookie(name,"",-1);
};

function clickFunctionality() {
  $('.nav-pills>li').click(function(){
    $('.nav-pills>li').removeClass();
    $('.nav-pills>li').addClass('col-md-10 col-xs-10');
    $(this).removeClass();
    $(this).addClass('active');
    $('.word').removeClass('style');
    $('.word.' + $(this).children('a').attr('data-pos')).addClass('style');
  });

  $('.word').click(function(){
    var curActive = $('.nav-pills>li.active').children('a').attr('data-pos');
    if($(this).hasClass(curActive)){
      $(this).removeClass();
      $(this).addClass('word');
      teacherChanges.push({id: $(this).attr('id'), action: 'remove', pos: curActive});
    } else {
      $(this).removeClass();
      $(this).addClass('word style ' + curActive);
      teacherChanges.push({id: $(this).attr('id'), action: 'add', pos: curActive});
    }
  });

  $('#linkButton').click(function () {
      console.log(teacherChanges);
      passageTitle = $('#teacher-title-box').val();
      var subRes = {avail: true, link: '<a href="localhost:3000/student/studentView.html#' + passageTitle + '" target="_blank">localhost:3000/student/studentView.html#' + passageTitle + '</a>'}; // TODO Sahirs specicial sauce. returns link if avialbe, or false if title not availble

      if (passageTitle == '') {
        $('#teacher-title-warning').html('Please enter a title for your passage.');
      } else if (!subRes.avail){
        $('#teacher-title-warning').html('This title has been taken, please try another.');
      } else {
        $('#teacher-title-warning').html('');
        $('#introModal .modal-body').html('<p>Students will be able to access your parts of speach passage at: ' + subRes.link + '</p>');
        $('#introModal').modal('show');
      }
  });
};

// sahir's temp functions

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

function demask(mask) {
    var indices = [];
    var i = 0;

    while (mask > 0) {
        if ((mask & 1) != 0)
            indices.push(i);

        mask >>= 1;
        ++i;
    }

    return indices;
};
