/*
 * jQuery.formFilters
 * 
 *
 * Copyright (c) 2014 Roberto Yudice
 * Licensed under the MIT license.
 */

(function ($) {

  // Collection method.
  $.fn.formFilters = function (options) {
    var inputs = [];
    options = $.extend({}, $.formFilters.options, options);
    $.formFilters.options = options;
    var Observable = function(value, callback){
      var _value = value;
      var _self = this;
      this.observable = function () {
        if (arguments.length > 0) {
       
            _value = arguments[0];
            if (_self.callback) {
              _self.callback();
            }
            
            return this; 
        }
        else {         
            return _value;
        }
      };

      if (value === undefined) {
        return value; 
      }

      this.callback= callback;
      _value = value;
      
      return this.observable;
    };

    return this.each(function () {
      // Do something awesome to each selected element.
      $(this).find("input,select").each(function(i,input){
        var label = $("label[for='"+ $(input).attr("id") + "']").first();
        
        if (label) 
        {
          var observable = new Observable($(this).val(), function(){
            var value = this.observable();
            if (value === '' || value === null) {
              element.hide();
            }
            else
            {
              element.find('.input-value').html(' ' + value + ' ');
              element.show();  
            }
            
          });
            var element;
            var filterInput;
            
            if ($(input).is(":radio")) {
                var group = $(input).data("filter-group");
                var existingGroup;
                element = $("<li><span class='input-label'>" + group + "</span><span class='input-value'></span></li>").hide();
                $.each(inputs, function(index, o) {
                    if (o.group === group) {
                        existingGroup = o;
                        return false;
                    }
                });

                if (existingGroup) {
                    filterInput = existingGroup;

                } else {
                    filterInput = { label: group, input: input, value: observable, element: element, group: group, labelElement: label };

                }

            } else {
                element = $("<li><span class='input-label'>" + $(label).html() + "</span><span class='input-value'></span></li>").hide();
                filterInput = { label: $(label).html(), input: input, value: observable, element: element, group: null, labelElement: label};
            }

            var link = $("<a href='#'>" + $.formFilters.options.removeLabel + "</a>").on('click', function (evt) {
                if ($(filterInput.input).is(":radio")) {
                    var group = $("input:radio[data-filter-group='" + filterInput.group + "']");
                    group.removeAttr("checked").filter("[value='']").attr("checked", "checked").change();
                    
                } else {
                    $(filterInput.input).val('').change();
                }

            evt.preventDefault();
            
            if($.formFilters.options.onClear){
              $.formFilters.options.onClear();
            }
          });

          element.append(link);

          $(input).on('change', function () {
              if($(this).is(":radio")) {
                  var friendlyName = $(this).data("filter-description");
                  if (friendlyName) {
                      filterInput.value(friendlyName);
                  } else {
                      filterInput.value($(this).val());
                  }
              }
              else
              {
                  filterInput.value($(this).val());
              }
              
            });

          inputs.push(filterInput);
        }
      });

      $($.formFilters.options.renderTo).append($.map(inputs, function(input){  
          return input.element;
      }));
    });
  };

  // Static method.
  $.formFilters = function (options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.formFilters.options, options);
    $.awesome.options = options;
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.formFilters.options = {
    renderTo: null,
    onClear: null,
    removeLabel: "Remove"
  };

  

}(jQuery));
