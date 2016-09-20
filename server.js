//all includes listed here
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
app.use(express.static(__dirname)); //this allows all of our requests access files in the root directory

//include mysql here, creating a connection
var mysql = require('mysql');
var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'Blast0!se',
   database: 'addresses'
});
connection.connect(function(err) {
   if(!err) {
      console.log("Database is connected ... ");
   }
   else {
      console.log("Error connecting database ... ");
   }
});
//get request on street city and state input
app.get('/get/:street/:city/:state', function(request, response) {
   var addr = [request.params.street, request.params.city, request.params.state];
   var name = request.params.street; //this is just for the sake of einstein code returning at the moment
   var errFlag = 0;
   var newAddress = {};
   var userInput = addr[0] + ' ' + addr[1] + ' ' + addr[2];
   for (var i = 0; i < addr.length; ++i) {
      addr[i] = addr[i].replace(/\s/g, '');
   }
   if (!isNaN(addr[0]) || !isNaN(addr[1]) || !isNaN(addr[2])) {
      errFlag = 1;
   }
   //api code here
   //https://maps.googleapis.com/maps/api/geocode/xml?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAuVomf7gL__hc2dBd-HHRUy8P_XFy0wBQ
   var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addr[0] + ',' + addr[1] + ',' + addr[2] + '&key=AIzaSyAuVomf7gL__hc2dBd-HHRUy8P_XFy0wBQ';
   callback = function(res) {
      var str = '';
      res.on('data', function(chunk) {
         str += chunk;
      });
      res.on('end', function() {
//BIG BOX INCOMING
         var confirmedAddress = {"street":''};
         var addressValues = JSON.parse(str)
         if (addressValues["results"][0] == null){
            errFlag = 1;
         }
         else {
            for (var i = 0; i < addressValues["results"][0]["address_components"].length; ++i) {
               if (addressValues["results"][0]["address_components"][i]["types"][0] == "country"  
                  && addressValues["results"][0]["address_components"][i]["short_name"] != "US") {
                  errFlag = 1;
                  break;
               }
               else if (addressValues["results"][0]["address_components"][i]["types"][0] == "street_number") {
                  confirmedAddress.street = addressValues["results"][0]["address_components"][i]["long_name"];
               }
               else if (addressValues["results"][0]["address_components"][i]["types"][0] == "route"){
                  confirmedAddress.street +=  ' ' + addressValues["results"][0]["address_components"][i]["short_name"];
               }
               else if (addressValues["results"][0]["address_components"][i]["types"][0] == "locality"){
                  confirmedAddress.city = addressValues["results"][0]["address_components"][i]["short_name"];
               }
               else if (addressValues["results"][0]["address_components"][i]["types"][0] == "administrative_area_level_1"){
                  confirmedAddress.state = addressValues["results"][0]["address_components"][i]["short_name"];
               }
               else if (addressValues["results"][0]["address_components"][i]["types"][0] == "postal_code"){
                  confirmedAddress.zip = addressValues["results"][0]["address_components"][i]["short_name"];
               }
            };
         }         
         if (confirmedAddress.street == null || confirmedAddress.city == null || confirmedAddress.state == null || confirmedAddress.zip == null) {
            errFlag = 1;
         }
         else if (addr[1].toLowerCase() !== confirmedAddress.city.toLowerCase().replace(/\s/g, '') || addr[2].toLowerCase() !== confirmedAddress.state.toLowerCase()) {
            errFlag = 1;
         }

   //
         if (errFlag == 1) {
            response.end('ERROR');
         }
         else {
            newAddress = {
               street:confirmedAddress.street,
               city:confirmedAddress.city,
               state:confirmedAddress.state,
               zip:confirmedAddress.zip,
               input:userInput
            };
            //console.log(newAddress);
            connection.query('INSERT INTO main SET ?', newAddress, function (err, rows) {
            //connection.end();
                  if (!err)
                     console.log('The solution is: ', rows);
                  else
                     console.log('Error while performing query.', newAddress);
            });
            console.log(confirmedAddress);
            response.end(JSON.stringify(confirmedAddress));
         }
      });
   }
   //console.log(url);
   https.request(url, callback).end();
   //logic to confirm its a correct address
   //database
   //return to client, zip and proper address
   //console.log(xml);
   //response.end(); 
});

app.get('/', function(req,res) {
   console.log('hello?');
   res.sendFile(__dirname + '/index.html')
   console.log(__dirname);
})

app.listen(8080);
console.log ('server opened at 8080 hi');