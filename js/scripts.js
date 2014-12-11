$(document).ready(function() {
    var loadLinks = function(set, scope){
        i = 0;
        linksArray = config.links[set];
        output = '';
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
        $(scope).append(output);
    };

    var loadLinkContainers = function(){
        i = 0;
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
    }

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
                console.log(output);
            }
            $('#search-modes').append(output);
        }
    }

    var setLinks = function(){
        b = 0
        for (var link in config.links){
            if (link != 'titles'){
                b++
                loadLinks(link, '#linkset-' + b);
            }
        }
    }

    loadSearchModes();
    loadLinkContainers();
    setLinks();

    $('input').on('focus', function(){

        $(this).attr('placeholder', '');

    });

    $('input').on('blur', function(){

        var placeholder = $(this).attr('data-placeholder')
        $(this).attr('placeholder', placeholder);

    });

});