var submitSearch = function(mode){

    chrome.storage.sync.get({

        modes: ''

    }, function(items) {

        console.log(items.modes);

        var searchquery = $('#search-input').val();

        if (!searchquery){return  false;};

        var useMode = items.modes[mode];

        console.log('usemode', useMode);
        
        var location = useMode[1] + encodeURIComponent(searchquery) + useMode[2];

        var win = window.open(location);

    });

}

var searchViaKey = function(input){

        chrome.storage.sync.get({

            modes: ''

        }, function(items) {

            $(input).on('keydown', function(e){

            //Find the key pressed
            var keyListener = e.keyCode;

            for (var mode in items.modes){

                var useMode = items.modes[mode];

                if(keyListener == useMode[3]){

                    e.preventDefault();

                    submitSearch(mode);

                }
                
            }

        });

    });

}

var searchViaButtons = function(buttonWrappers){

    $(buttonWrappers).on('click', 'li', function(){

        var mode = $(this).attr('id');

        submitSearch(mode);

    });

}