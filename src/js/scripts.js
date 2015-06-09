$(document).ready(function() {

    "use strict";

    //Load the search modes and place them on the page
    
    //Insert the calendar to its container
    insertCalendar('#calendar ul');

    //Run a search mode when the corresponding button is clicked
    searchViaButtons('#search-modes');

    //Run a search mode when the hotkey is pressed
    searchViaKey('#search-input');

    //Handle the TODO functionality
    handleTodo();

    loadCSS();

    loadBackground();

    //Placeholder removal on focus
    $('input').on('focus', function(){

        $(this).attr('placeholder', '');

    });

    //Placeholder insertion on focus
    $('input').on('blur', function(){

        var placeholder = $(this).attr('data-placeholder')
        $(this).attr('placeholder', placeholder);

    });

});