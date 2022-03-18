let rotatableBox = (function () {
    let FLIP_TIME = 800;
    let FADE_TIME = 500;
    let EXPAND_TIME = 1000;
    let EASING = 'easeInOutCirc';
    let NO_SKEW = true;

    let BACK_SIDE_CLASS = 'hidden-content';
    let FULL_SCREEN_CLASS = 'full-screen';
    let CLICKED_CLASS = 'clicked';
    let CLICKABLE_CLASS = 'clickable';
    let BOX_CLASS = 'box';
    let SMALL_CLASS = 'small';

    let FLIP_BUTTON_SELECTOR = '.btn a.animate';
    let FLIPPABLE_IMAGE_SELECTOR = 'li.sec-img';
    let FRONT_SIDE_SELECTOR = 'div.visible-content';
    let BACK_SIDE_SELECTOR = 'div.' + BACK_SIDE_CLASS;
    let BOX_SELECTOR = '.' + BOX_CLASS;
    let SEC_TXT_SELECTOR = '.sec-txt';

    function setupLinks() {
        $(BOX_SELECTOR).click(function (e) {
            let $this = $(this);
            let boxHref = $this.attr('data-boxhref');
            if ($this.hasClass('box-blocking-overlay')) {
                if (isShowingOverlay($this)) {
                    return;
                }
                localOverlay($this);
            }
            let loading = $this.find('.has-spinner');
            if (loading) {
                loading.addClass('loading');
                let heading = loading.find('[role="heading"]');
                if (heading) {
                    heading.css('opacity', '0');
                }
            }

            if ($.type(boxHref) !== 'undefined' && $this.hasClass(CLICKABLE_CLASS)) {
                window.location.href = boxHref;
            }

            e.stopPropagation();
        });
    }

    function closeSpinner(el) {
        let loading = $(el);
        if (loading) {
            loading.removeClass('loading');
            let heading = loading.find('[role="heading"]');
            if (heading) {
                heading.css('opacity', '');
            }
        }
    }

    function setupFlipButtons() {
        $(FLIP_BUTTON_SELECTOR).removeClass(CLICKED_CLASS);
        $(FLIP_BUTTON_SELECTOR).click(function () {
            let $this = $(this);
            let boxElement = $this.closest(BOX_SELECTOR);
            let rotatableElement = boxElement.hasClass(SMALL_CLASS) ? boxElement : boxElement.children('div');

            if ($this.hasClass(CLICKED_CLASS)) {
                rotatableElement.stop().rotate3Di('unflip', FLIP_TIME, {sideChange: onSideChange, complete: onFlipEnded, easing: EASING, noSkew: NO_SKEW});
                $this.removeClass(CLICKED_CLASS);
                boxElement.addClass(CLICKABLE_CLASS);
            } else {
                //flip back all other boxes if needed
                $(FLIP_BUTTON_SELECTOR + '.' + CLICKED_CLASS).click();
                $(FLIPPABLE_IMAGE_SELECTOR + '.' + CLICKED_CLASS).click();

                rotatableElement.stop().rotate3Di('flip', FLIP_TIME, {direction: 'clockwise', sideChange: onSideChange, complete: onFlipEnded, easing: EASING, noSkew: NO_SKEW});
                $this.addClass(CLICKED_CLASS);
                boxElement.removeClass(CLICKABLE_CLASS);
            }
            return false;
        });
    }

    function setupFlipImages() {
        $(FLIPPABLE_IMAGE_SELECTOR).removeClass(CLICKED_CLASS);
        $(FLIPPABLE_IMAGE_SELECTOR).click(function () {
            let $this = $(this);

            $this.children('div').stop().rotate3Di('flip', FLIP_TIME, {direction: 'clockwise', sideChange: onSideChange, complete: onFlipEnded, easing: EASING, noSkew: NO_SKEW});

            if ($this.hasClass(CLICKED_CLASS)) {
                $this.children('div').stop().rotate3Di('unflip', FLIP_TIME, {sideChange: onSideChange, complete: onFlipEnded, easing: EASING, noSkew: NO_SKEW});
                $this.removeClass(CLICKED_CLASS);
            } else {
                //flip back all other boxes if needed
                $(FLIP_BUTTON_SELECTOR + '.' + CLICKED_CLASS).click();
                $(FLIPPABLE_IMAGE_SELECTOR + '.' + CLICKED_CLASS).click();
                $this.addClass(CLICKED_CLASS);
            }

            return false;
        });
    }

    function onSideChange(nowFrontIsShown) {
        let $this = $(this);
        let box = $this.closest(BOX_SELECTOR);
        let flipButton = box.find('div.btn');
        let frontSide = box.find(FRONT_SIDE_SELECTOR);
        let backSide = box.find(BACK_SIDE_SELECTOR);
        let backIsFullScreen = backSide.hasClass(FULL_SCREEN_CLASS);

        if (nowFrontIsShown) {
            frontSide.show();

            if (backIsFullScreen) {
                flipButton.show();
                $this.find('#fake-back-side').remove();
            } else {
                backSide.hide();
            }
        } else {
            frontSide.hide();

            if (backIsFullScreen) {
                flipButton.hide();
                // because of position=fixed scrolling breakes some animation positioning logic
                $(window).scrollTop(0);
                // since the real back side is hidden until expanded we put a placeholder, so that the back side appears the right size during flip
                backSide.before($('<div/>').addClass(BACK_SIDE_CLASS).show().attr('id', 'fake-back-side'));
            } else {
                backSide.show();
            }
        }
    }

    function prepareFullScreenDiv(expandedFrom, content, unflipper) {
        let div = $('<div/>')
            .addClass(PP.FULL_SCREEN_BACK_FLIP_CLASS)
            .css('left', expandedFrom.offset().left)
            .css('top', expandedFrom.offset().top)
            .css('width', expandedFrom.width())
            .css('height', expandedFrom.height())
            .attr('tabindex', '0')
            .data('expandedFrom', expandedFrom)
            .data('unflipper', unflipper);

        content.addClass('fs-content').hide().appendTo(div);
        return div.appendTo($('body'));
    }

    function makeStretchable(el) {
        return el
            .css('width', '100%')
            .css('height', '100%');
    }

    function fixToWindowSize(el) {
        return el
            .css('width', $(window).width())
            .css('height', $(window).height());
    }

    function onFlipEnded() {
        let box = $(this).closest(BOX_SELECTOR);
        let backSide = box.find(BACK_SIDE_SELECTOR);
        let backIsFullScreen = backSide.hasClass(FULL_SCREEN_CLASS);
        let backIsNowShown = !box.find(FRONT_SIDE_SELECTOR).is(':visible');
        let secTxtElement = box.children(SEC_TXT_SELECTOR);

        secTxtElement.css("transform", "none");

        if (backIsFullScreen && !backIsNowShown) {
            PP.scrolling.enable();
        }

        if (backIsFullScreen && backIsNowShown) {
            PP.scrolling.disable();

            let flipButton = box.find(FLIP_BUTTON_SELECTOR);
            let backSideContent = backSide.children(':first').clone();
            let fullScreenDiv = prepareFullScreenDiv(box, backSideContent, flipButton);

            fullScreenDiv.animate(
                {
                    top: 0,
                    left: 0,
                    width: $(window).width(),
                    height: $(window).height()
                },
                {
                    duration: EXPAND_TIME,
                    complete: backSideExpanded,
                }
            )
        }
    }

    function backSideExpanded() {
        let div = makeStretchable($(this));
        let content = div.find('.fs-content').fadeIn(FADE_TIME);
        $(this).show();
        setupBackButtonForExpandedDiv(div, content);
        $(PP.FULL_SCREEN_BACK_FLIP_SELECTOR).focus();
        $(PP.FULL_SCREEN_BACK_FLIP_SELECTOR).find('.box').removeAttr("role");
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
                    },
                    {
                        duration: EXPAND_TIME,
                        complete: backSideShrieked
                    }
                );
            });
        });
    }

    function unbindEscFromBackButton() {
        $(window).unbind('keyup.esc');
    }

    function bindEscToBackButton(div) {
        $(window).bind('keyup.esc', function (evt) {
            if (evt.keyCode === $.ui.keyCode.ESCAPE) {
                div.find(PP.BACK_BUTTON_SELECTOR).click();
            }
        });
    }

    function backSideShrieked() {
        let div = $(this);

        div.data('unflipper').click();
        div.remove();
    }

    return {
        setup: function () {
            $(document).ready(function () {
                setupLinks();
                setupFlipButtons();
                setupFlipImages();
            });
        },
        closeSpinner: closeSpinner,
    };
})();

rotatableBox.setup();
