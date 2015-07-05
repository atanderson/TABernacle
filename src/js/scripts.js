var loadCSS = (function(){

    chrome.storage.sync.get({

        customCSS: ''

    }, function(items) {

        $('head').append('<style>' + items.customCSS + '</style>');

    });

})();

var loadBackground = (function(){

    chrome.storage.sync.get({

        bgImage: ''

    }, function(items) {

        $('body').css({

            "background-size": "cover",
            "background-image" : "url('" + items.bgImage + "')"

        });

    });

})();

//Run a search mode when the hotkey is pressed
searchViaKey('#search-input');