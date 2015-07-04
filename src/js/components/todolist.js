var React = require('react');

//The todolist wrapper
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
        };
    },
    toggleList: function () {
        if (this.state.reveal == 'to-do') {
            this.setState({
                reveal: 'done'
            });
        } else if (this.state.reveal == 'done') {
            this.setState({
                reveal: 'to-do'
            });
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

module.exports = Todo;