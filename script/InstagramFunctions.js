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

    ret.getRecentImages = function(hashtag, n, callback_function) {
        console.log("getRecentImages called");

        function callBack(data) {
            var tuple_list = []; 
            for (var i = 0; i < n; i++) {
                var link_profile = data.data[i].link;
                var thumbnail_link = data.data[i].images.thumbnail.url;
                tuple_list.push([link_profile, thumbnail_link]);
            }
            callback_function(tuple_list);
        }

        var url = INSTAGRAMURL+ hashtag + RECENTURLEXTENSION + InstagramApi.clientId;
        getImagesFromUrl(url, callBack);
    };

    ret.getPopularImages = function(hashtag, n, callback_function) {
        console.log("getPopularImages called");

        var url = INSTAGRAMURL+ hashtag + RECENTURLEXTENSION + InstagramApi.clientId;
        var images = [];

        function callBack(data){
            url = data.pagination.next_url;
            for(var i = 0; i < data.data.length; i++) {
                var link_profile = data.data[i].link;
                var thumbnail_link = data.data[i].images.thumbnail.url;
                var likeCount = data.data[i].likes.count;
                images.push([link_profile, thumbnail_link, likeCount]);
            }
        }

        for(var i = 0; i < 10; i++) {
            getImagesFromUrl(url, callBack);
        }

        images.sort(function(a , b) {
            if(a[2] < b[2]) {
                return 1;
            }

            if(a[2] > b[2]) {
                return -1;
            }

            return 0;
        });
        var ret = [];

        for(i = 0; i < n; i++) {
            ret.push(images[i]);
        }

        callback_function(ret);
        
    };
    
    return ret;

})(window, document);