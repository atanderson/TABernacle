/** @jsx React.DOM */

var Debug = require('../components/debug');
var React = require('react');

//Main container for the options page
var Options = React.createClass({
    getInitialState: function(){
        //This sets the first "active" tab
        return { settingEditable: 'LinkSettings'};
    },
    swapModule: function(name, event){
        this.setState( {settingEditable: name} );
    },
    render: function() {
        var settingArea;
        //TODO there has to be a cleaner/more concise way of doing this
        if (this.state.settingEditable == 'CalendarSettings') {
            settingArea = <CalendarSettings />;
        } else if (this.state.settingEditable == 'LinkSettings') {
            settingArea = <LinkSettings />;
        } else if (this.state.settingEditable == 'ModeSettings') {
            settingArea = <ModeSettings />;
        } else if (this.state.settingEditable == 'CssSettings') {
            settingArea = <CssSettings />;
        } else if (this.state.settingEditable == 'BgSettings') {
            settingArea = <BgSettings />;
        } else if (this.state.settingEditable == 'TodoSettings') {
            settingArea = <TodoSettings />;
        }

        return (
            <div className="container">
                <nav className="navbar navbar-default">
                    <div className="navbar-header"><span className="navbar-brand">TABernacle Settings</span></div>
                    <SettingsToggles onClick={this.swapModule} />
                </nav>
                <div id='setting-wrapper'>
                    {settingArea}
                </div>
            </div>
        );
    }
});

//Navbar that activates the various options panels via state change
var SettingsToggles = React.createClass({
    render: function() {
        return(
            <ul className="nav navbar-nav">
                <li className="active"><a href="#" onClick={this.props.onClick.bind(null, 'LinkSettings')} >Links</a></li>
                <li><a href="#" onClick={this.props.onClick.bind(null, 'ModeSettings')} >Search Modes</a></li>
                <li><a href="#" onClick={this.props.onClick.bind(null, 'CalendarSettings')} >Calendar</a></li>
                <li><a href="#" onClick={this.props.onClick.bind(null, 'TodoSettings')} >To-Do list</a></li>
                <li><a href="#" onClick={this.props.onClick.bind(null, 'CssSettings')} >Custom CSS</a></li>
                <li><a href="#" onClick={this.props.onClick.bind(null, 'BgSettings')} >Background Image</a></li>
            </ul>
        )
    }
});

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

//All of the settings/values for link containers and their associated links
var LinkSettings = React.createClass({
    addArea: function (){
        //Make sure we are binding to the correct element
        var self = this,

        //Store the state (which should be immutable) as a new variable
        state = self.state.data,
        //Empty object for chrome storage to prevent syntax issues
        chromeData = {};

        var newArea = {   
            'title': 'New Area',
            'links': []
        };

        //Create an empty array for the new area
        state.push(newArea);

        self.setState(state);
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    removeArea: function(index){
        var self = this,
        state = self.state.data,
        chromeData = {};

        //Remove the link area object and it's associated array
        state.splice(index , 1);

        self.setState(state);
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    addLink: function(index){
        var self = this,
        state = self.state.data,
        chromeData = {};

        //Add a blank link object to the link area array
        state[index].links.push({
            'title' : '',
            'icon': '',
            'text': '',
            'value': ''
        });

        self.setState(state);
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    removeLink: function(link){
        var self = this,
        state = self.state.data,
        chromeData = {};

        //Remove the link of the specified index from the specified linkarea
        state[link.linkArea].links.splice(link.index, 1);

        self.setState(state);
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    handleChange: function(name, event) {
        var self = this,
        linkArea = name.linkArea,
        index = name.index,
        value = name.value,
        state = self.state.data,
        chromeData = {};

        state[linkArea].links[index][value] = event.target.value;
        
        self.setState({state});
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    handleTitle: function(index, event){
        var self = this,
        val = event.target.value,
        state = self.state.data,
        chromeData = {};
        
        state[index].title = val;
        
        self.setState({state});
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    componentDidMount: function () {
        var self = this,
        linkDefault = [
            {   
                'title': '',
                'links': []
            }
        ];

        chrome.storage.sync.get({
            linkData: linkDefault,
            linksEnabled: 'enabled'
        }, function(items){
            self.setState({
                data: items.linkData,
                enabled: items.linksEnabled
            })
        });
    },
    getInitialState: function() {
        var linkDefault = [
            {   
                'title': '',
                'links': []
            }
        ];

        return {
            data: linkDefault,
            enabled: 'enabled'
        }
    },
    disableToggle: function() {
        var self = this,
        chromeData = {};

        if(self.state.enabled == 'enabled') {
            self.setState({enabled: 'disabled'});
            chromeData.linksEnabled = 'disabled';
        } else if (self.state.enabled == 'disabled') {
            self.setState({ enabled: 'enabled' });
            chromeData.linksEnabled = 'enabled';
        }

        chrome.storage.sync.set(chromeData);
    },
    render: function() {
        var self = this,
        modules = this.state.data.map(function(linkModule, i) {
            return <LinkWrapper removeArea={self.removeArea} handleTitle={self.handleTitle} addLink={self.addLink} removeLink={self.removeLink} title={module} key={i} index={i} onChange={self.handleChange} data={linkModule} />
        }),
        buttonClass;

        if (this.state.enabled == 'enabled') {
            buttonClass = 'btn btn-primary';
        } else if (this.state.enabled == 'disabled') {
            buttonClass = 'btn btn-default';
        }

        return (
            <div className="col-sm-12">
                <a className={ buttonClass } onClick={this.disableToggle}>{this.state.enabled}</a>
                <a className="btn btn-success" onClick={this.addArea}>new link area</a>
                <hr />
                <form id="link-settings">{modules}</form>
            </div>
        )
    }
});

var TodoSettings = React.createClass({
    //Whenever input value changes, alter state and save value to storage
    //On mount, load chrome storage and set state to stored data
    componentDidMount: function () {
        //Make sure we are binding to the correct element
        var self = this;

        chrome.storage.sync.get({
            todoEnabled: 'enabled'
        }, function(items){
            self.setState({
                enabled: items.todoEnabled
            });
        });
    },
    //Load blank component initially, needed because google storage retreval is async
    getInitialState: function() {
        return {
            enabled: 'enabled'
        }
    },
    disableToggle: function() {
        var self = this,
        chromeData = {};

        if(self.state.enabled == 'enabled') {
            self.setState({enabled: 'disabled'});
            chromeData.todoEnabled = 'disabled';
        } else if (self.state.enabled == 'disabled') {
            self.setState({ enabled: 'enabled' });
            chromeData.todoEnabled = 'enabled';
        }

        chrome.storage.sync.set(chromeData);
    },
    //Render two inputs with labels
    render: function() {
        var buttonClass;

        if (this.state.enabled == 'enabled') {
            buttonClass = 'btn btn-primary';
        } else if (this.state.enabled == 'disabled') {
            buttonClass = 'btn btn-default';
        }

        return (
            <form id="todo-settings" className="col-md-4">
                <a className={ buttonClass } onClick={this.disableToggle}>{this.state.enabled}</a>
            </form>
        );
    }
});

var LinkWrapper = React.createClass({
    render: function() {
        var self = this,
        links = this.props.data.links.map(function(link, i) {
            return <LinkForm data={link} key={i} index={i} removeLink={self.props.removeLink} onChange={self.props.onChange} parentIndex={self.props.index} />
        });

        return (
            <div className="row">
                <div className="col-sm-12 title-bar">
                    <div className="btn-group pull-right" role="group">
                        <a className="btn btn-success" onClick={this.props.addLink.bind(null, this.props.index)}>add link</a>
                        <a className="btn btn-danger" onClick={this.props.removeArea.bind(null, this.props.index)}>remove area</a>
                    </div>
                    <div className="input-group">
                        <input id="title" type="text" title={this.props.data.title} onChange={this.props.handleTitle.bind(null, this.props.index )} className="form-control" data-prop="title" value={this.props.data.title}></input>
                        <span className="input-group-btn">
                           <button className="btn btn-default" type="button"><i className="fa fa-info-circle"></i></button>
                        </span>
                    </div>
                </div>
                {links}
                <div className="col-sm-12">
                    <hr />
                </div>   
            </div>
        )
    }
});

var LinkForm = React.createClass({
    render: function() {
        return (
            <div className="form-group col-md-4">
                <div className="inner panel panel-default">
                    <div className="panel-heading col-sm-12">
                        <div className="row">
                            <div className="col-sm-10">
                                <input id="title" placeholder="title" onChange={this.props.onChange.bind(null, {'linkArea': this.props.parentIndex, 'value': 'title', 'index': this.props.index})} type="text" className="form-control" data-prop="title" value={this.props.data.title}></input>
                            </div>
                            <div className="col-sm-2">
                                <a className="btn btn-danger pull-right btn-padded" onClick={this.props.removeLink.bind(null, { 'index' : this.props.index, 'linkArea' : this.props.parentIndex })}>x</a>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <input id="icon" placeholder="icon" onChange={this.props.onChange.bind(null, {'linkArea': this.props.parentIndex, 'value': 'icon', 'index': this.props.index})} type="text" className="form-control" data-prop="icon" value={this.props.data.icon}></input>
                        <input id="text" placeholder="text" onChange={this.props.onChange.bind(null, {'linkArea': this.props.parentIndex, 'value': 'text', 'index': this.props.index})} type="text" className="form-control" data-prop="text" value={this.props.data.text}></input>
                        <input id="value" placeholder="value" onChange={this.props.onChange.bind(null, {'linkArea': this.props.parentIndex, 'value': 'value', 'index': this.props.index})} type="text" className="form-control" data-prop="value" value={this.props.data.value}></input>
                    </div>
                </div>
            </div>
        )
    }
});

//TODO remove extra stateData variable
var ModeSettings = React.createClass({
    addMode: function() {
        var self = this,
        state = self.state;

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
        var self = this,
        index = name.index,
        value = name.value,
        state = self.state,
        stateData = state.data,
        chromeData = {};

        state.data[index][value] = event.target.value;
        self.setState({
            stateData
        });

        chromeData.modes = state.data;
        chrome.storage.sync.set(chromeData);
    },
    componentDidMount: function() {
    
        var self = this,
        modeDefault = [{
                'hotkey': '',
                'indicator': '',
                'queryBefore': '',
                'queryafter': '',
                'show': '',
                'title': ''
            }];

        chrome.storage.sync.get({
            modes: modeDefault,
            searchEnabled: 'enabled'
        }, function(items){
            self.setState({
                data: items.modes,
                enabled: items.searchEnabled
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
            data: [],
            enabled: 'enabled'
        }
    },
    disableToggle: function() {
        var self = this,
        chromeData = {};

        if(self.state.enabled == 'enabled') {
            self.setState({enabled: 'disabled'});
            chromeData.searchEnabled = 'disabled';
        } else if (self.state.enabled == 'disabled') {
            self.setState({ enabled: 'enabled' });
            chromeData.searchEnabled = 'enabled';
        }

        chrome.storage.sync.set(chromeData);
    },
    render: function() {
        var self = this,
        modes = this.state.data.map(function(mode, i){
            return <ModeForm data={mode} removeMode={self.removeMode} onChange={self.handleChange} index={i} key={i} />
        }),
        buttonClass;

        if (this.state.enabled == 'enabled') {
            buttonClass = 'btn btn-primary';
        } else if (this.state.enabled == 'disabled') {
            buttonClass = 'btn btn-default';
        }

        return (
            <form id="mode-settings" className="col-sm-12">
                <a className={ buttonClass } onClick={this.disableToggle}>{this.state.enabled}</a>
                <a onClick={this.addMode} className='btn btn-success'>new search mode</a>
                <hr />
                {modes}
            </form>
        )
    }
});

var ModeForm = React.createClass({
    render: function() {
        return (
            <div className="form-group col-md-4">
                <div className="inner panel panel-default">
                    <div className="panel-heading col-sm-12">
                        <div className="row">
                            <div className="col-sm-10">
                                <input id="title" placeholder="text" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'title'})} className="form-control" data-prop="title" value={this.props.data.title}></input>
                            </div>
                            <div className="col-sm-2">
                                <a onClick={this.props.removeMode.bind(null, this.props.index)} className="btn btn-danger">x</a>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <input id="queryBefore" placeholder="url before search term" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'queryBefore'})} className="form-control" data-prop="queryBefore" value={this.props.data.queryBefore}></input>
                        <input id="queryAfter" placeholder="url after search term" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'queryafter'})} className="form-control" data-prop="queryAfter" value={this.props.data.queryafter}></input>
                        <input id="hotkey" placeholder="hotkey" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'hotkey'})} className="form-control" data-prop="hotkey" value={this.props.data.hotkey}></input>
                        <input id="indicator" placeholder="indicator" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'indicator'})} className="form-control" data-prop="indicator" value={this.props.data.indicator}></input>
                        <input id="show" placeholder="show? true/false" type="text" onChange={this.props.onChange.bind(null, {'index': this.props.index , 'value': 'show'})} className="form-control" data-prop="show" value={this.props.data.show}></input>
                    </div>
                </div>
            </div>
        )
    }
});

var CssSettings = React.createClass({
    handleChange: function(event) {
        var state = {},
        val = event.target.value,
        setting = {};

        this.setState({ customCSS: val });

        setting.customCSS = val;
        chrome.storage.sync.set(setting);
    },
    componentDidMount: function () {
        var self = this;

        chrome.storage.sync.get({
            customCSS: ''
        }, function(items){
            self.setState({
                customCSS: items.customCSS
            })
        });
    },
    getInitialState: function() {
        return {
            customCSS: ''
        }
    },
    render: function() {
        return (
            <form id="css-settings" className="col-md-4">
                <label htmlFor="custom-css">Custom CSS</label>
                <textarea id="custom-css" onChange={this.handleChange} className="form-control" value={this.state.customCSS}></textarea>
            </form>
        )
    }
});

var BgSettings = React.createClass({
    handleChange: function(event) {
        var state = {},
        val = event.target.value,
        setting = {};

        this.setState({ bgImage: val });

        setting.bgImage = val;
        chrome.storage.sync.set(setting);
    },
    componentDidMount: function () {
        var self = this;

        chrome.storage.sync.get({
            bgImage: ''
        }, function(items){
            self.setState({
                bgImage: items.bgImage
            })
        });
    },
    getInitialState: function() {
        return {
            bgImage: '',
        }
    },
    render: function() {
        return (
            <form id="bg-settings" className="col-md-4">
                <label htmlFor="custom-css">Backgound Image</label>
                <input id="background-image" onChange={this.handleChange} className="form-control" type="text" value={this.state.bgImage}></input>
            </form>
        )
    }
});

React.render(
    <Options />,
    document.getElementById('options')
)