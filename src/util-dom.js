
/**
 * @fileoverview DOM utils for fetching script etc.
 */

(function(util) {

  var head = document.getElementsByTagName('head')[0];

  util.getScript = function(url, callback, charset) {
    var node = document.createElement('script');

    scriptOnload(node, function() {
      if (callback) callback.call(node);

      // Reduces memory leak.
      try {
        if (node.clearAttributes) {
          node.clearAttributes();
        } else {
          for (var p in node) delete node[p];
        }
      } catch (x) {
      }
      head.removeChild(node);
    });

    if (charset) node.setAttribute('charset', charset);
    node.async = true;
    node.src = url;
    return head.insertBefore(node, head.firstChild);
  };

  function scriptOnload(node, callback) {
    node.addEventListener('load', callback, false);
    node.addEventListener('error', callback, false);
  }

  if (!head.addEventListener) {
    scriptOnload = function(node, callback) {
      node.attachEvent('onreadystatechange', function() {
        var rs = node.readyState;
        if (rs === 'loaded' || rs === 'complete') {
          callback();
        }
      });
    }
  }

  util.scriptOnload = scriptOnload;


  var interactiveScript = null;

  util.getInteractiveScript = function() {
    if (interactiveScript && interactiveScript.readyState === 'interactive') {
      return interactiveScript;
    }

    var scripts = head.getElementsByTagName('script');

    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      if (script.readyState === 'interactive') {
        return script;
      }
    }

    return null;
  };


  util.getScriptAbsoluteSrc = function(node) {
    return node.hasAttribute ? // non-IE6/7
        node.src :
        // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
        node.getAttribute('src', 4);
  };

})(seajs._util);
