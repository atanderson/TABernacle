var React = require('react');

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
            });
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
        };
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

module.exports = LinkSettings;