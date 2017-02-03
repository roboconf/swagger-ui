'use strict';

$(function () {
  var url = '';
  var rawUrl = window.location.search.match(/url=([^&]+)/);
  if (rawUrl && rawUrl.length > 1) { 
      if (rawUrl[1].startsWith('http://roboconf.net/') ||
          rawUrl[1].startsWith('http://localhost') ||
          rawUrl[1].startsWith('/')) {
        url = decodeURIComponent(rawUrl[1]);
      }
  }
  /*
   ** Only for tests! **
   ** Just copy your "swagger.json" file in the "dist" directory.
   
  else {
    url = '/swagger.json';
  }
  */
  
  // Check there is a valid URL
  if (! url) {
    var msg = 'No swagger.json file was provided.<br />Such files must be hosted by Roboconf\'s Maven repositories to be loaded here.';
    $('#message-bar').html(msg);
    return;
  }

  // Otherwise, use Swagger UI
  hljs.configure({
    highlightSizeThreshold: 5000
  });

  // Pre load translate...
  if(window.SwaggerTranslator) {
    window.SwaggerTranslator.translate();
  }

  window.swaggerUi = new SwaggerUi({
    url: url,
    dom_id: 'swagger-ui-container',
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    onComplete: function(/*swaggerApi, swaggerUi*/){
      if(typeof initOAuth === 'function') {
        // We do not care for Roboconf
     }

      if(window.SwaggerTranslator) {
        window.SwaggerTranslator.translate();
      }
    },
    onFailure: function(/*data*/) {
      log('Unable to Load SwaggerUI.');
    },
    docExpansion: 'none',
    jsonEditor: false,
    defaultModelRendering: 'schema',
    showRequestHeaders: false
  });

  window.swaggerUi.load();

  function log() {
    if ('console' in window) {
      console.log.apply(console, arguments);
    }
  }
});
