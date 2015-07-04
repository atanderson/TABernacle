var React = require('react');

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

module.exports = ModeSettings;