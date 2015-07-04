var React = require('react');

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

module.exports = Calendar;