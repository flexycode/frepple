
// Django sets this variable in the admin/base.html template.
window.__admin_media_prefix__ = "/static/admin/";


//----------------------------------------------------------------------------
// A class to handle changes to a grid.
//----------------------------------------------------------------------------
var upload = {
  warnUnsavedChanges: function()
  {
    $(window).off('beforeunload', upload.warnUnsavedChanges);
    return gettext("There are unsaved changes on this page.");
  },

  undo : function ()
  {
    if ($('#undo').hasClass("ui-state-disabled")) return;
    $("#grid").trigger("reloadGrid");
    $('#save').addClass("ui-state-disabled").removeClass("bold");
    $('#undo').addClass("ui-state-disabled").removeClass("bold");
    $('#filter').removeClass("ui-state-disabled");
    $(window).off('beforeunload', upload.warnUnsavedChanges);
  },

  select : function ()
  {
    $('#filter').addClass("ui-state-disabled");
    $.jgrid.hideModal("#searchmodfbox_grid");
    $('#save').removeClass("ui-state-disabled").addClass("bold");
    $('#undo').removeClass("ui-state-disabled").addClass("bold");
    $(window).off('beforeunload', upload.warnUnsavedChanges);
    $(window).on('beforeunload', upload.warnUnsavedChanges);
  },

  save : function()
  {
    if ($('#save').hasClass("ui-state-disabled")) return;

    // Pick up all changed cells. If a function "getData" is defined on the
    // page we use that, otherwise we use the standard functionality of jqgrid.
    if (typeof getDirtyData == 'function')
      rows = getDirtyData();
    else
      rows = $("#grid").getChangedCells('dirty');
    if (rows != null && rows.length > 0)
      // Send the update to the server
      $.ajax({
          url: location.pathname,
          data: JSON.stringify(rows),
          type: "POST",
          contentType: "application/json",
          success: function () {
            upload.undo();
            },
          error: function (result, stat, errorThrown) {
            $('#popup').html(result.responseText)
              .dialog({
                title: gettext("Error saving data"),
                autoOpen: true,
                resizable: false,
                width: 'auto',
                height: 'auto'
              });
            $('#timebuckets').dialog('close');
            $.jgrid.hideModal("#searchmodfbox_grid");
            }
        });
  },

  validateSort: function(event)
  {
    if ($(this).attr('id') == 'grid_cb') return;
    if ($('#save').hasClass("ui-state-disabled"))
      jQuery("#grid").jqGrid('resetSelection');
    else
    {
      $('#popup').html("")
        .dialog({
          title: gettext("Save or cancel your changes first"),
          autoOpen: true,
          resizable: false,
          width: 'auto',
          height: 'auto',
          buttons: [
            {
              text: gettext("Save"),
              click: function() {
                upload.save();
                $('#popup').dialog('close');
                }
            },
            {
              text: gettext("Cancel"),
              click: function() {
                upload.undo();
                $('#popup').dialog('close');
                }
            }
            ]
        });
      event.stopPropagation();
    }
  }
}


//----------------------------------------------------------------------------
// Custom formatter functions for the grid cells. Most of the custom handlers
// just add an appropriate context menu.
//----------------------------------------------------------------------------

function linkunformat (cellvalue, options, cell) {
  return cellvalue;
}

jQuery.extend($.fn.fmatter, {
  percentage : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    return cellvalue + "%";
  },
  item : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='item'></span>";
  },
  customer : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='customer'></span>";
  },
  buffer : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='buffer'></span>";
  },
  resource : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='resource'></span>";
  },
  forecast : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='forecast'></span>";
  },
  demand : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='demand'></span>";
  },
  operation : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='operation'></span>";
  },
  calendar : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='calendar'></span>";
  },
  calendarbucket : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='calendarbucket'></span>";
  },
  location : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='location'></span>";
  },
  setupmatrix : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='setupmatrix'></span>";
  },
  user : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='user'></span>";
  },
  group : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='group'></span>";
  },
  flow : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='flow'></span>";
  },
  load : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='load'></span>";
  },
  bucket : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='bucket'></span>";
  },
  parameter : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='parameter'></span>";
  },
  skill : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='skill'></span>";
  },
  resourceskill : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='resourceskill'></span>";
  },
  project : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='project'></span>";
  },
  projectdeel : function(cellvalue, options, rowdata) {
    if (cellvalue === undefined || cellvalue ==='') return '';
    if (options['colModel']['popup']) return cellvalue;
    return cellvalue + "<span class='context ui-icon ui-icon-triangle-1-e' role='projectdeel'></span>";
  },
  graph : function (cellvalue, options, rowdata) {
    return '<div class="graph"></div>';
  }
});
jQuery.extend($.fn.fmatter.percentage, {
    unformat : function(cellvalue, options, cell) {
      return cellvalue;
      }
});
jQuery.extend($.fn.fmatter.item, {
    unformat : linkunformat
});
jQuery.extend($.fn.fmatter.buffer, {
    unformat : linkunformat
});
jQuery.extend($.fn.fmatter.resource, {
    unformat : linkunformat
});
jQuery.extend($.fn.fmatter.forecast, {
    unformat : linkunformat
});
jQuery.extend($.fn.fmatter.customer, {
    unformat : linkunformat
});
jQuery.extend($.fn.fmatter.operation, {
    unformat : linkunformat
});
jQuery.extend($.fn.fmatter.demand, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.location, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.calendar, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.setupmatrix, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.user, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.group, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.flow, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.load, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.bucket, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.parameter, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.skill, {
  unformat : linkunformat
});
jQuery.extend($.fn.fmatter.resourceskill, {
  unformat : linkunformat
});


//
// Functions related to jqgrid
//

var grid = {

   // Popup row selection.
   // The popup window present a list of objects. The user clicks on a row to
   // select it and a "select" button appears. When this button is clicked the
   // popup is closed and the selected id is passed to the calling page.
   selected: undefined,

   setSelectedRow: function(id)
   {
     if (grid.selected != undefined)
       $(this).jqGrid('setCell', selected, 'select', null);
     grid.selected = id;
     $(this).jqGrid('setCell', id, 'select', '<button onClick="opener.dismissRelatedLookupPopup(window, grid.selected);" class="ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all"><span class="ui-button-text" style="font-size:66%">'+gettext('Select')+'</span></button>');
   },

  // Renders the cross list in a pivot grid
  pivotcolumns : function  (cellvalue, options, rowdata)
  {
    var result = '';
    for (i in cross)
    {
      if (result != '') result += '<br/>';
      result += cross[i]['name'];
    }
    return result;
  },

  //This function is called when a cell is just being selected in an editable
  //grid. It is used to either a) select the content of the cell (to make
  //editing it easier) or b) display a date picker it the field is of type
  //date.
  afterEditCell: function (rowid, cellname, value, iRow, iCol)
  {
  var cell = document.getElementById(iRow+'_'+cellname);
  var colmodel = jQuery("#grid").jqGrid ('getGridParam', 'colModel')[iCol];
  if (colmodel.formatter == 'date')
  {
    if (colmodel.formatoptions['srcformat'] == "Y-m-d")
      $(cell).datepicker({
        showOtherMonths: true, selectOtherMonths: true,
        dateFormat: "yy-mm-dd", changeMonth:true,
        changeYear:true, yearRange: "c-1:c+5"
        });
    else
      $(cell).datepicker({
        showOtherMonths: true, selectOtherMonths: true,
        dateFormat: "yy-mm-dd 00:00:00", changeMonth:true,
        changeYear:true, yearRange: "c-1:c+5"
        });
  }
  else
    $(cell).select();
  },

  // Display dialog for exporting CSV-files
  showExport: function(only_list)
  {
    // The argument is true when we show a "list" report.
    // It is false for "table" reports.
    if (only_list)
      $('#popup').html(
        gettext("Export format") + '&nbsp;&nbsp;:&nbsp;&nbsp;<select name="csvformat" id="csvformat">' +
        '<option value="spreadsheetlist" selected="selected">' + gettext("Spreadsheet list") + '</option>' +
        '<option value="csvlist">' + gettext("CSV list") +'</option></select>'
        );
    else
        $('#popup').html(
        gettext("Export format") + '&nbsp;&nbsp;:&nbsp;&nbsp;<select name="csvformat" id="csvformat">' +
        '<option value="spreadsheettable" selected="selected">' + gettext("Spreadsheet table") + '</option>' +
        '<option value="spreadsheetlist">' + gettext("Spreadsheet list") + '</option>' +
        '<option value="csvtable">' + gettext("CSV table") +'</option>'+
        '<option value="csvlist">' + gettext("CSV list") +'</option></select>'
        );
    $('#popup').dialog({
        title: gettext("Export data"),
        autoOpen: true, resizable: false, width: 390, height: 'auto',
        buttons: [
          {
            text: gettext("Export"),
            click: function() {
              // Fetch the report data
              var url = (location.href.indexOf("#") != -1 ? location.href.substr(0,location.href.indexOf("#")) : location.href);
              if (location.search.length > 0)
                // URL already has arguments
                url += "&format=" + $('#csvformat').val();
              else if (url.charAt(url.length - 1) == '?')
                // This is the first argument for the URL, but we already have a question mark at the end
                url += "format=" + $('#csvformat').val();
    else
                // This is the first argument for the URL
                url += "?format=" + $('#csvformat').val();
              // Append current filter and sort settings to the URL
              var postdata = $("#grid").jqGrid('getGridParam', 'postData');
              url +=  "&" + jQuery.param(postdata);
              // Open the window
              window.open(url,'_blank');
              $('#popup').dialog().dialog('close');
    }
          },
    {
            text: gettext("Cancel"),
            click: function() { $(this).dialog("close"); }
    }
          ]
  });
    $('#timebuckets').dialog().dialog('close');
    $.jgrid.hideModal("#searchmodfbox_grid");
  },

  // Display time bucket selection dialog
  showBucket: function()
  {
    // Show popup
    $('#popup').dialog().dialog('close');
    $.jgrid.hideModal("#searchmodfbox_grid");
    $( "#horizonstart" ).datepicker({
        showOtherMonths: true, selectOtherMonths: true,
        changeMonth:true, changeYear:true, yearRange: "c-1:c+5", dateFormat: 'yy-mm-dd'
    });
    $( "#horizonend" ).datepicker({
        showOtherMonths: true, selectOtherMonths: true,
        changeMonth:true, changeYear:true, yearRange: "c-1:c+5", dateFormat: 'yy-mm-dd'
  });
    $('#timebuckets').dialog({
       autoOpen: true, resizable: false, width: 390,
       buttons: [
  {
           text: gettext("OK"),
           click: function() {
            // Compare old and new parameters
            var params = $('#horizonbuckets').val() + '|' +
              $('#horizonstart').val() + '|' +
              $('#horizonend').val() + '|' +
              ($('#horizontype').is(':checked') ? "True" : "False") + '|' +
              $('#horizonlength').val() + '|' +
              $('#horizonunit').val();
            if (params == $('#horizonoriginal').val())
              // No changes to the settings. Close the popup.
              $(this).dialog('close');
            else {
              // Ajax request to update the horizon preferences
              $.ajax({
                  type: 'POST',
                  url: '/horizon/',
                  data: {
                    horizonbuckets: $('#horizonbuckets').val(),
                    horizonstart: $('#horizonstart').val(),
                    horizonend: $('#horizonend').val(),
                    horizontype: ($('#horizontype').is(':checked') ? '1' : '0'),
                    horizonlength: $('#horizonlength').val(),
                    horizonunit: $('#horizonunit').val()
                    },
                  dataType: 'text/html',
                  async: false  // Need to wait for the update to be processed!
                });
            // Reload the report
            window.location.href = window.location.href;
  }
    }
         },
    {
           text: gettext("Cancel"),
           click: function() { $(this).dialog("close"); }
      }
         ]
      });
  },

  //Display dialog for copying or deleting records
  showDelete : function()
  {
  if ($('#delete_selected').hasClass("ui-state-disabled")) return;
  var sel = jQuery("#grid").jqGrid('getGridParam','selarrrow');
  if (sel.length == 1)
  {
    // Redirect to a page for deleting a single entity
    location.href = location.pathname + encodeURI(sel[0]) + '/delete/';
  }
  else if (sel.length > 0)
  {
    $('#popup').html(
      interpolate(gettext('You are about to delete %s objects AND ALL RELATED RECORDS!'), [sel.length], false)
      ).dialog({
        title: gettext("Delete data"),
        autoOpen: true,
        resizable: false,
        width: 'auto',
        height: 'auto',
        buttons: [
          {
            text: gettext("Confirm"),
            click: function() {
              $.ajax({
                url: location.pathname,
                data: JSON.stringify([{'delete': sel}]),
                type: "POST",
                contentType: "application/json",
                success: function () {
                  $("#delete_selected").addClass("ui-state-disabled").removeClass("bold");
                  $("#copy_selected").addClass("ui-state-disabled").removeClass("bold");
                  $('.cbox').prop("checked", false);
                  $('#cb_grid.cbox').prop("checked", false);
                  $("#grid").trigger("reloadGrid");
                  $('#popup').dialog('close');
                  },
                error: function (result, stat, errorThrown) {
                  $('#popup').html(result.responseText)
                    .dialog({
                      title: gettext("Error deleting data"),
                      autoOpen: true,
                      resizable: true,
                      width: 'auto',
                      height: 'auto'
                    });
                  $('#timebuckets').dialog('close');
                  $.jgrid.hideModal("#searchmodfbox_grid");
                  }
              });
            }
          },
          {
            text: gettext("Cancel"),
            click: function() { $(this).dialog("close"); }
          }
          ]
      });
    $('#timebuckets').dialog().dialog('close');
    $.jgrid.hideModal("#searchmodfbox_grid");
  }
  },

  showCopy: function()
  {
  if ($('#copy_selected').hasClass("ui-state-disabled")) return;
  var sel = jQuery("#grid").jqGrid('getGridParam','selarrrow');
  if (sel.length > 0)
  {
    $('#popup').html(
      interpolate(gettext('You are about to duplicate %s objects'), [sel.length], false)
      ).dialog({
        title: gettext("Copy data"),
        autoOpen: true,
        resizable: false,
        width: 'auto',
        height: 'auto',
        buttons: [
          {
            text: gettext("Confirm"),
            click: function() {
              $.ajax({
                url: location.pathname,
                data: JSON.stringify([{'copy': sel}]),
                type: "POST",
                contentType: "application/json",
                success: function () {
                  $("#delete_selected").addClass("ui-state-disabled").removeClass("bold");
                  $("#copy_selected").addClass("ui-state-disabled").removeClass("bold");
                  $('.cbox').prop("checked", false);
                  $('#cb_grid.cbox').prop("checked", false);
                  $("#grid").trigger("reloadGrid");
                  $('#popup').dialog().dialog('close');
                  },
                error: function (result, stat, errorThrown) {
                  $('#popup').html(result.responseText)
                    .dialog({
                      title: gettext("Error copying data"),
                      autoOpen: true,
                      resizable: true,
                      width: 'auto',
                      height: 'auto'
                    });
                  $('#timebuckets').dialog().dialog('close');
                  $.jgrid.hideModal("#searchmodfbox_grid");
                  }
              });
             }
           },
           {
             text: gettext("Cancel"),
             click: function() { $(this).dialog("close"); }
           }
           ]
       });
     $('#timebuckets').dialog().dialog('close');
     $.jgrid.hideModal("#searchmodfbox_grid");
   }
  },

  // Display filter dialog
  showFilter: function()
  {
    if ($('#filter').hasClass("ui-state-disabled")) return;
    $('#timebuckets,#popup').dialog().dialog('close');
    jQuery("#grid").jqGrid('searchGrid', {
      closeOnEscape: true,
      multipleSearch:true,
      multipleGroup:true,
      overlay: 0,
      sopt: ['eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en','cn','nc'],
      onSearch : function() {
        var s = jQuery("#fbox_grid").jqFilter('toSQLString');
        if (s) $('#curfilter').html(gettext("Filtered where") + " " + s);
        else $('#curfilter').html("");
        },
      onReset : function() {
        if (initialfilter != '') $('#curfilter').html(gettext("Filtered where") + " " + jQuery("#fbox_grid").jqFilter('toSQLString'));
        else $('#curfilter').html("");
        }
      });
  },

  markSelectedRow: function(id)
  {
    var sel = jQuery("#grid").jqGrid('getGridParam','selarrrow').length;
    if (sel > 0)
    {
      $("#copy_selected").removeClass("ui-state-disabled").addClass("bold");
      $("#delete_selected").removeClass("ui-state-disabled").addClass("bold");
    }
    else
    {
      $("#copy_selected").addClass("ui-state-disabled").removeClass("bold");
      $("#delete_selected").addClass("ui-state-disabled").removeClass("bold");
    }
  },

  markAllRows: function()
  {
    if ($(this).is(':checked'))
    {
      $("#copy_selected").removeClass("ui-state-disabled").addClass("bold");
      $("#delete_selected").removeClass("ui-state-disabled").addClass("bold");
      $('.cbox').prop("checked", true);
    }
    else
    {
      $("#copy_selected").addClass("ui-state-disabled").removeClass("bold");
      $("#delete_selected").addClass("ui-state-disabled").removeClass("bold");
      $('.cbox').prop("checked", false);
    }
  }
}





//----------------------------------------------------------------------------
// Code for customized autocomplete widget.
// The customization creates unselectable categories and selectable list
// items.
//----------------------------------------------------------------------------

$.widget( "custom.catcomplete", $.ui.autocomplete, {
  _renderItem: function( ul, item) {
    if (item.value == undefined)
      return $( "<li class='ui-autocomplete-category'>" + item.label + "</li>" ).appendTo( ul );
    else
      return $( "<li></li>" )
      .data( "item.autocomplete", item )
      .append( $( "<a></a>" ).text( item.value ) )
      .appendTo( ul );
  },



});


//----------------------------------------------------------------------------
// Code for handling the menu bar, context menu and active button.
//----------------------------------------------------------------------------

var activeButton = null;
var contextMenu = null;

$(function() {

  // Install code executed when you click on a menu button
  $(".menuButton").click( function(event) {
    // Get the target button element
    var button = $(event.target);
    var menu = button.next("div");

    // Blur focus from the link to remove that annoying outline.
    button.blur();

    // Reset the currently active button, if any.
    if (activeButton) {
      activeButton.removeClass("menuButtonActive");
      activeButton.next("div").css('visibility', "hidden");
    }

    // Activate this button, unless it was the currently active one.
    if (button != activeButton)
    {
      // Update the button's style class to make it look like it's depressed.
      button.addClass("menuButtonActive");

      // Position the associated drop down menu under the button and show it.
      var pos = button.position();
      menu.css({
        left: pos.left + "px",
        top: (pos.top + button.outerHeight() + 3) + "px",
        visibility: "visible"
        });
      activeButton = button;
    }
    else
      activeButton = null;
  });

  $('.menuButton').mouseenter( function(event) {
    // If another button menu is active and we move the mouse into a new menu button,
    // we make this one active instead.
    if (activeButton != null && activeButton != $(event.target))
      $(event.target).click();
  });

  // Send django's CRSF token with every POST request to the same site
  $(document).ajaxSend(function(event, xhr, settings) {
    if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && sameOrigin(settings.url))
      xhr.setRequestHeader("X-CSRFToken", getToken());
    });

  // Never cache ajax results
  $.ajaxSetup({ cache: false });

  // Autocomplete search functionality
  var database = $('#database').val();
  database = (database===undefined || database==='default') ? '' : '/' + database;
  $("#search").catcomplete({
    source: database + "/search/",
    minLength: 2,
    select: function( event, ui ) {
      window.location.href = database + "/data/" + ui.item.app + '/' + ui.item.label + "/" + ui.item.value + "/";
    }
  });

});


// Capture mouse clicks on the page so any active menu can be deactivated.
$(document).mousedown(function (event) {

  if (contextMenu && $(event.target).parent('.ui-menu-item').length < 1)
          {
    // Hide any context menu
    contextMenu.css('display', 'none');
    contextMenu = null;
  }

  // We clicked on a context menu. Display that now.
  if ($(event.target).hasClass('context'))
  {
    // Find the id of the menu to display
    contextMenu = $('#' + $(event.target).attr('role') + "context");

    // Get the entity name. Unescape all escaped characters and urlencode the result.
    if ($(event.target).hasClass('cross'))
    {
      var item = $(event.target).closest("tr.jqgrow")[0].id;
      item = encodeURIComponent(item.replace(/&amp;/g,'&').replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\//g,"_2F"));
      var params = jQuery("#grid").jqGrid ('getGridParam', 'colModel')[jQuery.jgrid.getCellIndex($(event.target).closest("td,th"))];
      params['value'] = item;
  }
  else
  {
      var item = $(event.target).parent().text();
      item = encodeURIComponent(item.replace(/&amp;/g,'&').replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\//g,"_2F"));
      var params = {value: item};
  }

    // Build the URLs for the menu
    contextMenu.find('a').each( function() {
      $(this).attr('href', $(this).attr('id').replace(/{\w+}/g, function(match, number) {
      var key = match.substring(1,match.length-1);
      return key in params ? params[key] : match;
  }
      ))
    });

    // Display the menu at the right location
    $(contextMenu).css({
      left: event.pageX,
      top: event.pageY,
      display: 'block'
      });
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // If there is no active button, exit.
  if (!activeButton || event.target == activeButton) return;

  // If the element is not part of a menu, hide the menu
  if ($(event.target).parent('.ui-menu-item').length < 1) {
    activeButton.removeClass("menuButtonActive");
    activeButton.next("div").css('visibility', "hidden");
    activeButton = null;
  }
});


//----------------------------------------------------------------------------
// Return the value of the csrf-token
//----------------------------------------------------------------------------

function getToken()
{
  var allcookies = document.cookie.split(';');
  for ( i = allcookies.length; i >= 0; i-- )
    if (jQuery.trim(allcookies[i]).indexOf("csrftoken=") == 0)
      return jQuery.trim(jQuery.trim(allcookies[i]).substr(10));
  return 'none';
}


//----------------------------------------------------------------------------
// Check whether a URL is on the same domain as the current location or not.
// We use it to avoid send the CSRF-token to ajax requests submitted to other
// sites - for security reasons.
//----------------------------------------------------------------------------

function sameOrigin(url) {
    // URL could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}


//----------------------------------------------------------------------------
// Display import dialog for CSV-files
//----------------------------------------------------------------------------

function import_show(url)
{
  $('#popup').html(
    '<form id="uploadform" enctype="multipart/form-data" method="post" action="'
    + (typeof(url) != 'undefined' ? url : '') + '">' +
    '<input type="hidden" name="csrfmiddlewaretoken" value="' + getToken() + '"/>' +
    gettext('Load a CSV-formatted text file.') + '<br/>' +
    gettext('The first row should contain the field names.') + '<br/><br/>' +
    '<input type="checkbox" name="erase" value="yes"/>&nbsp;&nbsp;' + gettext('First delete all existing records AND ALL RELATED TABLES') + '<br/><br/>' +
    gettext('Data file') + ':<input type="file" id="csv_file" name="csv_file"/></form>'
    ).dialog({
      title: gettext("Import data"),
      autoOpen: true, resizable: false, width: 390, height: 'auto',
      buttons: [
        {
          text: gettext("Import"),
          click: function() { if ($("#csv_file").val() != "") $("#uploadform").submit(); }
        },
        {
          text: gettext("Cancel"),
          click: function() { $(this).dialog("close"); }
        }
        ]
      });
  $('#timebuckets').dialog().dialog('close');
  $.jgrid.hideModal("#searchmodfbox_grid");
}

//----------------------------------------------------------------------------
// This function returns all arguments in the current URL as a dictionary.
//----------------------------------------------------------------------------

function getURLparameters()
{

  if (window.location.search.length == 0) return {};
  var params = {};
  jQuery.each(window.location.search.match(/^\??(.*)$/)[1].split('&'), function(i,p){
    p = p.split('=');
    p[1] = unescape(p[1]).replace(/\+/g,' ');
    params[p[0]] = params[p[0]]?((params[p[0]] instanceof Array)?(params[p[0]].push(p[1]),params[p[0]]):[params[p[0]],p[1]]):p[1];
  });
  return params;
}


//----------------------------------------------------------------------------
// Functions to convert units for the duration fields
//----------------------------------------------------------------------------

var _currentunits = null;

var _factors = {
  'seconds': 1,
  'minutes': 60,
  'hours': 3600,
  'days': 86400,
  'weeks': 604800
};

function getUnits(unitselector)
{
  _currentunits = unitselector.value;
}

function setUnits(unitselector)
{
  var field = $(unitselector).previous();
  if (field.value && _currentunits!="" && unitselector.value!="")
  {
    var val = parseFloat(field.value);
    val *= _factors[_currentunits];
    val /= _factors[unitselector.value];
    field.value = val;
  }
  _currentunits = unitselector.value;
}


//----------------------------------------------------------------------------
// Dropdown list to select the model.
//----------------------------------------------------------------------------

function selectDatabase()
{
  // Find new database and current database
  var el = $('#database');
  var db = el.val();
  var cur = el.attr('name');
  // Change the location
  if (cur == db)
    return;
  else if (cur == 'default')
    window.location.href = window.location.href.replace(window.location.pathname, "/"+db+window.location.pathname);
  else if (db == 'default')
    window.location.href = window.location.href.replace("/"+cur+"/", "/");
  else
    window.location.href = window.location.href.replace("/"+cur+"/", "/"+db+"/");
}


//----------------------------------------------------------------------------
// Jquery utility function to bind an event such that it fires first.
//----------------------------------------------------------------------------

$.fn.bindFirst = function(name, fn) {
    // bind as you normally would
    // don't want to miss out on any jQuery magic
    this.on(name, fn);

    // Thanks to a comment by @Martin, adding support for
    // namespaced events too.
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        // take out the handler we just inserted from the end
        var handler = handlers.pop();
        // move it at the beginning
        handlers.splice(0, 0, handler);
    });
};


//
// Gantt chart functions
//

var gantt = {

  // Used to follow the mous when dragging the timeline
  startmousemove: null,
  resizing: null,

  // Height of the blocks
  rowsize: 25,

  header : function ()
  {
    // "scaling" stores the number of pixels available to show a day.
    var scaling = 86400000 / (viewend.getTime() - viewstart.getTime()) * $("#jqgh_grid_operationplans").width();
    var result = [
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="34px">',
      '<line class="time" x1="0" y1="17" x2="' + $("#jqgh_grid_operationplans").width() + '" y2="17"/>'
      ];
    var x = 0;
    if (scaling < 5)
    {
      // Quarterly + monthly buckets
      var bucketstart = new Date(viewstart.getFullYear(), viewstart.getMonth(), 1);
      while (bucketstart < viewend)
      {
        x1 = (bucketstart.getTime() - viewstart.getTime()) / 86400000 * scaling;
        bucketend = new Date(bucketstart.getFullYear(), bucketstart.getMonth()+1, 1);
        x2 = (bucketend.getTime() - viewstart.getTime()) / 86400000 * scaling;
        result.push('<text class="svgheadertext" x="' + Math.floor((x1+x2)/2) + '" y="31">' + $.datepicker.formatDate("M", bucketstart) + '</text>');
            if (bucketstart.getMonth() % 3 == 0)
            {
            quarterend = new Date(bucketstart.getFullYear(), bucketstart.getMonth()+3, 1);
            x2 = (quarterend.getTime() - viewstart.getTime()) / 86400000 * scaling;
            quarter = Math.floor((bucketstart.getMonth()+3)/3);
          result.push('<line class="time" x1="' + Math.floor(x1) + '" y1="0" x2="' + Math.floor(x1) + '" y2="34"/>');
          result.push('<text class="svgheadertext" x="' + Math.floor((x1+x2)/2) + '" y="13">' + bucketstart.getFullYear() + " Q" + quarter + '</text>');
            }
            else
          result.push('<line class="time" x1="' + Math.floor(x1) + '" y1="17" x2="' + Math.floor(x1) + '" y2="34"/>');
        bucketstart = bucketend;
      }
    }
    else if (scaling < 10)
    {
      // Monthly + weekly buckets, short style
      x -= viewstart.getDay() * scaling;
      var bucketstart = new Date(viewstart.getTime() - 86400000 * viewstart.getDay());
      while (bucketstart < viewend)
      {
        result.push('<line class="time" x1="' + Math.floor(x) + '" y1="17" x2="' + Math.floor(x) + '" y2="34"/>');
        result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling*3.5) + '" y="31">' + $.datepicker.formatDate("mm-dd", bucketstart) + '</text>');
        x = x + scaling*7;
        bucketstart.setTime(bucketstart.getTime() + 86400000 * 7);
      }
      bucketstart = new Date(viewstart.getFullYear(), viewstart.getMonth(), 1);
      while (bucketstart < viewend)
      {
        x1 = (bucketstart.getTime() - viewstart.getTime()) / 86400000 * scaling;
        bucketend = new Date(bucketstart.getFullYear(), bucketstart.getMonth()+1, 1);
        x2 = (bucketend.getTime() - viewstart.getTime()) / 86400000 * scaling;
        result.push('<line class="time" x1="' + Math.floor(x1) + '" y1="0" x2="' + Math.floor(x1) + '" y2="17"/>');
        result.push('<text class="svgheadertext" x="' + Math.floor((x1+x2)/2) + '" y="13">' + $.datepicker.formatDate("M yy", bucketstart) + '</text>');
        bucketstart = bucketend;
      }
    }
    else if (scaling < 20)
    {
      // Monthly + weekly buckets, long style
      x -= viewstart.getDay() * scaling;
      var bucketstart = new Date(viewstart.getTime() - 86400000 * viewstart.getDay());
      while (bucketstart < viewend)
      {
        result.push('<line class="time" x1="' + Math.floor(x) + '" y1="17" x2="' + Math.floor(x) + '" y2="34"/>');
        result.push('<text class="svgheadertext" x="' + (x + scaling*7.0/2.0) + '" y="31">' + $.datepicker.formatDate("yy-mm-dd", bucketstart) + '</text>');
        x = x + scaling*7.0;
        bucketstart.setTime(bucketstart.getTime() + 86400000 * 7);
      }
      bucketstart = new Date(viewstart.getFullYear(), viewstart.getMonth(), 1);
      while (bucketstart < viewend)
      {
        x1 = (bucketstart.getTime() - viewstart.getTime()) / 86400000 * scaling;
        bucketend = new Date(bucketstart.getFullYear(), bucketstart.getMonth()+1, 1);
        x2 = (bucketend.getTime() - viewstart.getTime()) / 86400000 * scaling;
        result.push('<line class="time" x1="' + Math.floor(x1) + '" y1="0" x2="' + Math.floor(x1) + '" y2="17"/>');
        result.push('<text class="svgheadertext" x="' + Math.floor((x1+x2)/2) + '" y="13">' + $.datepicker.formatDate("M yy", bucketstart) + '</text>');
        bucketstart = bucketend;
      }
    }
    else if (scaling <= 40)
    {
      // Weekly + daily buckets, short style
      var bucketstart = new Date(viewstart.getTime());
      while (bucketstart < viewend)
      {
        if (bucketstart.getDay() == 0)
        {
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="0" x2="' + Math.floor(x) + '" y2="34"/>');
          result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling*7/2) + '" y="13">' + $.datepicker.formatDate("yy-mm-dd", bucketstart) + '</text>');
        }
        else
        {
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="17" x2="' + Math.floor(x) + '" y2="34"/>');
        }
        result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling/2) + '" y="31">' + $.datepicker.formatDate("d", bucketstart) + '</text>');
        x = x + scaling;
        bucketstart.setDate(bucketstart.getDate()+1);
      }
    }
    else if (scaling <= 75)
    {
      // Weekly + daily buckets, long style
      var bucketstart = new Date(viewstart.getTime());
      while (bucketstart < viewend)
      {
        if (bucketstart.getDay() == 0)
        {
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="0" x2="' + Math.floor(x) + '" y2="34"/>');
          result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling*7/2) + '" y="13">' + $.datepicker.formatDate("yy-mm-dd", bucketstart) + '</text>');
        }
        else
        {
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="17" x2="' + Math.floor(x) + '" y2="34"/>');
        }
        result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling/2) + '" y="31">' + $.datepicker.formatDate("dd M", bucketstart) + '</text>');
        x = x + scaling;
        bucketstart.setDate(bucketstart.getDate()+1);
      }
    }
    else if (scaling < 350)
    {
      // Weekly + daily buckets, very long style
      var bucketstart = new Date(viewstart.getTime());
      while (bucketstart < viewend)
      {
        if (bucketstart.getDay() == 0)
        {
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="0" x2="' + Math.floor(x) + '" y2="34"/>');
          result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling*3.5) + '" y="13">' + $.datepicker.formatDate("yy-mm-dd", bucketstart) + '</text>');
        }
        else
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="17" x2="' + Math.floor(x) + '" y2="34"/>');
        result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling/2) + '" y="31">' + $.datepicker.formatDate("D dd M", bucketstart) + '</text>');
        x = x + scaling;
        bucketstart.setDate(bucketstart.getDate()+1);
      }
    }
    else
    {
      // Daily + hourly buckets
      var bucketstart = new Date(viewstart.getTime());
      while (bucketstart < viewend)
      {
        if (bucketstart.getHours() == 0)
        {
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="0" x2="' + Math.floor(x) + '" y2="34"/>');
          result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling/2) + '" y="13">' + $.datepicker.formatDate("D yy-mm-dd", bucketstart) + '</text>');
        }
        else
          result.push('<line class="time" x1="' + Math.floor(x) + '" y1="17" x2="' + Math.floor(x) + '" y2="34"/>');
        result.push('<text class="svgheadertext" x="' + Math.floor(x + scaling/48) + '" y="31">' + bucketstart.getHours() + '</text>');
        x = x + scaling/24;
        bucketstart.setTime(bucketstart.getTime() + 3600000);
      }
    }
    result.push( '</svg>' );
    $("#jqgh_grid_operationplans")
       .html(result.join(''))
       .unbind('mousedown')
       .bind('mousedown', function(event) {
          gantt.startmousemove = event.pageX;
          $(window).bind('mouseup', function(event) {
            $(window).unbind('mousemove');
            $(window).unbind('mouseup');
            event.stopPropagation();
            })
          $(window).bind('mousemove', function(event) {
            var delta = event.pageX - gantt.startmousemove;
            if (Math.abs(delta) > 3)
            {
              gantt.zoom(1, delta > 0 ? -86400000 : 86400000);
              gantt.startmousemove = event.pageX;
            }
            event.stopPropagation();
          });
          event.stopPropagation();
         });
  },

  reset: function()
  {
    var scale = $("#jqgh_grid_operationplans").width() / 10000;
    viewstart = new Date(horizonstart.getTime());
    viewend = new Date(horizonend.getTime());
    $('.transformer').each(function() {
      var layers = $(this).attr("title");
      $(this).attr("transform", "scale(" + scale + ",1) translate(0," + ((layers-1)*gantt.rowsize+3) + ")");
      });
    gantt.header();
  },

  redraw: function()
  {
    // Determine the conversion between svg units and the screen
    var scale = (horizonend.getTime() - horizonstart.getTime())
       / (viewend.getTime() - viewstart.getTime())
       * $("#jqgh_grid_operationplans").width() / 10000;
    $('.transformer').each(function() {
      var layers = $(this).attr("title");
      $(this).attr("transform", "scale(" + scale + ",1) translate(0," + ((layers-1)*gantt.rowsize+3) + ")");
      });
    gantt.header();
  },

  zoom: function(zoom_in_or_out, move_in_or_out)
  {
    // Determine the window to be shown. Min = 1 day. Max = 3 years.
    var delta = Math.min(1095,Math.max(1,Math.ceil((viewend.getTime() - viewstart.getTime()) / 86400000.0 * zoom_in_or_out)));
    // Determine the start and end date global variables.
    viewstart.setTime(viewstart.getTime() + move_in_or_out);
    viewend.setTime(viewstart.getTime() + delta * 86400000);
    // Determine the conversion between svg units and the screen
    var scale = (horizonend.getTime() - horizonstart.getTime()) / (delta * 864000000) * $("#jqgh_grid_operationplans").width() / 1000;
    var offset = (horizonstart.getTime() - viewstart.getTime()) / (horizonend.getTime() - horizonstart.getTime()) * 10000;
    // Transform all svg elements
    $('.transformer').each(function() {
      var layers = $(this).attr("title");
      $(this).attr("transform", "scale(" + scale + ",1) translate(" + offset + "," + ((layers-1)*gantt.rowsize+3) + ")");
      });
    // Redraw the header
    gantt.header();
  }
}


var tour = {

  autoplay: 0,
  tooltip: null,
  chapter: 0,
  step: 0,
  timeout: null,


  start: function (args)
  {
    // Parse the arguments
    var splitargs = args.split(",");
    tour.chapter = parseInt(splitargs[0]);
    tour.step = parseInt(splitargs[1]);
    tour.autoplay = parseInt(splitargs[2]);
    // Load and execute the tutorial
    jQuery.ajax( {
        url: "/static/js/i18n/tour.en.js",
        dataType: "script",
        cache: true
      })
      .success( tour.init )
      .fail( function() {
        console.log('Error loading the tutorial: ' + arguments[2].toString());
      });
  },

  init: function()
  {
     // Display the main dialog of the tour
     $("body").append( '<div id="tour" style="padding-bottom:20px; display:none">' + tourdata[tour.chapter]['description']  + '<br/><br/><br/></div>')
     $("#tour").dialog({
      title: gettext("Guided tour"),
      autoOpen: true,
      resizable: false,
      width: 390,
      height: 'auto',
      position: "right bottom",
      modal: false,
      dialogClass: "tourguide",
      close: function() {
          $('#tour').remove();
          $('#tourtooltip').remove();
          tour.tooltip.css({ 'display' : 'none' }).html('');
          tour.chapter = 0;
          tour.step = 0;
          tour.autoplay = false;
          if (tour.timeout)
          {
            clearTimeout(tour.timeout);
            tour.timeout = null;
          }
        },
      buttons: [
        {
          id: "tourprevious",
          text: gettext("Previous"),
          icons: { primary: "ui-icon-seek-prev" },
          click: tour.prev
        },
        {
          text: (tour.autoplay != 0) ? gettext("Stop") : gettext("Play"),
          icons: { primary: (tour.autoplay != 0) ? "ui-icon-pause" : "ui-icon-play" },
          click: tour.toggleAutoplay
        },
        {
          id: "tournext",
          text: gettext("Next"),
          icons: { primary: "ui-icon-seek-next" },
          click: tour.next
        }
        ]
      });

     // Create the tooltip
     tour.tooltip = $('<div>',{id:'tourtooltip', class:'tourtooltip ui-dialog ui-widget ui-widget-content ui-corner-all ui-front', html:''}).css({
       'display'     : 'none'
     });
     $("body").append(tour.tooltip);

     // Show the first step
     tour.showStep();
  },

  next: function()
  {
    tour.step++;
    if (tour.step >= tourdata[tour.chapter]['steps'].length)
    {
      tour.chapter++;
      if (tour.chapter < tourdata.length)
        tour.step = 0;
      else if (tour.autoplay == 2)
      {
        // Restart from the beginning
        tour.step = 0;
        tour.chapter = 0;
      }
      else
      {
        // Stop at the last step
        if (tour.autoplay == 1) tour.toggleAutoplay();
        tour.chapter--;
        tour.step--;
        return;
      }
    }
    tour.showStep();
  },

  prev: function()
  {
    tour.step--;
    if (tour.step < 0)
    {
      tour.chapter--;
      if (tour.chapter < 0)
      {
        // Stay at the very first step
        tour.step = 0;
        tour.chapter = 0;
        return;
      }
      else
        tour.step = tourdata[tour.chapter]['steps'].length - 1;
    }
    tour.showStep();
  },

  showStep: function()
  {
    var stepData = tourdata[tour.chapter]['steps'][tour.step];
    // Switch url if required
    var prefix = $('#database').attr('name');
    console.log(prefix);
    if (prefix && prefix != "default")
    {
      if (location.pathname != "/" + prefix + stepData['url'])
      {
        window.location.href = "/" + prefix + stepData['url'] + "?tour=" + tour.chapter + "," + tour.step + "," + tour.autoplay;
        return;
      }
    }
    else
    {
      if (location.pathname != stepData['url'])
      {
        window.location.href = stepData['url'] + "?tour=" + tour.chapter + "," + tour.step + "," + tour.autoplay;
        return;
      }
    }
    // Callback
    if ('beforestep' in stepData)
      eval(stepData['beforestep']);
    // Display the tooltip
    var element = $(stepData['element']);
    tour.tooltip.html(stepData['description']);
    var tooltipPos = (typeof stepData.position == 'undefined') ? 'BL' : stepData['position'];
    var pos = tour.getTooltipPosition(tooltipPos, element);
    tour.tooltip.css({ 'top': pos.top+'px', 'left': pos.left+'px' });
    tour.tooltip.show('fast');
    // Update tour dialog
    $('#tour').html(tourdata[tour.chapter]['description'] + '<br/><br/>' + (tour.step+1) + " " + gettext("out of") + " " + tourdata[tour.chapter]['steps'].length);
    // Previous button
    if (tour.chapter == 0 && tour.step == 0)
      $("#tourprevious").button("disable");
    else
      $("#tourprevious").button("enable");
    // Next button
    if ((tour.chapter >= tourdata.length-1) && (tour.step >= tourdata[tour.chapter]['steps'].length-1))
      $("#tournext").button("disable");
    else
      $("#tournext").button("enable");
    // Autoplay
    if (tour.autoplay)
      tour.timeout = setTimeout(tour.next, tourdata[tour.chapter]['delay'] * 1000);
    // Callback
    if ('afterstep' in stepData)
      eval(stepData['afterstep']);
  },

  toggleAutoplay: function()
  {
    if (tour.autoplay > 0)
    {
      var icn = $(".ui-icon-pause");
      icn.toggleClass("ui-icon-pause ui-icon-play");
      icn.next().html(gettext("Play"));
      tour.autoplay = 0;
      clearTimeout(tour.timeout);
      tour.timeout = null;
    }
    else
    {
      var icn = $(".ui-icon-play");
      icn.toggleClass("ui-icon-play ui-icon-pause");
      icn.next().html(gettext("Stop"));
      tour.autoplay = 1;
      tour.next();
    }
  },

  getTooltipPosition: function(pos, element)
  {
    var position;
    var ew = element.outerWidth();
    var eh = element.outerHeight();
    var el = element.offset().left;
    var et = element.offset().top;
    var tw = tour.tooltip.width() + parseInt(tour.tooltip.css('padding-left')) + parseInt(tour.tooltip.css('padding-right'));
    var th = tour.tooltip.height() + parseInt(tour.tooltip.css('padding-top')) +  + parseInt(tour.tooltip.css('padding-bottom'));

    $('.tourArrow').remove();
    var upArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-left' : '9px solid transparent', 'border-right' : '9px solid transparent', 'border-bottom' : '9px solid red'});
    var downArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-left' : '9px solid transparent', 'border-right' : '9px solid transparent', 'border-top' : '9px solid red'});
    var rightArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-top' : '9px solid transparent', 'border-bottom' : '9px solid transparent', 'border-left' : '9px solid red'});
    var leftArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-top' : '9px solid transparent', 'border-bottom' : '9px solid transparent', 'border-right' : '9px solid red'});
    switch (pos) {
      case 'BL' :
        position = { 'left'  : el, 'top' : et + eh + 10 };
        upArrow.css({ top: '-9px', left: '48%' });
        tour.tooltip.prepend(upArrow);
        break;

      case 'BR' :
        position = { 'left'  : el + ew - tw, 'top' : et + eh + 10 };
        upArrow.css({ top: '-9px', left: '48%' });
        tour.tooltip.prepend(upArrow);
        break;

      case 'TL' :
        position = { 'left'  : el, 'top' : (et - th) -10 };
        downArrow.css({ top: th, left: '48%' });
        tour.tooltip.append(downArrow);
        break;

      case 'TR' :
        position = { 'left'  : (el + ew) - tw, 'top' : et - th -10 };
        downArrow.css({ top: th, left: '48%' });
        tour.tooltip.append(downArrow);
        break;

      case 'RT' :
        position = { 'left'  : el + ew + 10, 'top' : et };
        leftArrow.css({ left: '-9px' });
        tour.tooltip.prepend(leftArrow);
        break;

      case 'RB' :
        position = { 'left'  : el + ew + 10, 'top' : et + eh - th };
        leftArrow.css({ left: '-9px' });
        tour.tooltip.prepend(leftArrow);
        break;

      case 'LT' :
        position = { 'left'  : (el - tw) - 10, 'top' : et };
        rightArrow.css({ right: '-9px' });
        tour.tooltip.prepend(rightArrow);
        break;

      case 'LB' :
        position = { 'left'  : (el - tw) - 10, 'top' : et + eh - th};
        rightArrow.css({ right: '-9px' });
        tour.tooltip.prepend(rightArrow);
        break;

      case 'B'  :
        position = { 'left'  : el + ew/2 - tw/2, 'top' : (et + eh) + 10 };
        upArrow.css({ top: '-9px', left: '48%' });
        tour.tooltip.prepend(upArrow);
        break;

      case 'L'  :
        position = { 'left'  : (el - tw) - 10, 'top' : et + eh/2 - th/2 };
        rightArrow.css({ right: '-9px' });
        tour.tooltip.prepend(rightArrow);
        break;

      case 'T'  :
        position = { 'left'  : el + ew/2 - tw/2, 'top' : (et - th) - 10 };
        downArrow.css({ top: th, left: '48%' });
        tour.tooltip.append(downArrow);
        break;

      case 'R'  :
        position = { 'left'  : (el + ew) + 10, 'top' : et + eh/2 - th/2 };
        leftArrow.css({ left: '-9px' });
        tour.tooltip.prepend(leftArrow);
        break;

      case 'C'  :
        position = { 'left'  : el + ew/2 - tw/2, 'top' : et + eh/2 - th/2 };
    }
    return position;
  }

}


function feedbackform()
{
  if (typeof UserVoice === 'undefined')
  {
    var uv=document.createElement('script');
    uv.type='text/javascript';
    uv.async=false;
    uv.src='//widget.uservoice.com/LktnQ41DM3h2147DNO6aDQ.js';
    var s=document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(uv,s);
  }

  UserVoice = window.UserVoice || [];
  UserVoice.push(['show', {
    mode: 'contact',
    primary_color: '#cc6d00',
    link_color: '#007dbf',
    forum_id: 207501,
    contact_title: 'Send us a message'
  }]);
}


// Gauge for widgets on dashboard
// Copied from https://gist.github.com/tomerd/1499279

function Gauge(placeholderName, configuration)
{
  this.placeholderName = placeholderName;

  var self = this; // for internal d3 functions

  this.configure = function(configuration)
  {
    this.config = configuration;

    this.config.size = this.config.size * 0.9;

    this.config.raduis = this.config.size * 0.97 / 2;
    this.config.cx = this.config.size / 2;
    this.config.cy = this.config.size / 2;

    this.config.min = undefined != configuration.min ? configuration.min : 0;
    this.config.max = undefined != configuration.max ? configuration.max : 100;
    this.config.range = this.config.max - this.config.min;

    this.config.majorTicks = configuration.majorTicks || 5;
    this.config.minorTicks = configuration.minorTicks || 2;

    this.config.greenColor  = configuration.greenColor || "#109618";
    this.config.yellowColor = configuration.yellowColor || "#FF9900";
    this.config.redColor  = configuration.redColor || "#DC3912";

    this.config.transitionDuration = configuration.transitionDuration || 500;
  }

  this.render = function()
  {
    this.body = d3.select("#" + this.placeholderName)
              .append("svg:svg")
              .attr("class", "gauge")
              .attr("width", this.config.size)
              .attr("height", this.config.size);

    this.body.append("svg:circle")
          .attr("cx", this.config.cx)
          .attr("cy", this.config.cy)
          .attr("r", this.config.raduis)
          .style("fill", "#ccc")
          .style("stroke", "#000")
          .style("stroke-width", "0.5px");

    this.body.append("svg:circle")
          .attr("cx", this.config.cx)
          .attr("cy", this.config.cy)
          .attr("r", 0.9 * this.config.raduis)
          .style("fill", "#fff")
          .style("stroke", "#e0e0e0")
          .style("stroke-width", "2px");

    for (var index in this.config.greenZones)
    {
      this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
    }

    for (var index in this.config.yellowZones)
    {
      this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
    }

    for (var index in this.config.redZones)
    {
      this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
    }

    if (undefined != this.config.label)
    {
      var fontSize = Math.round(this.config.size / 9);
      this.body.append("svg:text")
            .attr("x", this.config.cx)
            .attr("y", this.config.cy / 2 + fontSize / 2)
            .attr("dy", fontSize / 2)
            .attr("text-anchor", "middle")
            .text(this.config.label)
            .style("font-size", fontSize + "px")
            .style("fill", "#333")
            .style("stroke-width", "0px");
    }

    var fontSize = Math.round(this.config.size / 16);
    var majorDelta = this.config.range / (this.config.majorTicks - 1);
    for (var major = this.config.min; major <= this.config.max; major += majorDelta)
    {
      var minorDelta = majorDelta / this.config.minorTicks;
      for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
      {
        var point1 = this.valueToPoint(minor, 0.75);
        var point2 = this.valueToPoint(minor, 0.85);

        this.body.append("svg:line")
              .attr("x1", point1.x)
              .attr("y1", point1.y)
              .attr("x2", point2.x)
              .attr("y2", point2.y)
              .style("stroke", "#666")
              .style("stroke-width", "1px");
      }

      var point1 = this.valueToPoint(major, 0.7);
      var point2 = this.valueToPoint(major, 0.85);

      this.body.append("svg:line")
            .attr("x1", point1.x)
            .attr("y1", point1.y)
            .attr("x2", point2.x)
            .attr("y2", point2.y)
            .style("stroke", "#333")
            .style("stroke-width", "2px");

      if (major == this.config.min || major == this.config.max)
      {
        var point = this.valueToPoint(major, 0.63);

        this.body.append("svg:text")
              .attr("x", point.x)
              .attr("y", point.y)
              .attr("dy", fontSize / 3)
              .attr("text-anchor", major == this.config.min ? "start" : "end")
              .text(major)
              .style("font-size", fontSize + "px")
              .style("fill", "#333")
              .style("stroke-width", "0px");
      }
    }

    var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");

    var midValue = (this.config.min + this.config.max) / 2;

    var pointerPath = this.buildPointerPath(midValue);

    var pointerLine = d3.svg.line()
                  .x(function(d) { return d.x })
                  .y(function(d) { return d.y })
                  .interpolate("basis");

    pointerContainer.selectAll("path")
              .data([pointerPath])
              .enter()
                .append("svg:path")
                  .attr("d", pointerLine)
                  .style("fill", "#dc3912")
                  .style("stroke", "#c63310")
                  .style("fill-opacity", 0.7)

    pointerContainer.append("svg:circle")
              .attr("cx", this.config.cx)
              .attr("cy", this.config.cy)
              .attr("r", 0.12 * this.config.raduis)
              .style("fill", "#4684EE")
              .style("stroke", "#666")
              .style("opacity", 1);

    var fontSize = Math.round(this.config.size / 10);
    pointerContainer.selectAll("text")
              .data([midValue])
              .enter()
                .append("svg:text")
                  .attr("x", this.config.cx)
                  .attr("y", this.config.size - this.config.cy / 4 - fontSize)
                  .attr("dy", fontSize / 2)
                  .attr("text-anchor", "middle")
                  .style("font-size", fontSize + "px")
                  .style("fill", "#000")
                  .style("stroke-width", "0px");

    this.redraw(this.config.value, 0);
  }

  this.buildPointerPath = function(value)
  {
    var delta = this.config.range / 13;

    var head = valueToPoint(value, 0.85);
    var head1 = valueToPoint(value - delta, 0.12);
    var head2 = valueToPoint(value + delta, 0.12);

    var tailValue = value - (this.config.range * (1/(270/360)) / 2);
    var tail = valueToPoint(tailValue, 0.28);
    var tail1 = valueToPoint(tailValue - delta, 0.12);
    var tail2 = valueToPoint(tailValue + delta, 0.12);

    return [head, head1, tail2, tail, tail1, head2, head];

    function valueToPoint(value, factor)
    {
      var point = self.valueToPoint(value, factor);
      point.x -= self.config.cx;
      point.y -= self.config.cy;
      return point;
    }
  }

  this.drawBand = function(start, end, color)
  {
    if (0 >= end - start) return;

    this.body.append("svg:path")
          .style("fill", color)
          .attr("d", d3.svg.arc()
            .startAngle(this.valueToRadians(start))
            .endAngle(this.valueToRadians(end))
            .innerRadius(0.65 * this.config.raduis)
            .outerRadius(0.85 * this.config.raduis))
          .attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
  }

  this.redraw = function(value, transitionDuration)
  {
    var pointerContainer = this.body.select(".pointerContainer");

    pointerContainer.selectAll("text").text(Math.round(value));

    var pointer = pointerContainer.selectAll("path");
    pointer.transition()
          .duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
          //.delay(0)
          //.ease("linear")
          //.attr("transform", function(d)
          .attrTween("transform", function()
          {
            var pointerValue = value;
            if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
            else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
            var targetRotation = (self.valueToDegrees(pointerValue) - 90);
            var currentRotation = self._currentRotation || targetRotation;
            self._currentRotation = targetRotation;

            return function(step)
            {
              var rotation = currentRotation + (targetRotation-currentRotation)*step;
              return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")";
            }
          });
  }

  this.valueToDegrees = function(value)
  {
    // thanks @closealert
    //return value / this.config.range * 270 - 45;
    return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
  }

  this.valueToRadians = function(value)
  {
    return this.valueToDegrees(value) * Math.PI / 180;
  }

  this.valueToPoint = function(value, factor)
  {
    return {  x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value)),
          y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value))    };
  }

  // initialization
  this.configure(configuration);
}