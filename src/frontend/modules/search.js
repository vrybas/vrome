var Search = (function(){
  var searchMode,direction,lastSearch;

  var highlight_class      = '__vrome_search_highlight';
  var highlight_current_id = '__vrome_search_highlight_current';

  function find(keyword, node) {
    if (!keyword) return;
    node = node || document.body;

    // Iterate node childNodes
    if (node.id != '_vrome_cmd_box' && node.hasChildNodes() && !/(script|style)/i.test(node.tagName)) {
      var childNodes = node.childNodes;
      for (var i = 0;i < childNodes.length;i++) {
        find(keyword, childNodes[i]);
      }
    }

    if (node.nodeType == 3) { // text node
      var caseSensitive = /[A-Z]/.test(keyword);
      var key   = caseSensitive ? keyword   : keyword.toUpperCase();
      var text  = caseSensitive ? node.data : node.data.toUpperCase();
      var index = text.indexOf(key);

      if (index != -1) {
        var parentNode = node.parentNode;

        if (parentNode.className != highlight_class) {
          var nodeData = node.data;

          var before = document.createTextNode(nodeData.substr(0,index));
          var match  = document.createTextNode(nodeData.substr(index,keyword.length));
          var after  = document.createTextNode(nodeData.substr(index + keyword.length));

          var span = document.createElement("span");
          span.setAttribute('class',highlight_class);
          span.appendChild(match);

          parentNode.insertBefore(before, node);
          parentNode.insertBefore(span  , node);
          parentNode.insertBefore(after , node);
          parentNode.removeChild(node);
        }
      }
    }
  }

  function remove() {
    var nodes = document.getElementsByClassName(highlight_class);
    for (var i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i]) {
        var parentNode = nodes[i].parentNode;
        var text = nodes[i].innerText;

        var prevNode   = nodes[i].previousSibling;
        if (prevNode.nodeType == 3) {
          text = prevNode.data + text;
          parentNode.removeChild(prevNode);
        }

        var nextNode   = nodes[i].nextSibling;
        if (nextNode.nodeType == 3) {
          text = text + nextNode.data;
          parentNode.removeChild(nextNode);
        }

        var textNode = document.createTextNode(text);
        parentNode.replaceChild(textNode, nodes[i]);
      }
    }
  }

  function next(step) {
		if (!searchMode) return;

    var offset = direction * step * times();
    var nodes = document.getElementsByClassName(highlight_class);
    if (nodes.length == 0) return false;

    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id == highlight_current_id) {
        nodes[i].removeAttribute('id');
        break;
      }
    }

		i = (i + offset) % nodes.length
		if (i < 0) i +=	nodes.length;

    Debug('Search.next - size:' + nodes.length + ' selected:' + i + ' direction:' + direction + ' offset:' + offset);

    if (nodes[i]) { //FIXME if element is invisable
      nodes[i].setAttribute('id',highlight_current_id);
      nodes[i].scrollIntoViewIfNeeded();
    } else {
      next(step);
    }
  }


  function handleInput(e){
    if (!searchMode) return;
    if (!isAcceptKey(getKey(e))) remove();
    content = CmdBox.get().content;
    if (content.length >= 3) {
      find(content);
      lastSearch = content;
    }
  }

  function start(backward){
    searchMode = true;
    direction = backward ? -1 : 1 ;

    CmdBox.set({
			title   : backward ? 'Backward search: ?' : 'Forward search: /',
			pressUp : handleInput,
			content : lastSearch || ''
	  });
  }

  function stop() {
		if (!searchMode) return;
    searchMode = false;
    remove();
  }

  function useSelectedValueAsKeyword() {
    lastSearch = getSelected();
		return lastSearch;
  }

	// API
  return {
    start    : start,
    stop     : stop,
    backward : function() { start(true); },
    prev     : function() { next(-1); },
    next     : function() { next(1);  },
    forwardCursor  : function() { if (useSelectedValueAsKeyword()) { start(); } },
    backwardCursor : function() { if (useSelectedValueAsKeyword()) { start(true); } },
  }
})()
