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

// $('#get-json-string-contents-btn').click(function () {
//   let content = quill.getContents();
//   $('#contents-container').text(JSON.stringify(content, null, 2).escapeSpecialChars());
// });