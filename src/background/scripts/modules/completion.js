var Completion = (function() {

  function completeUrls(msg) {
    // FIXME open,tabopen complete (search by) search engine, history, bookmarks
    var tab     = arguments[arguments.length-1],index;
    var port    = chrome.tabs.connect(tab.id, {});
    var keyword = msg.keyword;

    chrome.bookmarks.search(keyword, function(bookmarks) {
      var matched = [];
      for (var i=0; i < bookmarks.length; i++) {
        matched[matched.length] = bookmarks[i].url;
      }
      port.postMessage({action : "Completion.completeUrls", matched : matched});
    })
  }

  return {
    completeUrls : completeUrls
  }
})()
