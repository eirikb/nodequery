var http = require('http'),
jsdom = require('jsdom'),
fs = require('fs'),
client = require('./client');

http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	jsdom.env(fs.readFileSync('index.html') + '', ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
		global.$ = window.$;
		client.ready();
		res.end(window.document.innerHTML);
	});
}).listen(8000);

