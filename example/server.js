var http = require('http'),
url = require('url'),
path = require('path'),
dir = path.join(__dirname, '/'),
nodequery = require(path.normalize(__dirname + '/../lib/nodequery'));

nodequery.setup({
	dir: dir + 'pages',
	jQuery: dir + 'jquery-1.5.min.js',
	before: function() {
		$('body').append($('<img>').attr('src', 'http://google.no/images/logos/ps_logo2.png'));
	},
	after: function() {
		$('body').append('<h1>Hey</h1>');
	}
});

http.createServer(function(req, res) {
	var path = url.parse(req.url, true);
	nodequery.request(path, function(error, result) {
		if (error === null) {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.end(result);
		} else {
			res.writeHead(404);
			res.end();
		}
	});
}).listen(8749);

