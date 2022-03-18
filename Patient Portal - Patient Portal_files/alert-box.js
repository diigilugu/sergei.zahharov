function AlertBox(id, href, additionalQuery, additionalQueryResultParam) {
    this.id = id;
    this.href = href;
    this.additionalQuery = additionalQuery;
    this.additionalQueryResultParam = additionalQueryResultParam;

    this.ALERT_BOX_ACTION_URL = PP.CONTEXT_ROOT + '/alertBox/' + id;
    this.ADDITIONAL_QUERY_URL = PP.CONTEXT_ROOT + '/' + additionalQuery;
}

AlertBox.prototype._setupAndShowBox = function () {
    var alert = $('#' + this.id).show();

    alert.find('.r .link').click(function (e) {
        alert.hide();
        $.ajax(this.ALERT_BOX_ACTION_URL, {type: 'POST', data: 'action=close'});
        e.stopPropagation();
    }.bind(this));

    if (this.href) {
        alert.addClass('clickable');
        alert.click(function (e) {
            new PrivacyAccessRestriction().open("0", true);
            e.stopPropagation();
        }.bind(this));
    }
};

AlertBox.prototype._makeAdditionalQuery = function () {
    $.get(this.ADDITIONAL_QUERY_URL, function (data) {
        var show = data[this.additionalQueryResultParam];

        if (show) {
            this._setupAndShowBox();
        }
    }.bind(this));
};

AlertBox.prototype._init = function () {
    $.get(this.ALERT_BOX_ACTION_URL, function (data) {
        if (!data.isClosed) {
            if (this.additionalQuery) {
                this._makeAdditionalQuery();
            } else {
                this._setupAndShowBox();
            }
        }
    }.bind(this));
};

AlertBox.prototype.setup = function () {
    $(document).ready(function () {
        this._init();
    }.bind(this));
};
