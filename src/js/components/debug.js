//For debugging. Called in the console as needed.
window.logStorage = function(){

    //Load these as default when their values are not present (can prevent data type mismatch)
    var linkDefault = [
        {   
            'title': '',
            'links': []
        }
    ],
    todoDefault = {
        'active': [],
        'done': []
    };

    //Basic storage grabber
    chrome.storage.sync.get({
        googleCalendarID: '',
        googleCalendarKey: '',
        linkData: linkDefault,
        modes: [],
        customCSS: '',
        bgImage: '',
        todoData: todoDefault,
        searchEnabled: '',
        linksEnabled: '',
        calendarEnabled: '',
        todoEnabled: ''
    }, function(items) {
        console.log("allData", items);
        console.log("calID", items.googleCalendarID);
        console.log("calKey", items.googleCalendarKey);
        console.log("linkData", items.linkData);
        console.log("modes", items.modes);
        console.log("customCSS", items.customCSS);
        console.log("bgImage", items.bgImage);
        console.log("todo data", items.todoData);
        console.log("search enabled", items.searchEnabled);
        console.log("links enabled", items.linksEnabled);
        console.log("calendar enabled", items.calendarEnabled);
        console.log("todo enabled", items.todoEnabled);
    });

};

module.exports = window.logStorage;