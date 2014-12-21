//Load the links defined in the config
var loadLinks = function(set, scope){

    //Get the array of links
    linksArray = config.links[set];

    //Define the inital output to concatinate to
    output = '';

    //Set a variable to interate over
    var i = 0;

    //Build a link
    for (i; i < linksArray.length; i += 1 ){

        output += '<li class="float">';

        output += '<a href="' + linksArray[i].value + '" title="' + linksArray[i].title + '">';

        output += '<span class="fa-stack fa-lg">';   

        output += '<i class="fa fa-stop fa-stack-2x"></i>';    

        output += '<i class="fa fa-inverse ' + linksArray[i].icon + ' fa-stack-1x">' + linksArray[i].text + '</i>';   

        output += '<span>';

        output += '</a>';  

        output += '</li>';

    }

    //Append all the links to the scope
    $(scope).append(output);

};

//Load the link containers defined in the config and append them to the page
var loadLinkContainers = function(){

    var i = 0;

    linkTitles = config.links.titles;

    output = '';

    for (i; i < linkTitles.length; i += 1 ){

        output += '<div class="module small clearfix links">';

        output += '<h4>' + linkTitles[i] + '</h4>';

        output += '<ul id="linkset-' + (i + 1) + '" class="un-list">'

        output += '</ul>'

        output += '</div>'

    }

    $('#link-module-wrapper').append(output);

};

//Load the search modes and append them to the page
var loadSearchModes = function(){

    var i = 0;

    for ( var mode in config.searchModes ){

        var output = '';

        modeIcon = config.searchModes[mode];

        if (modeIcon.button){

            output += '<li id="' + mode + '" class="float mode">';

            output += '<a class="icon search-mode" href="javascript:void(0)">';

            output += modeIcon.label;

            output += '</a>';

            if (modeIcon.indicator){

                output += '<span class="fa-stack fa-lg indicator"><i class="fa fa-circle fa-stack-1x"></i>';

                output += '<i class="fa fa-inverse fa-stack-1x">' + modeIcon.indicator; + '</i>';

                output += '<span>'

            }

            output += '</li>'

        }

        $('#search-modes').append(output);

    }

};

//Load links and then append them to the link containers they are scoped to
var setLinks = function(){

    i = 0

    for (var link in config.links){

        if (link != 'titles'){

            i++

            loadLinks(link, '#linkset-' + i);

        }

    }

};