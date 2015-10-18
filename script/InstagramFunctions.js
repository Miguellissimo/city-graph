var InstagramFunctions = (function (window, document, undefined) {

    /* global InstagramApi */
    /* global console */

    var ret = {};

    var INSTAGRAMURL = "https://api.instagram.com/v1/tags/";
    var RECENTURLEXTENSION = "/media/recent?client_id=";

    function getImagesFromUrl(url, callBack) {
        $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
                callBack(data);
            }
        });
    }

    ret.getRecentImages = function(hashtag, n, lat, lng, callback_function) {
        console.log("getRecentImages called");

        function callBack(data) {
            var tuple_list = []; 
            for (var i = 0; i < n; i++) {
                var link_profile = data.data[i].link;
                var thumbnail_link = data.data[i].images.thumbnail.url;
                var big_image = data.data[i].images.standard_resolution;
                tuple_list.push([link_profile, thumbnail_link, big_image]);
            }
            callback_function(tuple_list, lat, lng);
        }

        var url = INSTAGRAMURL+ hashtag + RECENTURLEXTENSION + InstagramApi.clientId;
        getImagesFromUrl(url, callBack);
    };
    
    return ret;

})(window, document);