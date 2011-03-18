var http = require('http'),
url = require('url'),
path = require('path'),
fs = require('fs'),
dir = path.join(__dirname, '/'),
nodequery = require(path.normalize(dir + '../lib/nodequery')),
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
// This is used to load all synta-scripts using CommonJS
require.paths.push(dir + 'syntaxhighlighter/scripts/');
// It seems XRegExp is not included properly for shXmlBrush, doing a simple hack
eval(fs.readFileSync(dir + 'xregexp.js') + '');
global.XRegExp = XRegExp;

nodequery.setup({
	dir: dir + 'pages',
	jQuery: dir + 'jquery-1.5.min.js',
	before: function() {
		$('head').append('<link href="/static/nodequery.css" rel="stylesheet">').
		append('<link href="http://fonts.googleapis.com/css?family=Cantarell" rel="stylesheet">').
		append('<link href="/static/shCoreDefault.css" rel="stylesheet">');
		var $header = $('div.header').
		append('<img src="/static/nodejs.jpg" width="200" height="60"><span class="plus">+</span><img src="/static/jquery.png">'),
		$nav = $('ul.nav'),
		addNav = function(name, url) {
			$nav.append('<li><a href="' + url + '">' + name + '</a></li>');
		};

		addNav('Home', '/');
		addNav('About', '/about.html');
		$header.append($nav);
		//$nav.after($header);
		$('div.wrapper').prepend($header);
		$('.author > span').text('eirikb@eirikb.no');
	},
	after: function() {
		var shSyntaxHighlighter = require('shCore').SyntaxHighlighter;
		$('pre').each(function(i, e) {
			var $e = $(e),
			sh = require('shBrush' + $e.data('brush')).Brush,
			brush = new sh();
			brush.init({
				toobar: false
			});
			$e.html(brush.getHtml($e.html()));
		});
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

