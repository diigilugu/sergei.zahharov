function AddressInput(id) {
    this.GET_CITIES_URL = PP.CONTEXT_ROOT + '/classifiers/cities?county=';
    this.id = id;
}

AddressInput.prototype._setupChangeListeners = function () {
    this.countrySelectEl.combobox('change', function () {
        var country = this.countrySelectEl.combobox('val');
        var countryEst = document.getElementById("countryEst");
        var countryOther = document.getElementById("countryOther");
        if (country === 'EST') {
            countryEst.style.display = "block";
            countryOther.style.display = "none";
        } else {
            countryEst.style.display = "none";
            countryOther.style.display = "block";
        }
    }.bind(this));
};

AddressInput.prototype._init = function () {
    var country = this.countrySelectEl.combobox('val');
    var countryEst = document.getElementById("countryEst");
    var countryOther = document.getElementById("countryOther");
    if (country === 'EST') {
        countryEst.style.display = "block";
        countryOther.style.display = "none";
    } else {
        countryEst.style.display = "none";
        countryOther.style.display = "block";
    }
};

AddressInput.prototype.setup = function () {
    $(document).ready(function () {
        this.countrySelectEl = $('[id="' + this.id + '.country"]');
        this._setupChangeListeners();
        this._init();
    }.bind(this));
};