
const HOST = "http://103.114.107.16:8005/api/examination/";
var categories = null;
$(function () {

  $(".messError").hide();
  $("#success-alert").hide();
  $("#error-alert").hide();



  $.ajax({
    url: HOST + "list_exam/" + $("#select-categories").val() + "/time?time=12_2018",
    type: 'GET',
  }).done(data => {
    if (data.message) {
      $("#error-alert span").text(data.message);
      $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#success-alert").slideUp(500);
      });
    } else {
      var listExam = data.listExam;
      $('#select-exams').empty();
      listExam.forEach(exam => {
        $('#select-exams').append($('<option>', { value: exam._id, text: exam.title }));
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

  $(".messError").hide();

  let content = $("#contents-container").val();
  let examId = $('#select-exams :selected').val();
  let choiceA = $('#input-choice-a').val();
  let choiceB = $('#input-choice-b').val();
  let choiceC = $('#input-choice-c').val();
  let choiceD = $('#input-choice-d').val();

  //var content = JSON.stringify(contentQuill);
  if (content === "") {
    $(".question-content .messError").show();
    return;
  }
  if (choiceA === "") {
    $(".choice-a .messError").show();
    return;
  }
  if (choiceB === "") {
    $(".choice-b .messError").show();
    return;
  }
  if (choiceC === "") {
    $(".choice-c .messError").show();
    return;
  }
  if (choiceD === "") {
    $(".choice-d .messError").show();
    return;
  }
  $("#insert-db-btn").prop("disabled", true);

  let ans = $('input[name=ans]:checked').val();

  var data = {
    content: content,
    examId: examId,
    answers: {
      ansA: choiceA,
      ansB: choiceB,
      ansC: choiceC,
      ansD: choiceD
    },
    answerRight: ans,
  };

  var jsonData = JSON.stringify(data);
  var http = new XMLHttpRequest();
  http.open("POST", HOST + "choice_question", true);
  http.setRequestHeader('Content-type', 'application/json');
  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status === 200) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#success-alert span").text("Add question successful!");
      $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#success-alert").slideUp(500);
      });
    } else if (http.status === 403) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#error-alert span").text(resultJson.message);
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });

    } else if (http.readyState == 4 && http.status != 200) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#error-alert span").text(resultJson.message);
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


$('#btn-add-exam').click(function () {

  var numberQuestion = +$("#numberQuestion").val();
  if (numberQuestion < 1) {
    $(".exam-numberQuestion .messError").show();
    return;
  }

  var timeDo = +$("#inputExamTimeLeft").val();
  if (timeDo < 60) {
    $(".exam-time-left .messError").show();
    return;
  }
  var categoryId = $('#select-categories :selected').val();
  var data = {
    type: categoryId,
    time: "12_2018",
    numberQuestion: numberQuestion,
    timeDo: timeDo
  };
  var jsonData = JSON.stringify(data);
  var http = new XMLHttpRequest();
  http.open("POST", HOST + "exam", true);
  http.setRequestHeader('Content-type', 'application/json');

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status === 200) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#success-alert span").text(resultJson.message);
      $("#success-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#success-alert").slideUp(500);
      });
    } else if (http.status === 403) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);
      $("#error-alert span").text(resultJson.message);
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });

    } else if (http.readyState == 4 && http.status != 200) {
      resp = http.responseText;
      var resultJson = JSON.parse(http.responseText);

      $("#error-alert span").text(resultJson.message);
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
  $('#select-exams').empty();

  $.ajax({
    url: HOST + "list_exam/" + $("#select-categories").val() + "/time?time=12_2018",
    type: 'GET',
  }).done(data => {
    if (data.message) {
      $("#error-alert span").text(data.message);
      $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
        $("#error-alert").slideUp(500);
      });
    } else {
      var listExam = data.listExam;
      $('#select-exams').empty();
      listExam.forEach(exam => {
        $('#select-exams').append($('<option>', { value: exam._id, text: exam.title }));
      })
    }
  }).fail(data => {

    $("#error-alert span").text(data.responseJSON.message);
    $("#error-alert").fadeTo(1000, 500).slideDown(500, function () {
      $("#error-alert").slideUp(500);
    });
  });
});

$('#modal-add-exam').on('show.bs.modal', function (event) {
  $(".messError").hide();
});




// $('#get-json-string-contents-btn').click(function () {
//   let content = quill.getContents();
//   $('#contents-container').text(JSON.stringify(content, null, 2).escapeSpecialChars());
// });