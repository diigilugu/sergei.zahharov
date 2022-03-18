let fadingOverlay = (function () {

    let fadeTime = 500;
    let overlay = null;

    return {
        setup: function () {
            overlay = $('<div/>').addClass('blocking-overlay').hide();
            $('body').append(overlay);
        },

        fade: function (opacityValue, bgColor) {
            if (!overlay.is(':visible')) {
                overlay.css('opacity', 0);
                overlay.css('background-color', bgColor);
                overlay.show();

                overlay.animate(
                    {opacity: opacityValue},
                    fadeTime);
            }
        },

        restore: function () {
            if (overlay.is(':visible')) {
                overlay.animate(
                    {opacity: 0.0},
                    fadeTime,
                    function () {
                        overlay.hide();
                    }
                );
            }
        }
    };

})();

function findOverlayContainer(clickedElement, containerSelector) {
    if (containerSelector === undefined) {
        return $(clickedElement).first();
    } else {
        return $(clickedElement).parents(containerSelector).first();
    }
}

function isShowingOverlay(clickedElement, containerSelector) {
    let container = findOverlayContainer(clickedElement, containerSelector);
    return container.find('.local-blocking-overlay').length > 0;
}

function localOverlay(clickedElement, containerSelector) {
    let container = findOverlayContainer(clickedElement, containerSelector);
    container.each(function () {
        $(this).css('position', 'relative');

        let localOverlay = $('<div/>')
            .addClass('local-blocking-overlay')
            .hide();
        $(this).append(localOverlay);

        localOverlay.css('opacity', 0);
        localOverlay.css('background-color', 'black');
        localOverlay.show();


        localOverlay.animate({
            opacity: 0.2
        }, 500);
        $(this).append($('<div/>')
            .addClass('local-blocking-overlay-spinner')
            .addClass('local-blocking-overlay'));
    });

}
