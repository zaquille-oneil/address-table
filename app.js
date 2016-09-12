$('form').on('submit', function(e) {
	e.preventDefault();
	var address = $('.input[name^=address]').map(function(idx, elem) {
		return $(elem).val();
	}).get();
	$.ajax({
		method: 'GET',
		url: '/get/' + address[0] + '/' + address[1] + '/' + address[2]
	}).success(function(data) {
		console.log(data);
		if (data == 'ERROR') {
			$('#quote-response').html('Invalid address!');
		}
		else {
			console.log(data);
			var parsedData = JSON.parse(data);
			$('#quote-response').html('');
			$('#row-zone').append('<tr><td>'+parsedData.street+'</td><td>'+parsedData.city+'</td><td>'+parsedData.state+'</td><td>'+parsedData.zip+'</td></tr>');
		}
	});
});

