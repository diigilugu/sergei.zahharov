(function ($) {
    $.widget("ui.combobox", {
        _create: function () {
            let input,
                that = this,
                select = this.element.hide(),
                selected = select.children(":selected"),
                value = selected.val() ? selected.text() : "",
                wrapper = this.wrapper = $("<span>")
                    .addClass("ui-combobox")
                    .insertAfter(select);

            let menuClosed = this.options.menuClosed;
            let menuOpened = this.options.menuOpened;

            function removeIfInvalid(element) {
                let value = $(element).val(),
                    matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(value) + "$", "i"),
                    valid = false;
                select.children("option").each(function () {
                    if ($(this).text().match(matcher)) {
                        this.selected = valid = true;
                        return false;
                    }
                });
                if (!valid) {
                    // remove invalid value, as it didn't match anything
                    $(element)
                        .val("");
                    //	.attr( "title", value + " didn't match any item" )
                    //	.tooltip( "open" );
                    select.val("");
                    //setTimeout(function() {
                    //	input.tooltip( "close" ).attr( "title", "" );
                    //}, 2500 );
                    input.data("ui-autocomplete").term = "";
                    return false;
                }
            }

            this.input = input = $("<input>")
                .attr("readonly", "readonly")
                .attr("tabindex", "-1")
                .attr("type", "text")
                .appendTo(wrapper)
                .val(value)
                .attr("title", "")
                .addClass("ui-state-default ui-combobox-input")
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: function (request, response) {
                        let matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                        response(select.children("option").map(function () {
                            let text = $(this).text();
                            if (this.value && (!request.term || matcher.test(text)))
                                return {
                                    label: text.replace(
                                        new RegExp(
                                            "(?![^&;]+;)(?!<[^<>]*)(" +
                                            $.ui.autocomplete.escapeRegex(request.term) +
                                            ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                        ), "<strong>$1</strong>"),
                                    value: text,
                                    option: this
                                };
                        }));
                    },
                    select: function (event, ui) {
                        ui.item.option.selected = true;
                        that._trigger("selected", event, {
                            item: ui.item.option
                        });

                        setTimeout(function () {
                            that.input.blur();
                            that.input.change();
                            $(that).trigger('changed');
                        }, 1);
                    },
                    // not needed since input field is disabled
                    /*change: function( event, ui ) {
                      let result = true;

                        if ( !ui.item ) {
                          result = removeIfInvalid( this );
                        }

                        $(that).trigger('changed');

                        return result;
                    },*/
                    open: function (event, ui) {
                        wrapper.addClass('ui-combobox-active');
                        let a = input.data("ui-autocomplete").menu.element.css('z-index', 10000);

                        if (menuOpened) menuOpened();
                    },
                    close: function (event, ui) {
                        wrapper.removeClass('ui-combobox-active');

                        if (menuClosed) menuClosed();
                    }
                })
                .addClass("ui-widget ui-widget-content ui-corner-left");

            input.data("ui-autocomplete")._renderItem = function (ul, item) {
                return $("<li>")
                    .data("ui-autocomplete-item", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };

            $("<a>")
                .attr("tabindex", 0)
                .tooltip()
                .appendTo(wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-combobox-toggle no-brightness")
                .click(function () {
                    if (select.attr("disabled") !== "disabled") {
                        // close if already visible
                        if (input.autocomplete("widget").is(":visible")) {
                            input.autocomplete("close");
                            //removeIfInvalid( input );
                            return;
                        }

                        // work around a bug (likely same cause as #5265)
                        $(this).blur();

                        // pass empty string as value to search for, displaying all results
                        input.autocomplete("search", "");
                        input.focus();
                    }
                });

            input
                .tooltip({
                    position: {
                        of: this.button
                    },
                    tooltipClass: "ui-state-highlight"
                });
        },

        destroy: function () {
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        },

        show: function () {
            this.wrapper.show();
        },

        hide: function () {
            this.wrapper.hide();
        },

        val: function (v) {
            if (v === undefined) {
                return this.element.val();
            } else {
                this.element.val(v);
                this.input.val(v);
                this.input.change();
            }
        },

        selectFirst: function () {
            this.val(this.element.find('option:first-child').val());
        },

        change: function (f) {
            if (f === undefined) {
                $(this).trigger('changed');
            } else {
                $(this).bind('changed', f);
            }
        }
    });
})(jQuery);
