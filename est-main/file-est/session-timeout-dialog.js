function SessionTimeoutDialog() {
    this.DIALOG = $('#session-timeout-dialog');
    this.ONE_TICK = 1000;
    this.logoutCountdownTaskId;
    this.showDialogTaskId;
    this.timeoutMessageDelay;
    this.activeTimeoutMessageDelay;
    this.logoutDelay;
    this.timeLeftTillLogout;
    this.countdownMsg;
    this.countdownMsgEl;
    this.forcedLogout = false;
    this._init();
}

SessionTimeoutDialog.prototype._init = function () {
    $.get(PP.CONTEXT_ROOT + '/sessionHandling/timeoutDialog', function (data) {
        this.timeoutMessageDelay = data.timeoutMessageDelay;
        this.logoutDelay = data.logoutDelay;
        this.activeTimeoutMessageDelay = data.activeTimeoutMessageDelay;
        this._DOMRelatedInit();
        this._initiateTimeout();
        this._initiateForcedTimeout();
    }.bind(this));
};

SessionTimeoutDialog.prototype._DOMRelatedInit = function () {
    this.countdownMsgEl = this.DIALOG.find('h2');
    this.countdownMsg = this.countdownMsgEl.text();
    this.DIALOG.find('.cancel-button').click(this._logout.bind(this));
    this.DIALOG.find('.ok-button').click(this._continue.bind(this));
};

SessionTimeoutDialog.prototype._initiateTimeout = function () {
    this.showDialogTaskId = setTimeout(this._showDialog.bind(this), this.timeoutMessageDelay);
};

SessionTimeoutDialog.prototype._initiateForcedTimeout = function () {
    if (this.activeTimeoutMessageDelay) {
        setTimeout(this._showForcedDialog.bind(this), this.activeTimeoutMessageDelay);
    }
};

SessionTimeoutDialog.prototype._updateCountdownMessage = function () {
    if (this.timeLeftTillLogout) {
        this.countdownMsgEl.text(this.countdownMsg.format(this.timeLeftTillLogout / 1000));
    } else {
        this.countdownMsgEl.text(this.countdownMsg.format(0));
        this._logout.call(this);
    }
};

SessionTimeoutDialog.prototype._showDialog = function () {
    this.forcedLogout = false;
    this.DIALOG.find('.session-expires-title').show();
    this.DIALOG.find('.session-expired-title').hide();
    this.DIALOG.find('.session-expires-message').show();
    this.DIALOG.find('.session-expired-message').hide();
    this.DIALOG.find('h2').show();
    this.DIALOG.find('.ok-button').show();
    this.DIALOG.show();
    this.timeLeftTillLogout = this.logoutDelay;
    this._updateCountdownMessage.call(this);
    this.logoutCountdownTaskId = setInterval(function () {
        this.timeLeftTillLogout -= this.ONE_TICK;
        this._updateCountdownMessage.call(this);
        if (this.timeLeftTillLogout === 0) {
            this._logout.call(this);
        }
    }.bind(this), this.ONE_TICK);
};

SessionTimeoutDialog.prototype._showForcedDialog = function () {
    this.forcedLogout = true;
    this.DIALOG.find('.session-expires-title').hide();
    this.DIALOG.find('.session-expired-title').show();
    this.DIALOG.find('.session-expires-message').hide();
    this.DIALOG.find('.session-expired-message').show();
    this.DIALOG.find('h2').hide();
    this.DIALOG.find('.ok-button').hide();
    this.DIALOG.show();
    this.timeLeftTillLogout = this.logoutDelay;
    this._updateCountdownMessage.call(this);
    this.logoutCountdownTaskId = setInterval(function () {
        this.timeLeftTillLogout -= this.ONE_TICK;
        this._updateCountdownMessage.call(this);
        if (this.timeLeftTillLogout === 0) {
            this.forcedLogout = true;
            this._logout.call(this);
        }
    }.bind(this), this.ONE_TICK);
};

SessionTimeoutDialog.prototype._logout = function () {
    clearInterval(this.logoutCountdownTaskId);
    if (this.forcedLogout) {
        PP.forcedLogout();
    } else {
        PP.logout();
    }
};

SessionTimeoutDialog.prototype._continue = function () {
    this.DIALOG.hide();
    clearInterval(this.logoutCountdownTaskId);
    clearTimeout(this.showDialogTaskId);
    this.showDialogTaskId = setTimeout(this._showDialog.bind(this), this.timeoutMessageDelay);

    $.get(PP.CONTEXT_ROOT + '/sessionHandling/renew', this._initiateTimeout.bind(this));
};

$(window).ready(function () {
    new SessionTimeoutDialog();
});