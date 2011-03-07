var cars = [{
	name: 'Opel',
	price: 1000
},
{
	name: 'Bmw',
	price: 3000
}];

$(function() {
	$p = $('p');

	$('span').html(cars.length);
	$.each(cars, function(i, car) {
		var $section = $('<section>').append($('<p>').text('Name: ' + car.name)).append($('<p>').text('Price: ' + car.price));
		$p.after($section);
	});
});

