var http = require('http'),
url = require('url'),
path = require('path'),
dir = path.join(__dirname, '/'),
nodequery = require(path.normalize(__dirname + '/../lib/nodequery'));

nodequery.setup({
	dir: dir + 'pages',
	jQuery: dir + 'jquery-1.5.min.js'
});

http.createServer(function(req, res) {
	var path = url.parse(req.url, true);
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
    console.log(nodequery.request(path))
    nodequery.request(path, function(result) {
        res.end(result);
    });
}).listen(8749);

