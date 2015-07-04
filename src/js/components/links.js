var React = require('react');
var Todo = require('../components/todolist');
var Calendar = require('../components/calendar');

//Monsterous parent element of all the links and their containers
var Links = React.createClass({
    //Once mounted, get all the data needed to render out the component
    componentDidMount: function(){
        var self = this;
        chrome.storage.sync.get({
            linkData: [],
            linksEnabled: 'enabled',
            calendarEnabled: 'enabled',
            todoEnabled: 'enabled'
        }, function(items){
            self.setState({
                data: items.linkData,
                linksEnabled: items.linksEnabled,
                calendarEnabled: items.calendarEnabled,
                todoEnabled: items.todoEnabled
            });
        });
    },
    //Render nothing but store the state as proper primatives to avoid errors
    getInitialState: function() {
        return {
            data: [],
            linksEnabled: '',
            calendarEnabled: '',
            todoEnabled: ''
        };
    },
    render: function() {
        //Set conditionally rendered elements as nothing to begin with
        var leftColumn = null,
            rightColumn = null,
            calendar = null,
            todoClass = '',
            linkClass = '';
        //Figure this out immediately to avoid undefined issues
        //TODO Should not be rendered if modules disabled
        var modules = this.state.data.map(function(module, i) {
            return <LinkModule title={module.title} data={module} key={i} />
        });
        //If link area set to enabled in the options
        if (this.state.linksEnabled == 'enabled') {
            //If the todolist is also set to enabled
            if (this.state.todoEnabled == 'enabled') {
                //Make the two areas take up only 1/2 the screen
                linkClass = "col-left";
                todoClass = "col-right";
            }
            //Define the left column
            leftColumn = <div className={ linkClass }>{modules}</div>
        }
        //If calendar is set to enabled in the options
        if (this.state.calendarEnabled == 'enabled') {
            calendar = <Calendar />
        }
        //If todo list is enabled in the options
        if (this.state.todoEnabled == 'enabled') {
           rightColumn = <div className={ todoClass }><Todo /></div> 
        }
        //Finally, return the link area to be rendered
        return (
            <div className="links-wrapper clearfix">
                { leftColumn }
                { rightColumn }
                { calendar }
            </div>
        )
    }
});

//Wrapper for all the little link icons. Props represents the area and the links
var LinkModule = React.createClass({
    render: function(){
        return (
            <div id="link-module-wrapper">
                <div className="module small clearfix links">
                    <h4>{this.props.title}</ h4>
                    <LinkList data={this.props.data.links}/>
                </div>
            </div>
        )
    }
});

//Ul wrapper of the links icons. Data represents link array.
//TODO combine this with the LinkModue element since it is just a ul...
var LinkList = React.createClass({
    render: function() {
        var links = this.props.data.map(function(link, i) {
            return <ALink data={link} key={i} />
        });
        return (
            <ul id="un-list">
                {links}
            </ul>
        )
    }
});

//An individual link. Data at this point represnts the inidividual link props
var ALink = React.createClass({
    render: function() {
        var icon = this.props.data.icon + " fa fa-inverse fa-stack-1x";
        return (
            <li className="float">
                <a href={this.props.data.value} title={this.props.data.title}>
                    <span className="fa-stack fa-lg">
                        <i className="fa fa-stop fa-stack-2x"></i>
                        <i className={icon}>
                            {this.props.data.text}
                        </i>
                    </span>
                </a>
            </li>
        )
    }
});

module.exports = Links;