(function () {
	/* global $ */
	/* global google */
	/* global console */
	/* global InstagramApi */
    /* global GoogleMapsFunctions */

	var map;

	function placeMarker(location) {
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});
	}

	function setMapCenter() {
		navigator.geolocation.getCurrentPosition(function(position){
			var latLng = new google.maps.LatLng(
				position.coords.latitude,
				position.coords.longitude);

			map.setCenter(latLng);
		});
	}

	function mapClicked(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();

        GoogleMapsFunctions.getCityNameFromCoordinates(lat, lng, function(cityName){
            console.log(cityName);
            // TODO: pass cityName to InstagramFunctions

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

        google.maps.event.addListener(map, 'click', mapClicked);
    }

    $(document).ready(function() {
        initializeMap();
    });
})();