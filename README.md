#TABernacle

*A custom new tab page for persnickety people.*

##How To Use

- Edit the config.js file to create the HTML elements for your page.
- Edit the sass color variables and background-image.jpg to re-skin the page.

##Config.js

**Custom Links**

Inside of the config object there is a links object that determines the titles/number of link containers (AKA modules) and their contents.

*example*

```Javascript
    "links": {
        //A module will be generated for each title
        "titles": [
            "Module 1"
        ],
        /*
        This array represents a group of links to be appended into a module. 
        The name is not used for anything, the sets will simply be appended
        to the title with the same index.
        */
        "set1": [
            //This object represents 
            {   
                //Title of the link (can be used for custom CSS if desired).
                "title": "twitch",
                //Font Awesome icon to be used for the link.
                "icon": "fa-bell-o",
                //Text of the link (can be combined with the icon for interesting effects).
                "text": "",
                //Href value for the link.
                "value": "http://www.twitch.tv"
            }
        ]
    }
```

**Google Calendar**

A google calendar ID and API key can be specified in the config object to output a google calendar into the "coming up" section

*example*

```Javascript
    "calendar": {
        "id": "myCalendar@gmail.com",
        "apikey": "my api key"
    }
```

**Custom Search Modes**

Search modes are defined in the searchmodes object in the config, and wrap a string array around the search query in a new tab/window (browser dependant)

Hotkeys can be specified to activate search modes and use [Javascript keycodes](http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)

*example*
```Javascript
    "searchModes": {
        //The name is the ID of the search mode (can be used for CSS)
        "reddit": {
            //Text to use for the button label
            "label": "Reddit",
            /*
            Array used to generate the window location. query[0] will go before the 
            search query, query[1] will go after.
            */
            "query": ["http://www.reddit.com/r/", ""],
            //Hotkey used to execute a particular search mode
            "hotkey": 49,
            //Indicator for the hotkey
            "indicator": 1,
            //Make a button appear over the search input
            "button": true
        }
    }
```

*another example*
```Javascript
//For a "disambiguation" wikipedia search
"searchModes": {
    "wikiAll": {
        "label": "Wikipedia (all)",
        "query": ["http://en.wikipedia.org/wiki/", "_(disambiguation)"],
        "hotkey": 49,
        "indicator": 1,
        "button": false
    }
}
```


**Todo/Done List**

Basic todo list. Click the upper right icon to see items you have crossed off.

Localstorage must be enabled to preserve data!

##Skinning

- Replace background-image.jpg in the images folder for a full-screen background image
- Three sass variables control the color scheme for the skin and can be found at the top of styles.scss

*****

*jQuery, Moment.js & Font Awesome used under the terms of the [MIT license](http://opensource.org/licenses/MIT)*
