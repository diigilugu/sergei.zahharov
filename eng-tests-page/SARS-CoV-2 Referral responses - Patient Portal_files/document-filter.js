function DocumentFilter(dropDownFilters) {
    this.dropDownFilters = dropDownFilters;
}

DocumentFilter.prototype.init = function () {
    var self = this;

    $(".datepicker").each(function () {
        self._showDate(this);
    });

    $(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        buttonText: "",
        beforeShow: function (input, inst) {
            function changeLineColor() {
                $(".ui-datepicker table tr:last-child td").css("border-bottom", "none");
                $(".ui-datepicker table tr td:first-child").css("border-left", "none");
                $(".ui-datepicker table tr td:last-child").css("border-right", "none");
            };

            function initFunctions() {
                changeLineColor();
                makeCalendarAccessible(input);
            };

            setTimeout(initFunctions, 100);
        },
        onSelect: function (dateText) {
            self._showDate(this);
            let focusableElement = $('a.noUnderline.menu.dropdown-box');
            if(focusableElement.length === 0) {
                $('li.home').find('a.no-contrast-change').focus();
            } else {
                focusableElement.focus();
            }
        }
    });

    $(".clear-date").on('click', function (e) {
        const inputField = document.getElementById(this.id.substring(2));
        clearDate(inputField);
        self._showDate(inputField);
        e.preventDefault();
    });

    self._initMenus();
    for (var i = 0; i < this.dropDownFilters.length; i++) {
        self._initMenuData(this.dropDownFilters[i]);
    }
};
DocumentFilter.prototype.initWithYearRange = function (yearRange) {
    var self = this;

    $(".datepicker").each(function () {
        self._showDate(this);
    });

    $(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        yearRange: yearRange,
        buttonText: "",
        beforeShow: function (input, inst) {
            function changeLineColor() {
                $(".ui-datepicker table tr:last-child td").css("border-bottom", "none");
                $(".ui-datepicker table tr td:first-child").css("border-left", "none");
                $(".ui-datepicker table tr td:last-child").css("border-right", "none");
            };

            function initFunctions() {
                changeLineColor();
                makeCalendarAccessible(input);
            };

            setTimeout(initFunctions, 100);
        },
        onSelect: function (dateText) {
            self._showDate(this);
            let focusableElement = $('a.noUnderline.menu.dropdown-box');
            if(focusableElement.length === 0) {
                $('li.home').find('a.no-contrast-change').focus();
            } else {
                focusableElement.focus();
            }
        }
    });

    $(".clear-date").on('click', function (e) {
        const inputField = document.getElementById(this.id.substring(2));
        clearDate(inputField);
        self._showDate(inputField);
        e.preventDefault();
    });


    self._initMenus();
    for (var i = 0; i < this.dropDownFilters.length; i++) {
        self._initMenuData(this.dropDownFilters[i]);
    }
};

DocumentFilter.prototype._showDate = function (dateInputElement) {
     let formattedDate;
     if ($(dateInputElement).val().length == 0) {
        let dateInputElementId = $(dateInputElement).attr('id');
        if (dateInputElementId === 'start') {
             formattedDate = `<span class="second">${calendarStart}</span>`;
        }
        else if (dateInputElementId === 'end') {
            formattedDate = `<span class="second">${calendarEnd}</span>`;
        }
        else {
            formattedDate = `<span class="first">- -</span>`;
        }
    }
    else {
        let d = $.datepicker.parseDate('yy-mm-dd', $(dateInputElement).val());
        formattedDate = $.datepicker.formatDate('<span class="first">d</span><span>MM</span><span>yy</span>', d);
    }
    $(dateInputElement).parent().find('.selected-date').empty().append(formattedDate);
};

DocumentFilter.prototype._initMenuData = function (filterId) {
    var itemId = $('#' + filterId).val();

    if (itemId.length > 0) {
        var itemName = $('.filters .' + filterId + '[data-id="' + itemId + '"]').html();
        $('#selected_' + filterId).find('span').text(itemName);
    }

    $('.' + filterId).click(function (e) {
        $('#' + filterId).val($(this).attr('data-id'));
        e.stopPropagation();
    });
};

DocumentFilter.prototype._initMenus = function () {
    $("a.dropdown-box").click(function () {
        $(".row ul").hide();

        var thisMenu = $(this).next("ul");

        if (thisMenu.children('li').length > 0) {
            thisMenu.show();
        }
    });
    $(".row ul a").click(function () {
        var selectedValue = $(this).text();

        var filterId = $(this).parent().parent().prev().data("filter-id");
        if ($(this).attr('data-id').length == 0) {
            selectedValue = $('#default_' + filterId).html();
        }
        $("#selected_" + filterId + " span").html(selectedValue);
        $(".row ul").hide();
    });
    $(".row ul").each(function () {
        var menu = $(this);

        menu.mouseenter(function () {
            menu.show();
        }).mouseleave(function () {
            menu.hide();
        });
        menu.prev().mouseleave(function () {
            menu.hide();
        });
    });
};
