let headerBarHelp = (function () {
    let header;
    let menu;
    let button;
    let loadingItem;

    function setupDropdown() {
        button.click(function () {
            if (menu.is(':visible')) {
                menu.fadeOut('fast');
            } else {
                menu.css('right', $(this).offset().left / 5).fadeIn('fast');
            }
        });
    }

    function init() {
        header = $('.header');
        menu = header.find('.help-dropdown-container ul');
        button = header.find('.help-dropdown-container a.toggle-button');

        setupDropdown();
    }

    return {
        setup: function () {
            $(window).ready(function () {
                init();
            });
        }
    };
})();
