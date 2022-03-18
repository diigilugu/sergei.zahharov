let tooltipDialog = (function () {

    let FADE_TIME = 500;
    let EXPAND_TIME = 1000;

    $(function () {
        $("#tooltip-dialog-message").dialog({
            closeOnEscape: true,
            autoOpen: false,
            position: {
                my: 'left top+5',
                at: 'left bottom',
                of: '.tooltip-message'
            }
        })
    });

    function openDialogMessage() {
        $("#tooltip-dialog-message").dialog("open");
    }

    function openFullScreenTooltipMessage(id, element) {
        let boxFrom = $(element);
        let fullScreenBox = $('#' + id + ' .full-screen-tooltip-dialog-message')
            .clone()
            .attr("id", "full-screen-tooltip-dialog-message-fake")
            .css('top', boxFrom.offset().top)
            .css('left', boxFrom.offset().left)
            .css('width', boxFrom.width())
            .css('height', boxFrom.height())
            .data('expandedFrom', boxFrom)
            .show().appendTo($('body'));

        fullScreenBox.animate({
            top: 0,
            left: 0,
            width: $(window).width(),
            height: $(window).height()
        }, {
            duration: EXPAND_TIME,
            complete: backSideExpanded
        });
    }

    function closeFullScreenDialogMessage() {
        $("#full-screen-tooltip-dialog-message").hide();
    }

    function backSideExpanded() {
        let div = makeStretchable($(this));
        let content = div.find('.fs-content').fadeIn(FADE_TIME);
        $(this).show();
        setupBackButtonForExpandedDiv(div, content);
        $(PP.FULL_SCREEN_BACK_FLIP_SELECTOR).focus();
    }

    function makeStretchable(el) {
        return el.css('width', '100%').css('height', '100%');
    }

    function bindEscToBackButton(div) {
        $(window).bind('keyup.esc', function (evt) {
            if (evt.keyCode === $.ui.keyCode.ESCAPE) {
                div.find(PP.BACK_BUTTON_SELECTOR).click();
            }
        });
    }

    function setupBackButtonForExpandedDiv(div, content) {
        bindEscToBackButton(div);

        content.find(PP.BACK_BUTTON_SELECTOR).click(function () {
            unbindEscFromBackButton();
            fixToWindowSize(div);

            content.fadeOut(FADE_TIME, function () {
                let expandedFrom = div.data('expandedFrom');

                div.animate({
                    left: expandedFrom.offset().left,
                    top: expandedFrom.offset().top,
                    width: expandedFrom.width(),
                    height: expandedFrom.height()
                }, {
                    duration: EXPAND_TIME,
                    complete: function () {
                        div.remove();
                    }
                });
            });
        });
    }

    function unbindEscFromBackButton() {
        $(window).unbind('keyup.esc');
    }

    function fixToWindowSize(el) {
        return el.css('width', $(window).width()).css('height', $(window).height());
    }

    return {
        openFullScreenTooltipMessage: openFullScreenTooltipMessage,
    };

})();