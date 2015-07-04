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
        
        var location = useMode[0].queryBefore + encodeURIComponent(searchquery) + useMode[0].queryafter;

        var win = window.open(location);

    });

};

var searchViaKey = function(input){

        chrome.storage.sync.get({

            modes: ''

        }, function(items) {

            $(input).on('keydown', function(e){

            //Find the key pressed
            var keyListener = e.keyCode;
                var useMode = $.grep(items.modes, function(e){
                    return e.hotkey == keyListener;
                });

                console.log(useMode[0]);

                if(useMode[0]){

                    e.preventDefault();

                    submitSearch(useMode[0].title);

            }

        });

    });

};