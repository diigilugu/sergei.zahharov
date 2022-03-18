/* Estonian initialisation for the jQuery UI date picker plugin. */
/* Written by Taavi Kõosaar (kirjatuvi@msn.com). */
jQuery(function($) {
    $.datepicker.regional['ru'] = {
        closeText: "Закрыть",
    	prevText: "&#x3C;Пред",
    	nextText: "След&#x3E;",
        currentText: 'Сегодня',
        monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь",
        "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
        monthNamesShort: [ "Январь","Февраль","Март","Апрель","Май","Июнь",
                           "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
        dayNamesShort: [ "вск","пнд","втр","срд","чтв","птн","сбт" ],
        dayNames: [ "воскресенье","понедельник","вторник","среда","четверг","пятница","суббота" ],
        dayNamesMin: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
        dateFormat: 'dd.mm.yy', firstDay: 1,
        isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);
});