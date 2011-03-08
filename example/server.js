var http = require('http'),
url = require('url'),
path = require('path'),
fs = require('fs'),
dir = path.join(__dirname, '/'),
nodequery = require(path.normalize(__dirname + '/../lib/nodequery')),
// This is a simple simple and horrible hack to serve static files.
// Should use node-static or similar module, but this is just an example so don't want too many dependencies
serveStatic = function(href, res) {
	fs.readFile(path.join(dir, href), function(error, data) {
		if (error === null) {
			res.writeHead(200);
			res.end(data);
		} else {
			res.writeHead(404);
			res.end();
		}
	});
};

nodequery.setup({
	dir: dir + 'pages',
	jQuery: dir + 'jquery-1.5.min.js',
	before: function() {
		$('head').append('<link href="/static/nodequery.css" rel="stylesheet">');
		$('head').append('<link href="http://fonts.googleapis.com/css?family=Cantarell" rel="stylesheet">');
		var $header = $('<div>').
		append('<img src="/static/jquery.png"><span class="plus">+</span><img src="/static/nodejs.jpg" width="200" height="60">'),
		$nav = $('<ul class="nav">'),
		addNav = function(name, url) {
			$nav.append('<li><a href="' + url + '">' + name + '</a></li>');
		};

		addNav('Home', '/');
		addNav('About', '/about.html');
		$header.append($nav);
		//$nav.after($header);
		$('div.wrapper').prepend($header);
	}
});

http.createServer(function(req, res) {
	var reqPath = url.parse(req.url, true);
	if (reqPath.href.split('/')[1] === 'static') {
		serveStatic(reqPath.href, res);
	} else {
		nodequery.request(reqPath, function(error, result) {
			if (error === null) {
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				// The DOM stripped away doctype?!
				res.end('<!DOCTYPE html>' + result);
			} else {
				res.writeHead(404);
				res.end();
			}
		});
	}
}).listen(8749);

