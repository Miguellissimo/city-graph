(function () {
	/* global $ */
	/* global google */
	/* global console */

	var map;

	function placeMarker(location) {
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});

		//google.maps.event.addListener(marker, 'click', indexViewMarkerClicked);
	}

	function setMapCenter() {
		navigator.geolocation.getCurrentPosition(function(position){
			var latLng = new google.maps.LatLng(
				position.coords.latitude,
				position.coords.longitude);

			map.setCenter(latLng);
        });
	}

	function initializeMap() {
		var mapProp = {
			center: new google.maps.LatLng(0,0),
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var googleMap = document.getElementById('googleMap');
		map = new google.maps.Map(googleMap, mapProp);
		setMapCenter();

    // TODO: eventListener in die EditMap auslagern.
    google.maps.event.addListener(map, 'click', function(event) {
    	placeMarker(event.latLng);
    });
}


$(document).ready(function() {
	initializeMap();

});

})();