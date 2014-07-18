(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});

  
  var interval = setInterval(  function(){
     if(document.readyState === "complete"){
      clearInterval(interval);
      if ( window.location.href.indexOf('page_y') != -1 ) {
        var match = window.location.search.split('?')[1].split("&")[0].split("=");
         setTimeout(function(){ 
          document.getElementsByTagName("body")[0].scrollTop = 0; 
          document.getElementsByTagName("body")[0].scrollTop = +match[1]; 
      }
    }
  } , 1);

  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var reloaders = {
    page: function(){
      var page_y = document.getElementsByTagName("body")[0].scrollTop;
      var old =   window.location.href;
      var next = window.location.origin + window.location.pathname + '?page_y=' +  page_y + window.location.hash;   
      window.location.href =  next
      if(next == old){
        window.location.reload(true);
      }
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel="stylesheet"]'))
        .filter(function(link){
          return (link != null && link.href != null);
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname;

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
