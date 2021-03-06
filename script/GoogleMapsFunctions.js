var GoogleMapsFunctions = (function (window, document, undefined) {

	/* global console */

	var ret = {};

	// privates variables
	var COORDINATESTOCITYURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
	var CITYTOCOORDINATESURL = "https://maps.google.com/maps/api/geocode/json?address=";

	ret.getCityNameFromCoordinates = function(latitude, longitude, callback) {
		var url = COORDINATESTOCITYURL + latitude + "," + longitude;
		console.log(url);
		$.get(url, function(data) {

			var cityName = "";

			var results = data.results[0];
			var found = false;
			var i = 0;

			while (i < results.address_components.length && found === false) {
				if($.inArray("locality", results.address_components[i].types) !== -1) {
					cityName = results.address_components[i].short_name;
					found = true;
				}
				 i++;
			}

			callback(cityName);
		}, "json");
	};

	ret.getCoordinatesFromCityName = function(city, callback) {
		var url = CITYTOCOORDINATESURL + city;
		console.log(url);

		$.get(url, function(data) {
			var results = data.results[0].geometry.location;
			callback(results);
		}, "json");
	};

	return ret;
})(window, document);