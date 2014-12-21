var submitSearch = function(mode){

    var searchquery = $('#search-input').val();

    if (!searchquery){return  false;};

    var useMode = config.searchModes[mode];

    var location = useMode.query[0] + encodeURIComponent(searchquery) + useMode.query[1];

    var win = window.open(location);

}

var searchViaKey = function(input){

    $(input).on('keydown', function(e){

        //Find the key pressed
        var keyListener = e.keyCode;

        for (var mode in config.searchModes){

            var useMode = config.searchModes[mode];

            if(keyListener == useMode.hotkey){

                e.preventDefault();

                submitSearch(mode);

            }
            
        }

    });

}

var searchViaButtons = function(buttonWrappers){

    $(buttonWrappers).on('click', 'li', function(){

        var mode = $(this).attr('id');

        submitSearch(mode);

    });

}