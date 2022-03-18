function DocumentAccessRestriction() {

    this.URL_OPEN = PP.CONTEXT_ROOT + '/document/access/open';
    this.URL_CLOSE = PP.CONTEXT_ROOT + '/document/access/close';
    this.URL_IS_TIMECRITICAL_OPEN_FOR_DOCTORS = PP.CONTEXT_ROOT + '/document/access/isTimeCriticalOpenForDoctors';
    this.CONFIDENTIALITY_CELL_MATCHER = "#confidentialityCell_0_1.3.6.1.4.1.28284.6.2.2.18.1_AT_5".replace(/\./g, '\\.');

    this.DOCTOR_CLOSE_WARNING_DIALOG = '#close-document-doctor-warning-dialog';
    this.OPEN_ERROR_DIALOG = '#open-error-dialog';
    this.CLOSE_ERROR_DIALOG = '#close-error-dialog';

    this.DOCTOR_CONFIDENTIALITY = '0';

    $(document).ready(function () {
        $('.statuses a').click(function (e) {
            e.stopPropagation();
        });
    });
}

DocumentAccessRestriction.prototype.isTimeCriticalDataOpenForDoctors = function () {
    this._showLoadingCell($(this.CONFIDENTIALITY_CELL_MATCHER));
    $.get(this.URL_IS_TIMECRITICAL_OPEN_FOR_DOCTORS, this._showTimeCriticalConfidentialityStatus.bind(this));
};

DocumentAccessRestriction.prototype.open = function (confidentiality, idRoot, idExtension, typeCode) {
    var confidentialityCell = this._getConfidentialityCell(confidentiality, idRoot, idExtension, typeCode);
    this._showLoadingCell(confidentialityCell);

    $.post(this.URL_OPEN, this._asRequestParameters(confidentiality, idRoot, idExtension, typeCode),
        this._openCallback.bind(this));
};

DocumentAccessRestriction.prototype.close = function (confidentiality, idRoot, idExtension, typeCode) {

    if (confidentiality === this.DOCTOR_CONFIDENTIALITY) {
        this._displayDoctorCloseWarning(confidentiality, idRoot, idExtension, typeCode);
    } else {
        this._initiateClose(confidentiality, idRoot, idExtension, typeCode);
    }
};

DocumentAccessRestriction.prototype._showTimeCriticalConfidentialityStatus = function (data) {
    var confidentialityCell = $(this.CONFIDENTIALITY_CELL_MATCHER);

    confidentialityCell.html(data.openForDoctors ? ich.leftCellOpen(data) : ich.leftCellClosed(data));

    confidentialityCell.find('a').click(function (e) {
        e.stopPropagation();
    });
};

DocumentAccessRestriction.prototype._initiateClose = function (confidentiality, idRoot, idExtension, typeCode) {
    var confidentialityCell = this._getConfidentialityCell(confidentiality, idRoot, idExtension, typeCode);
    this._showLoadingCell(confidentialityCell);

    $.post(this.URL_CLOSE, this._asRequestParameters(confidentiality, idRoot, idExtension, typeCode),
        this._closeCallback.bind(this));
};

DocumentAccessRestriction.prototype._openCallback = function (data) {
    var confidentialityCell = this._getConfidentialityCell(data.confidentiality, data.idRoot, data.idExtension, data.typeCode);

    var left = confidentialityCell.hasClass('left');

    if (data.successMessage) {
        confidentialityCell.html(left ? ich.leftCellOpen(data) : ich.rightCellOpen(data));
        var docCloseBtn = confidentialityCell.find("a");
        docCloseBtn.attr('onclick', $(this).attr('onclick_historyopen'));
        docCloseBtn.removeClass('health-record-closed');
    } else {
        confidentialityCell.html(left ? ich.leftCellClosed(data) : ich.rightCellClosed(data));
        this._showOpeningErrorMessage(data.failureMessages);
    }

    confidentialityCell.find('a').click(function (e) {
        e.stopPropagation();
    });
};

DocumentAccessRestriction.prototype._closeCallback = function (data) {
    var confidentialityCell = this._getConfidentialityCell(data.confidentiality, data.idRoot, data.idExtension, data.typeCode);
    var left = confidentialityCell.hasClass('left');

    if (data.successMessage) {
        confidentialityCell.html(left ? ich.leftCellClosed(data) : ich.rightCellClosed(data));
        var docOpenBtn = confidentialityCell.find("a");
        docOpenBtn.attr('onclick', $(this).attr('onclick_historyopen'));
        docOpenBtn.removeClass('health-record-closed');
        docOpenBtn.removeAttr('title');
    } else {
        confidentialityCell.html(left ? ich.leftCellOpen(data) : ich.rightCellOpen(data));
        this._showClosingErrorMessage(data.failureMessages);
    }

    confidentialityCell.find('a').click(function (e) {
        e.stopPropagation();
    });
};

DocumentAccessRestriction.prototype._displayDoctorCloseWarning = function (confidentiality, idRoot, idExtension, typeCode) {

    $(this.DOCTOR_CLOSE_WARNING_DIALOG).show();

    const lastFocusableElement = $(this.DOCTOR_CLOSE_WARNING_DIALOG + " .cancel-button");
    const firstFocusableElement = $(this.DOCTOR_CLOSE_WARNING_DIALOG + " .ok-button");

    firstFocusableElement.focus();

    $(this.DOCTOR_CLOSE_WARNING_DIALOG + " .cancel-button").one("click", function () {
        $(this.DOCTOR_CLOSE_WARNING_DIALOG).hide();
        $("a[class*='" + idRoot + "']").focus();
    }.bind(this));

    $(this.DOCTOR_CLOSE_WARNING_DIALOG + " .ok-button").one("click", function () {
        this._initiateClose(confidentiality, idRoot, idExtension, typeCode);
        $(this.DOCTOR_CLOSE_WARNING_DIALOG).hide();
        $("a[class*='" + idRoot + "']").focus();
    }.bind(this));

    firstFocusableElement.on("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            firstFocusableElement.trigger("click");
        }
    });

    lastFocusableElement.on("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            lastFocusableElement.trigger("click");
        } else if (event.keyCode === $.ui.keyCode.TAB) {
            firstFocusableElement.focus();
            event.preventDefault();
        }
    });
};

DocumentAccessRestriction.prototype._asRequestParameters = function (confidentiality, idRoot, idExtension, typeCode) {
    return {
        'idRoot': idRoot,
        'idExtension': idExtension,
        'confidentiality': confidentiality,
        'typeCode': typeCode
    };
};

DocumentAccessRestriction.prototype._showLoadingCell = function (confidentialityCell) {
    confidentialityCell.html(ich.cellLoading({"height": confidentialityCell.height() - 2}));
};

DocumentAccessRestriction.prototype._getConfidentialityCell = function (confidentiality, idRoot, idExtension, typeCode) {
    return $(document.getElementById("confidentialityCell_" + confidentiality + "_" + idRoot + "_" + idExtension + "_" + typeCode));
};

DocumentAccessRestriction.prototype._showOpeningErrorMessage = function (messages) {
    this._showMessage(messages, this.OPEN_ERROR_DIALOG);
};

DocumentAccessRestriction.prototype._showClosingErrorMessage = function (messages) {
    this._showMessage(messages, this.CLOSE_ERROR_DIALOG);
};

DocumentAccessRestriction.prototype._showMessage = function (messages, dialogId) {

    var messagesText = "";
    let button = $(dialogId + " .ok-button")
    $(messages).each(function (index, msg) {
        messagesText += msg.localizedText + " ";
    });

    $(dialogId + " .message").html(messagesText).attr("role", "alert");

    button.one("click", function () {
        $(dialogId).hide();
    });

    $(dialogId).show();

    button.focus();

    button.on("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            button.trigger("click");
            if (dialogId === '#close-error-dialog') {
                $('.animate.darkgreen').focus();
                event.preventDefault();
            }
        } else if (event.keyCode === $.ui.keyCode.TAB) {
            button.focus();
            event.preventDefault();
        }
    });
};
