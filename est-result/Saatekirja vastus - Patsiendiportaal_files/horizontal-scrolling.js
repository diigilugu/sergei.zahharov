// Depends on: jquery, iscroll.js, jquery.doubleScroll.js, jquery.easing.1.2.js, jquery.detectmobilebrowser.js

var horizontalScrolling = (function () {
    var WRAPPER_SELECTOR = '.horizontal-data-wrapper';
    var SCROLL_ANIMATION_TIME = 600;
    var EASING = 'easeInOutCubic';

    var wrapper;
    var scroller;
    var mobileScroller;

    function setupTabs() {
        var tabsDiv = $('<div/>').addClass('tabs');
        wrapper.before(tabsDiv);

        $('[data-tab-id]').each(function (index, column) {
            var $column = $(column);
            var tabTitle = $column.find('h2').text();
            var tabLink = $('<a>' + tabTitle + '</a>').addClass('tab-bubble').addClass('rounded-corners').attr('href', 'javascript: void(0)').attr('data-tab-of', $column.attr('data-tab-id'));
            var pressIndicator = $('<div/>').addClass('press-indicator').appendTo(tabLink);

            // on load leave the first one visible
            if (index > 0) {
                pressIndicator.hide();
            }

            tabLink.click(function () {
                if (mobileScroller) {
                    mobileScroller.scrollToElement(column, SCROLL_ANIMATION_TIME);
                } else {
                    var onloadListener = window.onbeforeunload; // IE workaround
                    window.onbeforeunload = null; // IE workaround
                    scroller.animate({scrollLeft: $column.offset().left - $('[data-tab-id]:first-child').offset().left}, SCROLL_ANIMATION_TIME, EASING, function () {
                        window.onbeforeunload = onloadListener; // IE workaround
                    });
                }

                tabLink.parent().parent().find('.press-indicator').hide(); // hide all
                tabLink.find('.press-indicator').show(); // show current
            });

            tabLink.on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    $(this).trigger('click');
                    event.preventDefault();
                }
            });

            tabsDiv.append(tabLink);

            pressIndicator.css('margin-left', tabLink.width() / 2 - parseInt(pressIndicator.css('border-top-width'))); // centering
        });
    }

    function colorTabsIfErrorsExist() {
        $('[data-tab-id]').each(function (index, column) {
            var $column = $(column);
            var $tab = $('[data-tab-of=' + $column.attr('data-tab-id') + ']');

            $column.find('.field-error').each(function () {
                if ($.trim($(this).val()) === '') {
                    $tab.addClass('has-errors');
                    return false;
                }
            });
        });
    }

    function setupScrolling() {
        if ($.browser.mobile) {
            mobileScroller = new IScroll(wrapper[0], {
                scrollX: true,
                freeScroll: true,
                preventDefault: false
            });
        } else {
            // for some reason columns get wrapped only after JS is processed, so a delay is needed
            // otherwise the scroller would falsely indicate that there is more room
            setTimeout(function () {
                scroller = wrapper.css('overflow', 'hidden').doubleScroll();
            }, 1);
        }
    }

    return {
        setup: function () {
            $(document).ready(function () {
                wrapper = $(WRAPPER_SELECTOR);

                if (wrapper.length > 0) {
                    setupTabs();
                    colorTabsIfErrorsExist();
                    setupScrolling();
                }
            });
        }
    };
})();

horizontalScrolling.setup();
