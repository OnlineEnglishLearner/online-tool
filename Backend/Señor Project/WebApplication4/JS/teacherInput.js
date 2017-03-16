
$(document).ready(function(){
  $('#introModal').modal('show');

  $('#submitButton').click(function () {
      var input = $('#teacherInput').val();

      console.log("firing");
  
      $.ajax({
          url: "api/Project/TriggerAPI",
          beforeSend: function (xhrObj) {
              // Request headers
              xhrObj.setRequestHeader("Content-Type", "application/json");
          },
          type: "POST",
          // Request body
          data: JSON.stringify(input),
      })
        .done(function (data) {
            $('#teacherInput').replaceWith(data.HTML);
            console.log(data);
            console.log(data.HTML);
            console.log(demask(data.Content[0][0].SyllableIndices));
        })
        .fail(function () {
            alert("error");
        });       
  });  
});

function demask(mask) {
    var indices = [];
    var i = 0;

    while(mask > 0) {
        if( (mask & 1) != 0)
            indices.push(i);

        mask >>= 1;
        ++i;
    }

    return indices;
};



//    post('teacherModify.html', { name: 'Hello' });
/*
function post(path, parameters) {
    var form = $('<form></form>');

    form.attr("method", "post");
    form.attr("action", path);

    $.each(parameters, function (key, value) {
        var field = $('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
    });

    // The form needs to be a part of the document in
    // order for us to be able to submit it.
    $(document.body).append(form);
    form.submit();
};
*/