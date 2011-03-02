var http = require('http'),
jsdom = require('jsdom'),
fs = require('fs'),
fn;

jsdom.env(fs.readFileSync('index.html') + '', ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
	global.$ = window.$;
	global.document = window.document;
	window.$.fn.ready = function(f) {
		fn = f;
	};
	require('./client.js');
});

http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	jsdom.env(fs.readFileSync('index.html') + '', ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
		global.$ = window.$;
		global.document = window.document;
		fn();
		res.end(document.innerHTML);
	});
}).listen(8000);

