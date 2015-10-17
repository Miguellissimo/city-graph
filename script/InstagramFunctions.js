var InstagramFunctions = (function (window, document, undefined) {

    var ret = {}

    ret.get_image_links_for = function(hashtag, n) {
        console.log("get_images_links_for called");
        $.ajax({
            url: 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent?client_id=' + InstagramApi.clientId,
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
            var tuple_list = []; 
            for (i = 0; i < n; i++) {
                var link_profile = data.data[i].link;
                var thumbnail_link = data.data[i].images.low_resolution.url;
                tuple_list.push([link_profile, thumbnail_link]);
            }
            console.log(tuple_list); }
        });
    };
    
    return ret;

})(window, document);