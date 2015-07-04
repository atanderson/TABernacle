var React = require('react');

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
        };
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

module.exports = TodoSettings;