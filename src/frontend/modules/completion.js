// FIXME update after everykey input
var Completion = (function() {
  var CompletionMode;
  var selectedIndex = -1;
  var highlight   = 'completion_highlight';

  function drawCompletions(/*Array*/ arg) {
    var box = document.getElementById('_vrome_content');
    for (var i=0; i < arg.length; i++) {
      var li = document.createElement('li');
      li.innerText = arg[i];
      box.appendChild(li);
    }
  }

  function completeCommands(keyword) {
    drawCompletions(CmdLine.getCommands(keyword));
  }

  function completeUrls(keyword) {
    // FIXME open,tabopen complete (search by) search engine, history, bookmarks
    drawCompletions([]);
  }

  function start() {
    CompletionMode = true;
    selectedIndex = -1;

    var content = CmdBox.get().content;
    /^(\S+)\s*(.*)$/.test(content);
    var cmd     = RegExp.$1;
    var arg     = RegExp.$1 && RegExp.$2;

    if (!/\s/.test(content)) {
      completeCommands(cmd);
    } else if (cmd == 'open' || cmd == 'tabopen') {
      completeUrls(arg);
    } else {
      // FIXME
    }
  }

  // FIXME
  function close() {
    CompletionMode = false;
    var box = document.getElementById('_vrome_content');
    if (box) box.innerHTML = '';
  }

  function next(step) {
    if (!CompletionMode) start();

    step      = step || 1;
    var ul    = document.getElementById('_vrome_content');
    var nodes = [];

    for (var i in ul.childNodes) {
      var node = ul.childNodes[i];
      if (/li/i.test(node.nodeName)) {
        nodes[nodes.length] = ul.childNodes[i];
      }
    }

    if (nodes[selectedIndex]) nodes[selectedIndex].removeAttribute(highlight);
    selectedIndex = selectedIndex + nodes.length + step;
    selectedIndex = selectedIndex % nodes.length;
    if (nodes[selectedIndex]) nodes[selectedIndex].setAttribute(highlight,'true');
  }

  function prev() {
    next(-1);
  }

  function select() {
    if (!CompletionMode) return;

    var li = document.querySelector('li[' + highlight + ']');
    CmdBox.set({content : li.innerText });
  }

  return {
    start  : start,
    close  : close,
    next   : next,
    prev   : prev,
    select : select,
  }
})()
