var data = JSON.parse(require('fs').readFileSync(__dirname + '/index.json'));

$(function() {
	$p = $('p');

	$.each(data, function(i, part) {
		var $section = $('.content').append('<h2>' + part.title + '</h2>'),
        text = '';
        $.each(part.content, function(i, line) {
            text += line + '\n';
        });
        $section.append(text);
		$p.after($section);
	});
});

