var mobileMenu = (function () {
    var header;
    var menu;
    var button;
    let roleButton;
    let lastLineHeightButton;
    let FAQ;

    var loadingItem;

    function setupDropdown() {
        button.click(function () {
            if (menu.is(':visible')) {
                menu.fadeOut('fast');
            } else {
                menu.css('left', 0).css('width', $(window).width()).fadeIn('fast');
            }
        });
        button.on('keydown', function(e) {
            if ((e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.ESCAPE) && menu.is(':visible')) {
                menu.hide();
            } else if (e.keyCode === $.ui.keyCode.ENTER) {
                menu.show();
            }
        });
        if (FAQ.length !== 0) {
            FAQ.focusout(function () {
                if (menu.is(':visible')) {
                    menu.hide();
                }
            });
        } else {
            lastLineHeightButton.focusout(function() {
                if (menu.is(':visible')) {
                    menu.hide();
                }
            });
        }
    }

    function setupMobileWidth() {
        let width = window.innerWidth;
        if (width < 761) {
            $('.role-dropdown-container').css('width', width/2.4);
            $('#representation').css('max-width', width/3.6);
        }
    }

    function init() {
        header = $('.header');
        menu = header.find('.mobile-menu-dropdown-container div');
        button = header.find('#mobile-menu-logo');
        roleButton = header.find('.role-dropdown-container');
        FAQ = menu.find('a#faq');
        lastLineHeightButton = menu.find('li').last();
        setupDropdown();
        setupMobileWidth();
    }

    return {
        setup: function () {
            $(window).ready(function () {
                init();
            });
        }
    };
})();
