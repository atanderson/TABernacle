#TABernacle

*A custom new tab page for persnickety people.*

##Installation

[Chrome web store installation link](https://chrome.google.com/webstore/detail/tabernacle/ocdkoialkjmbdfmhdmcppmeljpcfibfi)

You can also install by cloning the repo and loading it as an unpacked extension (developer mode must be enabled)

##Usage

**Note: This project is not the most intuitive thing in the world. I made this extension primarily for personal use (and to learn a bit of react), so many of the labels could be more descriptive. Also none of the tooltips are filled in, so apologies in advance**

Configuration is handled by the extension's options page.
All of the fields save automatically and are synced to chrome storage (should work across multiple devices).

TABernacle has four main elements:
 -  Links to websites
 -  A search bar with custom modes
 -  Google calendar embed
 -  To-do/done list

All of the above can be enabled/disabled as you see fit.

In addition, you can optionally specify custom CSS and a custom background image.

### Links

[Sample Configuration](http://i.imgur.com/QudOnmV.png)

[Result](http://i.imgur.com/NzqSi6N.png)

**Area title**

- The text for the link area's title bar 

**Title**

- Semantic title for the link

**Icon**

- Font awesome icon to represent the link

**Text**

- Text to represent the link

**Value**

- Url for the link

### Search modes

[Sample Configuration](http://i.imgur.com/6HWrebf.png)

[Result](http://i.imgur.com/XloT6hZ.png)

**Text**

- Text label for mode button

**Url before search term**

- Url fragment to be inserted before the search term

**Url after search term**

- Url fragment to be inserted after the search term

**Hotkey**

- Javascript KeyCode for the hotkey

**Indicator**

- Text label/tooltip for hotkey (because they keycode and hotkey value will not match)

**Show?**

- If `true`, show the button

### Calendar

[Sample Configuration](http://i.imgur.com/6tStWGt.png)

[Result](http://i.imgur.com/UEfE6fU.png)

**Calendar ID**

- Google calendar ID for the calender you want to show (usually just e-mail address)

**Calendar API key**

- Your Google Calender API key

### Custom CSS

Does not compile SCSS/LESS. Inserted in head so be careful what you put in there (don't load a ton of fonts or external sheets).

### Background Image

Unfortunately cannot be a local file due to Chrome extension restrictions.


*****

*Bootstrap, jQuery, Moment.js & Font Awesome used under the terms of the [MIT license](http://opensource.org/licenses/MIT)*

*React used under the terms of the [BSD License](https://github.com/facebook/react/blob/master/LICENSE)*
