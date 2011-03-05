var http = require('http'),
jsdom = require('jsdom'),
markup = require('fs').readFileSync('index.html') + '',
dir = process.cwd(),
fn;

jsdom.env('<html><body></body></html>', [dir + 'jquery-1.5.min.js'], function(errors, window) {
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
	jsdom.env(markup, [dir + 'jquery-1.5.min.js'], function(errors, window) {
		global.$ = window.$;
		fn();
		res.end(window.document.innerHTML);
	});
}).listen(8749);

