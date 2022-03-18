var etsaDocument = (function() { // 'document' is reserved by DOM
  var TABS_PLACEHOLDER_ID = 'tabs-placeholder';
  var FLOATING_TABS_CLASS = 'floating';
  var TAB_BUBBLE_CLASS = 'tab-bubble';
  var PRESS_INDICATOR_CLASS = 'press-indicator';

  var DOCUMENT_WRAPPER_SELECTOR = '#documentBox';
  var TAB_BUBBLE_SELECTOR = '.' + TAB_BUBBLE_CLASS;
  var PRESS_INDICATOR_SELECTOR = '.' + PRESS_INDICATOR_CLASS;

  var SCROLL_AMOUNT_ADJUST = -45;
  var FLOATING_HEADER_TOP_PADDING = 40;

  var BUTTON_TO_DOC_PADDING = 25;
  var BUTTON_TO_BUTTON_PADDING = 12;

  var SHOW_UP_BUTTON_THRESHOLD = 50;
  var FADE_ANIMATION_TIME = 300;
  var SCROLL_ANIMATION_TIME = 600;
  var HIDE_TABS_IN_IE_TIME = 250;
  var EASING = 'easeInOutCubic';

  var documentWrapper;
  var printButton;
  var pdfButton = $('<div/>');
  var upButton;

  function scrollVerticallyTo(scrollAmount) {
    $('html, body').animate({ scrollTop : scrollAmount }, SCROLL_ANIMATION_TIME, EASING);
  }

  function upButtonShouldBeVisible() {
    return $(window).scrollTop() > SHOW_UP_BUTTON_THRESHOLD;
  }

  function setupTabs(tabs) {
    var tabsDiv = $('<div/>').addClass('tabs').addClass('document');

    documentWrapper.before(tabsDiv);

    $.each(tabs, function(key, value) {
      var tabBlock = $('.' + key);

      if (tabBlock.length > 0) {
        var tabLink = $('<a>' + value + '</a>')
            .addClass(TAB_BUBBLE_CLASS)
            .addClass('rounded-corners')
            .attr('href', 'javascript: void(0)');
        var pressIndicator = $('<div/>')
            .addClass(PRESS_INDICATOR_CLASS)
            .hide()
            .appendTo(tabLink);

        tabLink.click(function() {
          var tabHeight = parseInt(tabsDiv.find(TAB_BUBBLE_SELECTOR + ':first').outerHeight());
          var firstTabPos = tabsDiv.find(TAB_BUBBLE_SELECTOR + ':first').offset().top;
          var lastTabPos = tabsDiv.find(TAB_BUBBLE_SELECTOR + ':last').offset().top;
          var scrollAmount = tabBlock.offset().top - tabHeight - Math.abs(firstTabPos - lastTabPos) + SCROLL_AMOUNT_ADJUST;

          scrollVerticallyTo(scrollAmount);

          tabLink.parent().parent().find(PRESS_INDICATOR_SELECTOR).hide(); // hide all
          tabLink.find(PRESS_INDICATOR_SELECTOR).show(); // show current
        });

        tabsDiv.append(tabLink);

        pressIndicator.css('margin-left', tabLink.width() / 2 - parseInt(pressIndicator.css('border-top-width'))); // centering
      }
    });
  }

  function hideForAMomentInOldIE(tabs) {
    if ($.browser.msie && $.browser.version < 9) {
      tabs.css('visibility', 'hidden');

      setTimeout(function() {
        tabs.css('visibility', 'visible').find(PRESS_INDICATOR_SELECTOR + ':visible').parent().focus();
      }, HIDE_TABS_IN_IE_TIME);
    }
  }

  function setupFixingTabsWhenScrolling() {
    var WEIRD_NUMBER = 18; // dunno why, but without it the height is wrong, which results in erroneous scrolling

    var tabs = $('.tabs');
    var tabsOffset = tabs.offset().top;
    var firstTab = tabs.find(TAB_BUBBLE_SELECTOR + ':first');

    if (firstTab.length == 0) return; // no tabs have been created

    var lastTab = tabs.find(TAB_BUBBLE_SELECTOR + ':last');
    var tabHeight = firstTab.outerHeight();
    var tabsHeight = tabHeight + Math.abs(firstTab.offset().top - lastTab.offset().top) + WEIRD_NUMBER;

    $(window).scroll(function() {
      if ($(window).scrollTop() > tabsOffset - FLOATING_HEADER_TOP_PADDING) {

        // when we scroll low enough to float tabs
        if (!tabs.hasClass(FLOATING_TABS_CLASS)) {
          tabs.css('width', tabs.width()); // put width to preserve wrapping
          tabs.css('top', FLOATING_HEADER_TOP_PADDING);
          tabs.addClass(FLOATING_TABS_CLASS);

          // in old IE hide tabs for a moment, since PIE rounded corners plugin glitches when tabs toggle floating state
          hideForAMomentInOldIE(tabs);

          // put placeholder to prevent jumps and to keep the length of the page constant (for scrolling)
          tabs.before($('<div/>').attr('id', TABS_PLACEHOLDER_ID).css('height', tabsHeight));
        }
      } else {

        // when we scroll high enough to fix tabs
        if (tabs.hasClass(FLOATING_TABS_CLASS)) {
          tabs.css('width', '');
          tabs.css('top', '');
          tabs.removeClass(FLOATING_TABS_CLASS);

          hideForAMomentInOldIE(tabs);

          $('#' + TABS_PLACEHOLDER_ID).remove();
        }
      }
    });
  }

  function buildPrintButton(messages) {
    printButton = $('<div/>')
        .addClass('rect-button')
        .addClass('print-button')
        .addClass('no-contrast-change')
        .attr("aria-labelledby", "print-button")
        .attr("role", "button")
        .attr("tabindex", "0");

    $('<span/>').addClass('text').attr("id", "print-button").text(messages.print).appendTo(printButton);

    printButton.click(function() { window.print(); });

    $('body').append(printButton);
  }

    function buildPdfButton(pdfDataLink, messages) {
        if (pdfDataLink) {
            pdfButton = $('<div/>')
                .addClass('rect-button')
                .addClass('pdf-button')
                .addClass('no-contrast-change')
                .attr("aria-labelledby", "pdf-button")
                .attr("role", "button")
                .attr("tabindex", "0");
            $('<span/>').addClass('text').attr("id", "pdf-button").text(messages.pdf).appendTo(pdfButton);

            pdfButton.click(function () {
                pdfDataLink.click()
            });
            $('body').append(pdfButton);
        }
    }

  function buildUpButton(messages) {
    upButton = $('<div/>')
        .addClass('rect-button')
        .addClass('up-button')
        .addClass('no-contrast-change')
        .attr("aria-labelledby", "up-button")
        .attr("role", "button")
        .attr("tabindex", "0");

    $('<span/>').addClass('text').attr("id", "up-button").text(messages.up).appendTo(upButton);

    upButton.click(function() { scrollVerticallyTo(0); });

    $('body').append(upButton);
  }

  function setupUpButtonHidingShowing() {
    $(window).scroll(function() {
      if (upButtonShouldBeVisible()) {
        if (!upButton.is(':visible')) {
          upButton.fadeIn(FADE_ANIMATION_TIME);
        }
      } else {
        if (upButton.is(':visible')) {
          upButton.fadeOut(FADE_ANIMATION_TIME);
        }
      }
    });
  }

  function refreshSideButtonsPosition() {
    var doc = documentWrapper;
    var topScrollAmount = $(window).scrollTop();
    var docOffset = doc.offset();
    var x = docOffset.left + doc.outerWidth();
    var y = docOffset.top - Math.min(docOffset.top - FLOATING_HEADER_TOP_PADDING, topScrollAmount);
    let width = $(window).width();
    let buttonWidth;

    $(window).on('resize', function() {
        if ($(this).width() !== width) {
            width = $(this).width();
        }
    });

    if (width < 481) {
        buttonWidth = 60;
    } else {
        buttonWidth = 145;
    }

    printButton.css('left', width - buttonWidth);
    pdfButton.css('left', width - buttonWidth);
    upButton.css('left', width - buttonWidth);
    printButton.css('top', y);
    pdfButton.css('top', y + parseInt(printButton.css('height')) + BUTTON_TO_BUTTON_PADDING);
    let buttonsBefore = parseInt(pdfButton.css('height')) > 5 ? 2 : 1;
    upButton.css('top', y + buttonsBefore * (parseInt(printButton.css('height')) +  BUTTON_TO_BUTTON_PADDING));
  }

  function setupFixingSideButtonsWhenScrolling() {
    $(window).scroll(function() {
      refreshSideButtonsPosition();
    });
  }

  function setupButtonRepositioningOnResize() {
    var timeoutId;
    var winWidth;
    var winHeight;

    function onResize() {
      refreshSideButtonsPosition();

      printButton.fadeIn(FADE_ANIMATION_TIME);
      pdfButton.fadeIn(FADE_ANIMATION_TIME);
      if (upButtonShouldBeVisible()) { upButton.fadeIn(FADE_ANIMATION_TIME); }

      timeoutId = null;
    }

    $(window).resize(function() {
      // In IE8 resize is triggered when ANY element is resized
      // so we check if dimensions have actually changed
      var winNewWidth = $(window).width();
      var winNewHeight = $(window).height();

      if (winWidth === winNewWidth && winHeight === winNewHeight) return;

      winWidth = winNewWidth;
      winHeight = winNewHeight;

      if (timeoutId) {
        clearTimeout(timeoutId);
      } else {
        printButton.hide();
        pdfButton.hide();
        upButton.hide();
      }

      timeoutId = setTimeout(onResize, 300); // just a good practice
    }).resize();
  }


  function decorateSourceLinks(messages) {
	  $('div.decorate_source').each(function(index, toDecorate) {
		  var docId = $(toDecorate).text();
		  var link = $('<a/>').attr('href', messages.urlBase + docId);
		  link.text(messages.sourceLink);
		  $(toDecorate).replaceWith(link);
	  });
  }

  /*objektiivse leiu tabeli skript:ALGNUS*/
  function show_find(){
  	$('.leid-checkbox').attr('checked' , true);
  	$(".finding-openable").removeClass( "obj-finding" );
  	$(".table-cell-cover").css('display' , 'none');
  }

  function hide_find(){
  	$('.leid-checkbox').attr('checked' , false);
  	$(".finding-openable").addClass( "obj-finding" );
  	$(".table-cell-cover").css('display' , 'block');
  }

  $(document).ready(function() {
  	$('.leid-checkbox').attr('checked', false);

  	$('.leid-checkbox').change(function() {
  		var parts = this.id.split("-");
  		if ($(this).is(':checked')) {
  			$("#cell-"+parts[1]+"-"+parts[2]).removeClass( "obj-finding" );
  			$("#cell-cover-"+parts[2]).toggle();
  		}
  		else{
  			$("#cell-"+parts[1]+"-"+parts[2]).addClass( "obj-finding" );
  			$("#cell-cover-"+parts[2]).toggle();
  		}
  	} );
  	$('.leid-list-link').on( "click", function(){
  			$text = $(this).attr('status_text').split(';');
  			$block_name = $(this).attr('block_name');

  			if($(this).text() == $text[0]){
  				$(this).text($text[1]);
  				show_find();

  			}else{
  				$(this).text($text[0]);
  				hide_find();
  			}
  	});
  });
  /*objektiivse leiu tabeli skript:LÕPP*/

	/*Listi lingi skript:ALGUS*/
	$(document).ready(function() {
        $('.list-link').keypress(function(e){
            e.preventDefault();
            if((e.keyCode ? e.keyCode : e.which) == 13){
                $(this).trigger('click');
            }
        });

		$('.list-link').on( "click", function(){
				$text = $(this).attr('status_text').split(';');
				$block_name = $(this).attr('block_name');

				if($(this).text() == $text[0]){
					$(this).text($text[1]);
					$('.'+$block_name+'-checkbox').attr('checked' , true);
					$('.'+$block_name+'-openable').css('display' , 'block');

				}else{
					$(this).text($text[0]);
					$('.'+$block_name+'-checkbox').attr('checked' , false);
					$('.'+$block_name+'-openable').css('display' , 'none');
					}
		});
		/*Listi lingi skript:LÕPP*/
		/*Checkbox - toggle info skript:ALGUS*/
		$("input[type='checkbox']").change(function() {
			var toggle_checkbox = $(this).data('toggle-checkbox');
			if(toggle_checkbox != '' || toggle_checkbox != null){
				var toggle_target = $('div[data-toggle-target=' + toggle_checkbox + ']');
				if($(this).is(':checked')){
					toggle_target.show();
				}else{
					toggle_target.hide();
				}
			}
		})
		/*Checkbox - toggle info skript:LÕPP*/
	});

	/*Ambulance card - style */
	$(document).ready(function() {
		$(".etsa_reanimation .sub-title span:contains('Elustamise tulemus')," +
	    		".etsa_reanimation .sub-title span:contains('Anamnees ja brigaadi tegevuse lühikokkuvõte')," +
	    		".etsa_reanimation .sub-title span:contains('Probleemid/puudused elustamise ajal')," +
	    		".etsa_reanimation .sub-title span:contains('Kliiniline surm')").each(function () {
			$(this).addClass("reanimation_block_subheader");
	    });
		$(".etsa_documentTypeCode70 span:contains('Kiirabil elustamiseks kulunud aeg minutites')").parent().addClass("amb_reanimation_time");
	    $(".etsa_documentTypeCode70 tr.sub-title td[colspan='5'] span.reanimation_block_subheader").each(function () {
	    	$(this).parent().addClass("reanimation_block_subheader_parent");
	    });
	    $("td.ambCard table tbody tr td table tbody tr span:first-child, .etsa_documentTypeCode70 span.rowValue:first-child," +
	    		".etsa_documentTypeCode70 td[width='15%'], .etsa_representedOrganization td:first-child").each(function () {
	    	$(this).siblings().css('font-weight','normal');
	    });
	    $(".etsa_documentTypeCode70 span:contains(', aeg ')").each(function () {
	    	$(this).removeAttr('style');
	    	$(this).addClass("timePart");
	    });
	    $(".etsa_documentTypeCode70 span:contains('Temperatuuri mõõtmise koht')").parent().parent().attr('class', '');
	    $(".etsa_documentTypeCode70 span:contains('Lisajõu appikutsumine')").parent().parent().attr('class', 'titleFontWeightBold timeValueBold');
	    $(".etsa_documentTypeCode70 span:contains('Hingamismeetmed')").parent().parent().attr('class', 'titleFontWeightBold breath');
	    $(".titleFontWeightBold breath").next().find("table").removeAttr('class');

	    $(".reanimation_block_complications").first().siblings(".reanimation_block_complications").css('display','none');
	    $(".injury_block_equipment").first().siblings(".injury_block_equipment").css('display','none');
	    $(".etsa_injury .titleFontWeightBold span:contains('Vigastuse piirkond ja iseloom')").each(function () {
			$(this).parent().addClass("injury_block_subheader");
	    });
	});

  return {
    setup: function(config, messages) {
      documentWrapper = $(DOCUMENT_WRAPPER_SELECTOR);

      if (!documentWrapper.length) {
    	  documentWrapper = $(".scrollPosition");
      }

      if (documentWrapper.length == 0) { // No documents to wrap around
    	  return;
      }

      if (config.tabs) {
        setupTabs(config.tabs);
        setupFixingTabsWhenScrolling();
      }

      buildPrintButton(messages);
      buildPdfButton(config.pdfDataLink, messages);
      buildUpButton(messages);
      setupUpButtonHidingShowing();
      setupFixingSideButtonsWhenScrolling();
      setupButtonRepositioningOnResize();
      decorateSourceLinks(messages);
    }
  };
})();

function createPdfInLineLink(base64Data, fileName) {
    if (base64Data) {
        let link = document.createElement("a");
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        let file = new Blob([bytes], {type: 'application/pdf'});
        link.href = URL.createObjectURL(file);
        link.download = fileName;
        return link;
    }
    return null;
}
