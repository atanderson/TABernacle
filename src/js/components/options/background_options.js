var React = require('react');

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
            });
        });
    },
    getInitialState: function() {
        return {
            bgImage: '',
        };
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

module.exports = BgSettings;