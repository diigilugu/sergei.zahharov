(function( $ ) {
	var private = {		
		check: function(checkbox) {
			checkbox.attr('checked', true);
		},
		
		uncheck: function(checkbox) {
			checkbox.attr('checked', false);
		}
	};
	
	var methods = {
		init: function(options) {
		  return $(this).addClass('checkbox');
		},
		
		click: function(callback) {
			return this.click(function() {
			  var $this = $(this);
			  
				if (methods.checked.call($this)) {
					private.uncheck($this);
				}	else {
					private.check($this);
				}
				
				callback.call($this);
			});
		},
				
		checked: function() {
			return this.attr('checked') === 'checked';
		},
		
		check: function() {
			return this.each(function() {
				private.check($(this));
			});
		},
		
		uncheck: function() {
			return this.each(function() {
				private.uncheck($(this));
			});
		}
	};
	
	$.fn.checkbox = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
		  return methods.init.apply(this, arguments);
		} else {
		  $.error('Method ' +  method + ' does not exist on jQuery.checkbox');
		}
	};
})( jQuery );