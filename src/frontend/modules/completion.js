var Completion = (function() {
  var CompletionMode;

  function drawCompletions(/*Array*/ arg) {
    // FIXME
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
    /^(\S+)\s*(.*)$/.test(CmdBox.get().content);
    var cmd     = RegExp.$1;
    var arg     = RegExp.$2;

    if (!arg) {
      complete_commands(arg);
    } else if (cmd == 'open' || cmd == 'tabopen') {
      complete_urls(arg);
    } else {
      // FIXME
    }
  }

  // FIXME
  function close() {
    CompletionMode = false;
  }

  function next() {
  }

  function prev() {
  }

  return {
    start : start,
    close : close,
    next  : next,
    prev  : prev,
  }
})()
