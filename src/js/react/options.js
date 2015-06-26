/** @jsx React.DOM */

//TODO: move to separate file? Useful on the main page as well.
//For debugging. Called in the console as needed.
window.logStorage = function(){

    //Load these as default when their values are not present (can prevent data type mismatch)
    var linkDefault = [
        {   
            'title': 'Link Area title',
            'links': [{
                'title': 'test',
                'icon': '',
                'text': '',
                'value': ''
            }]
        },
        {
            'title': 'Link Area title2',
            'links': [{
                'title': 'test2',
                'icon': '',
                'text': '',
                'value': ''
            }]
        },
    ],
    modeDefault = [{
        'hotkey': '',
        'indicator': '',
        'queryBefore': '',
        'queryafter': '',
        'show': '',
        'title': ''
    }];

    //Basic storage grabber
    chrome.storage.sync.get({
        googleCalendarID: '',
        googleCalendarKey: '',
        linkData: linkDefault,
        modes: modeDefault,
        customCSS: '',
        bgImage: ''
    }, function(items) {
        console.log("allData", items);
        console.log("calID", items.googleCalendarID);
        console.log("calKey", items.googleCalendarKey);
        console.log("linkData", items.linkData);
        console.log("modes", items.modes);
        console.log("customCSS", items.customCss);
        console.log("bgImage", items.bgImage);
    });

};

var React = require('react');

//Main container for the options page
var Options = React.createClass({
    getInitialState: function(){
        return { settingEditable: 'CalendarSettings'};
    },
    swapModule: function(name, event){
        console.log(event.target);
        this.setState( {settingEditable: name} );
    },
    render: function() {
        var settingArea;
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

var SettingsToggles = React.createClass({
    render: function() {
        return(
            <ul className="nav navbar-nav">
                <li><a href="#" onClick={this.props.onClick.bind(null, 'CalendarSettings')} >Calendar</a></li>
                <li><a href="#" onClick={this.props.onClick.bind(null, 'LinkSettings')} >Links</a></li>
                <li><a href="#" onClick={this.props.onClick.bind(null, 'ModeSettings')} >Search Modes</a></li>
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
            googleCalendarID: ''
        }, function(items){
            self.setState({
                googleCalendarKey: items.googleCalendarKey,
                googleCalendarID: items.googleCalendarID
            });
        });
    },
    //Load blank component initially, needed because google storage retreval is async
    getInitialState: function() {
        return {
            googleCalendarKey: '',
            googleCalendarID: ''
        }
    },
    //Render two inputs with labels
    render: function() {
        return (
            <form id="calendar-settings" className="col-md-4">

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

var LinkSettings = React.createClass({
    addArea: function (){
        //Make sure we are binding to the correct element
        var self = this,
        //Store the state (which should be immutable) as a new variable
        state = self.state.data;

        var newArea = {   
            'title': 'New Area',
            'links': []
        };

        //Create an empty array for the new area
        state.push(newArea);
        self.setState(state);

        //Empty object for chrome storage to prevent syntax issues
        var chromeData = {};
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    removeArea: function(index){
        var self = this,
        state = self.state.data;

        //Remove the link area object and it's associated array
        state.splice(index , 1);
        self.setState(state);

        var chromeData = {};
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    addLink: function(index){
        var self = this,
        state = self.state.data;

        //Add a blank link object to the link area array
        state[index].links.push({
            'title' : '',
            'icon': '',
            'text': '',
            'value': ''
        });
        self.setState(state);

        var chromeData = {};
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    removeLink: function(link){
        var self = this;
        var state = self.state.data;

        //Remove the link of the specified index from the specified linkarea
        state[link.linkArea].links.splice(link.index, 1);

        self.setState(state);

        var chromeData = {};
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    handleChange: function(name, event) {
        var self = this,
        linkArea = name.linkArea,
        index = name.index,
        value = name.value,
        state = self.state.data;

        state[linkArea].links[index][value] = event.target.value;
        self.setState({state});

        var chromeData = {};
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    handleTitle: function(index, event){

        //TODO ordering is off on page refresh?
        //Might need to use array to garuntee order

        var self = this,
        val = event.target.value,
        state = self.state.data;
        
        state[index].title = val;
        self.setState({
            state
        });

        var chromeData = {};
        chromeData.linkData = state;
        chrome.storage.sync.set(chromeData);
    },
    componentDidMount: function () {
        var self = this;
        var linkDefault = [
            {   
                'title': 'Link Area title',
                'links': [{
                    'title': 'test',
                    'icon': '',
                    'text': '',
                    'value': ''
                }]
            },
            {
                'title': 'Link Area title2',
                'links': [{
                    'title': 'test2',
                    'icon': '',
                    'text': '',
                    'value': ''
                }]
            }
        ];
        chrome.storage.sync.get({
            linkData: linkDefault
        }, function(items){
            self.setState({
                data: items.linkData
            })
        });
    },
    getInitialState: function() {
        var linkDefault = [
            {   
                'title': 'Link Area title',
                'links': [{
                    'title': 'test',
                    'icon': '',
                    'text': '',
                    'value': ''
                }]
            },
            {
                'title': 'Link Area title2',
                'links': [{
                    'title': 'test2',
                    'icon': '',
                    'text': '',
                    'value': ''
                }]
            }
        ];
        return {
            data: linkDefault
        }
    },
    render: function() {
        var self = this;
        var modules = this.state.data.map(function(linkModule, i) {
            return <LinkWrapper removeArea={self.removeArea} handleTitle={self.handleTitle} addLink={self.addLink} removeLink={self.removeLink} title={module} key={i} index={i} onChange={self.handleChange} data={linkModule} />
        });
        return (
            <div className="col-sm-12">
                <a className="btn btn-success" onClick={this.addArea}>new link area</a>
                <hr />
                <form id="link-settings">{modules}</form>
            </div>
        )
    }
});

var LinkWrapper = React.createClass({
    render: function() {
        var self = this;
        var links = this.props.data.links.map(function(link, i) {
            return <LinkForm data={link} key={i} index={i} removeLink={self.props.removeLink} onChange={self.props.onChange} parentIndex={self.props.index} />
        });
        return (
            <div className="row">
                <div className="col-sm-12">
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
        var modes = this.state.data.map(function(mode, i){
            return <ModeForm data={mode} removeMode={self.removeMode} onChange={self.handleChange} index={i} key={i} />
        });
        return (
            <form id="link-settings" className="col-md-4">
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
    handleChange: function(event) {

        //TODO: rename the keys to be the same between chrome storage and state
        var state = {};
        var val = event.target.value
        this.setState({ customCSS: val });

        var setting = {};
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

        //TODO: rename the keys to be the same between chrome storage and state
        var state = {};
        var val = event.target.value
        this.setState({ bgImage: val });

        var setting = {};
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
            customCSS: '',
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