//Load the links defined in the config
var loadLinks = function(set, scope){

    chrome.storage.sync.get({

        links: ''

    }, function(items) {

        //Get the array of links
        for (linkArray in items.links){

            linksArray = items.links[linkArray];


            //Define the inital output to concatinate to
            output = '';

            output += '<li class="float">';

            output += '<a href="' + linksArray[4] + '" title="' + linksArray[1] + '">';

            output += '<span class="fa-stack fa-lg">';   

            output += '<i class="fa fa-stop fa-stack-2x"></i>';    

            output += '<i class="fa fa-inverse ' + linksArray[3] + ' fa-stack-1x">' + linksArray[2] + '</i>';   

            output += '<span>';

            output += '</a>';  

            output += '</li>';

            var index = (Number(linksArray[0]) + 1)

            //Append all the links to the scope
            $('#linkset-' + index).append(output);

        }

    });

};

//Load the link containers defined in the config and append them to the page
var loadLinkContainers = function(){

    chrome.storage.sync.get({

        titles: ''

    }, function(items) {

        var i = 0;

        linkTitles = items.titles;

        output = '';

        for (i; i < linkTitles.length; i += 1 ){

            output += '<div class="module small clearfix links">';

            output += '<h4>' + linkTitles[i] + '</h4>';

            output += '<ul id="linkset-' + (i + 1) + '" class="un-list">'

            output += '</ul>'

            output += '</div>'

        }

        $('#link-module-wrapper').append(output);

    });

};

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

//Load links and then append them to the link containers they are scoped to
var setLinks = function(){

    loadLinks();

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