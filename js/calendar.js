var calID = config.calendar.id;

//Api key of the client captured from the calendar settings element
var key = config.calendar.apikey;

//Define where you want to append the calendar
var target = '#calendar';

//Define today's date for event truncation
var date = new Date();

//Build the url for the json request
var url =  'https://www.googleapis.com/calendar/v3/calendars/'
            + calID 
            + '/events?singleEvents=true&orderBy=startTime&maxResults=5&timeMin=' 
            // todays date turned into an ISO string for the parameter
            + date.toISOString() 
            + '&key=' + key;

//Append a ul to the target to hold all of our list items
$(target).append('<ul></ul>');

    //Get the json object from the request url we just built
    $.getJSON(url, function(data) {

    //Loop through top level items (aka events)
    for(i in data['items']) {

        //Define a single item
        item = data['items'][i];

        //Format the start and end date from ISO so that it is readable by humans
        formattedToday = moment(date).format('MMM Do');
        formattedStartDate = moment(item.start.dateTime).format('MMM Do');
        formattedStart = moment(item.start.dateTime).format('h:mm');
        formattedEnd = moment(item.end.dateTime).format('h:mm');
        //Build the output for the individual event
        var output = '';

        if (formattedToday == formattedStartDate){
            todayClass = ' today';
        } else {
            todayClass = '';
        }

        output += '<span class="startDate">'
        output += formattedStartDate;
        output += '</span>'
        output += '<span class="startTime">';
        output += formattedStart;
        output += '-';
        output += formattedEnd;
        output += '</span>'
        output += '<span class="title">';
        output += item.summary;
        output += '</span>';
        
        //Append the output in a li in our new ul
        $(target + ' ul').append('<li class="event' + todayClass + '">' + '<a href="' + item.htmlLink + '">' + output + '</a></li>');

    }

});
