function save_options() {
  var calID = document.getElementById('calID').value;
  var calKey = document.getElementById('calKey').value;
  var moduleNumber = document.getElementById('linkAreas').value;
  var customCSS = document.getElementById('custom-css').value;
  var customBackground = document.getElementById('background-image').value;

  var modules = $('.module');
  var linksNumber = $('.module-links-number');
  var modesNumber = $('#searchModes').val();
  var searchModes = $('.mode');

  var linkData = {};
  for (var i = 0; i < modules.length; i++){
    var title = $(modules[i]).find('.module-title').val();
    var moduleLinks = $(modules[i]).find('.module-links .link');
    var links = [];
    for (var j = 0; j < moduleLinks.length; j++) {
      var thisLink = {};
      thisLink.title = $(moduleLinks[j]).find('[data-value="title"]').val();
      thisLink.text = $(moduleLinks[j]).find('[data-value="text"]').val();
      thisLink.icon = $(moduleLinks[j]).find('[data-value="icon"]').val();
      thisLink.value = $(moduleLinks[j]).find('[data-value="value"]').val();
      links.push(thisLink);
    }
    linkData[title] = links; 
  }

  var linksNumbers = [];
  for (var i = 0; i < linksNumber.length; i++) {
    linksNumbers.push(linksNumber[i].value);
  }

  var modes = {};
  for (var i = 0; i < searchModes.length; i++) {
    var modeProps = [];
    modeProps.push($(searchModes[i]).find('[data-value="title"]').val());
    modeProps.push($(searchModes[i]).find('[data-value="query-before"]').val());
    modeProps.push($(searchModes[i]).find('[data-value="query-after"]').val());
    modeProps.push($(searchModes[i]).find('[data-value="hotkey"]').val());
    modeProps.push($(searchModes[i]).find('[data-value="indicator"]').val());
    modeProps.push($(searchModes[i]).find('[data-value="show"]').prop('checked'));
    modes[$(searchModes[i]).find('[data-value="title"]').val()] = modeProps;
  }

  chrome.storage.sync.set({
    googleCalendarKey: calKey,
    googleCalendarID: calID,
    numberOfLinkAreas: moduleNumber,
    linksNumbers: linksNumbers,
    linkData: linkData,
    numberOfModesAreas: modesNumber,
    modes: modes,
    customCSS: customCSS,
    bgImage: customBackground
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
      restore_options();
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    googleCalendarID: '',
    googleCalendarKey: '',
    numberOfLinkAreas: '',
    titles: [],
    linksNumbers: [],
    linkData: '',
    numberOfModesAreas: '',
    modes: [],
    customCSS: '',
    bgImage: ''
  }, function(items) {
    document.getElementById('calID').value = items.googleCalendarID;
    document.getElementById('calKey').value = items.googleCalendarKey;
    document.getElementById('linkAreas').value = items.numberOfLinkAreas;
    document.getElementById('searchModes').value = items.numberOfModesAreas;
    document.getElementById('custom-css').value = items.customCSS;
    document.getElementById('background-image').value = items.bgImage;

    console.log(items.linkData);

    $('#link-modules').html('');
    $('#search-modes').html('');

    for(var i = 0; i < items.numberOfLinkAreas; i++) {

      $('#link-modules').append(
        '<div class="module" data-module="' + i + '">' +
        '<label for="module-' + i + '-title">Title for link area ' + (i + 1) + '</label><input id="module-' + i + '-title" class="module-title form-control" type="text"></input><br>' +
        '<label for="module-' + i + '-linkNumber">Number of links in link area</label><input id="module-' + i + '-linkNumber" class="module-links-number form-control" type="number"><br>' +
        '<hr><div class="module-links"></div>' +
        '</div>'
      );

    }

    for(var i = 0; i < items.titles.length; i ++ ){


      $('#module-' + i + '-title').val(items.titles[i]);

    }

    for(var i = 0; i < items.titles.length; i ++ ){

      $('#module-' + i + '-linkNumber').val(items.linksNumbers[i]);

    }

    var modules = $(".module");

    for(var i = 0; i < modules.length; i++){
      for(var j = 0; j < items.linksNumbers[i]; j++){
        $('[data-module="' + i + '"] .module-links').append(

          '<div id="module-' + i + '-link-' + j + '" class="link">' +
          '<div class="form-group"><label for="module-' + i + '-link-' + j + '-title" >Link Title</label>' + 
          '<input class="linkProp form-control" id="module-' + i + '-link-' + j + '-title" data-value="title" type="text" placeholder="title"></div>' +
          '<div class="form-group"><label for="module-' + i + '-link-' + j + '-text" >Link Text</label>' + 
          '<input class="linkProp form-control" id="module-' + i + '-link-' + j + '-text" data-value="text" type="text" placeholder="text"></div>' +
          '<div class="form-group"><label for="module-' + i + '-link-' + j + '-icon" >Link Icon (font awesome)</label>' + 
          '<input class="linkProp form-control" id="module-' + i + '-link-' + j + '-icon" data-value="icon" type="text" placeholder="icon"></div>' +
          '<div class="form-group"><label for="module-' + i + '-link-' + j + '-title" >Link</label>' + 
          '<input class="linkProp form-control" id="module-' + i + '-link-' + j + '-value" data-value="value" type="text" placeholder="value"></div>' +
          '</div><hr>'

        );
      }
    }

    var linkNumber = 0;
    var links = $(".link");

    for (var linkArray in items.links){
      for (var i = 0; i < items.links[linkArray].length; i++){
        var currentProps = $(links[linkNumber]).find(".linkProp");
        $(currentProps[i]).val(items.links[linkArray][i+1]);
      }
      linkNumber++
    }

    for(var i = 0; i < items.numberOfModesAreas; i++) {

      $('#search-modes').append(
        '<div class="mode" data-mode="' + i + '">' +
        '<div class="form-group"><label for="mode-' + i + '-name" >Mode Name</label>' +
        '<input id="mode-' + i + '-name" class="modeProp form-control" data-value="title" placeholder="title" type="text"></div>' +
        '<div class="form-group"><label for="mode-' + i + '-query-before" >Text before search query</label>' +
        '<input id="mode-' + i + '-query-before" class="modeProp form-control" data-value="query-before" placeholder="query-before" type="text"></div>' +
        '<div class="form-group"><label for="mode-' + i + '-query-after" >Text after search query</label>' +
        '<input id="mode-' + i + '-query-after" class="modeProp form-control" data-value="query-after" placeholder="query-after" type="text"></div>' +
        '<div class="form-group"><label for="mode-' + i + '-name" >Mode Hotkey (js keycode)</label>' +
        '<input id="mode-' + i + '-hotkey" class="modeProp form-control" data-value="hotkey" placeholder="hotkey" type="text"></div>' +
        '<div class="form-group"><label for="mode-' + i + '-indicator" >Hotkey Reminder Text (key value)</label>' +
        '<input id="mode-' + i + '-indicator" class="modeProp form-control" data-value="indicator" placeholder="indicator" type="text"></div>' +
        '<div class="checkbox"><label for="mode-' + i + '-show" >' +
        '<input id="mode-' + i + '-show" class="modeProp" data-value="show" type="checkbox">Mode button enabled</label></div><hr>' +
        '<div class="module-links"></div>' +
        '</div>'
      );

    }

    var modeNumber = 0;
    var modes = $(".mode");
    for (var modeArray in items.modes){
      for (var i = 0; i < items.modes[modeArray].length; i++){
        var currentProps = $(modes[modeNumber]).find(".modeProp");
        if ($(currentProps[i]).attr('type') == 'checkbox'){
          $(currentProps[i]).prop('checked', items.modes[modeArray][i])
        } else {
          $(currentProps[i]).val(items.modes[modeArray][i]);
        }
      }
      modeNumber++
    }

  });

}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);