let readmoreDialog = (function () {

    let FADE_TIME = 500;
    let EXPAND_TIME = 1000;
    let KEYCODE_TAB = 9;
    let bodyEl;

    function openDialogAdditionalInformationMessage(calledOutFromElement) {
        $("#dialog-message")
            .dialog({
                closeOnEscape: true,
                autoOpen: false,
                position: {
                    my: 'left top+5',
                    at: 'left bottom',
                    of: '.additional-information'
                },
                beforeClose: function () {
                    $("#dialog-message").attr("role", "alert");
                    $(calledOutFromElement).focus();
                },
            })
            .dialog("open");
    }

    function openFullScreenDialogMessage(calledOutFromElementName, fullScreenBoxName) {

        bodyEl = $('body');
        let calledOutFromElement;
        let fullScreenBox;

        if (PP.isEmpty(calledOutFromElementName)) {
            calledOutFromElement = $('.additional-information');
        } else {
            calledOutFromElement = $(calledOutFromElementName);
        }
        // let boxFrom_position = boxFrom.position();
        let boxFrom_position = calledOutFromElement.offset();
        let boxFrom_position_top = boxFrom_position.top;
        let boxFrom_position_left = boxFrom_position.left;
        if (PP.isEmpty(fullScreenBoxName)) {
            fullScreenBox = $('#full-screen-dialog-message')
        } else {
            fullScreenBox = $(fullScreenBoxName);
        }
        fullScreenBox = fullScreenBox.clone();
        fullScreenBox
            .attr("id", fullScreenBoxName + "-fake")
            .css('top', boxFrom_position_top)
            .css('left', boxFrom_position_left)
            .css('width', calledOutFromElement.width())
            .css('height', calledOutFromElement.height())
            .css('position', 'absolute')
            .data('calledOutFromElement', calledOutFromElement)
            .show()
            .appendTo(bodyEl);

        fullScreenBox.animate(
            {
                top: $(document).scrollTop(),
                left: 0,
                width: '100%',
                height: '100%',
            },
            {
                duration: EXPAND_TIME,
                complete: backSideExpanded
            }
        );
    }

    function backSideExpanded() {
        let divEl = $(this);
        let content = divEl.find('.fs-content').fadeIn(FADE_TIME, function () {
            bodyEl.css('overflow-y', 'hidden');
            divEl.css('top', 0);
            divEl.css('position', 'fixed');
        });
        setupBackButtonForExpandedDiv(divEl, content);
        $(PP.FULL_SCREEN_BACK_FLIP_SELECTOR).focus();
    }

    function bindEscToBackButton(divEl) {
        $(window).bind('keyup.esc', function (evt) {
            if (evt.keyCode === $.ui.keyCode.ESCAPE) {
                divEl.find(PP.BACK_BUTTON_SELECTOR).click();
            }
        });
    }

    function setupBackButtonForExpandedDiv(divEl, content) {
        bindEscToBackButton(divEl);
        content.find(PP.BACK_BUTTON_SELECTOR).click(function () {
            backButtonClick(divEl, content);
        });
    }

    function backButtonClick(divEl, content) {

        unbindEscFromBackButton();

        content.fadeOut(FADE_TIME, function () {
            let calledOutFromElement = divEl.data('calledOutFromElement');
            divEl.css('height', $(document).height());
            divEl.css('position', 'absolute');
            $('body').css('overflow-y', 'auto');
            divEl.animate({
                    left: calledOutFromElement.offset().left,
                    top: calledOutFromElement.offset().top,
                    width: calledOutFromElement.width(),
                    height: calledOutFromElement.height(),
                },
                {
                    duration: EXPAND_TIME,
                    complete: function () {
                        divEl.remove();
                    }
                }
            );
        });
    }

    function unbindEscFromBackButton() {
        $(window).unbind('keyup.esc');
    }

    return {
        openDialogAdditionalInformationMessage: openDialogAdditionalInformationMessage,
        openFullScreenDialogMessage: openFullScreenDialogMessage,
    };

})();
