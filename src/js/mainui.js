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

var submitSearch = function(mode){
    chrome.storage.sync.get({
        modes: ''
    }, function(items) {
        var searchquery = $('#search-input').val();

        if (!searchquery){return  false;}

        var useMode = $.grep(items.modes, function(e){
            return e.title === mode;
        });
    
        if (useMode[0].queryBefore === ''){
            useMode[0].queryBefore = 'http://';
        }
    
        var location = useMode[0].queryBefore + encodeURIComponent(searchquery) + useMode[0].queryafter,
        win = window.open(location);
    });
};

var searchViaKey = function(input){
        chrome.storage.sync.get({
            modes: ''
        }, function(items) {
            $(input).on('keydown', function(e){
            //Find the key pressed
            var keyListener = e.keyCode,
            useMode = $.grep(items.modes, function(e){
                return e.hotkey == keyListener;
            });
            if(useMode[0]){
                e.preventDefault();
                submitSearch(useMode[0].title);
            }
        });
    });
};

//Run a search mode when the hotkey is pressed
searchViaKey('#search-input');