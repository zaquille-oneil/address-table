console.log('app.js required through index.html');
//a counter to see how many fields have been entered, altering each row.
$('form').on('submit', function(e) {
	e.preventDefault();
	//a counter to see how many fields have been entered, altering each row.
	var address = $('.input[name^=address]').map(function(idx, elem) {
		return $(elem).val();
	}).get(); //for input values, recall this
	// ajax
	/*var x = $.ajax({
		method: 'GET',
		url: '/quotes/' + inputValue
	});
	x.success(function(data) {
		console.log(data);
	});*/
	$.ajax({ //jackie's version, where she uses piggy-back thing
		method: 'GET',
		url: '/get/' + address[0] + '/' + address[1] + '/' + address[2]
	}).success(function(data) {
		//data now has your quote. what do u want to do with data?
		//$('#quote-response').html(data);
		console.log(data);
		if (data == 'ERROR') {
			$('#quote-response').html('Invalid address!');
		}
		else {
			console.log(data);
			var parsedData = JSON.parse(data);	
		//console.log(x);
		//console.log(data);
		//console.log(confirmedAddress);
		//confirmedAddress(results)
		/*
		var street = x["results"][0]["address_components"][0]["long_name"] + ' ' + x["results"][0]["address_components"][1]["short_name"];
		var city = x["results"][0]["address_components"][2]["short_name"];
		var state = x["results"][0]["address_components"][4]["short_name"];
		var zip = x["results"][0]["address_components"][6]["short_name"];*/
			$('#quote-response').html('');
			$('#row-zone').append('<tr><td>'+parsedData.street+'</td><td>'+parsedData.city+'</td><td>'+parsedData.state+'</td><td>'+parsedData.zip+'</td></tr>');
		}
		//confirmedAddress.fhjdkahf)
	});
	//$('#row-zone').html('<tr><td>street</td><td>city</td><td>state</td><td>zip</td></tr>')//confirmedAddress.fhjdkahf)
});

