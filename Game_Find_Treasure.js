
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
  let answer = $('#input-answer').val();

  if (content === "") {
    $(".question-content .messError").show();
    return;
  }
  if (answer === "") {
    $(".answer .messError").show();
    return;
  }
  
  $("#insert-db-btn").prop("disabled", true);

  var categoryId = $('#select-categories :selected').val();


  var data = {
    question: content,
    answer: answer,
  };
  var jsonData = JSON.stringify(data);
  var http = new XMLHttpRequest();
  http.open("POST", HOST + "game/game_find_treasure/" + categoryId , true);
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