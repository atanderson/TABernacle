var React = require('react');

var Calendar = React.createClass({
    getInitialState: function(){
        return {
            data: {'items': []}
        };
    },
    componentDidMount: function(){
        var self = this,
        date = new Date();
        chrome.storage.sync.get({
            googleCalendarID: '',
            googleCalendarKey: ''
        }, function(items){
            var calID = items.googleCalendarID,
            key = items.googleCalendarKey;
            //If the calendarID or Key is not defined, get out
            if (!calID || !key) { 
                console.log('missing google calendar ID or api key');
                return false;
            }
            //Build JSON request url with above variables
            var url =  'https://www.googleapis.com/calendar/v3/calendars/' + calID + '/events?singleEvents=true&orderBy=startTime&maxResults=5&timeMin=' + date.toISOString() + '&key=' + key;
            $.getJSON(url, function(data) {
                self.setState({data: data});
            });
        });
    },
    render: function() {
        var events = this.state.data.items.map(function(CalendarItem, i){
            
            var date = new Date(),
            today = moment(date).format('MMM Do'),
            startDay = moment(CalendarItem.start.dateTime).format('MMM Do'),
            startTime = moment(CalendarItem.start.dateTime).format('h:mm'),
            endTime = moment(CalendarItem.end.dateTime).format('h:mm');

            return <Event link={CalendarItem.htmlLink} summary={CalendarItem.summary} today={today} startDay={startDay} startTime={startTime} endTime={endTime} key={i} />
        });
        return (
            <div className="module small">
                <h4>
                    <span>Coming Up</span>
                </h4>
                <div id="calendar" className="calendar">
                    <ul>
                        {events}
                    </ul>
                </div>
            </div>
        )
    }
});

var Event = React.createClass({
    render: function() {
        var liClass;
        if (this.props.today == this.props.startDay){
            liClass = "event today"
        } else {
            liClass = "event"
        }

        return (
            <li className={liClass}>
                <a href={this.props.link}>
                    <span className="startDate">{this.props.startDay}</span>
                    <span className="startTime">{this.props.startTime} - {this.props.endTime}</span>
                    <span className="title">{this.props.summary}</span>
                </a>
            </li>
        )
    }
});

module.exports = Calendar;