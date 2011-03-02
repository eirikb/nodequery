var http = require('http'),
jsdom = require('jsdom'),
markup = require('fs').readFileSync('index.html') + '';

jsdom.env(markup, ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
	global.$ = window.$;
	$.fn.ready = function(f) {
		fn = f;
	};
	require('./client.js');
});

http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	jsdom.env(markup, ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
        global.$ = window.$;
		fn();
		res.end(window.document.innerHTML);
	});
}).listen(8000);

