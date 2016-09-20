$('form').on('submit', function(e) {

	//to prevent the default action of submitting a form and reloading the page
	e.preventDefault();

	//maps the input values with name='address' to our variable in JS 'address'.
	var address = $('.input[name^=address]').map(function(idx, elem) {
		return $(elem).val();
	//http get request
	}).get();

	//ajax call GET request on /get/ADDRESS/CITY/STATE
	$.ajax({
		method: 'GET',
		url: '/get/' + address[0] + '/' + address[1] + '/' + address[2]
	}).success(function(data) {
		//on a successful request, parse and save the data
		var parsedData = JSON.parse(data);

		//error flag received from server.
		if (data == 'ERROR') {
			$('#quote-response').html('Invalid address!');
		}
		//otherwise, alter HTML and create a new row with the correct input as data.
		else {
			$('#quote-response').html('');
			$('#row-zone').append(
				'<tr><td>'+parsedData.street+
				'</td><td>'+parsedData.city+
				'</td><td>'+parsedData.state+
				'</td><td>'+parsedData.zip+
				'</td></tr>');
		}
	});

});

