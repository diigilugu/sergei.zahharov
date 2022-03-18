/* Estonian initialisation for the jQuery UI date picker plugin. */
/* Written by Taavi Kõosaar (kirjatuvi@msn.com). */
jQuery(function($) {
    $.datepicker.regional['et'] = {
        closeText: 'Sulge',
        prevText: '&laquo;Tagasi',
        nextText: 'Edasi&raquo;',
        currentText: 'T&auml;na',
        monthNames: ['Jaanuar', 'Veebruar', 'M&auml;rts', 'Aprill', 'Mai', 'Juuni',
        'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'],
        monthNamesShort: ['Jaanuar', 'Veebruar', 'M&auml;rts', 'Aprill', 'Mai', 'Juuni',
        'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'],
        dayNamesShort: ['Es', 'Te', 'Ko', 'Ne', 'Re', 'La', 'P&uuml;'],
        dayNames: ['P&uuml;hap&auml;ev', 'Esmasp&auml;ev', 'Teisip&auml;ev', 'Kolmap&auml;ev', 'Neljap&auml;ev', 'Reede', 'Laup&auml;ev'],
        dayNamesMin: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
        dateFormat: 'dd.mm.yy', firstDay: 1,
        isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional["et"]);
});