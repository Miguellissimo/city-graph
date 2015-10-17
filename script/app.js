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

    map.setCenter(event.latLng);
    map.setZoom(10);

    GoogleMapsFunctions.getCityNameFromCoordinates(lat, lng, function(cityName){
        console.log(cityName);
        // TODO: pass cityName to InstagramFunctions
        InstagramFunctions.get_image_links_for(cityName, 5, function(images) {

            var image = {
                url: images[0][1],
                size: new google.maps.Size(150, 150),
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10
            };

            var marker = new google.maps.Marker({
                position: map.center,
                map: map,
                icon: image
            });

            /*
            for (var i = 0; i < images.length; i++) {

            }

            */
        });
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


var mapHeight = $(window).height() - $('header').height() - $('.searchControls').height();
$('#googleMap').height(mapHeight);
}

$(document).ready(function() {
    initializeMap();
});
})();