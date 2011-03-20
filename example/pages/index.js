var highlight = require('highlight').Highlight;

var data = JSON.parse(require('fs').readFileSync(__dirname + '/index.json'));

$(function() {
	var $content = $('.content');

	$(data).each(function() {
		$content.append('<h2>' + this.title + '</h2>');
		$(this.content).each(function() {
			// Hack 
            var text = '';
			[].concat(this.text).concat(this.code).forEach(function(line) {
				if (line) {
                    text += line + '\n';
				}
			});
            if (this.text) {
		    $content.append($('<p>').text(text));
            } else {
				$content.append($('<pre>').text(highlight(text)));
            }
		});
		$('a:contains(Home)').addClass('active');
	});
	$.each(data, function(i, part) {
		var text = '';
	});

	var $test = $('<div>').append($('<h2>').text('Proof of concept'));
	$test.append('<p>This is a <i>proof of concept</i> using an alternative solution to classic templating.<br>' + 'The point is to have a clean and static markup, then do all dynamic code from the outside.<br/>' + 'This is how people usually work with jQuery, and doing the same as templating should be familiar and comforting.</p>');
	$content.prepend($test);
});

