$( document ).ready(function(){
    $('#introModal').modal('show');

    $('#submitButton').click(function () {
        
        $('#teacherInput').replaceWith(exampleHTML);
        console.log(exampleResult());
    });
});


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

var exampleString = 'Hello everyone, my name is Alexander';
var exampleHTML = '<p><span class="Unknown">Hello</span>&nbsp<span class="Noun">everyone,</span>&nbsp<span class="Unknown">my</span>&nbsp<span class="Noun">name</span>&nbsp<span class="Verb">is</span>&nbsp<span class="Noun">Alexander.</span>&nbsp</p>';
