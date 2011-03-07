var jsdom = require('jsdom'),
fs = require('fs'),
path = require('path'),
pages = {},
startDir,
jQuery,
beforeFunctions,
afterFunctions,
setupPages = function(dir) {
	fs.readdir(dir, function(error, files) {
		if (error === null) {
			files.forEach(function(file) {
				setupPage(dir, file);
			});
		}
	});
},
setupPage = function(dir, file) {
	file = path.join(dir, file);
	if (path.extname(file) === '.html') {
		fs.readFile(file, function(error, data) {
			if (error === null) {
				var url = path.join('/', file.substring(startDir.length)),
				page = pages[url] = {
					markup: data + ''
				};
				if (url === '/index.html') {
					pages['/'] = page;
				}
				setupFuntion(file, page);
			}
		});
	} else {
		fs.stat(file, function(error, stats) {
			if (stats.isDirectory()) {
				setupPages(file);
			}
		});
	}
},
setupFuntion = function(file, page) {
	var jsFile = path.join(path.dirname(file), path.basename(file, '.html') + '.js');
	path.exists(jsFile, function(exists) {
		if (exists) {
			jsdom.env('<html><body></body></html>', [jQuery], function(errors, window) {
				global.$ = window.$;
				$.fn.ready = function(fn) {
					page.fn = fn;
				};
				require(jsFile);
			});
		}
	});
};

exports.setup = function(options) {
	jQuery = options.jQuery;
	startDir = options.dir;
	setupPages(startDir);
	beforeFunctions = options.beforeFunctions || [];
	afterFunctions = options.afterFunctions || [];
};

exports.request = function(url, callback) {
	var page = pages[url.href];
	if (page) {
		jsdom.env(page.markup, [jQuery], function(errors, window) {
			global.$ = window.$;
			beforeFunctions.forEach(function(fn) {
				fn();
			});
			if (page.fn) {
				page.fn();
			}
            afterFunctions.forEach(function(fn) {
                fn();
            });
			// Cleanup
			$('script[src*="' + jQuery + '"]').remove();
			callback(null, window.document.innerHTML);
		});
	} else {
		callback(true);
	}
};

exports.addBeforeFunction = function(fn) {
	beforeFunctions.push(fn);
};

exports.addAfterFunction = function(fn) {
	afterFunctions.push(fn);
};

