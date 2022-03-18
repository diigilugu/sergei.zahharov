function PrivacyAccessRestriction(target) {

    this.URL_OPEN = PP.CONTEXT_ROOT + '/privacy/open';
    this.URL_CLOSE = PP.CONTEXT_ROOT + '/privacy/close';
    this.URL_GET = PP.CONTEXT_ROOT + '/privacy/get';

    this.DOCTOR_CLOSE_WARNING_DIALOG = '#close-all-doctor-warning-dialog';
    this.DOCTOR_NEED_TO_OPEN_DIALOG = '#need-to-open-healthrecord-to-doctor-warning-dialog';
    this.DOCTOR_NEED_TO_CLOSE_DIALOG = '#need-to-close-healthrecord-to-doctor-warning-dialog';
    this.OPEN_ERROR_DIALOG = '#open-error-dialog';
    this.CLOSE_ERROR_DIALOG = '#close-error-dialog';

    this.DOCTOR_CONFIDENTIALITY = '0';
    this.MESSAGE_SEVERITY_INFO = 'I';
    this.target = target;
}

PrivacyAccessRestriction.prototype.openFromSingleDoc = function () {

    $(this.DOCTOR_NEED_TO_OPEN_DIALOG).show();

    const firstFocusableElement = $(this.DOCTOR_NEED_TO_OPEN_DIALOG + " .ok-button");

    firstFocusableElement.focus();

    $(this.DOCTOR_NEED_TO_OPEN_DIALOG).on("keypress", function (e) {
        if ((e.keyCode ? e.keyCode : e.which) === 13) {
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }.bind(this));

    $(this.DOCTOR_NEED_TO_OPEN_DIALOG + " .cancel-button").one("click", function () {
        $(this.DOCTOR_NEED_TO_OPEN_DIALOG).hide();
    }.bind(this));

    $(this.DOCTOR_NEED_TO_OPEN_DIALOG + " .ok-button").one("click", function () {
        if ($("#privacy-access-toggle").length) {
            $("#privacy-access-toggle").click();
        } else {
            this.open(0);
        }
        $(this.DOCTOR_NEED_TO_OPEN_DIALOG).hide();
    }.bind(this));
}

PrivacyAccessRestriction.prototype._openDoc = function (confidentiality, closeAllDocs) {
    let closeDocs = closeAllDocs | false;
    $(this.DOCTOR_NEED_TO_OPEN_DIALOG).show();

    const firstFocusableElement = $(this.DOCTOR_NEED_TO_OPEN_DIALOG + " .ok-button");

    firstFocusableElement.focus();

    $(this.DOCTOR_NEED_TO_OPEN_DIALOG).on("keypress", function (e) {
        if ((e.keyCode ? e.keyCode : e.which) === 13) {
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }.bind(this));

    $(this.DOCTOR_NEED_TO_OPEN_DIALOG + " .cancel-button").one("click", function () {
        $(this.DOCTOR_NEED_TO_OPEN_DIALOG).hide();
    }.bind(this));

    $(this.DOCTOR_NEED_TO_OPEN_DIALOG + " .ok-button").one("click", function () {
        if (this.target) {
            this.target.children("span.visible").hide();
            this.target.children("span.intermediate").show();
            this.target.addClass("loading");
        }
        $.post(this.URL_OPEN, this._asRequestParameters(confidentiality),
            this._openCallback.bind(this));
        $(this.DOCTOR_NEED_TO_OPEN_DIALOG).hide();
        if (closeDocs) {
            location.reload(true);
        }
    }.bind(this));
}

PrivacyAccessRestriction.prototype._closeDoc = function (confidentiality) {
    $(this.DOCTOR_NEED_TO_CLOSE_DIALOG).show();

    const firstFocusableElement = $(this.DOCTOR_NEED_TO_CLOSE_DIALOG + " .ok-button");

    firstFocusableElement.focus();

    $(this.DOCTOR_NEED_TO_CLOSE_DIALOG).on("keypress", function (e) {
        if ((e.keyCode ? e.keyCode : e.which) === 13) {
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }.bind(this));

    $(this.DOCTOR_NEED_TO_CLOSE_DIALOG + " .cancel-button").one("click", function () {
        $(this.DOCTOR_NEED_TO_CLOSE_DIALOG).hide();
    }.bind(this));

    $(this.DOCTOR_NEED_TO_CLOSE_DIALOG + " .ok-button").one("click", function () {
        if (this.target) {
            this.target.children("span.hidden").hide();
            this.target.children("span.intermediate").show();
            this.target.addClass("loading");
        }
        $.post(this.URL_CLOSE, this._asRequestParameters(confidentiality),
            this._closeCallback.bind(this));
        $(this.DOCTOR_NEED_TO_CLOSE_DIALOG).hide();
    }.bind(this));
}

PrivacyAccessRestriction.prototype.open = function (confidentiality, closeAllDocs) {
    this._openDoc(confidentiality, closeAllDocs);
};

PrivacyAccessRestriction.prototype.close = function (confidentiality) {
    if (confidentiality === this.DOCTOR_CONFIDENTIALITY) {
        this._displayDoctorCloseWarning(confidentiality);
    } else {
        this._initiateClose(confidentiality);
    }
};

PrivacyAccessRestriction.prototype._initState = function () {
    $.get(this.URL_GET, function (data) {
        if (data.isClosed) {
            this._caseHistoryClosed();
        } else {
            this._caseHistoryOpened();
        }
    }.bind(this));
};

PrivacyAccessRestriction.prototype.init = function () {
    this._initState();
    this.target.click(this._targetPressed.bind(this));
};

PrivacyAccessRestriction.prototype._targetPressed = function () {
    if (this.target.hasClass("loading")) {
        return false;
    }

    if (this.target.hasClass("active")) {
        this.close(0);
    } else {
        this.open(0);
    }

    return false;
};

PrivacyAccessRestriction.prototype._caseHistoryOpened = function () {
    if (this.target) {
        this.target.removeClass("loading");
        this.target.addClass("active");
        this.target.children("span.intermediate").hide();
        this.target.children("span.hidden").show();
    }
};

PrivacyAccessRestriction.prototype._caseHistoryClosed = function () {
    if (this.target) {
        this.target.removeClass("loading");
        this.target.removeClass("active");
        this.target.children("span.intermediate").hide();
        this.target.children("span.visible").show();
    }
};

PrivacyAccessRestriction.prototype._initiateClose = function (confidentiality) {
    this._closeDoc(confidentiality)
};

PrivacyAccessRestriction.prototype._openCallback = function (data) {
    if (data.successMessage) {
        this._caseHistoryOpened();
        $(".statuses a").each(
            function () {
                $(this).attr('onclick', $(this).attr('onclick_historyopen'));
                $(this).removeClass('health-record-closed');
                $(this).attr('title', '');
            }
        );
    } else {
        this._caseHistoryClosed();
        this._showOpeningErrorMessage(data.failureMessages);
    }
};

PrivacyAccessRestriction.prototype._closeCallback = function (data) {
    if (data.successMessage) {
        this._caseHistoryClosed();
        $(".statuses a").each(
            function () {
                $(this).attr('onclick', $(this).attr('onclick_historyclosed'));
                $(this).addClass('opened');
                $(this).addClass('health-record-closed');
                $(this).removeClass('closed');
                $(this).attr('title', $(this).attr('title_historyclosed'));

            }
        );
    } else {
        this._caseHistoryOpened();
        this._showClosingErrorMessage(data.failureMessages);
    }
};

PrivacyAccessRestriction.prototype._displayDoctorCloseWarning = function (confidentiality, callback) {

    $(this.DOCTOR_CLOSE_WARNING_DIALOG).show();

    $(this.DOCTOR_CLOSE_WARNING_DIALOG + " .cancel-button").one("click", function () {
        $(this.DOCTOR_CLOSE_WARNING_DIALOG).hide();
    }.bind(this));

    $(this.DOCTOR_CLOSE_WARNING_DIALOG + " .ok-button").one("click", function () {
        this._initiateClose(confidentiality, callback);
        $(this.DOCTOR_CLOSE_WARNING_DIALOG).hide();
    }.bind(this));

};

PrivacyAccessRestriction.prototype._asRequestParameters = function (confidentiality) {
    return {
        'confidentiality': confidentiality
    };
};

PrivacyAccessRestriction.prototype._showOpeningErrorMessage = function (messages) {
    this._showMessage(messages, this.OPEN_ERROR_DIALOG);
};

PrivacyAccessRestriction.prototype._showClosingErrorMessage = function (messages) {
    this._showMessage(messages, this.CLOSE_ERROR_DIALOG);
};

PrivacyAccessRestriction.prototype._showMessage = function (messages, dialogId) {

    var messagesText = "";
    $(messages).each(function (index, msg) {
        messagesText += msg.localizedText + " ";
    });

    $(dialogId + " .message").html(messagesText);

    $(dialogId + " .ok-button").one("click", function () {
        $(dialogId).hide();
    });

    $(dialogId).show();
};

