var http = require('http'),
url = require('url'),
path = require('path'),
dir = path.join('/', path.join(path.dirname(__filename), '/')),
nodequery = require(path.normalize(dir + '../lib/nodequery')),
staticFiles = new(require('node-static')).Server('./example');

nodequery.setup({
	dir: dir + 'pages',
	jQuery: 'http://code.jquery.com/jquery-1.5.min.js',
	before: function($) {
		$('head').append('<link href="/static/nodequery.css" rel="stylesheet">').
		append('<link href="http://fonts.googleapis.com/css?family=Cantarell" rel="stylesheet">').
		append('<link href="/static/shCoreDefault.css" rel="stylesheet">').
		append('<link href="/static/github.css" rel="stylesheet">');
		var $header = $('div.header').
		append('<img src="/static/nodejs.jpg" width="200" height="60"><span class="plus">+</span><img src="/static/jquery.png">'),
		$nav = $('ul.nav'),
		addNav = function(name, url) {
			$nav.append('<li><a href="' + url + '">' + name + '</a></li>');
		};

		addNav('Home', '/');
		addNav('About', '/about.html');
		addNav('Faq', '/faq.html');
		addNav('Under the hood', '/under-the-hood.html');
		addNav('Usage', '/usage.html');
		$header.append($nav);
		//$nav.after($header);
		$('div.wrapper').prepend($header);
		$('.author > span').text('eirikb@eirikb.no');
	},
	after: function($) {
		$('.forkme').attr('href', 'https://github.com/eirikb/nodequery').children('img').attr('alt', 'Fork me on Github!');
	}
});

http.createServer(function(req, res) {
	var reqPath = url.parse(req.url, true);
	if (reqPath.href.split('/')[1] === 'static') {
		staticFiles.serve(req, res);
	} else {
		nodequery.request(reqPath, function(error, result) {
			if (error === null) {
				res.writeHead(200, {
					'Content-Type': 'text/html; charset=UTF-8'
				});
				// The DOM stripped away doctype?! - Don't shoot me!
				res.end('<!DOCTYPE html>\n' + result);
			} else {
				res.writeHead(404);
				res.end();
			}
		});
	}
}).listen(8749);

