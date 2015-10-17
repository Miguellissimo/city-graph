(function () {
	/* global $ */
	/* global google */
	/* global console */
	/* InstagramApi */

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

        console.log(lat + " " + lng);
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