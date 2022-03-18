jQuery(function($) {
    $.datepicker.regional['en'] = {
        closeText: 'Done',
        prevText: 'Prev',
        nextText: 'Next',
        currentText: 'Today',
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'],
        dayNamesShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        dayNamesMin: [ "Su","Mo","Tu","We","Th","Fr","Sa" ],
        dateFormat: 'dd.mm.yy', firstDay: 0,
        isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['en']);
});