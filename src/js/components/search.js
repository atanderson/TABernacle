var React = require('react');

//Search bar input and search mode buttons
var Search = React.createClass({
    componentDidMount: function() {
        var self = this;
        //Detect if the component is enabled
        chrome.storage.sync.get({
            searchEnabled: 'enabled'
        }, function(items){
            self.setState({
                enabled: items.searchEnabled
            });
        });
    },
    search: function(mode) {
        console.log(mode);
        submitSearch(mode);
    },
    getInitialState: function() {
        //Set initial state to null (not enabled or disabled)
        return {
            enabled: null
        };
    },
    render: function() {
        //If enabled option is checked render the element, otherwise do not
        if (this.state.enabled == 'enabled') {  
            return (          
                <div className="module clearfix search">
                    <SearchModes search={this.search} />
                    <input type="text" id="search-input" className="search-input" data-placeholder="search" placeholder="search" />
                </div>
            )
        } else {
            return null;
        }
    }
});

//list of search modes that appears above the search bar (if desired)
//TODO incorperate the search handlers into this component?
var SearchModes = React.createClass({
    componentDidMount: function() {
        var self = this;
        //Once mounted, get the modes set in the options
        chrome.storage.sync.get({
            modes: []
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
        var self = this;
        //Key required so elements have unique index. Data passed = single mode
        var modes = this.state.data.map(function(mode, i){
            return <Mode data={mode} search={self.props.search} key={i} />
        });
        return (
            <ul id="search-modes" className="un-list search-modes">
                {modes}
            </ul>
        )
    }
});

//The individual search mode button
var Mode = React.createClass({
    render: function(){
        var indicator = null;
        //If the indicator (number tooltip) is set, render one
        if(this.props.data.indicator != ''){
            //Define the indicator as a circle wrapped around the tooltip number
            indicator = <span className="fa-stack fa-lg indicator"><i className="fa fa-circle fa-stack-1x"></i><i className="fa fa-inverse fa-stack-1x">{this.props.data.indicator}</i></span>
        }
        //If the button is to be shown (set to true in options)
        if(this.props.data.show) {
            return (
                <li id={this.props.data.title} onClick={this.props.search.bind(null, this.props.data.title)} className="float mode">
                    <a className="icon search-mode" href="#">
                        {this.props.data.title}
                    </a>
                    {indicator}
                </li>
            )
        } else {
            return false;
        }
    }
});

module.exports = Search;