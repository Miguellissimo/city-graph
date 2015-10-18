(function () {
    /* global $ */
    /* global google */
    /* global console */
    /* global InstagramFunctions */
    /* global GoogleMapsFunctions */
    /* global math */

    var map;
    var markers = [];
    var hashTagMarkers = [];

    var IMAGECOUNT = 8;

    function setMapCenter() {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latLng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude);

            map.setCenter(latLng);
        });
    }

    function getImagesByTag(tag) {
        GoogleMapsFunctions.getCoordinatesFromCityName(tag, function(position) {
            var lat = position.lat;
            var lng = position.lng;

            InstagramFunctions.getRecentImages(tag, IMAGECOUNT, lat, lng, displayImagesOnMap);

            map.setCenter(new google.maps.LatLng(lat, lng));
            map.setZoom(10);
        });
    }

    function calculateRadialPositions(lat, lng, count) {
        var start_vector = [0.3, 0.0];
        var degree = math.PI / (count/2);

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

        return radial_pos;
    }

    function removeOldMarkers() {
        if (markers.length > 0) {
            for (var j = 0; j < markers.length; j++) {
                markers[j].setMap(null);
            }

            markers = [];
        }
    }

    function removeHashTagMarkers() {
     if (hashTagMarkers.length > 0) {
            for (var j = 0; j < hashTagMarkers.length; j++) {
                hashTagMarkers[j].setMap(null);
            }

            hashTagMarkers = [];
        }   
    }

    function hashTagMarkerClicked() {
        var label = this.labelContent;
        removeHashTagMarkers();
        getImagesByTag(label);
    }

    function markerClicked() {
        var marker = this;

        if(markers.length > 1) {
            removeOldMarkers();
            marker.setMap(map);
            markers.push(marker);
            //marker.icon = marker.imageUrl;
            marker.setPosition(new google.maps.LatLng(marker.originalLat, marker.originalLng));

            var hashTags = marker.hashTags;

            var hashTagCount = math.min(hashTags.length, 20);

            var radial_pos = calculateRadialPositions(marker.originalLat, marker.originalLng, hashTagCount);

            for (var i = 0; i < radial_pos.length; i++) {
                var marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(radial_pos[i]._data[0], radial_pos[i]._data[1]),
                    map: map,
                    draggable: false,
                    raiseOnDrag: false,
                    labelContent: hashTags[i],
                    labelAnchor: new google.maps.Point(3, 30),
                    labelClass: "hashTaglabels",
                    labelInBackground: false
                });


                marker.hashTag = hashTags[i];
                hashTagMarkers.push(marker);

                marker.addListener('click', hashTagMarkerClicked);
            }
        }
        else {
            window.open(marker.postUrl);
        }        
    }

    function displayImagesOnMap(images, lat, lng) {

        removeOldMarkers();

        var radial_pos = calculateRadialPositions(lat, lng, IMAGECOUNT);
        console.log(radial_pos);
        for (var i = 0; i < radial_pos.length; i++) {

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(radial_pos[i]._data[0], radial_pos[i]._data[1]),
                map: map,
                icon: images[i][1]
            });

            markers.push(marker);

            marker.postUrl = images[i][0];
            marker.thumbnailUrl = images[i][1];
            marker.imageUrl = images[i][2];
            marker.hashTags = images[i][3];
            marker.originalLat = lat;
            marker.originalLng = lng;

            marker.addListener('click', markerClicked);
        }

    }

    function mapClicked(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();

        map.setCenter(event.latLng);
        map.setZoom(10);

        GoogleMapsFunctions.getCityNameFromCoordinates(lat, lng, function(cityName) {
            console.log(cityName);

            InstagramFunctions.getRecentImages(cityName, IMAGECOUNT, lat, lng, displayImagesOnMap);
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

        map.addListener('zoom_changed', removeOldMarkers);

        google.maps.event.addListener(map, 'click', mapClicked);

        var mapHeight = $(window).height() - $('header').height() - $('.searchControls').height();
        $('#googleMap').height(mapHeight);
    }

    $(document).ready(function() {
        initializeMap();

        $('#searchButton').click(function(){
            var cityName = $('#searchInput').val();
            console.log(cityName);

            getImagesByTag(cityName);
        });
    });
})();   