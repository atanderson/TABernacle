/** @jsx React.DOM */

var React = require('react');

var Search = React.createClass({
    render: function() {
        return (
            <div className="module clearfix search">
                <SearchModes />
                <input type="text" id="search-input" className="search-input" data-placeholder="search" placeholder="search" />
            </div>
        )
    }
});

var SearchModes = React.createClass({
    render: function() {
        return (
            <ul id="search-modes" className="un-list search-modes"></ul>
        )
    }
});

var LinkModule = React.createClass({
    render: function(){
        return (
            <div id="link-module-wrapper">
                <div className="module small clearfix links">
                    <h4>{this.props.title}</ h4>
                    <LinkList data={this.props.data}/>
                </div>
            </div>
        )
    }
});

var LinkList = React.createClass({
    render: function() {
        var links = this.props.data.map(function(link, i) {
            return <ALink data={link} key={i} />
        });
        return (
            <ul id="Linkset-2 un-list">
                {links}
            </ul>
        )
    }
});

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

var Todo = React.createClass({
    render: function() {
        return (
            <div className="module small todo-wrapper">
                <h4>
                    <span>To-Do</span>
                    <a href="#" className="right">
                        <i id="swapper" className="fa fa-arrows-h"></i>
                    </a>
                </h4>
                <TodoForm />
            </div>
        )
    }
});

var TodoForm = React.createClass({
    render: function() {
        return (
            <div>
                <form>
                    <input id="todo-field" className="todo-field" type="text" placeholder="enter a to-do item" data-placeholder="enter a to-do item" />
                    <ul id="todo-list" className="todo-list"></ul>
                </form>
                <form>
                    <ul id="done-list" className="done-list"></ul>
                </form>
            </div>
        )
    }
});

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

var Links = React.createClass({
    componentDidMount: function(){
        var self = this;
        chrome.storage.sync.get({
            linkData: ''
        }, function(items){
            self.setState({
                data: items.linkData
            });
        });
    },
    getInitialState: function() {
        return {
            data: []
        }
    },
    render: function() {
        var modules = [];
        for (module in this.state.data) {
            modules.push(<LinkModule title={module} data={this.state.data[module]} />);
        }
        return (
            <div className="links-wrapper clearfix">
                <div className="col-left">
                    {modules}
                </div>
                <div className="col-right">
                    <Todo />
                </div>
                <Calendar />
            </div>
        )
    }
});

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

React.render(
    <APP />,
    document.getElementById('app')
);