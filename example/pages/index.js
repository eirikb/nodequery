var data = JSON.parse(require('fs').readFileSync(__dirname + '/index.txt'));

$(function() {
	$p = $('p');

	$.each(data, function(i, car) {
		var $section = $('<section>').append($('<p>').text('Name: ' + car.name)).append($('<p>').text('Price: ' + car.price));
		$p.after($section);
	});
});

