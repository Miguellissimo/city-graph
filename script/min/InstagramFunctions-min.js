var InstagramFunctions=function(a,n,t){function e(a,n){$.ajax({url:a,type:"GET",crossDomain:!0,dataType:"jsonp",success:function(a){n(a)}})}var o={},r="https://api.instagram.com/v1/tags/",i="/media/recent?client_id=";return o.getRecentImages=function(a,n,t){function o(a){for(var e=[],o=0;n>o;o++){var r=a.data[o].link,i=a.data[o].images.thumbnail.url;e.push([r,i])}t(e)}console.log("getRecentImages called");var s=r+a+i+InstagramApi.clientId;e(s,o)},o.getPopularImages=function(a,n,t){function o(a){s=a.pagination.next_url;for(var n=0;n<a.data.length;n++){var t=a.data[n].link,e=a.data[n].images.thumbnail.url,o=a.data[n].likes.count;c.push([t,e,o])}}console.log("getPopularImages called");for(var s=r+a+i+InstagramApi.clientId,c=[],u=0;10>u;u++)e(s,o);c.sort(function(a,n){return a[2]<n[2]?1:a[2]>n[2]?-1:0});var l=[];for(u=0;n>u;u++)l.push(c[u]);t(l)},o}(window,document);