TABernacle
==========

A custom new tab page for persnickety people.

*How To Use*

- Edit config.json to create a custom link/module/calendar/searchmode setup

- Calendar

    - Api Key and ID need to be specified in the config.json for the calendar to show up

- Custom Searches

    - Searchmodes wrap a string array around the search query and create a new tab/window (browser dependant) with the resulting string. 

    - Hotkeys can be specified to activate searchmodes and use the [Javascript keycodes](http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)

    - You can pass in an indicator to remind you of what key does what

    - If button is true the mode will be visible above the search bar

- Custom links

    - A lefthand module will be created for every item in the "titles" array

    - A set of links will be created for every "set" array and be inserted into the corresponding titled module.

    - Icon specifies the font-awesome icon to use

    - You can also pass any html object or string into the text value for a link

    - Value indicates where the link goes

- Todo/done list

    - All the to-do items are saved in localstorage. Make sure your browser supports localstorage or it will not work!

- Skins 

    - Replace background-image.jpg in the images folder if you would like to re-skin

    - Three sass variables control the color scheme for the skin and can be found at the top of styles.scss

jQuery & Moment.js used under the terms of the [MIT license](http://opensource.org/licenses/MIT)