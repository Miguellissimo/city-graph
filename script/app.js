(function () {
    /* global $ */
    /* global google */
    /* global console */
    /* global InstagramFunctions */
    /* global GoogleMapsFunctions */
    /* global math */

    var map;
    var markers = [];

    var IMAGECOUNT = 8;

    function setMapCenter() {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latLng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude);

            map.setCenter(latLng);
        });
    }

    function moveMarker(marker) {
        var marker = this;
        var oldPosition = marker.getPosition();
        var deltaLat = marker.originalLat - oldPosition.lat();
        var deltaLng = marker.originalLng - oldPosition.lng();

        var latStep = deltaLat / 50;
        var lngStep = deltaLng / 50;

        for(var i = 0; i < 50; i++) {
            setTimeout(function() {
                var lat = marker.getPosition().lat() + latStep;
                var lng = marker.getPosition().lng() + lngStep;
                marker.setPosition(new google.maps.LatLng(lat, lng));    
            }, 50);
        }
        

        //this.setPosition(new google.maps.LatLng(this.originalLat, this.originalLng));
    }

    function mapClicked(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();

        map.setCenter(event.latLng);
        map.setZoom(10);

        GoogleMapsFunctions.getCityNameFromCoordinates(lat, lng, function(cityName) {
            console.log(cityName);

            InstagramFunctions.getRecentImages(cityName, IMAGECOUNT, function(images) {
                if (markers.length > 0) {
                    for (var j = 0; j < markers.length; j++) {
                        markers[j].setMap(null);
                    }

                    markers = [];
                }

                var start_vector = [0.3, 0.0];
                var degree = math.PI / 4;

                function rotate(degree) {
                    return math.matrix([[math.cos(degree), math.sin(degree)],
                        [ -math.sin(degree), math.cos(degree)]]);
                }

                var radial_pos = [];
                for (var i = 0; i < math.PI * 2; i += degree) {
                    var pos = math.multiply(rotate(i), start_vector);
                    pos._data[0]  = pos._data[0] / 2;
                    radial_pos.push(math.add(pos, [lat, lng]));
                }

                console.log(radial_pos);
                for (i = 0; i < radial_pos.length; i++) {

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(radial_pos[i]._data[0], radial_pos[i]._data[1]),
                        map: map,
                        icon: images[i][1]
                    });

                    markers.push(marker);

                    marker.postUrl = images[i][0];
                    marker.originalLat = lat;
                    marker.originalLng = lng;

                    marker.addListener('click', moveMarker);
                }
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

    map.addListener('zoom_changed', function() {
        if (markers.length > 0) {
            for (var j = 0; j < markers.length; j++) {
                markers[j].setMap(null);
            }

            markers = [];
        }
    });

    google.maps.event.addListener(map, 'click', mapClicked);


    var mapHeight = $(window).height() - $('header').height() - $('.searchControls').height();
    $('#googleMap').height(mapHeight);
}

$(document).ready(function() {
    initializeMap();
});
})();   