//Load the search modes and append them to the page
var loadSearchModes = function(){

    chrome.storage.sync.get({

        modes: ''

    }, function(items) {

        var i = 0;

        for (var mode in items.modes ){

            var modeArray = items.modes[mode];

            var output = '';

            var button = modeArray[5];

            if (button){

                output += '<li id="' + modeArray[0] + '" class="float mode">';

                output += '<a class="icon search-mode" href="javascript:void(0)">';

                output += modeArray[0];

                output += '</a>';

                if (modeArray[4] != ''){

                    output += '<span class="fa-stack fa-lg indicator"><i class="fa fa-circle fa-stack-1x"></i>';

                    output += '<i class="fa fa-inverse fa-stack-1x">' + modeArray[4] + '</i>';

                    output += '<span>'

                }

                output += '</li>'

            }

            $('#search-modes').append(output);

        }

    });

};

var loadCSS = function(){

    chrome.storage.sync.get({

        customCSS: ''

    }, function(items) {

        $('head').append('<style>' + items.customCSS + '</style>')

    });

}

var loadBackground = function(){

    chrome.storage.sync.get({

        bgImage: ''

    }, function(items) {

        $('body').css({

            "background-size": "cover",
            "background-image" : "url('" + items.bgImage + "')"

        })

    });

}