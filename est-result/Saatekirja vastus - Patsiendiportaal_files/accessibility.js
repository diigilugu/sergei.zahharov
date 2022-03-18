var accessibility = (function () {
    var header;
    var menu;
    var button;

    function setupDropdown() {
        button.click(function () {
            if (menu.is(':visible')) {
                menu.fadeOut('fast');
            } else {
                menu.css('left', $(this).offset().left + 1)
                    .fadeIn('fast');
            }
        });
    }

    function init() {
        header = $('.header');
        menu = header.find('#accessibility-dropdown-content')
        button = header.find('.accessibility-dropdown');

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
