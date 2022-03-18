let myData = (function () {

    let getInsuranceUrl = PP.CONTEXT_ROOT + '/sidebar/insurance';

    let messages = null;

    let myDataContentSelector = '#myData\_box .visible-content';
    let myDataContent = null;

    let loadingClass = 'loading';
    let activeClass = 'active';
    let passiveClass = 'passive';

    function setup(_params, _messages) {
        messages = _messages;

        $(document).ready(function () {
            fetchInsurance();
            fetchReviewNeeded();
        });
    }

    function fetchInsurance() {
        myDataContent = $(myDataContentSelector);

        $.get(getInsuranceUrl, applyInsuranceToDom);
    }

    function fetchReviewNeeded() {
        let url = PP.CONTEXT_ROOT + "/reviewNeeded";
        $.get(url, function (data) {
            let show = data["isNeeded"];
            if (show) {
                $(".btn-update").show();
            }
        })
    }

    function applyInsuranceToDom(data) {
        myDataContent.parent().removeClass(loadingClass);

        let insurance = data.insurance;
        let insuredClass = passiveClass;
        let insuredMsg = messages.insuranceUnknown;

        if (insurance) {
            if (insurance.insured) {
                insuredClass = activeClass;
            }
            insuredMsg = insurance.insured ? messages.insured : messages.unInsured;
        }

        myDataContent.append(ich.insured({
            cssClass: insuredClass,
            status: insuredMsg
        }));

        if (insurance && (insurance.doctorName || insurance.doctorPhone)) {
            myDataContent.append(ich.familyDoctor({
                doctorName: insurance.doctorName,
                doctorPhone: insurance.doctorPhone,
                phoneTag: insurance.doctorPhone ? messages.phone : ''
            }));
        }
    }

    return {
        setup: setup
    };
})();