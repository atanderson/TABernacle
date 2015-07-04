/** @jsx React.DOM */

//TODO: move to separate file? Useful on the main page as well.
//For debugging. Called in the console as needed.
window.logStorage = function(){

    //Load these as default when their values are not present (can prevent data type mismatch)
    var linkDefault = [
        {   
            'title': '',
            'links': []
        }
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
        }
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

//The todolist wrapper
//TODO currently does not work. Merge in todo.js and render whole list w/ react
var Todo = React.createClass({
    componentDidMount: function(){
        var self = this,
        todoDefault = {
            'active': [],
            'done': []
        };

        chrome.storage.sync.get({
            todoData: todoDefault
        }, function(items){
            self.setState({
                data: items.todoData
            });
        });
    },
    getInitialState: function() {
        var todoDefault = {
            'active': [],
            'done': []
        };

        return {
            data: todoDefault,
            reveal: "to-do"
        }
    },
    toggleList: function () {
        if (this.state.reveal == 'to-do') {
            this.setState({
                reveal: 'done'
            })
        } else if (this.state.reveal == 'done') {
            this.setState({
                reveal: 'to-do'
            })
        }
    },
    deleteItem: function (index) {
        var self = this,
        state = self.state.data,
        chromeData = {};

        if (this.state.reveal == 'to-do') {
            state.done.push(state.active[index]);
            state.active.splice(index, 1);
        } else if (this.state.reveal == 'done') {
            state.done.splice(index, 1);
        }

        self.setState(state);
        chromeData.todoData = state;
        chrome.storage.sync.set(chromeData);
    },
    handleSubmit: function(event) {
        var self = this,
        state = self.state.data,
        chromeData = {};

        if (event.which == 13){
            event.preventDefault();
            state.active.push(event.target.value);
            event.target.value = '';
        }

        self.setState(state);
        chromeData.todoData = state;
        chrome.storage.sync.set(chromeData);
    },
    render: function () {
        return (
            <div className="module small todo-wrapper">
                <h4>
                    <span>{this.state.reveal}</span>
                    <a href="#" className="right" onClick={this.toggleList}>
                        <i id="swapper" className="fa fa-arrows-h"></i>
                    </a>
                </h4>
                <TodoForm data={this.state.data} handleSubmit={this.handleSubmit} deleteItem={this.deleteItem} reveal={this.state.reveal} />
            </div>
        )
    }
});

//The form that adds the todo items
var TodoForm = React.createClass({
    render: function() {
        var items,
        form,
        self = this;

        if (this.props.reveal == 'to-do') {
            items = this.props.data.active.map(function(item, i){
                        return <TodoItem key={i} index={i} task={item} deleteItem={self.props.deleteItem} />
                    })
            form =  <form>
                        <input onKeyDown={self.props.handleSubmit} id="todo-field" className="todo-field" type="text" placeholder="enter a to-do item" data-placeholder="enter a to-do item" />
                        <ul id="todo-list" className="todo-list">
                            {items}
                        </ul>
                    </form>
        } else if (this.props.reveal = 'done') {
            items =  this.props.data.done.map(function(item, i){
                        return <TodoItem key={i} index={i} task={item} deleteItem={self.props.deleteItem}/>
                    })
            form =  <form>
                        <ul id="done-list" className="done-list">
                            {items}
                        </ul>
                    </form>
        }
        return (
            <div className="todo-inner">
                {form}
            </div>
        )
    }
});

var TodoItem = React.createClass({
    render: function() {
        return(
            <li className="task" onClick={this.props.deleteItem.bind(null, this.props.index)}>{this.props.task}</li>
        )
    }
})

//Wrapper for calendar that gets added in via ajax.
//TODO merge in calendar.js and render with react.
var Calendar = React.createClass({
    render: function() {
        return (
            <div className="module small">
                <h4>
                    <span>Coming Up</span>
                </h4>
                <div id="calendar" className="calendar">
                    <ul style={{display: "none"}}></ul>
                </div>
            </div>
        )
    }
});

//Over-arching application wrapper
var APP = React.createClass({
    render: function() {
        return( 
            <div className="wrapper">
                <Search />
                <Links />
            </div>
        )
    }
});

//Render it to the page
React.render(
    <APP />,
    document.getElementById('app')
);