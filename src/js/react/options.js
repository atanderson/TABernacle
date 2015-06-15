/** @jsx React.DOM */

$(document).ready(function() {
    var linkDefault = {
        'Link Area': [{
            'title': '',
            'icon': '',
            'text': '',
            'value': ''
        }]
    };
    var modeDefault = [{
            'hotkey': '',
            'indicator': '',
            'queryBefore': '',
            'queryafter': '',
            'show': '',
            'title': ''
        }];
  chrome.storage.sync.get({
    googleCalendarID: '',
    googleCalendarKey: '',
    linkData: linkDefault,
    modes: modeDefault,
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
            </div>
        )
    }
});

var CalendarSettings = React.createClass({
    handleChange: function(name, event) {

        //TODO: rename the keys to be the same between chrome storage and state

        var state = {};
        var stateName;
        if (name == 'googleCalendarKey') {
            stateName = "calKey";
        } else if (name == 'googleCalendarID') {
            stateName = 'calID';
        }

        console.log('calChange', event.target.value)
        state[stateName] = event.target.value;
        this.setState(state);

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
    addArea: function (){
        console.log('add area');
        var self = this;
        var state = self.state;
        state.data['New Area'] = [];
        stateData = state.data;
        self.setState(stateData);
        var chromeData = {};
        chromeData.linkData = state.data;
        chrome.storage.sync.set(chromeData);
    },
    removeArea: function(area){
        console.log('area name', area);
        console.log('remove area');
        var self = this;
        var state = self.state;
        delete state.data[area];
        stateData = state.data;
        self.setState(stateData);
        var chromeData = {};
        chromeData.linkData = state.data;
        chrome.storage.sync.set(chromeData);
    },
    addLink: function(area){
        console.log('add link');
        console.log(area);
        var self = this;
        var state = self.state;
        state.data[area].push({
            'title' : '',
            'icon': '',
            'text': '',
            'value': ''
        })
        stateData = state.data;
        self.setState(stateData);
        var chromeData = {};
        chromeData.linkData = state.data;
        chrome.storage.sync.set(chromeData);
    },
    removeLink: function(link){
        console.log('index', link.index);
        console.log('area', link.linkArea);
        console.log('remove link');
        var self = this;
        var state = self.state;
        state.data[link.linkArea].splice(link.index, 1);
        stateData = state.data;
        self.setState(stateData);
        var chromeData = {};
        chromeData.linkData = state.data;
        chrome.storage.sync.set(chromeData);
    },
    handleChange: function(name, event) {
        var self = this;
        var linkArea = name.linkArea;
        var index = name.index;
        var value = name.value;
        var state = self.state;
        state.data[linkArea][index][value] = event.target.value;
        var stateData = state.data
        self.setState({
            stateData
        });
        var chromeData = {};
        chromeData.linkData = state.data;
        chrome.storage.sync.set(chromeData);
    },
    componentDidMount: function () {
        var self = this;
        var linkDefault = {
            'Link Area': [{
                'title': '',
                'icon': '',
                'text': '',
                'value': ''
            }]
        };
        chrome.storage.sync.get({
            linkData: linkDefault
        }, function(items){
            self.setState({
                data: items.linkData
            })
        });
    },
    getInitialState: function() {
        var linkDefault = {
            'Link Area': [{
                'title': '',
                'icon': '',
                'text': '',
                'value': ''
            }]
        };
        return {
            data: linkDefault
        }
    },
    render: function() {
        var modules = [];
        var i = 0;
        for (module in this.state.data) {
            modules.push(<LinkWrapper removeArea={this.removeArea} addLink={this.addLink} removeLink={this.removeLink} title={module} key={i} onChange={this.handleChange} data={this.state.data[module]} />);
            i++;
        }
        return (
            <div className="col-md-4">
                <a className="btn btn-success" onClick={this.addArea}>add link area</a>
                <h2>Link Settings</h2>
                <form id="link-settings">{modules}</form>
            </div>
        )
    }
});

var LinkWrapper = React.createClass({
    render: function() {
        var self = this;
        var links = this.props.data.map(function(link, i) {
            return <LinkForm data={link} key={i} index={i} removeLink={self.props.removeLink} onChange={self.props.onChange} title={self.props.title} />
        });
        return (
            <div>
                <a className="btn btn-danger" onClick={this.props.removeArea.bind(null, this.props.title)}>remove link area</a>
                <label htmlFor="title">Link Area Title</label>
                <input id="title" type="text" title={this.props.title} onChange={this.props.onChange.bind(null, this.props.data )} className="form-control" data-prop="title" value={this.props.title}></input>
                {links}
                <a className="btn btn-success" onClick={this.props.addLink.bind(null, this.props.title)}>add link</a>
                <hr />
            </div>
        )
    }
});

var LinkForm = React.createClass({
    render: function() {
        return (
            <div className="form-group">
                <a className="btn btn-danger" onClick={this.props.removeLink.bind(null, { 'index' : this.props.index, 'linkArea' : this.props.title })}>remove link </a>
                <label htmlFor="title">Title</label>
                <input id="title" onChange={this.props.onChange.bind(null, {'linkArea': this.props.title, 'value': 'title', 'index': this.props.index})} type="text" className="form-control" data-prop="title" value={this.props.data.title}></input>
                
                <label htmlFor="icon">Icon</label>
                <input id="icon" onChange={this.props.onChange.bind(null, {'linkArea': this.props.title, 'value': 'icon', 'index': this.props.index})} type="text" className="form-control" data-prop="icon" value={this.props.data.icon}></input>
                
                <label htmlFor="text">Text</label>
                <input id="text" onChange={this.props.onChange.bind(null, {'linkArea': this.props.title, 'value': 'text', 'index': this.props.index})} type="text" className="form-control" data-prop="text" value={this.props.data.text}></input>
                
                <label htmlFor="value">Value</label>
                <input id="value" onChange={this.props.onChange.bind(null, {'linkArea': this.props.title, 'value': 'value', 'index': this.props.index})} type="text" className="form-control" data-prop="value" value={this.props.data.value}></input>
            </div>
        )
    }
})

var ModeSettings = React.createClass({
    addMode: function() {
        var self = this;
        var state = self.state;

        state.data.push({
            'hotkey': '',
            'indicator': '',
            'queryBefore': '',
            'queryafter': '',
            'show': '',
            'title': ''
        });

        stateData = state.data;
        self.setState(stateData);
        var chromeData = {};
        chromeData.modes = state.data;
        chrome.storage.sync.set(chromeData);
    },
    removeMode: function(index) {
        var self = this;
        var state = self.state;

        state.data.splice(index, 1);

        stateData = state.data;
        self.setState(stateData);
        var chromeData = {};
        chromeData.modes = state.data;
        chrome.storage.sync.set(chromeData);
    },
    handleChange: function(name, event) {
        var self = this;
        var index = name.index;
        var value = name.value;
        var state = self.state;
        state.data[index][value] = event.target.value;
        var stateData = state.data
        self.setState({
            stateData
        });
        var chromeData = {};
        chromeData.modes = state.data;
        chrome.storage.sync.set(chromeData);
    },
    componentDidMount: function() {
        var self = this;
        var modeDefault = [{
                'hotkey': '',
                'indicator': '',
                'queryBefore': '',
                'queryafter': '',
                'show': '',
                'title': ''
            }];
        chrome.storage.sync.get({
            modes: modeDefault
        }, function(items){
            self.setState({
                data: items.modes
            })
        });
    },
    getInitialState: function() {
        var modeDefault = [{
                'hotkey': '',
                'indicator': '',
                'queryBefore': '',
                'queryafter': '',
                'show': '',
                'title': ''
            }];
        return {
            data: [1,2]
        }
    },
    render: function() {
        var self = this;
        console.log('data', this.state);
        var modes = this.state.data.map(function(mode, i){
            return <ModeForm data={mode} removeMode={self.removeMode} onChange={self.handleChange} index={i} key={i} />
        });
        return (
            <form id="link-settings" className="col-md-4">
            <h2>Search Modes</h2>
            <a onClick={this.addMode} className='btn btn-success'>add mode<i className='fa fa-plus'></i></a>
            {modes}
            </form>
        )
    }
});

var ModeForm = React.createClass({
    render: function() {
        return (
            <div className="form-group">
                <a onClick={this.props.removeMode.bind(null, this.props.index)} className="btn btn-danger">remove mode</a><br />

                <label htmlFor="title">Title</label>
                <input id="title" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'title'})} className="form-control" data-prop="title" value={this.props.data.title}></input>
                
                <label htmlFor="queryBefore">Before Search Query</label>
                <input id="queryBefore" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'queryBefore'})} className="form-control" data-prop="queryBefore" value={this.props.data.queryBefore}></input>
                
                <label htmlFor="queryAfter">After Search Query</label>
                <input id="queryAfter" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'queryafter'})} className="form-control" data-prop="queryAfter" value={this.props.data.queryafter}></input>
                
                <label htmlFor="hotkey">Hotkey</label>
                <input id="hotkey" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'hotkey'})} className="form-control" data-prop="hotkey" value={this.props.data.hotkey}></input>
                
                <label htmlFor="indicator">Indicator</label>
                <input id="indicator" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'indicator'})} className="form-control" data-prop="indicator" value={this.props.data.indicator}></input>
                
                <label htmlFor="show">Show</label>
                <input id="show" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'show'})} className="form-control" data-prop="show" value={this.props.data.show}></input>
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

React.render(
    <Options />,
    document.getElementById('options')
)