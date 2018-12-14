
const HOST = "http://103.114.107.16:8004/api/exercise/";
var categories = null;
$(function () {

  $(".messError").hide();
  $("#success-alert").hide();
  $("#error-alert").hide();

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

$('#insert-db-btn').click(function () {

  $(".messError").hide();

  let content = $("#contents-container").val();
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
  var categoryId = $('#select-categories :selected').val();
  var listAnswers = [];
  listAnswers.push(choiceA);
  listAnswers.push(choiceB);
  listAnswers.push(choiceC);
  listAnswers.push(choiceD);

  var data = {
    question: content,
    listAnswers: listAnswers,
    correctAnswer: (+ans),
  };
  var jsonData = JSON.stringify(data);
  var http = new XMLHttpRequest();
  http.open("POST", HOST + "game/game_quiz/" + categoryId , true);
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




// $('#get-json-string-contents-btn').click(function () {
//   let content = quill.getContents();
//   $('#contents-container').text(JSON.stringify(content, null, 2).escapeSpecialChars());
// });