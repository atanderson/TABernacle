var React = require('react');

//All of the settings/inputs for the Google Calendar
var CalendarSettings = React.createClass({
    //Whenever input value changes, alter state and save value to storage
    handleChange: function(name, event) {
        //Create empty object to store state info to avoid object syntax issues
        var state = {};
        state[name] = event.target.value;
        this.setState(state);
        chrome.storage.sync.set(state);
    },
    //On mount, load chrome storage and set state to stored data
    componentDidMount: function () {
        //Make sure we are binding to the correct element
        var self = this;
        chrome.storage.sync.get({
            googleCalendarKey: '',
            googleCalendarID: '',
            calendarEnabled: 'enabled'
        }, function(items){
            self.setState({
                googleCalendarKey: items.googleCalendarKey,
                googleCalendarID: items.googleCalendarID,
                enabled: items.calendarEnabled
            });
        });
    },
    //Load blank component initially, needed because google storage retreval is async
    getInitialState: function() {
        return {
            googleCalendarKey: '',
            googleCalendarID: '',
            enabled: 'enabled'
        }
    },
    disableToggle: function() {
        var self = this,
        chromeData = {};
        if(self.state.enabled == 'enabled') {
            self.setState({enabled: 'disabled'});
            chromeData.calendarEnabled = 'disabled';
        } else if (self.state.enabled == 'disabled') {
            self.setState({ enabled: 'enabled' });
            chromeData.calendarEnabled = 'enabled';
        }
        chrome.storage.sync.set(chromeData);
    },
    render: function() {
        var buttonClass;
        if (this.state.enabled == 'enabled') {
            buttonClass = 'btn btn-primary';
        } else if (this.state.enabled == 'disabled') {
            buttonClass = 'btn btn-default';
        }
        return (
            <form id="calendar-settings" className="col-md-4">
                <a className={buttonClass} onClick={this.disableToggle}>{this.state.enabled}</a>
                <hr />
                <div className="form-group">
                    <label htmlFor="calID">Calendar ID</label>
                    <input id="calID" className="form-control" type="text" onChange={this.handleChange.bind(this, 'googleCalendarID')} value={this.state.googleCalendarID} />
                </div>

                <div className="form-group">
                    <label htmlFor="calKey">Calendar API Key</label>
                    <input id="calKey" className="form-control" type="text" onChange={this.handleChange.bind(this, 'googleCalendarKey')} value={this.state.googleCalendarKey} />
                </div>
            </form>
        );
    }
});

module.exports = CalendarSettings;