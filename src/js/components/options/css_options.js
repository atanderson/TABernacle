var React = require('react');

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
            });
        });
    },
    getInitialState: function() {
        return {
            customCSS: ''
        };
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

module.exports = CssSettings;