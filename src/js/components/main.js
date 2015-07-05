/** @jsx React.DOM */

var Debug = require('../components/debug');
var React = require('react');
var Search = require('../components/search');
var Links = require('../components/links');

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