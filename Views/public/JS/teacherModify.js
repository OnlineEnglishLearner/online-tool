$( document ).ready(function(){

  setPassageText();

  $('.nav-pills>li').click(function(){
    $('.nav-pills>li').removeClass();
    $('.nav-pills>li').addClass('col-md-10 col-xs-10');
    $(this).removeClass();
    $(this).addClass('active');
    $('.word').removeClass('style');
    $('.word.' + $(this).children('a').html() ).addClass('style');
  });
});

function setPassageText(){
  if(readCookie('useMS') == 'true'){
    var MSSug = getMSSuggestions(readCookie('inputText'));
    $('#teacher-modify-box').html(MSSug.HTML);
  } else {
    $('#teacher-modify-box').html(readCookie('inputText'));
  }
}

function getMSSuggestions(inputText){
  return exampleResult();
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}


// sahir's temp functions

function wordObj(pos, syllabifiedVersion, syllableIndices, value) {
    return { POS: pos, SyllabifiedVersion: syllabifiedVersion, SyllableIndices: syllableIndices, Value: value };
};

function exampleResult() {
    var wordObjs = [];
    wordObjs.push(wordObj('Unknown', 'Hel∙lo', 8, 'Hello'));
    wordObjs.push(wordObj('Noun', '"e∙ver∙y∙one,"', 162, 'everyone,'));
    wordObjs.push(wordObj('Unknown', 'my', 0, 'my'));
    wordObjs.push(wordObj('Noun', 'name', 0, 'name'));
    wordObjs.push(wordObj('Verb', 'is', 0, 'is'));
    wordObjs.push(wordObj('Noun', 'Al∙ex∙an∙der.', 292, 'Alexander.'));

    return { Content: wordObjs, HTML: exampleHTML };
};
var exampleHTML = '<span id="0" class="word Unknown">Hello</span>&nbsp<span class="word Noun">everyone,</span>&nbsp<span class="word Unknown">my</span>&nbsp<span class="word Noun">name</span>&nbsp<span class="word Verb">is</span>&nbsp<span class="word Noun">Alexander.</span>&nbsp';


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
