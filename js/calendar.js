var insertCalendar = function(target) {

    //Get Calendar ID from config object
    var calID = config.calendar.id;

    //Get Api key from config object
    var key = config.calendar.apikey;

    //If the calendarID or Key is not defined, get out
    if(!calID || !key){ return false; }

    //Define today's date
    var date = new Date();

    //Build JSON request url with above variables
    var url =  'https://www.googleapis.com/calendar/v3/calendars/'
                + calID 
                + '/events?singleEvents=true&orderBy=startTime&maxResults=5&timeMin=' 
                + date.toISOString() 
                + '&key=' + key;

    //JSON request using the built url
    $.getJSON(url, function(data) {

        //Define the calendar as an empty array of events
        var calendar = [];

        //For each event in the returned json data
        for(var i in data.items) {

            //Define a single event
            item = data.items[i];

            console.log(item);
            console.log(i);

            //Take today's date and format it with moment.js
            todayMonthDay = moment(date).format('MMM Do');

            //Take the event's start date and format it with moment.js
            startMonthDay = moment(item.start.dateTime).format('MMM Do');

            //Take the event's start time and format it with moment.js
            startTime = moment(item.start.dateTime).format('h:mm');

            //Take the event's end time and format it with moment.js
            endTime = moment(item.end.dateTime).format('h:mm');

            //Define the output of an event
            var output = '';
            output += '<span class="startDate">' + startMonthDay + '</span>';
            output += '<span class="startTime">' + startTime + '-' + endTime + '</span>';
            output += '<span class="title">' + item.summary + '</span>';

            //If today is the same day as an outputted event
            if (startMonthDay == todayMonthDay){
                //Define todayClass as today
                todayClass = ' today';
            } else {
                todayClass = '';
            }

            //Build the li containing the event data push it to our calendar array
            calendar.push('<li class="event' + todayClass + '">' + '<a href="' + item.htmlLink + '">' + output + '</a></li>');

        }

        //Append the calendar array into the target
        $(target).append(calendar);

    });

};