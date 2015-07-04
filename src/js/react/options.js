/** @jsx React.DOM */

var Debug = require('../components/debug');
var React = require('react');
var CalendarSettings = require('../components/options/calendar_options');
var LinkSettings = require('../components/options/link_options');
var ModeSettings = require('../components/options/mode_options');
var TodoSettings = require('../components/options/todo_options');
var BgSettings = require('../components/options/background_options');
var CssSettings = require('../components/options/css_options');

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

React.render(
    <Options />,
    document.getElementById('options')
)