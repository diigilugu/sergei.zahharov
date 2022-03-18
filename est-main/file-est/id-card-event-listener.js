if ($.browser.mozilla) {
    // FIXME: if ( window.crypto && typeof window.crypto.enableSmartCardEvents != 'undefined') {
    $(document).ready(function () {
        try {
            window.crypto.enableSmartCardEvents = true;

            $(document).bind('smartcard-remove', function () {
                PP.logout(true);
            });
        } catch (err) {
        }
    });
}