/** @jsx React.DOM */

$(document).ready(function() {
  chrome.storage.sync.get({
    googleCalendarID: '',
    googleCalendarKey: '',
    //numberOfLinkAreas: '',
    //titles: [],
    //linksNumbers: [],
    linkData: '',
    //numberOfModesAreas: '',
    modes: [],
    customCSS: '',
    bgImage: ''
    }, function(items) {
      console.log("calID", items.googleCalendarID);
      console.log("calKey", items.googleCalendarKey);
      console.log("linkData", items.linkData);
      console.log("modes", items.modes);
      console.log("customCSS", items.customCss);
      console.log("bgImage", items.bgImage);
    });
});

var React = require('react');

var Options = React.createClass({
    render: function() {
        return (
            <div className="container">
                <h1>TABernacle Settings</h1>
                <CalendarSettings />
                <LinkSettings />
                <ModeSettings />
                <CssSettings />
                <BgSettings />
                <SaveSettings />
            </div>
        )
    }
});

var CalendarSettings = React.createClass({
    handleChange: function(name, event) {
        console.log(name);
        console.log(event);
        var state = {};
        var stateName;
        if (name == 'googleCalendarKey') {
            stateName = "calKey";
        } else if (name == 'googleCalendarID') {
            stateName = 'calID';
        }
        state[stateName] = event.target.value;
        this.setState(state);

        console.log('setting...');

        var setting = {};
        setting[name] = event.target.value;
        chrome.storage.sync.set(setting);
    },
    componentDidMount: function () {
        var self = this;
        chrome.storage.sync.get({
            googleCalendarKey: '',
            googleCalendarID: ''
        }, function(items){
            self.setState({
                calKey: items.googleCalendarKey,
                calID: items.googleCalendarID
            })
        });
    },
    getInitialState: function() {
        return {
            calKey: '',
            calID: ''
        }
    },
    render: function() {
        return (
            <form id="calendar-settings" className="col-md-4">
                <h2>Calendar Settings</h2>
                <div className="form-group">
                    <label htmlFor="calID">Calendar ID</label>
                    <input id="calID" className="form-control" type="text" onChange={this.handleChange.bind(this, 'googleCalendarID')} value={this.state.calID} />
                </div>

                <div className="form-group">
                    <label htmlFor="cakKey">Calendar API Key</label>
                    <input id="calKey" className="form-control" type="text" onChange={this.handleChange.bind(this, 'googleCalendarKey')} value={this.state.calKey} />
                </div>
            </form>
        )
    }
});

var LinkSettings = React.createClass({
    componentDidMount: function () {
        var self = this;
        chrome.storage.sync.get({
            linkData: ''
        }, function(items){
            self.setState({
                data: items.linkData
            })
        });
    },
    getInitialState: function() {
        return {
            data: []
        }
    },
    render: function() {
        var modules = [];
        for (module in this.state.data) {
            modules.push(<LinkWrapper title={module} data={this.state.data[module]} />);
        }
        return (
            <div className="col-md-4">
                <h2>Link Settings</h2>
                <form id="link-settings">{modules}</form>
            </div>
        )
    }
});

var LinkWrapper = React.createClass({
    render: function() {
            var links = this.props.data.map(function(link, i) {
                return <LinkForm data={link} key={i} />
            });
        return (
            <div>
                <label htmlFor="title">Link Area Title</label>
                <input id="title" type="text" className="form-control" data-prop="title" value={this.props.title}></input>
                {links}
                <hr />
            </div>
        )
    }
});

var LinkForm = React.createClass({
    render: function() {
        return (
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" className="form-control" data-prop="title" value={this.props.data.title}></input>
                
                <label htmlFor="icon">Icon</label>
                <input id="icon" type="text" className="form-control" data-prop="icon" value={this.props.data.icon}></input>
                
                <label htmlFor="queryAfter">Text</label>
                <input id="text" type="text" className="form-control" data-prop="text" value={this.props.data.text}></input>
                
                <label htmlFor="hotkey">Value</label>
                <input id="value" type="text" className="form-control" data-prop="value" value={this.props.data.value}></input>
            </div>
        )
    }
})

var ModeSettings = React.createClass({
    componentDidMount: function() {
        var self = this;
        chrome.storage.sync.get({
            modes: ''
        }, function(items){
            self.setState({
                data: items.modes
            })
        });
    },
    getInitialState: function() {
        return {
            data: []
        }
    },
    render: function() {
        var modes = this.state.data.map(function(mode, i){
            return <ModeForm data={mode} key={i} />
        });
        return (
            <form id="link-settings" className="col-md-4">
            <h2>Search Modes</h2>
            {modes}
            </form>
        )
    }
});

var ModeForm = React.createClass({
    render: function() {
        return (
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" className="form-control" data-prop="title" value={this.props.data.title}></input>
                
                <label htmlFor="queryBefore">Before Search Query</label>
                <input id="queryBefore" type="text" className="form-control" data-prop="queryBefore" value={this.props.data.queryBefore}></input>
                
                <label htmlFor="queryAfter">After Search Query</label>
                <input id="queryAfter" type="text" className="form-control" data-prop="queryAfter" value={this.props.data.queryafter}></input>
                
                <label htmlFor="hotkey">Hotkey</label>
                <input id="hotkey" type="text" className="form-control" data-prop="hotkey" value={this.props.data.hotkey}></input>
                
                <label htmlFor="indicator">Indicator</label>
                <input id="indicator" type="text" className="form-control" data-prop="indicator" value={this.props.data.indicator}></input>
                
                <label htmlFor="show">Show</label>
                <input id="show" type="text" className="form-control" data-prop="show" value={this.props.data.show}></input>
                <hr />
            </div>
        )
    }
});

var CssSettings = React.createClass({
    render: function() {
        return (
            <form id="css-settings" className="col-md-4">
                <label htmlFor="custom-css">Custom CSS</label>
                <textarea id="custom-css" className="form-control"></textarea>
            </form>
        )
    }
});

var BgSettings = React.createClass({
    render: function() {
        return (
            <form id="bg-settings" className="col-md-4">
                <label htmlFor="custom-css">Backgound Image</label>
                <input id="background-image" className="form-control" type="text"></input>
            </form>
        )
    }
});

var SaveSettings = React.createClass({
    render: function() {
        return (
            <div id="save-settings" className="col-md-4">
                <h2 id="status"></h2>
                <button id="save" className="btn btn-success">Save</button>
            </div>
        )
    }
});

React.render(
    <Options />,
    document.getElementById('options')
)