var lastNoteBar = (function() {
	  var header;
	  var menu;
	  var button;

	  function setupDropdown() {
	    button.mouseover(function() {
	    	menu.css('left', $(this).offset().left - 249)
            .fadeIn('fast');
	    }).mouseout(function() {
	    	menu.fadeOut('fast');
	    });

	  }

	  function init() {
	    header = $('.header');
	    menu = header.find('.dropdown-lastnote ul');
	    button = header.find('.dropdown-lastnote a');

	    setupDropdown();
	  }

	  return {
	    setup: function() {
	      $(window).ready(function() {
	        init();
	      });
	    }
	  };
})();