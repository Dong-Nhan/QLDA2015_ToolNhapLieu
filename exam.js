
const HOST = "http://103.114.107.16:8005/api/examination/";
var categories = null;
$(function () {

  $(".messError").hide();
  $("#success-alert").hide();
  $("#error-alert").hide();


  $.ajax({
    url: "http://103.114.107.16:8003/api/learning/categories",
    type: 'GET',
  }).done(data => {
    if (data.message) {
      $("#error-alert span").text(data.message);
      $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#success-alert").slideUp(500);
      });
    } else {
      categories = data.value.categories;
      var isFirstCate = false;
      categories.forEach(category => {
        $('#select-categories').append($('<option>', { value: category._id, text: category.name }));
        if(!isFirstCate) {
          isFirstCate = true;
          var topics = category.topics;
          for (var i = 0 ; i < topics.length; i++) {
            $('#select-topics').append($('<option>', { value: topics[i]._id, text: topics[i].name }));
          }
        }
      })
    }
  }).fail(data => {
    $("#error-alert span").text(data.err);
    $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
      $("#success-alert").slideUp(500);
    });
  });
});

var quill = new Quill('#editor-container', {
  modules: {
    syntax: true,
    toolbar: '#toolbar-container'
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'
});


//escaping special chars
String.prototype.escapeSpecialChars = function () {
  return this.replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");
};

$('#get-json-contents-btn').click(function () {
  let content = quill.getContents();
  $('#contents-container').text(JSON.stringify(content));
});

$('#pretty-print-btn').click(function () {
  let content = quill.getContents();
  $('#contents-container').text(JSON.stringify(content, null, 2));
});

$('#insert-db-btn').click(function () {

  $(".lesson-id .messError").hide();
  
  let content = $("#contents-container").val();
  let topicId = $('#select-topics :selected').val();    
  let choiceA = $('#input-choice-a').val();
  let choiceB = $('#input-choice-b').val();
  let choiceC = $('#input-choice-c').val();
  let choiceD = $('#input-choice-d').val();
  let suggest = $('#input-suggest').val();
  let explain = $('#input-explain').val();

  //var content = JSON.stringify(contentQuill);
  if(content === "") {
    $(".question-content .messError").show();
    return;
  }
  if(choiceA === "") {
    $(".choice-a .messError").show();
    return;
  }
  if(choiceB === "") {
    $(".choice-b .messError").show();
    return;
  }
  if(choiceC === "") {
    $(".choice-c .messError").show();
    return;
  }
  if(choiceD === "") {
    $(".choice-d .messError").show();
    return;
  }
  $("#insert-db-btn").prop("disabled", true);
  let ans = $('input[name=ans]:checked').val();

  var data = { 
    content: content,
    topicId: topicId, 
    answers: {
      ansA: choiceA,
      ansB: choiceB,
      ansC: choiceC,
      ansD: choiceD
    }, 
    answerRight: ans, 
    explainRight: explain,
    suggest: suggest,
  };

  var jsonData = JSON.stringify(data);
  var http = new XMLHttpRequest();
  http.open("POST", HOST + "choice_question", true);
  http.setRequestHeader('Content-type', 'application/json');
  http.onreadystatechange = function () {
    $("#modal-add-category").modal('hide');
    if (http.readyState == 4 && http.status === 200) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      if (resultJson.message) {
        $("#error-alert span").text(resultJson.message);
        $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
          $("#error-alert").slideUp(500);
        });
      } else {
        $("#success-alert span").text("Add lesson successful!");
        $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
          $("#success-alert").slideUp(500);
        });
      }

    } else if (http.status === 403) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#error-alert span").text(resultJson.message);
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });

    } else if (http.readyState == 4 && http.status != 200) {
      $("#error-alert span").text("Error undefind, please contact Administartor");
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });
    }
  }
  http.onloadend = function () {
    $("#insert-db-btn").prop("disabled", false);
  }
  http.send(jsonData);
  
});

$('#btn-add-category').click(function () {
  //alert(URL);
  var inputCategory = $("#inputCategory").val();
  if (!inputCategory) {
    $("#modal-add-category .messError").show();
    return;
  }
  var data = { name: inputCategory };
  var jsonData = JSON.stringify(data);
  var http = new XMLHttpRequest();
  http.open("POST", HOST + "categories", true);
  http.setRequestHeader('Content-type', 'application/json');

  http.onreadystatechange = function () {
    $("#modal-add-category").modal('hide');
    if (http.readyState == 4 && http.status === 200) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      if (resultJson.message) {
        $("#error-alert span").text(resultJson.message);
        $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
          $("#error-alert").slideUp(500);
        });
      } else {
        $('#select-categories').append($('<option>', { value: resultJson.value._id, text: inputCategory }));
        $("#success-alert span").text("Add category successful!");
        $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
          $("#success-alert").slideUp(500);
        });
      }

    } else if (http.status === 403) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#error-alert span").text(resultJson.message);
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });

    } else if (http.readyState == 4 && http.status != 200) {
      $("#error-alert span").text("Error undefind, please contact Administartor");
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });
    }

  }
  http.onloadend = function () {
    // $("#btnSend").prop("disabled", false);
    // $("#btnSend").children('i').removeClass('fas fa-sync-alt fa-spin').css("margin-right", "");
  }
  http.send(jsonData);
  // $("#btnSend").children('i').addClass('fas fa-sync-alt fa-spin');
})

$('#btn-add-topic').click(function () {
  var inputTopic = $("#inputTopic").val();
  if (!inputTopic) {
    $("#modal-add-topic .messError").show();
    return;
  }
  var categoryId = $('#select-categories :selected').val();  
  var data = { 
    categoryId: categoryId,
    name: inputTopic 
  };
  var jsonData = JSON.stringify(data);
  var http = new XMLHttpRequest();
  http.open("POST", HOST + "topics", true);
  http.setRequestHeader('Content-type', 'application/json');

  http.onreadystatechange = function () {
    $("#modal-add-topic").modal('hide');
    if (http.readyState == 4 && http.status === 200) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      if (resultJson.message) {
        $("#error-alert span").text(resultJson.message);
        $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
          $("#error-alert").slideUp(500);
        });
      } else {
        $('#select-topics').append($('<option>', { value: resultJson.value._id, text: inputTopic }));
        $("#success-alert span").text("Add topic successful!");
        $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
          $("#success-alert").slideUp(500);
        });
      }

    } else if (http.status === 403) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#error-alert span").text(resultJson.message);
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });

    } else if (http.readyState == 4 && http.status != 200) {
      $("#error-alert span").text("Error undefind, please contact Administartor");
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });
    }

  }

  http.onloadend = function () {
    // $("#btnSend").prop("disabled", false);
    // $("#btnSend").children('i').removeClass('fas fa-sync-alt fa-spin').css("margin-right", "");
  }
  http.send(jsonData);
  // $("#btnSend").children('i').addClass('fas fa-sync-alt fa-spin');
})

$('#select-categories').change(function () {
  var categoryId = this.value;
  $('#select-topics').empty();
  const category = categories.find( category => category._id === categoryId );
  
  var topics = category.topics;
  for (var i = 0 ; i < topics.length; i++) {
    $('#select-topics').append($('<option>', { value: topics[i]._id, text: topics[i].name }));
  }
});

$('#modal-add-category').on('show.bs.modal', function (event) {
  $(".messError").hide();
});

$('#modal-add-topic').on('show.bs.modal', function (event) {
  $(".messError").hide();
});




// $('#get-json-string-contents-btn').click(function () {
//   let content = quill.getContents();
//   $('#contents-container').text(JSON.stringify(content, null, 2).escapeSpecialChars());
// });